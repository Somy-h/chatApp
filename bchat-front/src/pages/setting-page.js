import React from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../ApiServices/authService";
import { useContext } from "react";
import { UserContext } from "../context/user.context";
import { SocketContext } from "../context/socket.context";
import { setJwt } from "../ApiServices/jwtService";
import { stringAvatar } from "../utils/utils";

import Avatar from "@mui/material/Avatar";
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import InputAdornment from "@mui/material/InputAdornment";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { Button, IconButton } from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";

export default function SettingPage() {
  let navigate = useNavigate();
  const { currentUser, setCurrentUser } = useContext(UserContext);
  const { getChannelUsers } = useContext(SocketContext);

  const [settingFormData, setSettingFormData] = React.useState({
    ...currentUser,
    pwd2: "",
  });
  const [showPassword, setShowPassword] = React.useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleFormChange = (event) => {
    const { name, value } = event.target;
    setSettingFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const isValidField = () => {
    if (settingFormData.pwd?.trim() === "") return false;
    if (settingFormData.user_name?.trim() === "") return false;
    return true;
  };

  const handleUpdateSetting = async () => {
    //Validate the fields
    if (!isValidField()) return;

    //!!! HAVE TO PROVIDE UPDATE USER
    /*
    const data = await updateUser(settingFormData);
    console.log(data);

    if (data) {
      const token = data.jwt;
      //console.log("token: ", token);
      //set Jwt
      setJwt(token);

      //set current user
      const payload = JSON.parse(window.atob(token.split(".")[1]));
      //console.log(payload);
      setCurrentUser({
        ...payload,
      });
    }
    */

    getChannelUsers();
    navigate("/chat");
  };

  const handleUpdateAvatar = () => {
    console.log("updateAvatar");
  };

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "90vh",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Card
        sx={{
          display: "flex",
          alignItems: "center",
          maxWidth: 450,
          p: 4,
          pr: 6,
          pl: 6,
        }}
      >
        <Box
          sx={{
            width: "50%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar
            {...stringAvatar(settingFormData.user_name)}
            sx={{ width: 64, height: 64 }}
          />
          <Typography
            gutterBottom
            variant='body1'
            component='div'
            sx={{ m: 1 }}
          >
            <IconButton
              aria-label='upload avatar'
              onClick={handleUpdateAvatar}
              color='primary'
            >
              <AddPhotoAlternateIcon />
            </IconButton>
          </Typography>
        </Box>
        <Box
          component='form'
          noValidate
          autoComplete='off'
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            "& .MuiTextField-root": { m: 1, width: "25ch" },
          }}
        >
          <CardContent>
            <Typography gutterBottom variant='h5' component='div'>
              USER SETTINGS
            </Typography>
            <TextField
              name='user_name'
              required
              value={currentUser.user_name}
              onChange={handleFormChange}
            />
            <TextField required name='email' label='email' disabled />

            <FormControl sx={{ m: 1, width: "25ch" }} variant='outlined'>
              <InputLabel htmlFor='outlined-adornment-password'>
                Password
              </InputLabel>
              <OutlinedInput
                id='outlined-adornment-password'
                type={showPassword ? "text" : "password"}
                endAdornment={
                  <InputAdornment position='end'>
                    <IconButton
                      aria-label='toggle password visibility'
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge='end'
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
                name='pwd'
                onChange={handleFormChange}
              />
            </FormControl>
            <FormControl sx={{ m: 1, width: "25ch" }} variant='outlined'>
              <InputLabel htmlFor='outlined-adornment-password'>
                Confirm Password
              </InputLabel>
              <OutlinedInput
                id='outlined-adornment-password'
                type={showPassword ? "text" : "password"}
                endAdornment={
                  <InputAdornment position='end'>
                    <IconButton
                      aria-label='toggle password visibility'
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge='end'
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
                name='pwd2'
              />
            </FormControl>
          </CardContent>
          <CardActions>
            <Button variant='contained' onClick={handleUpdateSetting}>
              Update
            </Button>
          </CardActions>
        </Box>
      </Card>
    </Box>
  );
}
