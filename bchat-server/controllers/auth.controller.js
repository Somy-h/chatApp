const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const authModel = require("../models/auth.model");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

exports.signIn = catchAsync( async (req, res, next) => {
  const { email, pwd } = req.body;
  console.log("signin", email, pwd);
  
  const user = await authModel.getUserByEmail(req, email);

  if (!user) {
    return next(new AppError("Email not found", 404));
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
    return next(new AppError("Password not found", 404));
  }
});
