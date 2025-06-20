import { Trash2 } from "lucide-react";

export default function Sidebar({
  onNewChat,
  chats = [],
  onSelect,
  onDeleteChat,
}) {
  return (
    <div className="w-64 bg-gray-900 text-white p-4 space-y-4">
      <button
        onClick={onNewChat}
        className="w-full bg-blue-600 py-2 rounded hover:bg-blue-700"
      >
        + New Chat
      </button>
      <div className="space-y-2">
        {/* {chats.map((chat) => (
          <div
            key={chat.id}
            className="cursor-pointer hover:bg-gray-700 p-2 rounded"
            onClick={() => onSelect(chat.id)}
          >
            {chat.title || chat.id.slice(0, 8)}
          </div>
        ))} */}

        {chats.map((chat) => (
          <div
            key={chat.id}
            className="flex justify-between items-center cursor-pointer hover:bg-gray-700 p-2 rounded"
          >
            <div onClick={() => onSelect(chat.id)} className="flex-1 truncate">
              {chat.title || chat.id.slice(0, 8)}
            </div>
            <button
              onClick={() => onDeleteChat(chat.id)}
              className="ml-2 text-red-500 hover:text-red-700"
              title="Delete Chat"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
