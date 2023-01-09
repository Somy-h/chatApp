import { useContext } from "react";
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

  const displayMessages = () =>
    channelMessages?.map((msg) => <Message key={msg.id} message={msg} />);

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
              sx={{ flex: 1, py: 6, px: 4, bgcolor: "#eaeff1" }}
            >
              {displayMessages()}
            </Box>
            <Box component='footer' sx={{ p: 2, bgcolor: "#eaeff1" }}>
              <InputMessage sendMessage={handleSendMessage} />
            </Box>
          </>
        ) : null}
      </Box>
    </Box>
  );
}
