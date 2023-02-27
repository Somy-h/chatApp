require("dotenv").config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userModel = require("../models/user.model");

exports.createUser = async (req, res) => {
  await bcrypt.hash(req.body.pwd, 10).then(async (hash) => {
    try {
      console.log("Hashed the password ", hash);
      const userId = userModel.createUser(req, hash);

      const encodedUser = jwt.sign(
        {
          id: userId,
          email: req.body.email,
          user_name: req.body.user_name,
          avatar: null,
        },
        process.env.JWT_KEY
      );

      console.log("encoded user", encodedUser);
      res.json({ jwt: encodedUser });
    } catch (err) {
      console.log("error", err);
      //res.json("Failed to register user");
      res.status(404).json({
        status: "fail",
        message: err.message,
      });
    }
  });
};

exports.updateUser = async (req, res, err) => {
  console.log("update User");
  if (err === true) {
    console.log(err.message);
    res.json({
      success: false,
      msg: "Avatar image is not updated!",
    });
  } else {
    try {
      let hash;
      if (req.body.pwd) {
        hash = await bcrypt.hash(req.body.pwd, 10);
        console.log("Hashed the password ", hash);
      }
      const avatarURL = req.file
        ? `${process.env.BACK_URL}/images/avatar/${req.file.filename}`
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
    } catch (err) {
      console.log("error", err);
      res.status(404).json({
        status: "fail",
        message: err.message,
      });
    }
  }
};

exports.getUser = async (req, res) => {
  try {
  const user = await userModel.getUser(req, req.params.id);
  res.json({user: user});
  } catch (err) {
    console.log("error", err);
    res.status(404).json({
      status: "fail",
      message: err.message,
    });
  }
};
