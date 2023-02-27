const MESSAGE_TYPE = require("./config/message-types");
const socketController = require("./controllers/socket.controller");

module.exports = async (io) => {
  try {
    socketController.initChannelUsers();

    io.on("connection", (socket) => {
      console.log("a user connected: ", socket.id);

      // Message: Get user list in channel
      socket.on(MESSAGE_TYPE.CHANNEL_USERS, () => {
        socketController.getChannelUsers(socket);
      });

      // Message: Join channel
      socket.on(MESSAGE_TYPE.JOIN_CHANNEL, (joinMessage) => {
        socketController.joinChannel(io, socket, joinMessage);
      });

      // Message: message received from client
      socket.on(MESSAGE_TYPE.SEND_MESSAGE, (message) => {
        socketController.sendMessage(socket, message);
      });

      // Message: delete message
      socket.on(MESSAGE_TYPE.DELETE_MESSAGE, (channel_id, messageId) => {
        socketController.deleteMessage(socket, channel_id, messageId);
      });

      // Message: leave the channel
      socket.on(MESSAGE_TYPE.LEAVE_CHANNEL, (leaveMsg) => {
        socketController.leaveChannel(io, socket, leaveMsg);
      });
    });
  } catch (err) {
    console.log("Error: ", err.message);
  }
};
