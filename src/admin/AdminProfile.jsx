import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AdminProfile = () => {

  const navigate = useNavigate();

  const [admin, setAdmin] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [username, setUsername] = useState("");

  // FETCH PROFILE
  const fetchProfile = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/admin/profile");
      setAdmin(res.data);
      setUsername(res.data.username || "");
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  // UPDATE USERNAME
  const handleUpdate = async () => {
    try {
      const res = await axios.put(
        "http://localhost:5000/api/admin/profile",
        { username }
      );

      setAdmin(res.data);
      setIsEditing(false);
    } catch (err) {
      console.log(err);
    }
  };

  // 🔴 LOGOUT FUNCTION
  const handleLogout = () => {
    localStorage.removeItem("token"); // remove token if exists
    navigate("/login"); // redirect
  };

  return (
    <div className="ml-64 p-10 bg-gradient-to-br from-[#0f172a] to-[#1e293b] min-h-screen text-white">

      {/* TOP BAR */}
      <div className="flex justify-between items-center mb-10">

        <h1 className="text-4xl font-bold tracking-wide">
          Admin Profile
        </h1>

        <button
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-500 px-5 py-2 rounded-lg font-medium transition shadow-md"
        >
          Logout
        </button>

      </div>

      {/* PROFILE CARD */}
      <div className="flex justify-center">
        <div className="bg-white/10 backdrop-blur-xl p-10 rounded-3xl shadow-2xl w-full max-w-md border border-gray-700">

          <div className="flex flex-col items-center">

            {/* AVATAR */}
            <div className="w-28 h-28 bg-gradient-to-tr from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-4xl font-bold mb-6">
              {admin.username ? admin.username.charAt(0).toUpperCase() : "A"}
            </div>

            {!isEditing ? (
              <>
                <h2 className="text-2xl font-semibold mb-1">
                  {admin.username || "Admin"}
                </h2>

                <p className="text-gray-400 mb-6">
                  {admin.username ? `${admin.username}@smarttrip.com` : ""}
                </p>

                <button
                  onClick={() => setIsEditing(true)}
                  className="bg-blue-600 hover:bg-blue-500 px-6 py-2 rounded-xl"
                >
                  Edit Username
                </button>
              </>
            ) : (
              <>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="bg-[#0f172a] border border-gray-600 p-3 rounded-lg w-full mb-5"
                />

                <div className="flex gap-4 w-full">
                  <button
                    onClick={handleUpdate}
                    className="flex-1 bg-green-600 py-2 rounded-lg"
                  >
                    Save
                  </button>

                  <button
                    onClick={() => setIsEditing(false)}
                    className="flex-1 border py-2 rounded-lg"
                  >
                    Cancel
                  </button>
                </div>
              </>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;