import { useContext, useRef, useEffect, useCallback, useState } from "react";
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

  //START OF CALLBACK REF

  // const useHookWithRefCallback = () => {
  //   const messageStreamEnd = useRef(null)
  //   const setRef = useCallback(node => {
  //     if (messageStreamEnd.current) {
  //       // Make sure to cleanup any events/references added to the last instance
  //       messageStreamEnd.scrollIntoView({behavior: "smooth"})
  //     }
      
  //     if (node) {
  //       // Check if a node is actually passed. Otherwise node would be null.
  //       // You can now do what you need to, addEventListeners, measure, etc.

  //     }
      
  //     // Save a reference to the node
  //     messageStreamEnd.current = node
  //   }, [])
    
  //   return [setRef]
  // }
  
  // function Component() {
  //   // In your component you'll still recieve a `ref`, but it 
  //   // will be a callback function instead of a Ref Object
  //   const [messageStreamEnd] = useHookWithRefCallback()
    
  //   return <div ref={messageStreamEnd}>Ref element</div>
  // }


  // //END OF CALLBACK REF
  
  const [messageID, setMessageID] = useState(0);
  const [selectedChannel, setSelectedChannel] = useState("")

  const handleNewMessage = (newID) => {
    setMessageID(newID);
  }
  
  
  // ref used to scroll to the bottom of message stream
  let messageStreamEnd = useRef(null);

  const scrollToBottom = (scrollBehavior) => {
    messageStreamEnd.scrollIntoView({behavior: scrollBehavior})
  }
  
  //checks if currently in a channel then scrolls to bottom whenever last rendered message has a different ID
  //ISSUE: currently activates scrollToBottom() when the last message in a stream is updated.
  //
  useEffect(() => {
    if (currentChannel) {
      console.log(currentChannel.channel_id);
      scrollToBottom("smooth");
    };
  }, [messageID]);

  useEffect(() => {
    if (currentChannel) {
      scrollToBottom("auto");
    }
  }, [currentChannel])



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
        <Channel />
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
