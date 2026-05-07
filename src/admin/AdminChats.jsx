import React, { useEffect, useState } from "react";
import axios from "axios";

export default function AdminChats() {

  const [data, setData] = useState({});
  const [selectedChats, setSelectedChats] = useState([]);
  const [search, setSearch] = useState("");
  const [date, setDate] = useState({ start: "", end: "" });

  // 🔥 LOAD GROUPED DATA
  const fetchChats = async () => {
    const res = await axios.get(
      "http://localhost:5000/api/chat/admin/grouped"
    );
    setData(res.data);
  };

  useEffect(() => {
    fetchChats();
  }, []);

  // 🔥 FILTER
  const handleFilter = async () => {
    const res = await axios.get(
      `http://localhost:5000/api/chat/admin/filter?user=${search}&startDate=${date.start}&endDate=${date.end}`
    );

    const grouped = {};

    res.data.forEach(chat => {
      const user = chat.userId?.name || "User";
      const d = new Date(chat.createdAt).toISOString().split("T")[0];

      if (!grouped[user]) grouped[user] = {};
      if (!grouped[user][d]) grouped[user][d] = [];

      grouped[user][d].push(chat);
    });

    setData(grouped);
  };

  return (
    <div className="flex h-screen bg-black text-white">

      {/* LEFT PANEL */}
      <div className="w-1/3 bg-[#0f0f0f] border-r border-gray-800 p-4 overflow-auto">

        <h2 className="text-xl font-bold mb-4 text-white">
          📊 Admin Chats
        </h2>

        {/* 🔍 SEARCH */}
        <input
          placeholder="Search user..."
          className="w-full p-2 rounded mb-2 bg-black border border-gray-700 text-white placeholder-gray-400"
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* 📅 DATE FILTER */}
        <div className="flex gap-2 mb-2">
          <input
            type="date"
            className="bg-black border border-gray-700 text-white p-1 rounded"
            onChange={(e) => setDate({...date, start: e.target.value})}
          />
          <input
            type="date"
            className="bg-black border border-gray-700 text-white p-1 rounded"
            onChange={(e) => setDate({...date, end: e.target.value})}
          />
        </div>

        <button
          onClick={handleFilter}
          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded mb-4 w-full"
        >
          Apply Filter
        </button>

        {/* USER LIST */}
        {Object.keys(data).map((user, i) => (
          <div key={i} className="mb-4">

            <h3 className="font-bold text-blue-400">
              👤 {user}
            </h3>

            {Object.keys(data[user]).map((date, j) => (
              <div key={j} className="ml-3 mt-2">

                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-300">
                    📅 {date}
                  </span>

                  <button
                    className="text-xs text-blue-400 hover:underline"
                    onClick={() => setSelectedChats(data[user][date])}
                  >
                    View
                  </button>
                </div>

              </div>
            ))}

          </div>
        ))}

      </div>

      {/* RIGHT PANEL */}
      <div className="flex-1 p-6 flex flex-col bg-[#121212]">

        <h2 className="text-lg font-bold mb-4 text-white">
          💬 Chat Messages
        </h2>

        <div className="flex-1 overflow-auto bg-[#1a1a1a] rounded-xl p-4 shadow-inner">

          {selectedChats.length > 0 ? (
            selectedChats.map((msg, i) => (
              <div
                key={i}
                className={`flex mb-3 ${
                  msg.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`px-4 py-2 rounded-2xl max-w-xs text-sm ${
                    msg.role === "user"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-800 text-gray-200 border border-gray-700"
                  }`}
                >
                  {msg.message}
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center mt-10">
              Select a chat to view
            </p>
          )}

        </div>

      </div>

    </div>
  );
}