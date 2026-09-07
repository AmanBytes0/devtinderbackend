const socket = require("socket.io");
const Chat = require("../models/chat");
const initializeSocket = (server) => {
  const io = socket(server, {
    cors: {
      origin: "http://13.60.236.253",
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    socket.on("joinchat", ({ firstName, userId, targetUserId }) => {
      if (!userId || !targetUserId) {
        console.log("Missing chat ids", { userId, targetUserId });
        return;
      }

      const roomId = [userId, targetUserId].sort().join("_");
      console.log(firstName + " Joined the room: ", roomId);
      socket.join(roomId);
    });
    socket.on(
      "sendMessage",
      async ({ firstName, userId, targetUserId, text }) => {
        try {
          const roomId = [userId, targetUserId].sort().join("_");

          console.log("Message:", text);

          let chat = await Chat.findOne({
            participants: { $all: [userId, targetUserId] },
          });

          if (!chat) {
            chat = new Chat({
              participants: [userId, targetUserId],
              messages: [],
            });
          }

          chat.messages.push({
            senderId: userId,
            text,
          });

          await chat.save();

          io.to(roomId).emit("message received", {
            firstName,
            text,
            senderId: userId,
          });
        } catch (error) {
          console.log("Message error:", error);
        }
      },
    );
    socket.on("closeConnection", () => {});
  });
};
module.exports = { initializeSocket };
