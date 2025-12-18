const express = require("express");
const pool = require("../db");

const router = express.Router();

// Show all messages
router.get("/", async (req, res, next) => {
  try {
    const { rows } = await pool.query(
      `SELECT m.title, m.body, m.created_at, u.first_name, u.last_name
       FROM messages m
       JOIN members u ON m.member_id = u.member_id
       ORDER BY m.created_at DESC`
    );
    res.render("messages", { messages: rows });
  } catch (err) {
    console.error(err);
    next(err);
  }
});

// New message form
router.get("/new", (req, res) => {
  res.render("newMessage"); // views/newMessage.ejs
});

// Handle new message submission
router.post("/", async (req, res, next) => {
  try {
    const { title, body } = req.body;
    await pool.query(
      "INSERT INTO messages (title, body, member_id, created_at) VALUES ($1, $2, $3, NOW())",
      [title, body, req.user.member_id]
    );
    res.redirect("/messages");
  } catch (err) {
    console.error(err);
    next(err);
  }
});

module.exports = router;
