import ChatBubble from "./ChatBubble";

export default function ChatWindow({ messages = [] }) {
  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-gray-100">
      {messages.map((msg, idx) => (
        <ChatBubble key={idx} sender={msg.sender} message={msg.text} />
      ))}
    </div>
  );
}
