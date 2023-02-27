module.exports.getUserByEmail = async (req, email) => {
  const [[user]] = await req.db.query("SELECT * FROM users WHERE email = ?", [
    email,
  ]);
  //console.log("db return: ", user);
  return user;
};
