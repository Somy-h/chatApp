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
      messageOrientation: "flex-end",
      messageLayout: {
        backgroundColor: 'primary.dark'
      }
    }
  ) : (
    messageType = {
      messageOrientation: "flex-start",
      messageLayout: {
        backgroundColor: 'primary.main'
      }
    }
  )


  return(
    <Box component="span" sx={`${messageType.messageLayout}`}> 
      <Grid container direction="row" alignItems="flex-start" justifyContent={messageType.messageOrientation} spacing={2}>
        {/* avatar grid */}
        <Grid item xs="auto">
          <Avatar {...stringAvatar(message.user_name)} />
          {/* <Avatar alt={message.user_name} src={message.avatar} /> */}
        </Grid>
        {/* user time and message container */}
        <Grid item xs={5}>
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
        <Grid item xs="auto">
          {message.user_id === currentUser.id ? (
              <IconButton aria-label='delete' onClick={handleDeleteMessage}>
                <DeleteIcon />
              </IconButton>
            ) : null}
        </Grid>
      </Grid>
    </Box> 
  );

  //   <ListItem alignItems="flex-end">
  //     <ListItemText
  //       primary={`${message.user_name}`}
  //       secondary={
  //         <React.Fragment>
  //           <Typography
  //             sx={{ display: "inline" }}
  //             component='span'
  //             variant='body2'
  //             color='text.primary'
  //           >
  //             {message.time}
  //           </Typography>
  //         </React.Fragment>
  //       }
  //     />
  //   </ListItem>




  //original
  // return (
  //   <ListItem alignItems="flex-end">
  //     <ListItemAvatar>
  //       <Avatar {...stringAvatar(message.user_name)} />
  //       {/* <Avatar alt={message.user_name} src={message.avatar} /> */}
  //     </ListItemAvatar>
  //     <ListItemText
  //       primary={`${message.user_name}`}
  //       secondary={
  //         <React.Fragment>
  //           <Typography
  //             sx={{ display: "inline" }}
  //             component='span'
  //             variant='body2'
  //             color='text.primary'
  //           >
  //             {message.message}
  //           </Typography>
  //         </React.Fragment>
  //       }
  //     />
  //     {message.user_id === currentUser.id ? (
  //       <IconButton aria-label='delete' onClick={handleDeleteMessage}>
  //         <DeleteIcon />
  //       </IconButton>
  //     ) : null}
  //   </ListItem>
  // );

}
