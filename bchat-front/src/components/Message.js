import React from "react";
import { useContext } from "react";
import { UserContext } from "../context/user.context";
import { SocketContext } from "../context/socket.context";
import { stringAvatar } from "../utils/utils";

import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import { blue, cyan } from "@mui/material/colors";

export default function Message(prop) {
  const { message } = prop;
  const { currentUser } = useContext(UserContext);
  const { deleteMessage } = useContext(SocketContext);

  const handleDeleteMessage = () => {
    //Context Library- deleteMessage
    deleteMessage(message.channel_id, message.id);
  };

  //get message time
  // let messageTimeStamp = message.time.toLocalString();\
  const messageTimestamp = new Date(message.time).toLocaleString();

  //current theme work
  let messageType = {} ;
  (message.user_id === currentUser.id) ? (
    messageType = {
      messageOrientation: {
        width: '100%', 
        display: 'flex', 
        justifyContent: 'flex-end'
      },
      messageLayout: {
        margin: "0px 0px 8px 0px",
        width: "60%",
        border: "solid 1px red",
        backgroundColor: "#006AFF",
        padding: 1
      }
    }
  ) : (
    messageType = {
      messageOrientation: {
        width: '100%', 
        display: 'flex', 
        justifyContent: 'flex-start'
      },
      messageLayout: {
        margin: "0px 0px 8px 0px",
        width: "60%",
        border: "solid 1px red",
        backgroundColor: "#00B2FF",
        padding: 1
      }
    }
  )

  return(
    <Box sx={messageType.messageOrientation}>
      <Paper variant="outlined" elevation={3} sx={messageType.messageLayout}> 
        <Grid container direction="row" alignItems="flex-start" spacing={2}>
          {/* avatar grid */}
          <Grid item xs="auto">
            {message.avatar === null ? (
                <Avatar {...stringAvatar(message.user_name)} />
              ) : <Avatar alt={message.user_name} src={message.avatar} />}
          </Grid>
          {/* user time and message container */}
          <Grid item xs={9}>
            <Grid container>
              {/* name and date container */}
              <Grid xs={12}>
                <Grid container direction="row" justifyContent="flex-start" alignItems="flex-start" spacing={5}>
                  <Grid item xs="auto">
                    <Typography variant="h6">{message.user_name}</Typography>
                  </Grid>
                  <Grid item xs="auto">
                  <Typography variant="subtitle2">{messageTimestamp}</Typography>
                  </Grid>
                </Grid>
              </Grid>
              {/* message grid */}
              <Grid item xs={12}>
                <Typography
                  sx={{ display: "inline" }}
                  component='span'
                  variant='body2'
                  color='text.primary'
                >
                  {message.message}
                </Typography>
              </Grid>
            </Grid>
          </Grid>
          {/* user delete message button grid*/}
          <Grid item xs="auto" direction="row" justifyContent="flex-end" alignItems="flex-start">
            {message.user_id === currentUser.id ? (
                <IconButton sx={{margin: 0, padding: 0, display: 'flex', alignSelf: 'flex-start'}} aria-label='delete' onClick={handleDeleteMessage}>
                  <DeleteIcon />
                </IconButton>
              ) : null}
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
}
