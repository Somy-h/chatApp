import { useContext } from "react";
import { UserContext } from "../context/user.context";
import { SocketContext } from "../context/socket.context";

import { IconButton } from "@mui/material";
import Box from "@mui/material/Box";
import LogoutTwoToneIcon from "@mui/icons-material/LogoutTwoTone";
import Typography from "@mui/material/Typography";

export default function Header() {
  const { currentUser, currentChannel, setCurrentChannel } =
    useContext(UserContext);
  const { leaveChannel } = useContext(SocketContext);

  const handleLeaveChannel = () => {
    console.log("Leave channel: ", currentChannel.chanel_name);
    const leaveMsg = {
      channel_id: currentChannel.channel_id,
      channel_name: currentChannel.channel_name,
      user_id: currentUser.id,
      user_name: currentUser.user_name,
    };
    leaveChannel(leaveMsg);
    setCurrentChannel(null);
  };

  return (
    <Box display='flex' justifyContent='space-between'>
      <Typography gutterBottom variant='h6' component='div'>
        {currentChannel.channel_name}
      </Typography>
      <IconButton
        size='small'
        edge='start'
        color='inherit'
        arial-label='home'
        sx={{ ml: 2 }}
        onClick={handleLeaveChannel}
      >
        <LogoutTwoToneIcon /> Leave
      </IconButton>
    </Box>
  );
}
