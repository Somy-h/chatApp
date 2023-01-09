import React from "react";
import { useContext } from "react";
import { UserContext } from "../context/user.context";
import { SocketContext } from "../context/socket.context";

import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";

export default function Message(prop) {
  const { message } = prop;
  const { currentUser } = useContext(UserContext);
  const { deleteMessage } = useContext(SocketContext);

  const handleDeleteMessage = () => {
    //Context Library- deleteMessage
    deleteMessage(message.channel_id, message.id);
  };
  return (
    <ListItem alignItems='flex-start'>
      <ListItemAvatar>
        <Avatar alt={message.user_name} src={message.avatar} />
      </ListItemAvatar>
      <ListItemText
        primary={`${message.user_name}`}
        secondary={
          <React.Fragment>
            <Typography
              sx={{ display: "inline" }}
              component='span'
              variant='body2'
              color='text.primary'
            >
              {message.message}
            </Typography>
          </React.Fragment>
        }
      />
      {message.user_id === currentUser.id ? (
        <IconButton aria-label='delete' onClick={handleDeleteMessage}>
          <DeleteIcon />
        </IconButton>
      ) : null}
    </ListItem>
  );
}
