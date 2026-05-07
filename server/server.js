require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

// ✅ FIRST app create karo
const app = express();

// ✅ THEN middleware use karo
app.use(cors());
app.use(express.json());

// ================= ROUTES =================
const authRoutes = require("./routes/authRoutes");
const chatRoutes = require("./routes/chat");
const tripRoutes = require("./routes/trip");
const contactRoutes = require("./routes/contactRoutes");
const userRoutes = require("./routes/userRoutes");
const weatherRoutes = require("./routes/weatherRoutes");

const adminRoutes = require("./routes/adminRoutes");

// ================= STATIC =================
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ================= DB CONNECT =================
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

// ================= TEST ROUTE =================
app.get("/", (req, res) => {
  res.send("SmartTrip backend is running 🚀");
});

// ================= API ROUTES =================
app.use("/api/auth", authRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/trip", tripRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/users", userRoutes);
app.use("/api/weather", weatherRoutes);
app.use("/api/admin", adminRoutes);
// ================= SERVER START =================
app.listen(5000, () => {
  console.log("Server running on port 5000");
});