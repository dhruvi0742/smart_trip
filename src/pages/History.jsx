import React from "react";

export default function History() {

  const chats =
    JSON.parse(localStorage.getItem("chat_history")) || [];

  if (chats.length === 0) {
    return (
      <div className="p-10 text-gray-500">
        No chat history available.
      </div>
    );
  }

  return (
    <div className="p-10 overflow-auto">
      <h2 className="text-xl font-semibold mb-6">Chat History</h2>

      <div className="space-y-3">
        {chats.map((m, i) => (
          <div
            key={i}
            className={`p-3 rounded max-w-xl text-sm ${
              m.role === "user"
                ? "bg-black text-white ml-auto"
                : "bg-gray-100"
            }`}
          >
            {m.text}
          </div>
        ))}
      </div>
    </div>
  );
}