import { createContext, useState, useEffect } from "react";
import { io } from "socket.io-client";

export const MESSAGE_TYPE = {
  GET_CHANNELS: "get_channels",
  CHANNEL_USERS: "channel_users",
  JOIN_CHANNEL: "join_channel",
  SEND_MESSAGE: "send_message",
  RECEIVE_MESSAGE: "receive_message",
  DELETE_MESSAGE: "delete_message",
  LEAVE_CHANNEL: "leave_channel",
};

const socket = io.connect("http://localhost:4000", {
  withCredentials: true,
});
export const SocketContext = createContext(socket);

export const SocketProvider = ({ children }) => {
  const [channelUsers, setChannelUsers] = useState(null);
  const [channelMessages, setChannelMessages] = useState([]);

  const handleReceiveMessage = (message) => {
    //console.log("Received message", message);
    setChannelMessages((prevMessages) => [...prevMessages, message]);
  };

  const handleChannelMessages = (messages) => {
    //console.log("getting channel messages", messages);
    setChannelMessages(messages);
  };

  const handleDeletedMessage = (deletedMsgId) => {
    //console.log("getting delete message from server: ", deletedMsgId);
    const deletedMsg = channelMessages.find((msg) => msg.id === deletedMsgId);
    if (deletedMsg) {
      //Exclude deleted message
      deletedMsg.inactive = true;
      const activeMessages = channelMessages.filter((msg) => !msg.inactive);
      setChannelMessages(activeMessages);
    }
  };

  useEffect(() => {
    socket.on(MESSAGE_TYPE.JOIN_CHANNEL, handleChannelMessages);
    return () => {
      socket.off(MESSAGE_TYPE.JOIN_CHANNEL, handleChannelMessages);
    };
  }, []);

  useEffect(() => {
    socket.on(MESSAGE_TYPE.RECEIVE_MESSAGE, handleReceiveMessage);
    socket.on(MESSAGE_TYPE.DELETE_MESSAGE, handleDeletedMessage);
    return () => {
      socket.off(MESSAGE_TYPE.RECEIVE_MESSAGE, handleReceiveMessage);
      socket.off(MESSAGE_TYPE.DELETE_MESSAGE, handleDeletedMessage);
    };
  }, [channelMessages]);

  useEffect(() => {
    socket.on(MESSAGE_TYPE.CHANNEL_USERS, (responseData) =>
      setChannelUsers(responseData)
    );
    return () => {
      socket.off(MESSAGE_TYPE.CHANNEL_USERS, (responseData) =>
        setChannelUsers(responseData)
      );
    };
  }, [channelUsers]);

  function getChannelUsers() {
    socket.emit(MESSAGE_TYPE.CHANNEL_USERS);
  }

  function joinChannel(joinMessage) {
    socket.emit(MESSAGE_TYPE.JOIN_CHANNEL, joinMessage);
  }

  function sendMessage(message) {
    console.log("Sending message: ", message);
    socket.emit(MESSAGE_TYPE.SEND_MESSAGE, message);
    return;
  }

  function deleteMessage(channel_id, messageId) {
    console.log("Deleting message: ", messageId);
    socket.emit(MESSAGE_TYPE.DELETE_MESSAGE, channel_id, messageId);
  }

  function leaveChannel(message) {
    socket.emit(MESSAGE_TYPE.LEAVE_CHANNEL, message);
    setChannelMessages(null);
  }

  return (
    <SocketContext.Provider
      value={{
        socket,
        channelUsers,
        channelMessages,
        setChannelMessages,
        getChannelUsers,
        joinChannel,
        sendMessage,
        deleteMessage,
        leaveChannel,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};
