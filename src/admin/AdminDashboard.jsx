import React, { useEffect, useState } from "react";
import axios from "axios";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";

import {
  LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid,
  BarChart, Bar, Legend, ResponsiveContainer
} from "recharts";

const AdminDashboard = () => {

  const navigate = useNavigate();
  const location = useLocation();

  const [stats, setStats] = useState({
    users: 0,
    trips: 0,
    chats: 0,
    contacts: 0,
    activeUsers: 0
  });

  const [graphData, setGraphData] = useState([]);
  const [filter, setFilter] = useState("weekly"); // 🔥 NEW FILTER

  // ================= FETCH STATS =================
  useEffect(() => {
    axios.get("http://localhost:5000/api/admin/stats")
      .then(res => setStats(res.data))
      .catch(err => console.log(err));
  }, []);

  // ================= FETCH GRAPH =================
  useEffect(() => {
    axios.get(`http://localhost:5000/api/admin/graph-data?type=${filter}`)
      .then(res => setGraphData(res.data))
      .catch(err => console.log(err));
  }, [filter]);

  return (
    <div className="flex bg-gray-900 min-h-screen text-white">

      <AdminSidebar />

      <div className="flex-1 ml-64 p-6">

        {location.pathname === "/admin/dashboard" && (
          <>
            <h1 className="text-3xl font-bold mb-6">Dashboard Overview</h1>

            {/* 🔥 STATS CARDS */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">

              {[
                { label: "Users", value: stats.users, route: "/admin/users" },
                { label: "Trips", value: stats.trips, route: "/admin/trips" },
                { label: "Chats", value: stats.chats, route: "/admin/chats" },
                { label: "Contacts", value: stats.contacts, route: "/admin/contacts" }
              ].map((item, i) => (
                <div
                  key={i}
                  onClick={() => navigate(item.route)}
                  className="bg-gradient-to-br from-gray-800 to-gray-700 p-5 rounded-xl cursor-pointer hover:scale-105 transition shadow-lg"
                >
                  <h2 className="text-gray-300">{item.label}</h2>
                  <p className="text-3xl font-bold mt-2">{item.value}</p>
                </div>
              ))}

            </div>

            {/* ACTIVE USERS */}
            <div className="bg-gray-800 p-5 rounded-xl mb-6 shadow">
              <h2>Today's Active Users</h2>
              <p className="text-3xl font-bold text-blue-400">{stats.activeUsers}</p>
            </div>

            {/* 🔥 FILTER BUTTONS */}
            <div className="flex gap-3 mb-4">
              <button
                onClick={() => setFilter("weekly")}
                className={`px-4 py-2 rounded ${filter === "weekly" ? "bg-blue-600" : "bg-gray-700"}`}
              >
                Weekly
              </button>

              <button
                onClick={() => setFilter("monthly")}
                className={`px-4 py-2 rounded ${filter === "monthly" ? "bg-blue-600" : "bg-gray-700"}`}
              >
                Monthly
              </button>
            </div>

            {/* 🔥 GRAPH SECTION */}
            <div className="bg-gray-800 p-5 rounded-xl shadow">

              <h2 className="text-xl font-bold mb-6">Platform Analytics</h2>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* 📈 USERS GRAPH */}
                <div className="bg-gray-900 p-4 rounded-xl">
                  <h3 className="mb-2 text-blue-400">Users Growth</h3>

                  <ResponsiveContainer width="100%" height={250}>
                    <LineChart data={graphData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" stroke="#ccc"/>
                      <YAxis stroke="#ccc"/>
                      <Tooltip />
                      <Line
                        type="monotone"
                        dataKey="users"
                        stroke="#3b82f6"
                        strokeWidth={3}
                        dot={{ r: 4 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                {/* 📊 TRIPS vs CHATS */}
                <div className="bg-gray-900 p-4 rounded-xl">
                  <h3 className="mb-2 text-green-400">Trips vs Chats</h3>

                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={graphData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" stroke="#ccc"/>
                      <YAxis stroke="#ccc"/>
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="trips" fill="#22c55e" radius={[5,5,0,0]} />
                      <Bar dataKey="chats" fill="#f59e0b" radius={[5,5,0,0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

              </div>

            </div>

          </>
        )}

        <Outlet />

      </div>
    </div>
  );
};

export default AdminDashboard;