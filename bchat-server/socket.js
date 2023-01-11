const MESSAGE_TYPE = {
  GET_CHANNELS: "get_channels",
  CHANNEL_USERS: "channel_users",
  JOIN_CHANNEL: "join_channel",
  SEND_MESSAGE: "send_message",
  RECEIVE_MESSAGE: "receive_message",
  DELETE_MESSAGE: "delete_message",
  LEAVE_CHANNEL: "leave_channel",
};

var channels = [];
var users = {};

module.exports = async (io, pool) => {
  try {
    getChannelsInitUsers(pool);

    io.on("connection", (socket) => {
      try {
        console.log("a user connected: ", socket.id);

        // Message: Get user list in channel
        socket.on(MESSAGE_TYPE.CHANNEL_USERS, () => {
          console.log("get users from channel# with users");

          // Only to the sender
          console.log(users);
          socket.emit(MESSAGE_TYPE.CHANNEL_USERS, {
            channels,
            users,
          });
        });

        // Message: Join channel
        socket.on(MESSAGE_TYPE.JOIN_CHANNEL, (joinMessage) => {
          // join the channel and update channels & users
          handleJoinChannel(socket, joinMessage);

          try {
            // const responseMsg = {
            //   ...joinMessage,
            //   message: `*** JOINED ${joinMessage.channel_name}`,
            //   time: Date.now(),
            // };
            // console.log("Joined channel: ", joinMessage);

            // // Send join message to clients except the sender
            // socket
            //   .to(String(joinMessage.channel_id))
            //   .emit(MESSAGE_TYPE.RECEIVE_MESSAGE, responseMsg);

            // Fetch channel messages from DB
            getChannelMessagesFromDB(pool, joinMessage.channel_id).then(
              (channelMessages) => {
                // Send join message to the sender only
                console.log("Sending channel messages to the sender");
                socket.emit(MESSAGE_TYPE.JOIN_CHANNEL, channelMessages);
              }
            );
          } catch (err) {
            socket.leave(String(joinMessage.channel_id));
            deleteUserFromUsers(joinMessage.user_id, joinMessage.channel_name);
            throw err;
          }

          // disconnect socket with joined channel
          socket.on("disconnect", () => {
            // leave channel
            handleLeaveChannel(socket, joinMessage);
            console.log("disconnect");
            socket.disconnect();
          });
        });

        // Message: message received from client
        socket.on(MESSAGE_TYPE.SEND_MESSAGE, (message) => {
          console.log("message received: ");
          console.dir(message);

          // Insert message into DB
          insertMessageIntoDB(pool, message).then((msgId) => {
            const msg = {
              ...message,
              id: msgId,
            };

            console.log("send to client new message ID: ", msgId, socket.rooms);
            console.dir(msg);
            socket.nsp
              .to(String(msg.channel_id))
              .emit(MESSAGE_TYPE.RECEIVE_MESSAGE, msg);
          });
        });

        // Message: delete message
        socket.on(MESSAGE_TYPE.DELETE_MESSAGE, (channel_id, messageId) => {
          console.log("delete received: ");
          console.dir(messageId);

          // Update inactive column in messages table in database
          updateInactiveMessageFromDB(pool, messageId).then((isSuccess) => {
            if (isSuccess) {
              console.log("send to client: ", messageId);

              socket.nsp
                .to(String(channel_id))
                .emit(MESSAGE_TYPE.DELETE_MESSAGE, messageId);
            }
          });
        });

        // Message: leave the channel
        socket.on(MESSAGE_TYPE.LEAVE_CHANNEL, (leaveMsg) => {
          handleLeaveChannel(socket, leaveMsg);
        });
      } catch (err) {
        console.log("disconnect");
        //socket.disconnect();
        throw err;
      }
    });
  } catch (err) {
    new Error("From server: ", err.message);
  }
};

function deleteUserFromUsers(user_id, channel_name) {
  users[channel_name] = users[channel_name].filter(
    (user) => user.user_id !== user_id
  );
}

function handleJoinChannel(socket, joinMsg) {
  socket.join(String(joinMsg.channel_id));

  // Add user into users
  console.log(joinMsg.channel_name, users, users[joinMsg.channel_name]);
  users[joinMsg.channel_name].push({
    user_id: joinMsg.user_id,
    user_name: joinMsg.user_name,
    avatar: joinMsg.avatar,
  });

  // Send updated channel users
  socket.nsp.to(String(joinMsg.channel_id)).emit(MESSAGE_TYPE.CHANNEL_USERS, {
    channels,
    users,
  });
}

