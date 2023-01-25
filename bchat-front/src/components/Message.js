import React from "react";
import { useContext } from "react";
import { UserContext } from "../context/user.context";
import { SocketContext } from "../context/socket.context";
import { stringLargeAvatar } from "../utils/utils";

import DeleteIcon from "@mui/icons-material/Delete";
import { Hidden, Box, Paper, Grid, Typography, Avatar, IconButton, List, ListItem, ListItemText, ListItemAvatar } from "@mui/material";

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
        backgroundColor: "#69A8FF",
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
        backgroundColor: "#70D4FF",
        padding: 1
      }
    }
  )

  return(
    <Box sx={messageType.messageOrientation}>
      <Paper elevation={7} sx={messageType.messageLayout}> 
        <Grid container direction="row" alignItems="flex-start" justifyContent="space-between">
          <Grid container direction="row" alignItems="flex-start" justifyContent="space-between">
            <Grid item xs="11">
              <Grid container direction="row" alignItems="flex-start" spacing={1}>
                {/* avatar grid */}
                <Grid item xs="auto">
                  {message.avatar === null ? (
                      <Avatar {...stringLargeAvatar(message.user_name)} />
                    ) : <Avatar sx={{width: 45, height: 45 }} alt={message.user_name} src={message.avatar} />}
                </Grid>
                {/* user time and message container */}
                <Grid item xs={10}>
                  <Grid container>
                    {/* name and date container */}
                    <Grid item xs={12}>
                      {/* HERE HERE HERE HERE */}
                        <Grid container direction="row" justifyContent="flex-start" alignItems="flex-start" spacing={5} display={{ xs: 'none', lg: 'flex'}}>
                          <Grid item xs="auto">
                            <Typography variant="h6">{message.user_name}</Typography>
                          </Grid>
                          <Grid item xs="auto">
                          <Typography variant="subtitle2">{messageTimestamp}</Typography>
                          </Grid>
                        </Grid>
                        <ListItem alignItems='flex-start' display={{xs:'block', lg:'none'}} sx={{padding:0}}>
                          <ListItemText 
                            primary={
                              <React.Fragment>
                                <Typography
                                  display={{xs:'block', lg:'none'}}
                                  component='span'
                                  variant='h6'
                                  color='text.primary'
                                >
                                  {message.user_name}
                                </Typography>
                              </React.Fragment>
                            }
                            secondary={
                              <React.Fragment>
                                <Typography
                                  display={{xs:'block', lg:'none'}}
                                  component='span'
                                  variant='body2'
                                  color='text.primary'
                                >
                                  {messageTimestamp}
                                </Typography>
                              </React.Fragment>
                            }
                          />
                        </ListItem>
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
              </Grid>
            </Grid>
            <Grid item xs="auto">  
              {/* user delete message button grid*/}
              <Grid container direction="row" justifyContent="flex-end" alignItems="flex-start">
                <Grid item xs="auto" >
                  {message.user_id === currentUser.id ? (
                      <IconButton sx={{margin: 0, padding: 0, display: 'flex', alignSelf: 'flex-end'}} aria-label='delete' onClick={handleDeleteMessage}>
                        <DeleteIcon />
                      </IconButton>
                    ) : null}
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
}