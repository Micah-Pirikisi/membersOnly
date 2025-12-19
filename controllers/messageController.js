const pool = require("../db");

// Show all messages
exports.messages_get = async (req, res, next) => {
  try {
    const { rows } = await pool.query(
      `SELECT m.message_id, m.title, m.body, m.created_at, u.first_name, u.last_name
       FROM messages m
       JOIN members u ON m.member_id = u.member_id
       ORDER BY m.created_at DESC`
    );
    res.render("messages", { messages: rows, user: req.user });
  } catch (err) {
    console.error(err);
    next(err);
  }
};

// New message form
exports.newmessage_get = (req, res) => {
  res.render("newMessage"); // views/newMessage.ejs
};

// Handle new message submission
exports.newmessage_post = async (req, res, next) => {
  try {
    const { title, body } = req.body;
    await pool.query(
      "INSERT INTO messages (title, body, member_id, created_at) VALUES ($1, $2, $3, NOW()) RETURNING message_id",
      [title, body, req.user.member_id]
    );
    res.redirect("/messages");
  } catch (err) {
    console.error(err);
    next(err);
  }
};

// Delete message 
exports.delete_message_post = async (req, res, next) => {
  try {
    if (!req.user || !req.user.admin) {
      return res.status(403).send("Forbidden");
    }

    const { message_id } = req.params;
    await pool.query("DELETE FROM messages WHERE message_id = $1", [message_id]);
    res.redirect("/messages");
  } catch (err) {
    next(err);
  }
};