function handleLeaveChannel(socket, leaveMsg) {
  socket.leave(String(leaveMsg.channel_id));
  console.log("Server: leave the channel", socket.rooms);

  // Delete user from users
  deleteUserFromUsers(leaveMsg.user_id, leaveMsg.channel_name);

  // Send updated channel users
  socket.nsp.to(String(leaveMsg.channel_id)).emit(MESSAGE_TYPE.CHANNEL_USERS, {
    channels,
    users,
  });

  // const responseMsg = {
  //   ...leaveMsg,
  //   message: `*** LEFT ${leaveMsg.channel_name}`,
  //   time: Date.now(),
  // };

  // // to clients in room
  // socket
  //   .to(String(leaveMsg.channel_id))
  //   .emit(MESSAGE_TYPE.RECEIVE_MESSAGE, responseMsg);
}

//DB Library ***************

async function getChannelsInitUsers(pool) {
  try {
    const result = await pool.query("SELECT * FROM channels");
    console.log(result[0]);
    channels = result[0];

    channels.forEach((item) => {
      return (users[item.channel_name] = []);
    });
    console.log(users);
  } catch (e) {
    //new Error("Fail to get channels from database");

    //!!!!!!!!!!
    // For only test in case of db error ===>
    // !! When you set up the database,
    // then delete code below lines and uncomment upper line // new Error().
    console.log("Fail to get channels from database");
    channels = [
      { id: 1, channel_name: "Channel 1" },
      { id: 2, channel_name: "Channel 2" },
      { id: 3, channel_name: "Channel 3" },
      { id: 4, channel_name: "Channel 4" },
      { id: 5, channel_name: "Channel 5" },
    ];
    users = {
      "Channel 1": [],
      "Channel 2": [],
      "Channel 3": [],
      "Channel 4": [],
      "Channel 5": [],
    };

    console.log(users);
  }
}

async function getChannelMessagesFromDB(pool, channelId) {
  try {
    const result = await pool.query(`
    SELECT m.id, m.channel_id, c.channel_name, m.user_id, u.user_name, u.avatar, m.message, m.time, m.inactive
    FROM messages AS m
    INNER JOIN channels AS c ON m.channel_id = c.id
    INNER JOIN users AS u ON m.user_id = u.id
    WHERE m.channel_id = ${channelId} AND m.inactive = 0
    LIMIT 100`);

    console.log(result[0]);
    //const channelMessages = result[0];

    return result[0];
  } catch (e) {
    //new Error("Fail to get messages from database table");

    //!!!!!!!!!!
    // For only test in case of db error ===>
    // !! When you set up the database,
    // then delete code below lines and uncomment upper line // new Error().
    console.log("Fail to get messages from database table");
    return [
      {
        id: 1,
        channel_id: channelId,
        user_id: 3,
        user_name: "Smith",
        avatar: "😺",
        message: "previous example message1",
        time: Date.now(),
      },
      {
        id: 2,
        channel_id: channelId,
        user_id: 3,
        user_name: "Smith",
        avatar: "🤡",
        message: "previous example message2",
        time: Date.now(),
      },
    ];
  }
}

function getChannelsWithState() {
  const result = channels.map((channel) => {
    return {
      ...channel,
      isActive: users[channel.channel_name] ? true : false,
    };
  });
  console.log(result);

  return result;
}

async function insertMessageIntoDB(pool, message) {
  try {
    const result = await pool.query(
      `INSERT INTO messages (channel_id, user_id, message, time) VALUES (${message.channel_id}, ${message.user_id}, "${message.message}", now())`
    );

    const returnId = result[0]?.insertId;
    console.log("Inserted recent message id: ", returnId);
    return returnId;
  } catch (e) {
    //new Error("Fail to insert message into database table");

    //!!!!!!!!!!
    // For only test in case of db error ===>
    // !! When you set up the database,
    // then delete code below 2 lines and uncomment upper line // new Error().
    console.log(
      "DB Error: Cannot insert new message into table. For test, will return 1 to client"
    );
    return 1;
  }
}

async function updateInactiveMessageFromDB(pool, messageId) {
  try {
    const result = await pool.query(`
      UPDATE messages
      SET inactive = 1 
      WHERE id = ${messageId}`);
    console.log("DB returned: ", result);
    return result[0]?.changedRows === 1 ? true : false;
  } catch (e) {
    //new Error("Fail to update messages table.");
    //!!!!!!!!!!
    // !! When you set up the database,
    // then uncomment upper line // new Error().
  }
}
