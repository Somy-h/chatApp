import { React, Fragment } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../context/user.context";
import { removeJwt } from "../ApiServices/jwtService";

import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import { Button, IconButton } from "@mui/material";
import SmsIcon from "@mui/icons-material/Sms";
import SettingsIcon from "@mui/icons-material/Settings";

export default function Menu() {
  let navigate = useNavigate();
  const { currentUser, setCurrentUser } = useContext(UserContext);

  const routeToHomePage = () => {
    navigate("/");
  };

  const routeToLoginPage = () => {
    navigate("/login");
  };

  const routeToChatPage = () => {
    navigate("/chat");
  };

  const routeToSettingPage = () => {
    navigate("/setting");
  };

  const handleLogout = () => {
    removeJwt();
    setCurrentUser(null);
    navigate("/login");
  };

  return (
    <Fragment>
      <AppBar position='static'>
        <Toolbar>
          <IconButton
            size='large'
            edge='start'
            color='inherit'
            arial-label='home'
            sx={{ mr: 2 }}
            onClick={routeToHomePage}
          >
            <SmsIcon />
          </IconButton>

          {currentUser ? (
            <Button variant='text' color='inherit' onClick={handleLogout}>
              Logout
            </Button>
          ) : (
            <Button variant='text' color='inherit' onClick={routeToLoginPage}>
              Login
            </Button>
          )}

          {currentUser ? (
            <Button variant='text' color='inherit' onClick={routeToChatPage}>
              Chat
            </Button>
          ) : null}

          {currentUser ? (
            <IconButton
              size='large'
              edge='start'
              color='inherit'
              arial-label='home'
              sx={{ ml: 2 }}
              onClick={routeToSettingPage}
            >
              <SettingsIcon />
            </IconButton>
          ) : null}
        </Toolbar>
      </AppBar>
      <Outlet />
    </Fragment>
  );
}
