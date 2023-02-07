// import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../context/user.context";
import { SocketContext } from "../context/socket.context";
import { authenticateUser } from "../ApiServices/authService";
import { setJwt } from "../ApiServices/jwtService";

import Input from "@mui/material/Input";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import InputAdornment from "@mui/material/InputAdornment";
import AccountCircle from "@mui/icons-material/AccountCircle";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import VpnKeyIcon from "@mui/icons-material/VpnKey";

import React, { Fragment } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';

export default function LoginPage() {
  let navigate = useNavigate();
  const { setCurrentUser } = useContext(UserContext);
  const { getChannelUsers } = useContext(SocketContext);


  const validationSchema = Yup.object().shape({
   
    email: Yup.string()
      .required('Email is required')
      .email('Email is invalid'),
    pwd: Yup.string()
      .required('Password is required'),
    
   
  });  

  const {
    register,
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(validationSchema)
  });

  // const [loginFormData, setLoginFormData] = React.useState({
  //   email: "",
  //   pwd: "",
  // });

  // const handleFormChange = (event) => {
  //   const { name, value } = event.target;
  //   setLoginFormData((prevFormData) => ({
  //     ...prevFormData,
  //     [name]: value,
  //   }));
  // };

  const onSubmit = async (data) => {
    //console.log(loginFormData);

    const data1 = await authenticateUser(data);
    console.log(data1);

    if (data1) {
      const token = data1.jwt;
      console.log("token: ", token);
      //set Jwt
      setJwt(token);

      //set current user
      const payload = JSON.parse(window.atob(token.split(".")[1]));
      console.log(payload);
      setCurrentUser({ ...payload });
    }

    getChannelUsers();
    navigate("/chat");
  };

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
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
          }}
        >
          <CardMedia
            component='img'
            image='/coding-hamster.png'
            alt='green iguana'
          />
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <CardContent>
            <Typography gutterBottom variant='h5' component='div'>
              LOGIN
            </Typography>
            <FormControl sx={{ m: 1 }}>
              <Input
                name='email'
                placeholder='email address'
                startAdornment={
                  <InputAdornment position='start'>
                    <AccountCircle />
                  </InputAdornment>
                }
                {...register('email')}
                error={errors.email ? true : false}
                // onChange={handleFormChange}

              />
              <Typography variant="inherit" color="textSecondary">
              {errors.email?.message}
            </Typography>
            </FormControl>
            <FormControl sx={{ m: 1 }}>
              <Input
                name='pwd'
                type='password'
                placeholder='password'
                startAdornment={
                  <InputAdornment position='start'>
                    <VpnKeyIcon />
                  </InputAdornment>
                  
                }
                {...register('pwd')}
              error={errors.pwd ? true : false}
                // onChange={handleFormChange}
              />
              <Typography variant="inherit" color="textSecondary">
              {errors.pwd?.message}
            </Typography>
            </FormControl>
          </CardContent>
          <CardActions>
            <Button variant='contained' onClick={handleSubmit(onSubmit)}>
              Login
            </Button>
          </CardActions>
          <Typography
            gutterBottom
            variant='body2'
            display='inline-block'
            component='div'
            sx={{ m: 1 }}
          >
            If you don't have an account, please{" "}
            <Link to='/sign-up'>SIGNUP</Link> here.
          </Typography>
        </Box>
      </Card>
    </Box>
  );
}
