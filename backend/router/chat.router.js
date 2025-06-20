const express = require("express");
const {
  postChat,
  getChat,
  updateChat,
  deleteChat,
} = require("../controller/chat.controller");

const router = express.Router();

router.post("/:chatId", postChat);
router.get("/", getChat);
router.get("/:chatId", updateChat);
router.delete("/:chatId", deleteChat);

module.exports = router;
