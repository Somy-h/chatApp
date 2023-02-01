import React, { useContext } from "react";
import { SocketContext } from "../context/socket.context";
import { UserContext } from "../context/user.context";
import CollapseChannelItem from "./CollapseChannelItem";

import List from "@mui/material/List";

export default function Channel(prop) {
  const { channelUsers, joinChannel, leaveChannel } = useContext(SocketContext);
  const { currentUser, currentChannel, setCurrentChannel } =
    useContext(UserContext);
  const { handleChannelChange } = prop;

  const handleJoinChannel = (id, name) => {
    console.log("joined: ", id, name);
    
    //handle channel change in chat-page.js
    handleChannelChange()


    //Check if the channel is already joined
    if (currentChannel && currentChannel.channel_id === id) {
      console.log("Already joined: " + name);
      return;
    }

    //Check if user is already joined other channel
    if (currentChannel && currentChannel.channel_id !== id) {
      // Leave the previous channel first.
      const leaveMsg = {
        channel_id: currentChannel.channel_id,
        channel_name: currentChannel.channel_name,
        user_id: currentUser.id,
        user_name: currentUser.user_name,
      };
      leaveChannel(leaveMsg);
    }

    // Prepare join message channelID, channelName, userID, userName
    const joinMessage = {
      channel_id: id,
      channel_name: name,
      user_id: currentUser.id,
      user_name: currentUser.user_name,
      avatar: currentUser.avatar,
    };
    // Join the channel
    joinChannel(joinMessage);
    // Set current channel in user context
    console.log(currentChannel);
    setCurrentChannel({ channel_id: id, channel_name: name });
    console.log(currentChannel);

  };

  const channelList = () =>
    channelUsers?.channels?.map((channel, idx) => (
      <CollapseChannelItem
        key={idx}
        currentChannelId={currentChannel?.channel_id}
        channel={channel}
        handleJoinChannel={handleJoinChannel}
      />
    ));

  return (
    <List
      sx={{
        width: "100%",
        minWidth: 250,
        maxWidth: 360,
        bgcolor: "background.paper",
      }}
      component='nav'
      aria-labelledby='nested-list-subheader'
    >
      {channelList()}
    </List>
  );
}
