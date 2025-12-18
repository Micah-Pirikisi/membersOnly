const express = require("express");
const passport = require("passport");
const memberController = require("../controllers/memberController");
const router = express.Router();

router.get("/signup", memberController.signup_get);
router.post("/signup", memberController.signup_post);
router.get("/login", memberController.login_get);
router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
  })
);
router.get("/logout", memberController.logout_get);

module.exports = router;
