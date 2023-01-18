import React from "react";
import { useNavigate } from "react-router-dom";
import { updateUserProfile } from "../ApiServices/authService";
import { useState, useContext } from "react";
import { UserContext } from "../context/user.context";
import { SocketContext } from "../context/socket.context";
import { setJwt } from "../ApiServices/jwtService";
import { stringAvatar } from "../utils/utils";
import CollapseAlert from "../components/CollapseAlert";
import { ALERT_TYPE } from "../components/CollapseAlert";

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
  const navigate = useNavigate();

  const { currentUser, setCurrentUser } = useContext(UserContext);
  const { getChannelUsers } = useContext(SocketContext);

  //const [imageAvatar, setImageAvatar] = useState(null);
  const [settingFormData, setSettingFormData] = useState({
    ...currentUser,
    pwd: "",
    pwd2: "",
  });

  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [previewAvatarURL, setPreviewAvatarURL] = useState(null);

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
    // Check password
    if (settingFormData.pwd !== settingFormData.pwd2) {
      console.log("Passwords do not match");
      displayErrorMessage(true, "Passwords do not match");
      return false;
    }
    if (!settingFormData.user_name || !settingFormData.user_name?.trim()) {
      displayErrorMessage(true, "User name should not be empty");
      return false;
    }

    // success
    displayErrorMessage(false);
    return true;
  };

  const displayErrorMessage = (isErr, errMessage = "") => {
    setIsError(isErr);
    setErrorMessage(errMessage);
  };

  const getAvatarFileInfo = (e) => {
    if (e.target.files.length > 0) {
      setSettingFormData((prevData) => ({
        ...prevData,
        avatar: e.target.files[0],
      }));

      setPreviewAvatarURL(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleUpdateSetting = async () => {
    //Validate the fields
    if (!isValidField()) return;

    // Make Request data with image file
    const formData = new FormData();
    formData.append("id", settingFormData.id);
    formData.append("user_name", settingFormData.user_name);
    settingFormData.pwd && formData.append("pwd", settingFormData.pwd);
    console.log(previewAvatarURL ? "yes" : "no ");
    previewAvatarURL &&
      formData.append(
        "avatar",
        settingFormData?.avatar,
        settingFormData?.avatar?.name
      );
    formData.forEach((item) => console.log(item));

    // Call API to update the user settings
    try {
      const data = await updateUserProfile(formData);
      if (data) {
        const token = data.jwt;
        console.log("token: ", token);

        //Check if the update was successful
        if (token) {
          setJwt(token);
          //set updated current user
          const payload = JSON.parse(window.atob(token.split(".")[1]));

          console.log(payload);
          setCurrentUser({
            ...payload,
          });

          getChannelUsers();
          navigate("/chat");
        } else {
          console.log(data);
          displayErrorMessage(true, data);
        }
      }
    } catch (err) {
      console.log("Update Error: ", err);
    }
  };

  const handleCancel = () => {
    navigate("/chat");
  };

  const displayAvatar = () => {
    if (previewAvatarURL) {
      return <Avatar src={previewAvatarURL} sx={{ width: 64, height: 64 }} />;
    } else if (currentUser.avatar) {
      return <Avatar src={currentUser.avatar} sx={{ width: 64, height: 64 }} />;
    } else {
      return (
        <Avatar
          {...stringAvatar(settingFormData.user_name)}
          sx={{ width: 64, height: 64 }}
        />
      );
    }
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
      {currentUser ? (
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
              width: "40%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            {displayAvatar()}

            <label for='input_avatar'>
              <AddPhotoAlternateIcon
                sx={{ color: "blue", cursor: "pointer" }}
              />
              <input
                id='input_avatar'
                style={{ display: "none" }}
                type='file'
                accept='image/gif, image/jpeg, image/png'
                onChange={getAvatarFileInfo}
              ></input>
            </label>
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
              <CollapseAlert alertType={ALERT_TYPE.ERROR} isOpen={isError}>
                {errorMessage}
              </CollapseAlert>

              <FormControl sx={{ m: 1, width: "25ch" }} variant='outlined'>
                <InputLabel>User Name</InputLabel>
                <OutlinedInput
                  type='text'
                  name='user_name'
                  value={settingFormData.user_name}
                  onChange={handleFormChange}
                />
              </FormControl>

              <TextField
                required
                name='email'
                value={currentUser.email}
                disabled
              />

              <FormControl sx={{ m: 1, width: "25ch" }} variant='outlined'>
                <InputLabel htmlFor='outlined-adornment-password'>
                  Change Password
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
                  onChange={handleFormChange}
                />
              </FormControl>
            </CardContent>
            <CardActions>
              <Button variant='contained' onClick={handleCancel}>
                Cancel
              </Button>
              <Button variant='contained' onClick={handleUpdateSetting}>
                Update
              </Button>
            </CardActions>
          </Box>
        </Card>
      ) : null}
    </Box>
  );
}
