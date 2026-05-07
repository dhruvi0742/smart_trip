const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  phone: String,
  profileImage: String,

  status: {
    type: String,
    default: "active"
  },

  preferences: { type: [String], default: [] },

  createdAt: { type: Date, default: Date.now }
});

// 👇 IMPORTANT (same collection use karega)
module.exports = mongoose.model("Users", userSchema, "users");