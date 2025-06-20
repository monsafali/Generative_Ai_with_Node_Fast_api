const axios = require("axios");
const Chat = require("../models/chat.model");

exports.postChat = async (req, res) => {
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
};

exports.getChat = async (req, res) => {
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
};

exports.updateChat = async (req, res) => {
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
};

exports.deleteChat = async (req, res) => {
  const { chatId } = req.params;
  try {
    await Chat.deleteMany({ chatId });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete chat" });
  }
};
