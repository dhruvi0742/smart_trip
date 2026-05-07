import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");

  const [user, setUser] = useState({
    name: "",
    email: "",
    phone: "",
    profileImage: "",
    preferences: ""
  });

  const [image, setImage] = useState(null);

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/auth/profile/${userId}`)
      .then((res) => {
        setUser({
          ...res.data,
          preferences: res.data.preferences?.join(", ") || ""
        });
      });
  }, [userId]);

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  // ✅ FIXED FUNCTION
  const handleUpdate = async () => {
    try {
      const formData = new FormData();
      formData.append("name", user.name);
      formData.append("phone", user.phone);
      formData.append("preferences", user.preferences);

      if (image) {
        formData.append("profileImage", image);
      }

      await axios.put(
        `http://localhost:5000/api/auth/profile/${userId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      alert("Profile Updated ✅");
      window.location.reload();
    } catch (err) {
      console.error(err);
      alert("Update failed ❌");
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login", { replace: true });
  };

  return (
    <div className="flex-1 flex justify-center items-start pt-16 px-6 bg-gray-50">
      <div className="w-full max-w-3xl bg-white shadow-xl rounded-3xl p-10 border">

        {/* Profile Header */}
        <div className="flex items-center gap-6 mb-10">
          <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-gray-200 shadow">
            <img
              src={`http://localhost:5000/uploads/${user.profileImage}`}
              alt="profile"
              className="w-full h-full object-cover"
              onError={(e) => (e.target.src = "https://i.pravatar.cc/150")}
            />
          </div>

          <div>
            <h1 className="text-4xl font-bold">{user.name || "Your Name"}</h1>
            <p className="text-gray-500 text-lg">{user.email}</p>
          </div>
        </div>

        {/* Upload */}
        <div className="mb-8">
          <label className="font-semibold block mb-2">Change Profile Photo</label>
          <input
            type="file"
            onChange={(e) => setImage(e.target.files[0])}
            className="border p-2 rounded"
          />
        </div>

        {/* Form */}
        <div className="grid gap-6">
          <input
            name="name"
            value={user.name}
            onChange={handleChange}
            placeholder="Full Name"
            className="border p-4 rounded-xl"
          />

          <input
            name="phone"
            value={user.phone}
            onChange={handleChange}
            placeholder="Phone"
            className="border p-4 rounded-xl"
          />

          <input
            name="preferences"
            value={user.preferences}
            onChange={handleChange}
            placeholder="beach, adventure..."
            className="border p-4 rounded-xl"
          />

          <div className="flex gap-4 mt-6">
            <button
              onClick={handleUpdate}
              className="flex-1 bg-black text-white py-3 rounded-xl"
            >
              Update Profile
            </button>

            <button
              onClick={handleLogout}
              className="flex-1 bg-red-500 text-white py-3 rounded-xl"
            >
              Logout
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
