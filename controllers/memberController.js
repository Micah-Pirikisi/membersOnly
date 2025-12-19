const pool = require("../db");
const bcrypt = require("bcryptjs");

// Sign-up form (GET)
exports.signup_get = (req, res) => {
  res.render("signup");
};

// Handle sign-up (POST)
exports.signup_post = async (req, res, next) => {
  const { first_name, last_name, email, password, admin } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    // INSERT and RETURNING * to get the inserted user
    const result = await pool.query(
      "INSERT INTO members (first_name, last_name, email, password, admin) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [first_name, last_name, email, hashedPassword, admin === 'true']
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
};

// Login form (GET)
exports.login_get = (req, res) => {
  res.render("login");
};

// Logout
exports.logout_get = (req, res) => {
  req.logout(() => {
    res.redirect("/");
  });
};
