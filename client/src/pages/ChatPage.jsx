// File: src/pages/ChatPage.jsx
import Sidebar from "../components/Sidebar";
import ChatWindow from "../components/ChatWindow";
import ChatInput from "../components/ChatInput";
import { useState, useEffect } from "react";
import {
  sendMessage,
  getAllChats,
  getAllMessages,
  deleteChat,
} from "../services/api";
export default function ChatPage() {
  const [messages, setMessages] = useState([]);
  const [chatId, setChatId] = useState(null);
  const [chats, setChats] = useState([]);

  useEffect(() => {
    const loadInitialData = async () => {
      const last = localStorage.getItem("lastChatId");
      const allChats = await getAllChats();
      setChats(allChats);

      if (last) {
        loadChat(last);
      }
    };
    loadInitialData();
  }, []);

  const loadChat = async (id) => {
    const res = await getAllMessages(id);
    setChatId(id);
    setMessages(res);
    localStorage.setItem("lastChatId", id);
  };

  const handleSend = async (text) => {
    if (!chatId) return;
    const res = await sendMessage(chatId, text);
    setMessages((prev) => [
      ...prev,
      { sender: "user", text },
      { sender: "ai", text: res.answer },
    ]);
  };

  const handleNewChat = async () => {
    const newId = crypto.randomUUID();
    setChatId(newId);
    setMessages([]);
    localStorage.setItem("lastChatId", newId);
    const updated = await getAllChats();
    setChats(updated);
  };

  const handleDeleteChat = async (id) => {
    await deleteChat(id);
    const updated = await getAllChats();
    setChats(updated);
    if (id === chatId) {
      setMessages([]);
      setChatId(null);
      localStorage.removeItem("lastChatId");
    }
  };

  return (
    <div className="flex h-screen">
      <Sidebar
        onNewChat={handleNewChat}
        chats={chats}
        onSelect={loadChat}
        onDeleteChat={handleDeleteChat}
      />
      <div className="flex flex-col flex-1">
        <ChatWindow messages={messages} />
        <ChatInput onSend={handleSend} />
      </div>
    </div>
  );
}
