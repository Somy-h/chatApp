const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const authModel = require("../models/auth.model");

exports.signIn = async (req, res) => {
  try {
    console.log(req.body);
    const { email, pwd } = req.body;
    console.log("signin", email, pwd);
    const user = await authModel.getUserByEmail(req, email);

    if (!user) {
      console.log("Email not found");
      return res.status(404).json({
        status: "fail",
        message: "Email not found"
      });
    }

    const dbPassword = `${user.pwd}`;
    const compare = await bcrypt.compare(pwd, dbPassword);
    
    if (compare) {
      const payload = {
        id: user.id,
        email: user.email,
        user_name: user.user_name,
        avatar: user.avatar,
      };
      console.log("payload:", payload);
      const encodedUser = jwt.sign(payload, process.env.JWT_KEY);

      res.json({ jwt: encodedUser });
    } else {
      console.log("Password not found");
      //res.json("Password not found");
      res.status(404).json({
        status: "fail",
        message: "Password not found",
      });
    }
  } catch (err) {
    console.log("Error in /authenticate", err);
    //res.json("Failed to authenticate user");
    res.status(404).json({
      status: "fail",
      message: err.message
    });
  }
};
