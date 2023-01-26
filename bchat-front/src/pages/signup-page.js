// import React from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../ApiServices/authService";
import { useContext } from "react";
import { UserContext } from "../context/user.context";
import { SocketContext } from "../context/socket.context";
import { setJwt } from "../ApiServices/jwtService";
import { stringAvatar } from "../utils/utils";
import Avatar from "@mui/material/Avatar";
import TextField from "@mui/material/TextField";
// import FormControl from "@mui/material/FormControl";
// import OutlinedInput from "@mui/material/OutlinedInput";
// import InputLabel from "@mui/material/InputLabel";
// import InputAdornment from "@mui/material/InputAdornment";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import { Button, IconButton } from "@mui/material";
// import Visibility from "@mui/icons-material/Visibility";
// import VisibilityOff from "@mui/icons-material/VisibilityOff";


import React, { Fragment } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';



export default function SignupPage() {


  const validationSchema = Yup.object().shape({
    user_name : Yup.string()
      .required('Username is required')
      .min(6, 'Username must be at least 6 characters')
      .max(20, 'Username must not exceed 20 characters'),
    email: Yup.string()
      .required('Email is required')
      .email('Email is invalid'),
    pwd: Yup.string()
      .required('Password is required')
      .min(6, 'Password must be at least 6 characters')
      .max(40, 'Password must not exceed 40 characters'),
    confirmPassword: Yup.string()
      .required('Confirm Password is required')
      .oneOf([Yup.ref('pwd'), null], 'Confirm Password does not match'),
   
  });
  

  let navigate = useNavigate();
  const { setCurrentUser } = useContext(UserContext);
  const { getChannelUsers } = useContext(SocketContext);


const {
  register,
  control,
  handleSubmit,
  formState: { errors }
} = useForm({
  resolver: yupResolver(validationSchema)
});

// const [signupFormData, setSignupFormData] = React.useState({
//       user_name: "",
//       email: "",
//       pwd: "",
//     });

//   const handleFormChange = (event) => {
//     const { name, value } = event.target;
//     setSignupFormData((prevFormData) => ({
//       ...prevFormData,
//       [name]: value,
//     }));
//   };
const onSubmit = async(data) => {
  // console.log(JSON.stringify(data, null, 2));
  const data1 = await registerUser(data);

    console.log(data1);
    if (data1) {
      const token = data1.jwt;
      //console.log("token: ", token);\
      if(token === null){
        console.log("token: ", token);
        return;
      }
      //set Jwt
      setJwt(token);

      //set current user
      const payload = JSON.parse(window.atob(token.split(".")[1]));
      //console.log(payload);
      setCurrentUser({
        ...payload,
      });
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
      maxWidth: 500,
      p: 4,
      pr: 8,
      pl: 6,
     border: "none", boxShadow: "none",
    }}
    
  >
     {/* <Box
          sx={{
            width: "20%",
            outline: "none"
          }}
        >
          <h5>SB</h5>
          <Avatar {...stringAvatar(signupFormData.user_name)} />
        </Box> */}
 <Box 
 >
  <Fragment>
    <Paper  elevation={0}>
       
    
        <Typography variant="h5" align="center" margin="dense">
          SIGN UP
        </Typography>
        
        <Grid container spacing={1}
        item
        direction="column"
        alignItems="center"
        justifyContent="center"
      
         >
          <Grid item xs={12} sm={6}>
            <TextField
              required
              id="username"
              name="user_name"
              label="Username"
              fullWidth
              margin="dense"
              // onChange={handleFormChange}

              {...register('user_name')}
              error={errors.user_name ? true : false}
            />
            <Typography variant="inherit" color="textSecondary">
              {errors.user_name?.message}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              id="email"
              name="email"
              label="Email"
              fullWidth
              margin="dense"
              // onChange={handleFormChange}

              {...register('email')}
              error={errors.email ? true : false}
            />
            <Typography variant="inherit" color="textSecondary">
              {errors.email?.message}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              id="password"
              name="pwd"
              label="Password"
              type="password"
              fullWidth
              margin="dense"
              // onChange={handleFormChange}

              {...register('pwd')}
              error={errors.pwd ? true : false}
            />
            <Typography variant="inherit" color="textSecondary">
              {errors.pwd?.message}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              id="confirmPassword"
              name="confirmPassword"
              label="Confirm Password"
              type="password"
              fullWidth
              margin="dense"
              {...register('confirmPassword')}
              error={errors.confirmPassword ? true : false}
            />
            <Typography variant="inherit" color="textSecondary">
              {errors.confirmPassword?.message}
            </Typography>
          </Grid>
         
       
     
        
        <Box mt={3}
        >
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit(onSubmit)}
          >
            Register
          </Button>
        </Box>
        </Grid>
        
    </Paper>
  </Fragment>
  </Box>
  </Card>
  </Box>
);
}