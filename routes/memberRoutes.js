const express = require("express");
const passport = require("passport");
const bcrypt = require("bcryptjs");
const pool = require("../db");

const router = express.Router();

// Sign-up form (GET)
router.get("/signup", (req, res) => {
  res.render("signup");
});

// Handle sign-up (POST)
router.post("/signup", async (req, res, next) => {
  const { first_name, last_name, email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    // INSERT and RETURNING * to get the inserted user
    const result = await pool.query(
      "INSERT INTO members (first_name, last_name, email, password) VALUES ($1, $2, $3, $4) RETURNING *",
      [first_name, last_name, email, hashedPassword]
    );

    const user = result.rows[0]; // now user is defined

    // Log in immediately
    req.login(user, (err) => {
      if (err) return next(err);
      res.redirect("/"); // user is now logged in
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

// Login form (GET)
router.get("/login", (req, res) => {
  res.render("login");
});

// Handle login (POST)
router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
  })
);

// Logout
router.get("/logout", (req, res) => {
  req.logout(() => {
    res.redirect("/");
  });
});

module.exports = router;
