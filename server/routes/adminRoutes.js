const express = require("express");
const router = express.Router();

const Admin = require("../models/Admin");
const User = require("../models/User");
const Trip = require("../models/Trip");
const Chat = require("../models/Chat");
const Contact = require("../models/Contact");


// ================= ADMIN PROFILE =================

// GET ADMIN PROFILE
router.get("/profile", async (req, res) => {
  try {
    const admin = await Admin.findOne();
    res.json(admin);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE USERNAME
router.put("/profile", async (req, res) => {
  try {
    const { username } = req.body;

    const admin = await Admin.findOneAndUpdate(
      {},
      { username },
      { new: true }
    );

    res.json(admin);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ================= DASHBOARD STATS =================

router.get("/stats", async (req, res) => {
  try {
    const users = await User.countDocuments();
    const trips = await Trip.countDocuments();
    const chats = await Chat.countDocuments();
    const contacts = await Contact.countDocuments();

    // Today's active users
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // 🔥 ACTIVE USERS (chat based)
const todaysActiveUsers = await Chat.distinct("userId", {
  createdAt: { $gte: today }
});

const activeUsers = todaysActiveUsers.length;

    res.json({
      users,
      trips,
      chats,
      contacts,
      activeUsers
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/graph-data", async (req, res) => {
  try {
    const type = req.query.type || "weekly";

    const days = type === "monthly" ? 30 : 7;

    const data = [];

    for (let i = days - 1; i >= 0; i--) {

      const day = new Date();
      day.setDate(day.getDate() - i);
      day.setHours(0,0,0,0);

      const nextDay = new Date(day);
      nextDay.setDate(day.getDate() + 1);

      const label = day.toLocaleDateString("en-US", {
        weekday: type === "weekly" ? "short" : undefined,
        day: type === "monthly" ? "numeric" : undefined
      });

      const users = await User.countDocuments({
        createdAt: { $gte: day, $lt: nextDay }
      });

      const trips = await Trip.countDocuments({
        createdAt: { $gte: day, $lt: nextDay }
      });

      const chats = await Chat.countDocuments({
        createdAt: { $gte: day, $lt: nextDay }
      });

      data.push({ name: label, users, trips, chats });
    }

    res.json(data);

  } catch (err) {
    res.status(500).json({ error: "Graph error" });
  }
});
module.exports = router;