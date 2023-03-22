require("dotenv").config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userModel = require("../models/user.model");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

exports.createUser = catchAsync (async (req, res, next) => {
  
  const hash = await bcrypt.hash(req.body.pwd, 10);
  const userId = await userModel.createUser(req, hash);

  const encodedUser = jwt.sign({
      id: userId,
      email: req.body.email,
      user_name: req.body.user_name,
      avatar: null,
    },
    process.env.JWT_KEY
  );

  console.log("encoded user", encodedUser);
  res.json({ jwt: encodedUser });
}); 


exports.updateUser =  catchAsync (async (req, res, next) => {
  
  let hash;
  if (req.body.pwd) {
    hash = await bcrypt.hash(req.body.pwd, 10);
    console.log("Hashed the password ", hash);
  }

  const avatarURL = req.file ? 
    `${process.env.BACK_URL}/images/avatar/${req.file.filename}`
    : null;
  console.log("avatarURL: ", avatarURL);
      
  await userModel.updateUser(req, hash, avatarURL);
  const user = await userModel.getUser(req, req.params.id);

  const encodedUser = jwt.sign(
    {
      id: user.id,
      email: user.email,
      user_name: user.user_name,
      avatar: user.avatar,
    },
    process.env.JWT_KEY
  );
  console.log("encoded user", encodedUser);
  res.json({ jwt: encodedUser });
  
});

exports.getUser = catchAsync (async (req, res, next) => {

  const user = await userModel.getUser(req, req.params.id);
  if (!user) {
    return next(new AppError("User not found", 404));
  }
  res.json({user: user});
});
