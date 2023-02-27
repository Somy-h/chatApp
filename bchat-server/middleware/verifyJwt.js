const jwt = require("jsonwebtoken");

const verifyJwt = (req, res, next) => {
  if (!req.headers.authorization) {
    return res
      .status(401)
      .json("Invalid authorization, no authorization headers");
  }
  console.log("verify: ", req.headers.authorization);
  const [scheme, token] = req.headers.authorization.split(" ");

  if (scheme !== "Bearer") {
    return res
      .status(401)
      .json("Invalid authorization, invalid authorization scheme");
  }

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, payload) => {
    if (err) {
      if (err.message.toUpperCase() === "JWT EXPIRED") {
        return res.status(403).json("JWT EXPIRED");
      } else {
        return res.status(403).json("Access denied");
      }
    }
    req.user = payload;
    next();
  });
};

module.exports = verifyJwt;
