const router = require("express").Router();
const Users = require("../models/User");
const bcrypt = require("bcryptjs");

// ================= GET ALL USERS =================
router.get("/", async (req, res) => {
  try {
    const users = await Users.find().select("-password");
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// ================= UPDATE USER (STATUS + OTHER) =================
router.put("/:id", async (req, res) => {
  try {
    const updatedUser = await Users.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    ).select("-password");

    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// ================= DELETE USER =================
router.delete("/:id", async (req, res) => {
  try {
    await Users.findByIdAndDelete(req.params.id);
    res.json({ msg: "User deleted" });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

module.exports = router;