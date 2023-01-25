import React from "react";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import SendIcon from "@mui/icons-material/Send";
//import "./inputMessage.css";

export default function InputMessage(props) {
  const [sendingMessage, setSendingMessage] = React.useState("");

  const handleMessageInputChange = (event) => {
    const { value } = event.target;
    setSendingMessage(value);
  };

  //sends message and resets input field
  const handleSendMessage = () => {
    props.sendMessage(sendingMessage);
    //resets input field
    setSendingMessage("");
    
  }

  return (
    <Box display='flex' sx={{ width: "90%" }}>
      {/* <input
        type='text'
        placeholder='Write message'
        className='message-input'
        name='message'
        onChange={handleMessageInputChange}
      /> */}
      
      <TextField
        fullWidth
        label='write message'
        id='inputMessage'
        name='message'
        onChange={handleMessageInputChange}
        value={sendingMessage}
      />
      <Button
        variant='outlined'
        sx={{ m: 1 }}
        endIcon={<SendIcon />}
        onClick={handleSendMessage}
      >
        SEND
      </Button>
    </Box>
  );
}
