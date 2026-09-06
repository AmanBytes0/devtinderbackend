const express = require("express");
const { userAuth } = require("../middlewares/auth");
const chatRouter = express.Router();
const Chat = require("../models/chat");

chatRouter.get("/chat/:targetUserId", userAuth, async (req, res) => {
  const { targetUserId } = req.params;
  const userId = req.user._id;
  try {
    let chat = await Chat.findOne({
      participants: { $all: [userId, targetUserId] },
    }).populate({
      path: "messages.senderId",
      select: "firstName",
    });
    if (!chat) {
      chat = new Chat({
        praticipants: [userId, targetUserId],
        messages: [],
      });
      await chat.save();
    }

    res.json(chat);
  } catch (err) {
    console.log(err.message);
  }
});

module.exports = chatRouter;
