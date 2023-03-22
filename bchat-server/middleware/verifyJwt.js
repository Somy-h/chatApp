const jwt = require("jsonwebtoken");
const AppError = require("../utils/appError");

const verifyJwt = (req, res, next) => {
  if (!req.headers.authorization) {
    // return res
    //   .status(401)
    //   .json("Invalid authorization, no authorization headers");
    return next(new AppError("Invalid authorization, no authorization headers", 401));
  }
  console.log("verify: ", req.headers.authorization);
  const [scheme, token] = req.headers.authorization.split(" ");

  if (scheme !== "Bearer") {
    // return res
    //   .status(401)
    //   .json("Invalid authorization, invalid authorization scheme");
    return next(new AppError("Invalid authorization, invalid authorization scheme", 401));
  }

  jwt.verify(token, process.env.JWT_KEY, (err, payload) => {
    if (err) {
      if (err.message.toUpperCase() === "JWT EXPIRED") {
        return next(new AppError("JWT EXPIRED", 403));
        //return res.status(403).json("JWT EXPIRED");
      } else {
        console.log(err.message);
        return next(new AppError("Access denied", 403));
        //return res.status(403).json("Access denied");
      }
    }
    req.user = payload;
    next();
  });
};

module.exports = verifyJwt;
