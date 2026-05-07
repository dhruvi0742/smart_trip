import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  MessageSquare,
  Briefcase,
  Compass,
  Heart,
  Bell,
  Plus,
  CloudSun   // ✅ NEW ICON
} from "lucide-react";

export default function Sidebar({
  onChatClick,
  onTripsClick,
  onSavedClick,
  onExploreClick,
  onHistoryClick,   // ❗ same prop use kar rahe (rename nahi kiya)
  onProfileClick,
  onCreateClick,
  onUpdatesClick
}) {
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");

  const [user, setUser] = useState({
    name: "Traveler",
    profileImage: ""
  });

  const [active, setActive] = useState("");
  const [unreadCount, setUnreadCount] = useState(0);

  // ===============================
  // FETCH USER PROFILE
  // ===============================
  useEffect(() => {
    if (!userId) return;

    axios
      .get(`http://localhost:5000/api/auth/profile/${userId}`)
      .then((res) => {
        setUser({
          name: res.data.name || "Traveler",
          profileImage: res.data.profileImage || ""
        });
      })
      .catch(() => {});
  }, [userId]);

  // ===============================
  // FETCH UNREAD CONTACT REPLIES
  // ===============================
  const fetchUnread = () => {
    if (!userId) return;

    axios
      .get(`http://localhost:5000/api/contact/user/${userId}`)
      .then((res) => {
        const unread = res.data.filter(
          (msg) =>
            msg.adminReply &&
            msg.adminReply !== "" &&
            !msg.isReadByUser
        ).length;

        setUnreadCount(unread);
      })
      .catch(() => {});
  };

  useEffect(() => {
    fetchUnread();

    const interval = setInterval(() => {
      fetchUnread();
    }, 5000);

    return () => clearInterval(interval);
  }, [userId]);

  // ===============================
  // WHEN USER CLICKS UPDATES
  // ===============================
  const handleUpdatesClick = async () => {
    setActive("Updates");

    try {
      await axios.put(
        `http://localhost:5000/api/contact/mark-read/${userId}`
      );
      setUnreadCount(0);
    } catch (err) {}

    onUpdatesClick && onUpdatesClick();
  };

  // ===============================
  // MENU (🔥 ONLY CHANGE HERE)
  // ===============================
  const menu = [
    { name: "Chats", icon: MessageSquare, action: onChatClick },
    { name: "Trips", icon: Briefcase, action: onTripsClick },
    { name: "Saved", icon: Heart, action: onSavedClick },

    // ❌ History removed
    // ✅ Weather added
    { name: "Weather", icon: CloudSun, action: onHistoryClick },

    { name: "Explore", icon: Compass, action: onExploreClick },
    { name: "Updates", icon: Bell, action: handleUpdatesClick },
    { name: "Create", icon: Plus, action: onCreateClick }
  ];

  return (
    <aside className="w-64 h-screen bg-white border-r border-gray-200 px-6 py-6 flex flex-col justify-between fixed left-0 top-0 z-50 font-jakarta">

      {/* ================= Logo ================= */}
      <div
        onClick={() => navigate("/")}
        className="flex items-center gap-2 mb-10 cursor-pointer"
      >
        <span className="text-2xl">✨</span>
        <span className="text-xl font-bold tracking-tight">
          Smarttrip.
        </span>
      </div>

      {/* ================= Menu ================= */}
      <nav className="space-y-3">
        {menu.map((item) => (
          <button
            key={item.name}
            onClick={() => {
              setActive(item.name);
              item.action && item.action();
            }}
            className={`w-full flex items-center justify-between px-4 py-2 rounded-xl text-sm font-medium transition-all
              ${
                active === item.name
                  ? "bg-background-light text-black"
                  : "hover:bg-gray-100 text-gray-700"
              }`}
          >
            <div className="flex items-center gap-3">
              <item.icon className="w-5 h-5" />
              <span>{item.name}</span>
            </div>

            {/* 🔔 Notification Badge */}
            {item.name === "Updates" && unreadCount > 0 && (
              <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>
        ))}
      </nav>

      {/* ================= Profile ================= */}
      <div
        onClick={onProfileClick}
        className="flex items-center gap-3 mt-8 cursor-pointer border-t pt-4 hover:bg-gray-50 p-2 rounded-xl transition"
      >
        <div className="w-10 h-10 rounded-full overflow-hidden border">
          <img
            src={
              user.profileImage
                ? `http://localhost:5000/uploads/${user.profileImage}`
                : "https://i.pravatar.cc/100"
            }
            alt="profile"
            className="w-full h-full object-cover"
            onError={(e) =>
              (e.target.src = "https://i.pravatar.cc/100")
            }
          />
        </div>

        <div>
          <p className="text-sm font-semibold">{user.name}</p>
          <p className="text-xs text-gray-500">View Profile</p>
        </div>

        <span className="ml-auto text-gray-400 text-lg">⋯</span>
      </div>

    </aside>
  );
}