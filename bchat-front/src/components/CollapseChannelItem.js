import React, { useState, useContext } from "react";
import { SocketContext } from "../context/socket.context";

import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import GroupIcon from "@mui/icons-material/Group";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import LoginIcon from "@mui/icons-material/Login";
import Collapse from "@mui/material/Collapse";
import Avatar from "@mui/material/Avatar";

export default function CollapseChannelItem({
  currentChannelId,
  channel,
  handleJoinChannel,
}) {
  const { channelUsers } = useContext(SocketContext);

  const [isExpand, setIsExpand] = useState(false);

  const handleExpand = (e) => {
    setIsExpand((prev) => !prev);
    e.stopPropagation();
  };

  const onClickJoinChannel = () => {
    setIsExpand(true);
    handleJoinChannel(channel.id, channel.channel_name);
  };
  return (
    <>
      <ListItem
        value={channel.channel_name}
        key={channel.id}
        sx={{
          bgcolor: `${
            currentChannelId === channel.id ? "PowderBlue" : "transparent"
          }`,
        }}
      >
        <ListItemIcon>
          <GroupIcon />
        </ListItemIcon>
        <ListItemText primary={channel.channel_name} />
        <LoginIcon
          sx={{ color: "blue", cursor: "pointer", mr: 2 }}
          onClick={onClickJoinChannel}
        />
        {isExpand ? (
          <ExpandLess
            onClick={handleExpand}
            sx={{ color: "blue", cursor: "pointer" }}
          />
        ) : (
          <ExpandMore
            onClick={handleExpand}
            sx={{ color: "blue", cursor: "pointer" }}
          />
        )}
      </ListItem>
      <Collapse in={isExpand} timeout='auto' unmountOnExit>
        <List component='div' disablePadding>
          {channelUsers.users[channel.channel_name].map((user) => (
            <ListItem key={user.id} dense>
              <ListItemAvatar>
                <Avatar src={user.avatar} sx={{ width: 14, height: 14 }} />
              </ListItemAvatar>
              <ListItemText secondary={user.user_name} />
            </ListItem>
          ))}
        </List>
      </Collapse>
    </>
  );
}
