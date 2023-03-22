const pool = require("../config/db.config");
const socketMessageModel = require("../models/socket-message.model");
const MESSAGE_TYPE = require("../config/message-types");


var channels = [];
var users = {};
var _this = this;

exports.initChannelUsers = async() => {
  channels = await socketMessageModel.getChannels();
  channels && channels.forEach((item) => {
    return (users[item.channel_name] = []);
  });
  console.log(channels);
}

exports.getChannelUsers = (socket) => {
  console.log("get users from channel# with users", users);

  // Only to the sender
  //console.log(users);
  socket.emit(MESSAGE_TYPE.CHANNEL_USERS, {
    channels,
    users,
  });
}

exports.joinChannel = async (io, socket, joinMessage) => {
  // join the channel and update channels & users
  handleJoinChannel(socket, joinMessage);
  // Fetch channel messages from DB
  socketMessageModel
    .getChannelMessages(joinMessage.channel_id)
    .then((channelMessages) => {
      // Send join message to the sender only
      console.log("Sending channel messages to the sender");
      socket.emit(MESSAGE_TYPE.JOIN_CHANNEL, channelMessages);
    })
    .catch((err) => {
      socket.leave(String(joinMessage.channel_id));
      deleteUserFromUsers(joinMessage.user_id, joinMessage.channel_name);
      console.log(err.message);
    });

  // disconnect socket with joined channel
  socket.on("disconnect", () => {
    // leave channel
    _this.leaveChannel(io, socket, joinMessage);
    // console.log("disconnect");
    socket.disconnect();
  });
};

exports.sendMessage = async (socket, message) => {
  console.log("message received: ");
  console.dir(message);

  // Insert message into DB
  socketMessageModel.insertMessage(message).then((msgId) => {
    socketMessageModel.fetchMessage(msgId).then((newMsg) => {
      console.log("send to client new message ID: ", msgId, socket.rooms);
      console.dir(newMsg);
      socket.nsp
        .to(String(newMsg.channel_id))
        .emit(MESSAGE_TYPE.RECEIVE_MESSAGE, newMsg);
    });
  });
}

exports.deleteMessage = (socket, channel_id, messageId) => {
  console.log("delete received: ");
  console.dir(messageId);

  // Update inactive column in messages table in database
  socketMessageModel.updateInactiveMessage(messageId).then((isSuccess) => {
    if (isSuccess) {
      console.log("send to client: ", messageId);

      socket.nsp
        .to(String(channel_id))
        .emit(MESSAGE_TYPE.DELETE_MESSAGE, messageId);
    }
  });
}

exports.leaveChannel = async (io, socket, leaveMsg) => {
  socket.leave(String(leaveMsg.channel_id));
  //console.log("Server: leave the channel", socket.rooms);

  // Delete user from users
  deleteUserFromUsers(leaveMsg.user_id, leaveMsg.channel_name);

  // Send updated channel users to everyone
  //socket.nsp.to(String(leaveMsg.channel_id)).emit(MESSAGE_TYPE.CHANNEL_USERS, {
  io.emit(MESSAGE_TYPE.CHANNEL_USERS, {
    channels,
    users,
  });
}

function handleJoinChannel(socket, joinMsg) {
  socket.join(String(joinMsg.channel_id));

  // Add user into users

  users[joinMsg.channel_name].push({
    user_id: joinMsg.user_id,
    user_name: joinMsg.user_name,
    avatar: joinMsg.avatar,
  });
  console.log("joined: ", users);
  // Send updated channel users
  socket.nsp.to(String(joinMsg.channel_id)).emit(MESSAGE_TYPE.CHANNEL_USERS, {
    channels,
    users,
  });
}

function deleteUserFromUsers(user_id, channel_name) {
  users[channel_name] = users[channel_name].filter(
    (user) => user.user_id !== user_id
  );
  //console.log("left: ", users[channel_name]);
}

function getChannelsWithState() {
  const result = channels.map((channel) => {
    return {
      ...channel,
      isActive: users[channel.channel_name] ? true : false,
    };
  });
  console.log(result);

  return result;
}
