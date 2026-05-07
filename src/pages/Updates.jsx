import React, { useEffect, useState } from "react";
import axios from "axios";

export default function UserNotifications() {

  const userId = localStorage.getItem("userId");
  const [messages, setMessages] = useState([]);

  const fetchMessages = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/contact/user/${userId}`
      );
      setMessages(res.data);
    } catch (err) {
      console.error("Error fetching notifications", err);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const unreadMessages = messages.filter(
    (msg) => msg.adminReply && !msg.isReadByUser
  );

  return (
    <div className="min-h-screen bg-gray-100 p-6">

      {/* HEADER */}
      <div className="max-w-4xl mx-auto mb-6">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
          🔔 Notifications
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Stay updated with admin replies
        </p>
      </div>

      {/* CONTENT */}
      <div className="max-w-4xl mx-auto space-y-4">

        {unreadMessages.length === 0 ? (
          <div className="bg-white p-6 rounded-xl shadow text-center">
            <p className="text-gray-500">
              No new notifications
            </p>
          </div>
        ) : (
          unreadMessages.map((msg) => (

            <div
              key={msg._id}
              className="bg-white rounded-xl shadow-md border border-gray-200 p-5 hover:shadow-lg transition"
            >

              {/* USER MESSAGE */}
              <div className="mb-3">
                <p className="text-sm text-gray-500 mb-1">
                  Your Message
                </p>
                <div className="bg-gray-100 p-3 rounded-lg">
                  <p className="text-gray-700">{msg.message}</p>
                </div>
              </div>

              {/* ADMIN REPLY */}
              <div>
                <p className="text-sm text-green-600 font-semibold mb-1">
                  Admin Reply
                </p>
                <div className="bg-green-50 border border-green-200 p-3 rounded-lg">
                  <p className="text-green-700">{msg.adminReply}</p>
                </div>
              </div>

              {/* STATUS */}
              <div className="mt-3 flex justify-end">
                <span className="text-xs bg-blue-100 text-blue-600 px-3 py-1 rounded-full">
                  New Reply
                </span>
              </div>

            </div>

          ))
        )}

      </div>

    </div>
  );
}