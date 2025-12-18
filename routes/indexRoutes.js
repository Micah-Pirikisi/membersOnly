const express = require("express");
const pool = require("../db");

const router = express.Router();

// Homepage
router.get("/", async (req, res, next) => {
  try {
    // Show lates messages on homepage
    const { rows } = await pool.query(
      `SELECT m.title, m.body, m.created_at, u.first_name, u.last_name
       FROM messages m
       JOIN members u ON m.member_id = u.member_id
       ORDER BY m.created_at DESC
       LIMIT 10`
    );
    res.render("index", {
      user: req.user,
      messages: rows,
    });
  } catch (err) {
    console.error(err);
    next(err);
  }
});

module.exports = router;
