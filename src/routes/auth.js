const express = require("express");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const authRouter = express.Router();
const { validateSignUpData } = require("../utils/validate");

authRouter.post("/signup", async (req, res) => {
  try {
    validateSignUpData(req);
    const { firstName, lastName, email, password } = req.body;
    const hashpassword = await bcrypt.hash(password, 10);
    const user = new User({
      firstName,
      lastName,
      email,
      password: hashpassword,
    });
    const savedUser = await user.save();
    const token = await jwt.sign({ _id: user._id }, process.env.JWT_HASH_KEY, {
      expiresIn: "1d",
    });
    res.cookie("token", token, {
      expires: new Date(Date.now() + 8 * 3600000),
    });

    res.json({ message: "User created successfully", data: savedUser });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error : " + error.message);
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).send("Invalid credentials");
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (isPasswordValid) {
      const token = await jwt.sign(
        { _id: user._id },
        process.env.JWT_HASH_KEY,
        {
          expiresIn: "1d",
        },
      );
      res.cookie("token", token, {
        expires: new Date(Date.now() + 8 * 3600000),
      });
      res.status(200).send(user);
    } else {
      return res.status(400).send("Invalid credenials");
    }
  } catch (error) {
    res.send("Error: " + error.message);
  }
});

authRouter.post("/logout", async (req, res) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
  });
  res.send("You are logged out");
});

module.exports = authRouter;
