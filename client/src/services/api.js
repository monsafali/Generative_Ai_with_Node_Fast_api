import axios from "axios";
const API_URL = "http://localhost:5000/api";

export const getAllMessages = async (chatId) => {
  const res = await axios.get(`${API_URL}/chats/${chatId}`);
  return res.data.messages;
};

export const sendMessage = async (chatId, question) => {
  const res = await axios.post(`${API_URL}/chats/${chatId}`, { question });
  return res.data;
};

export const getAllChats = async () => {
  const res = await axios.get(`${API_URL}/chats`);
  return res.data.chats;
};

export const deleteChat = async (chatId) => {
  const res = await axios.delete(`${API_URL}/chats/${chatId}`);
  return res.data;
};
