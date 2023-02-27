require("dotenv").config();

const server = require("./app");

server.listen(process.env.PORT, () => {
  console.log("server listening on port 4000");
});