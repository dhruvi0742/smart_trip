import { Search, Edit, Trash } from "lucide-react";
import { useEffect, useState } from "react";
import axios from "axios";

export default function ChatListPanel({ open, setMessages, setChatId, refreshChats }) {

  const [chats, setChats] = useState([]);
  const [search, setSearch] = useState("");

  const userId = localStorage.getItem("userId");

  useEffect(() => {
    fetchChats();
  }, [refreshChats]);

  const fetchChats = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/chat/${userId}`
      );

      const grouped = {};

      res.data.forEach(msg => {
        if (!grouped[msg.chatId]) {
          grouped[msg.chatId] = [];
        }
        grouped[msg.chatId].push(msg);
      });

      const sorted = Object.entries(grouped).sort((a, b) => {
        return new Date(b[1][0].createdAt) - new Date(a[1][0].createdAt);
      });

      setChats(sorted);

    } catch (err) {
      console.log(err);
    }
  };

  const openChat = (id, msgs) => {
    setChatId(id);

    const formatted = msgs.map(m => ({
      role: m.role,
      text: m.message
    }));

    setMessages(formatted);
  };

  const deleteChat = async (chatId) => {
    if (!window.confirm("Delete this chat?")) return;

    await axios.delete(`http://localhost:5000/api/chat/chat/${chatId}`);

    setMessages([]);
    fetchChats();
  };

  const renameChat = async (chatId) => {
    const newName = prompt("Enter new chat name:");
    if (!newName) return;

    await axios.put(`http://localhost:5000/api/chat/rename/${chatId}`, {
      title: newName
    });

    fetchChats();
  };

  const filteredChats = chats.filter(([id, msgs]) =>
    msgs[0]?.message.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className={`fixed top-0 left-64 h-screen w-[360px] bg-white border-r border-black/10 z-40 transition-transform duration-300
      ${open ? "translate-x-0" : "-translate-x-full"}`}>

      <div className="p-6 flex flex-col h-full">

        {/* Header */}
        <div className="space-y-6">
          <h2 className="font-bold text-lg">Chats</h2>

          <div className="bg-gray-100 rounded-full px-4 py-2 flex items-center gap-2">
            <Search className="w-4 h-4 text-gray-400"/>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-transparent outline-none text-sm w-full"
              placeholder="Search chats..."
            />
          </div>

          <div className="space-y-3 text-sm font-medium">
            <div
              className="flex items-center gap-3 cursor-pointer"
              onClick={() => {
                setMessages([]);
                setChatId(null);
              }}
            >
              <Edit className="w-4 h-4"/> New chat
            </div>
          </div>
        </div>

        {/* 🔥 SCROLLABLE CHAT LIST */}
        <div className="pt-6 flex-1 overflow-y-auto">

          <p className="text-xs text-gray-400 mb-2">Chats</p>

          {filteredChats.map(([id, msgs], index) => (
            <div
              key={index}
              className="flex justify-between items-center hover:bg-gray-100 p-2 rounded"
            >
              <div
                onClick={() => openChat(id, msgs)}
                className="cursor-pointer font-medium"
              >
                {msgs[0]?.title || msgs[0]?.message.slice(0, 20) || "Untitled"}...
              </div>

              <div className="flex gap-2">
                <Edit
                  className="w-4 h-4 cursor-pointer"
                  onClick={() => renameChat(id)}
                />
                <Trash
                  className="w-4 h-4 cursor-pointer text-red-500"
                  onClick={() => deleteChat(id)}
                />
              </div>
            </div>
          ))}

        </div>

      </div>
    </div>
  );
}