const express = require("express");
const cors = require("cors");
const app = express();
const server = require("http").createServer(app);
const { Server } = require("socket.io");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

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

// app.use(async (req, res, next) => {
//   try {
//     req.db = await pool.getConnection();
//     req.db.connection.config.namedPlaceholders = true;

//     // Traditional mode ensures not null is respected for unsupplied fields, ensures valid JavaScript dates, etc.
//     await req.db.query('SET SESSION sql_mode = "TRADITIONAL"');
//     await req.db.query(`SET time_zone = '-8:00'`);

//     await next();

//     req.db.release();
//   } catch (err) {
//     // If anything downstream throw an error, we must release the connection allocated for the request
//     console.log(err);
//     if (req.db) req.db.release();
//     throw err;
//   }
// });

app.get("/students", (req, res) => {
  const students = [
    {
      id: 1,
      name: "Ramiro",
    },
    {
      id: 2,
      name: "Bryan",
    },
    {
      id: 3,
      name: "Kenneth",
    },
  ];
  console.log("students");
  res.json({ students });
});

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
  try {
    let encodedUser;
    console.log("req.body", req.body);
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

        encodedUser = jwt.sign(
          {
            id: user.insertId,
            email: req.body.email,
            user_name: req.body.user_name,
            avatar: null,
          },
          process.env.JWT_KEY
        );
      } catch (error) {
        console.log("error", error);
      }
    });

    console.log("encoded user", encodedUser);
    res.json({ jwt: encodedUser });
  } catch (err) {
    console.log("err", err);
    res.json({ err });
  }
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
      res.json("Email not found");
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
      res.json("Password not found");
    }
  } catch (err) {
    console.log("Error in /authenticate", err);
  }
});
