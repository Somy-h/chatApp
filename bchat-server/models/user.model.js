module.exports.createUser = async (req, pwd) => {

  const { email, user_name} = req.body;
  const [user] = await req.db.query(
    'INSERT INTO users SET ?', { email, pwd, user_name}
  );
  return user.insertId;
}

module.exports.getUser = async (req, id) => {

  const [[user]] = await req.db.query(
    'SELECT * FROM users WHERE id = ?',
    [id]
  );
  console.log(user);
  return user;
}


module.exports.updateUser = async (req, pwd, avatar) => {

  const { user_name } = req.body;
  const id = req.params.id;
  
  await req.db.query(
    `UPDATE users 
    SET 
      user_name = COALESCE(?, user_name),
      pwd=COALESCE(?, pwd), 
      avatar=COALESCE(?, avatar)
    WHERE id =?`,
   [user_name, pwd, avatar, id]
  );
}
