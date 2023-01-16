import React, { useContext } from "react";
import { SocketContext } from "../context/socket.context";
import { UserContext } from "../context/user.context";
import CollapseChannelItem from "./CollapseChannelItem";

import List from "@mui/material/List";

export default function Channel() {
  const { channelUsers, joinChannel, leaveChannel } = useContext(SocketContext);
  const { currentUser, currentChannel, setCurrentChannel } =
    useContext(UserContext);

  const handleJoinChannel = (id, name) => {
    console.log("joined: ", id, name);

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
    setCurrentChannel({ channel_id: id, channel_name: name });
  };

  const channelList = () =>
    channelUsers?.channels?.map((channel) => (
      <CollapseChannelItem
        currentChannelId={currentChannel?.channel_id}
        channel={channel}
        handleJoinChannel={handleJoinChannel}
      />
    ));

  return (
    <List
      size='sm'
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
