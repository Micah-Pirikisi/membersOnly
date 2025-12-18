const express = require("express");
const messageController = require("../controllers/messageController");
const router = express.Router();

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect("/login");
}

router.get("/", ensureAuthenticated, messageController.messages_get);
router.get("/new", ensureAuthenticated, messageController.newmessage_get);
router.post("/", ensureAuthenticated, messageController.newmessage_post);

module.exports = router;
