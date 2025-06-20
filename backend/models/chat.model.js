const mongoose = require("mongoose");

const ChatSchema = new mongoose.Schema({
  chatId: String,
  question: String,
  answer: String,
  createdAt: { type: Date, default: Date.now },
});

const Chat = mongoose.model("Chat", ChatSchema);

module.exports = Chat;
