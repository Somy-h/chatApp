import React, { useState, useContext } from "react";
import { SocketContext } from "../context/socket.context";
import { stringSmallAvatar } from "../utils/utils";

import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import GroupIcon from "@mui/icons-material/Group";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
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
  const { channelUsers, getChannelUsers } = useContext(SocketContext);

  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleExpand = (e) => {
    setIsCollapsed((prev) => !prev);
    e.stopPropagation();
    getChannelUsers();
  };

  const onClickJoinChannel = () => {
    setIsCollapsed(true);
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
        <Tooltip
          title={`join ${channel.channel_name}`}
          variant='outlined'
          color='info'
          size='sm'
          placement='left-end'
        >
          <IconButton
            color='primary'
            onClick={onClickJoinChannel}
            size='small'
            aria-label='join channel'
          >
            <LoginIcon fontSize='small' />
          </IconButton>
        </Tooltip>
        <Tooltip
          title={`${isCollapsed ? "hide users" : "show users"}`}
          variant='outlined'
          placement='right-end'
          color='info'
          size='sm'
        >
          {isCollapsed ? (
            <IconButton
              color='primary'
              onClick={handleExpand}
              size='small'
              aria-label='showed channel users'
            >
              <ExpandLess fontSize='small' />
            </IconButton>
          ) : (
            <IconButton
              color='primary'
              onClick={handleExpand}
              size='small'
              aria-label='hided channel users'
            >
              <ExpandMore fontSize='small' />
            </IconButton>
          )}
        </Tooltip>
      </ListItem>
      <Collapse in={isCollapsed} timeout='auto' unmountOnExit>
        <List component='div' disablePadding>
          {channelUsers.users[channel.channel_name].map((user) => (
            <ListItem key={user.id} dense>
              <ListItemAvatar>
                {user.avatar === null ? (
                  <Avatar {...stringSmallAvatar(user.user_name)} />
                ) : (
                  <Avatar src={user.avatar} sx={{ width: 16, height: 16 }} />
                )}
              </ListItemAvatar>
              <ListItemText secondary={user.user_name} />
            </ListItem>
          ))}
        </List>
      </Collapse>
    </>
  );
}
