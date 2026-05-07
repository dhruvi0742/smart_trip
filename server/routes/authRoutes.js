const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");

const User = require("../models/User");
const Admin = require("../models/Admin");


// ================= MULTER SETUP =================
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../uploads"));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });


// ================= REGISTER =================
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const exist = await User.findOne({ email });
    if (exist) {
      return res.status(400).json({ msg: "Email already exists" });
    }

    const hash = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email,
      password: hash,
    });

    res.status(201).json({
      msg: "Registered successfully",
      id: newUser._id,
    });

  } catch (err) {
    res.status(500).json({ msg: "Registration failed" });
  }
});


// ================= LOGIN =================
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // ===== ADMIN LOGIN =====
    const admin = await Admin.findOne({ username: email });

    if (admin && await bcrypt.compare(password, admin.password)) {
      const token = jwt.sign(
        { id: admin._id, role: "admin" },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
      );

      return res.json({
        token,
        role: "admin",
        id: admin._id,
      });
    }

    // ===== USER LOGIN =====
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ msg: "User not found" });
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(400).json({ msg: "Wrong password" });
    }

    const token = jwt.sign(
      { id: user._id, role: "user" },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      token,
      role: "user",
      id: user._id,
    });

  } catch (err) {
    res.status(500).json({ msg: "Login failed" });
  }
});


// ================= GET PROFILE =================
router.get("/profile/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    res.json(user);

  } catch (err) {
    res.status(500).json({ msg: "Error fetching profile" });
  }
});


// ================= UPDATE PROFILE =================
router.put(
  "/profile/:id",
  upload.single("profileImage"),
  async (req, res) => {
    try {
      const updateData = {
        name: req.body.name,
        phone: req.body.phone,
        preferences: req.body.preferences,
      };

      if (req.file) {
        updateData.profileImage = req.file.filename;
      }

      await User.findByIdAndUpdate(req.params.id, updateData);

      res.json({ msg: "Profile updated successfully" });

    } catch (err) {
      res.status(500).json({ msg: "Error updating profile" });
    }
  }
);

module.exports = router;