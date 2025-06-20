const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect("mongodb://localhost:27017/genai", {});

const ChatSchema = new mongoose.Schema({
  chatId: String,
  question: String,
  answer: String,
  createdAt: { type: Date, default: Date.now },
});

const Chat = mongoose.model("Chat", ChatSchema);

app.post("/api/chats/:chatId", async (req, res) => {
  const { chatId } = req.params;
  const { question } = req.body;
  const chat = new Chat({ chatId, question, answer: "" });
  await chat.save();

  try {
    const aiRes = await axios.post("http://localhost:8000/generate", {
      question,
    });

    chat.answer = aiRes.data.answer;
    await chat.save();

    res.json({ answer: aiRes.data.answer });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "AI server error" });
  }
});

app.get("/api/chats", async (req, res) => {
  try {
    const chats = await Chat.find().sort({ createdAt: -1 }).limit(20);

    // Group messages by chatId
    const chatGroups = {};
    chats.forEach((chat) => {
      if (!chatGroups[chat.chatId]) {
        chatGroups[chat.chatId] = [];
      }
      chatGroups[chat.chatId].push(chat);
    });

    const formatted = Object.keys(chatGroups).map((chatId) => ({
      id: chatId,
      title: chatGroups[chatId][0]?.question?.slice(0, 20) + "...",
    }));

    res.json({ chats: formatted });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch chats" });
  }
});

app.get("/api/chats/:chatId", async (req, res) => {
  const { chatId } = req.params;
  try {
    const messages = await Chat.find({ chatId }).sort({ createdAt: 1 });
    const formatted = messages.flatMap((msg) => [
      { sender: "user", text: msg.question },
      { sender: "ai", text: msg.answer },
    ]);
    res.json({ messages: formatted });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch messages" });
  }
});

app.delete("/api/chats/:chatId", async (req, res) => {
  const { chatId } = req.params;
  try {
    await Chat.deleteMany({ chatId });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete chat" });
  }
});
app.listen(5000, () => console.log("Backend running on http://localhost:5000"));
