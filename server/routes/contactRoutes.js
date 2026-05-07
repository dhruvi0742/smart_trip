const express = require("express");
const router = express.Router();
const Contact = require("../models/Contact");

// ================= CREATE CONTACT =================
router.post("/", async (req, res) => {
  try {
    const { userId, message } = req.body;

    if (!userId || !message) {
      return res.status(400).json({ msg: "Missing fields" });
    }

    const newMsg = new Contact({
      userId,
      message,
      adminReply: "",
      isReadByUser: true
    });

    await newMsg.save();

    res.json(newMsg);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// ================= USER GET =================
router.get("/user/:userId", async (req, res) => {
  try {
    const data = await Contact.find({ userId: req.params.userId })
      .sort({ createdAt: -1 });

    res.json(data);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// ================= ADMIN GET =================
router.get("/admin/all", async (req, res) => {
  try {
    const messages = await Contact.find()
      .populate("userId", "name email") // ⚠️ important
      .sort({ createdAt: -1 });

    res.json(messages);

  } catch (err) {
    console.error("ADMIN FETCH ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});
router.delete("/:id", async (req, res) => {
  try {
    await Contact.findByIdAndDelete(req.params.id);
    res.json({ msg: "Deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ================= ADMIN REPLY =================
router.put("/admin/reply/:id", async (req, res) => {
  try {
    const { reply } = req.body;

    const updated = await Contact.findByIdAndUpdate(
      req.params.id,
      {
        adminReply: reply,
        isReadByUser: false
      },
      { new: true }
    );

    res.json(updated);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;