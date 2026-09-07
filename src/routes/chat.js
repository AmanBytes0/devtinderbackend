const express = require("express");
const { userAuth } = require("../middlewares/auth");
const chatRouter = express.Router();
const Chat = require("../models/chat");
// chatRouter.get("/chat/:targetUserId", userAuth, async (req, res) => {
//   const { targetUserId } = req.params;
//   const userId = req.user._id;
//   try {
//     let chat = await Chat.findOne({
//       participants: { $all: [userId, targetUserId] },
//     }).populate({
//       path: "messages.senderId",
//       select: "firstName",
//     });
//     if (!chat) {
//       chat = new Chat({
//         participants: [userId, targetUserId],
//         messages: [],
//       });
//       await chat.save();
//     }

//     res.json(chat);
//   } catch (err) {
//     console.log(err.message);
//   }
// });

const mongoose = require("mongoose");

chatRouter.get("/chat/:targetUserId", userAuth, async (req, res) => {
  try {
    const { targetUserId } = req.params;
    const userId = req.user._id;

    if (!mongoose.Types.ObjectId.isValid(targetUserId)) {
      return res.status(400).json({
        message: "Invalid target user ID",
      });
    }

    let chat = await Chat.findOne({
      participants: {
        $all: [
          new mongoose.Types.ObjectId(userId),
          new mongoose.Types.ObjectId(targetUserId),
        ],
      },
    });
  } catch (err) {
    console.error("CHAT ERROR:", err);
    res.status(500).json({
      message: "Something went wrong",
      error: err.message,
    });
  }
});

module.exports = chatRouter;
