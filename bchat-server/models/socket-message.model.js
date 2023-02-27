const pool = require("../config/db.config");

module.exports.getChannels = async () => {
  try {
    const [channels] = await pool.query("SELECT * FROM channels");

    return channels;
  } catch (err) {
    console.log(err.message);
    throw new Error("Fail to get channels from database");
  }
};

module.exports.getChannelMessages = async (channelId) => {
  try {
    const [messages] = await pool.query(`
    SELECT m.id, m.channel_id, c.channel_name, m.user_id, u.user_name, u.avatar, m.message, m.time, m.inactive
    FROM messages AS m
      INNER JOIN channels AS c ON m.channel_id = c.id
      INNER JOIN users AS u ON m.user_id = u.id
    WHERE m.channel_id = ${channelId} AND m.inactive = 0
    LIMIT 500`);

    return messages;
  } catch (err) {
    throw new Error("Fail to get messages from database table");
  }
}


module.exports.insertMessage = async (message) => {
  try {
    const result = await pool.query(
      `INSERT INTO messages (channel_id, user_id, message, time) VALUES (${message.channel_id}, ${message.user_id}, "${message.message}", now())`
    );

    const returnId = result[0]?.insertId;
    console.log("Inserted recent message id: ", returnId);
    return returnId;
  } catch (err) {
    throw new Error("Fail to insert message into database table");
  }
}

module.exports.updateInactiveMessage = async (messageId) => {
  try {
    const result = await pool.query(`
      UPDATE messages
      SET inactive = 1 
      WHERE id = ${messageId}`);
    console.log("DB returned: ", result);
    return result[0]?.changedRows === 1 ? true : false;
  } catch (err) {
    throw new Error("Fail to update messages table.");
  }
}

module.exports.fetchMessage = async (messageId) => {
  try {
    const [[message]] = await pool.query(`
    SELECT  m.id, m.channel_id, c.channel_name, m.user_id, u.user_name, u.avatar, m.message, m.time, m.inactive
    FROM messages AS m
      INNER JOIN channels AS c ON m.channel_id = c.id
      INNER JOIN users AS u ON m.user_id = u.id
    WHERE m.id = ${messageId} `);
    console.log("DB returned: ", message);
    return message;
  } catch (err) {
    throw new Error("Fail to fetch last updated message.");
  }
}
