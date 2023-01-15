const express = require("express");
const cors = require("cors");
const app = express();
const server = require("http").createServer(app);
const { Server } = require("socket.io");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const multer = require("multer"); // For uploading avatar image file
const path = require("path");
const imageAvatarPath = path.join(__dirname, "/public/images/avatar");

//console.log(imageAvatarPath);
require("dotenv").config();

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

const mysql = require("mysql2/promise");

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// Import socket module
const socketHandler = require("./socket");
socketHandler(io, pool);

server.listen(process.env.PORT, () => {
  console.log("server listening on port 4000");
});

app.use(cors(corsOptions));

app.use(bodyParser.json());

app.use(async (req, res, next) => {
  try {
    req.db = await pool.getConnection();
    req.db.connection.config.namedPlaceholders = true;

    // Traditional mode ensures not null is respected for unsupplied fields, ensures valid JavaScript dates, etc.
    await req.db.query('SET SESSION sql_mode = "TRADITIONAL"');
    await req.db.query(`SET time_zone = '-8:00'`);

    await next();

    req.db.release();
  } catch (err) {
    // If anything downstream throw an error, we must release the connection allocated for the request
    console.log(err);
    if (req.db) req.db.release();
    throw err;
  }
});

app.post("/register", async (req, res) => {
  //console.log("req.body", req.body);
  // Hashes the password and inserts the info into the `user` table
  await bcrypt.hash(req.body.pwd, 10).then(async (hash) => {
    try {
      console.log("Hashed the password ", hash);
      const [user] = await req.db.query(
        `
          INSERT INTO users (email, pwd, user_name)
          VALUES (:email, :pwd, :user_name);
        `,
        {
          email: req.body.email,
          pwd: hash,
          user_name: req.body.user_name,
        }
      );

      const encodedUser = jwt.sign(
        {
          id: user.insertId,
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
      res.json("Failed to register user");
    }
  });
});

app.post("/authenticate", async function (req, res) {
  try {
    console.log(req.body);
    const { email, pwd } = req.body;
    const [[user]] = await req.db.query(
      `SELECT * FROM users WHERE email = :email`,
      { email }
    );
    console.log("user", email, pwd);

    if (!user) {
      console.log("Email not found");
      res.json("Email not found");
      return;
    }

    const dbPassword = `${user.pwd}`;
    const compare = await bcrypt.compare(pwd, dbPassword);
    console.log("compare:", compare);
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
      res.json("Password not found");
    }
  } catch (err) {
    console.log("Error in /authenticate", err);
    res.json("Failed to authenticate user");
  }
});

// Update User Profile

app.use(express.static("public"));

const storage = multer.diskStorage({
  destination: imageAvatarPath,
  filename: (req, file, cb) => {
    const uniqueSuffix = "-" + Date.now() + path.extname(file.originalname);
    cb(null, `${file.originalname}${uniqueSuffix}`);
  },
});

const imageUpload = multer({
  storage: storage,
}).single("avatar");

app.post("/updateUserProfile", imageUpload, async (req, res, err) => {
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
      await req.db.query(
        `UPDATE users 
         SET 
          user_name = COALESCE(:user_name, user_name),
          pwd=COALESCE(:pwd, pwd), 
          avatar=COALESCE(:avatar, avatar)
         WHERE id =:id`,
        {
          user_name: req.body.user_name,
          pwd: hash,
          avatar: avatarURL,
          id: req.body.id,
        }
      );

      const [[user]] = await req.db.query(
        `SELECT * FROM users WHERE id = :id`,
        { id: req.body.id }
      );

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
      res.json("Failed to update user profile");
    }
  }
});
