const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      index: true,
      minLength: 3,
      maxLength: 50,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("invalid email address");
        }
      },
    },
    password: {
      type: String,
      required: true,
      minLength: 6,
      validate(value) {
        if (!validator.isStrongPassword(value)) {
          throw new Error("Please enter a strong password");
        }
      },
    },
    age: {
      type: Number,
      validate(value) {
        if (value < 18) {
          throw new Error("Your age must be 18+");
        }
      },
    },
    gender: {
      type: String,
      validate(value) {
        if (!["male", "female", "others"].includes(value)) {
          throw new Error("Gender is not valid");
        }
      },
    },
    photoUrl: {
      type: String,
      default:
        "https://c8.alamy.com/comp/2G6PJCR/default-avatar-photo-placeholder-grey-profile-picture-icon-business-man-illustration-2G6PJCR.jpg",
      validate(value) {
        if (!validator.isURL(value)) {
          throw new Error("This URL is not valid");
        }
      },
    },
    skills: {
      type: [String],
    },
    About: {
      type: String,
      default: "This is the default about message",
      maxLength: 150,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("user", userSchema);
