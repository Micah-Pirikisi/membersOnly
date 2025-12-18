const express = require("express");
const path = require("path");
const pool = require("./db");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");
require("dotenv").config();

const app = express();

// Routes
const memberRoutes = require("./routes/memberRoutes.js");
const messageRoutes = require("./routes/messageRoutes");
const indexRoutes = require("./routes/indexRoutes");

// Middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      maxAge: 1000 * 60 * 60, // 1 hour
    },
  })
);
app.use(passport.initialize());
app.use(passport.session());

// Passport LocalStrategy
passport.use(
  new LocalStrategy(
    { usernameField: "email" },
    async (email, password, done) => {
      try {
        const { rows } = await pool.query(
          "SELECT * FROM members WHERE email = $1",
          [email]
        );
        const user = rows[0];
        if (!user) return done(null, false, { message: "Incorrect username" });
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
          // passwords do not match!
          return done(null, false, { message: "Incorrect password" });
        }
        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.member_id); // store the member_id in session
});

passport.deserializeUser(async (id, done) => {
  try {
    const { rows } = await pool.query(
      "SELECT * FROM members WHERE member_id = $1",
      [id]
    );
    done(null, rows[0]);
  } catch (err) {
    done(err);
  }
});

// Mount routes
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect("/login");
}

app.use("/", indexRoutes);
app.use("/", memberRoutes);
app.use("/messages", ensureAuthenticated, messageRoutes);

// View engine
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// Start server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
