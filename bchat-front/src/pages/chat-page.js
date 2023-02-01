import { useContext, useRef, useEffect, useState } from "react";
import { UserContext } from "../context/user.context";
import { SocketContext } from "../context/socket.context";

import Channel from "../components/Channel";
import Header from "../components/Header";
import Message from "../components/Message";
import InputMessage from "../components/InputMessage";

import { Box, CssBaseline } from "@mui/material";

export default function ChatPage() {
  const { currentUser, currentChannel } = useContext(UserContext);
  const { channelMessages, sendMessage } = useContext(SocketContext);

  //state setup
  const [messageID, setMessageID] = useState(0);
  const [channelChange, setChannelChange] = useState(false);


  const handleNewMessage = (newID) => {
    //if statement stops scrolling from message being deleted 
    if (newID > messageID) {
      setMessageID(newID);
    }
  };

  //channel change from Channel component
  const handleChannelChange = () => {
    //when channel changes it resets messageID state
    setMessageID(0);
    //sets state for selected channel
    setChannelChange(true);
  }
  
  // ref used to scroll to the bottom of message stream
  let messageStreamEnd = useRef(null);

  const scrollToBottom = (scrollBehavior) => {
    messageStreamEnd.scrollIntoView({behavior: scrollBehavior})
  }
  
  //checks if messages have been rendered then scroll to bottom of message
  useEffect(() => {
    if (messageID > 0) {
      //If the channel was switch it will auto scroll to bottom
      if (channelChange) {
        scrollToBottom("auto");
        setChannelChange(false);
      }
      //If the channel was not switch then it will smooth scroll to bottom on new message
      scrollToBottom("smooth");
    }
  }, [messageID, channelChange]);


  const displayMessages = () =>
    channelMessages?.map((msg) => <Message key={msg.id} message={msg} handleNewMessage={handleNewMessage} />);

  const handleSendMessage = (messageText) => {
    const sendMsg = {
      channel_id: currentChannel.channel_id,
      channel_name: currentChannel.channel_name,
      user_id: currentUser.id,
      user_name: currentUser.user_name,
      avatar: currentUser.avatar,
      message: messageText,
    };
    sendMessage(sendMsg);
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <Box component='nav'>
        <Channel handleChannelChange={handleChannelChange} />
      </Box>
      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          height: "90vh",
        }}
      >
        {currentChannel?.channel_id ? (
          <>
            <Header />
            <Box
              component='main'
              sx={{ flex: 1, py: 6, px: 4, bgcolor: "#eaeff1", "overflow-x": "hidden"}}
            >
              {displayMessages()}
              <div ref={(element) => {messageStreamEnd = element;}}>
                
              </div>
            </Box>
            <Box component='footer' sx={{ p: 2, bgcolor: "#eaeff1" }}>
              <InputMessage sendMessage={handleSendMessage} />
            </Box>
          </>
        ) : null}
      </Box>
    </Box>
  );
};
