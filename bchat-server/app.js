const express = require("express");
const cors = require("cors");
const app = express();
const server = require("http").createServer(app);
const { Server } = require("socket.io");

const corsOptions = {
  origin: "*",
  credentials: true,
};
const io = new Server(server, {
  cors: {
    ...corsOptions,
    origin: "http://localhost:3000",
  },
});

// Import socket module
const socketHandler = require("./socket");
socketHandler(io);

// middlewares
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.static("public"));
const dbConnection = require("./middleware/dbconnect");
app.use(dbConnection);

const authRouter = require("./routes/auth.route");
const userRouter = require("./routes/user.route");
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);


module.exports = server;
