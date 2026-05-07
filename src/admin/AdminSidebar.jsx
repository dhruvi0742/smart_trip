import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Map,
  MessageSquare,
  Mail,
  UserCircle
} from "lucide-react";

const Sidebar = () => {
  const linkClass =
    "flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800 transition";

  return (
    <div className="w-64 h-screen bg-gray-950 text-white fixed">
      <div className="p-6 text-2xl font-bold border-b border-gray-800">
        SmartTrip AI
      </div>

      <nav className="p-4 space-y-2">
        <NavLink to="/admin/dashboard" className={linkClass}>
          <LayoutDashboard size={18} /> Dashboard
        </NavLink>

        <NavLink to="/admin/users" className={linkClass}>
          <Users size={18} /> Users
        </NavLink>

        <NavLink to="/admin/trips" className={linkClass}>
          <Map size={18} /> Trips
        </NavLink>

        <NavLink to="/admin/chats" className={linkClass}>
          <MessageSquare size={18} /> Chats
        </NavLink>

        <NavLink to="/admin/contacts" className={linkClass}>
          <Mail size={18} /> Contacts
        </NavLink>

        <NavLink to="/admin/profile" className={linkClass}>
          <UserCircle size={18} /> Profile
        </NavLink>
      </nav>
    </div>
  );
};

export default Sidebar;
