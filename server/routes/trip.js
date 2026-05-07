const router = require("express").Router();
const Trip = require("../models/Trip");
const Users = require("../models/User");
const generateTripPlan = require("../groq"); // 🔥 ADD THIS

/* =====================================================
   🆕 CREATE TRIP (FORM BASED) 🔥 IMPORTANT
===================================================== */
router.post("/create", async (req, res) => {
  try {
    const {
      userId,
      from,
      to,
      startDate,
      endDate,
      budget,
      people,
      travelType,
      notes
    } = req.body;

    // ✅ validation
    if (!userId || !from || !to) {
      return res.status(400).json({
        success: false,
        msg: "Missing required fields"
      });
    }

    // ✅ date format
    const date = startDate && endDate
      ? `${startDate} to ${endDate}`
      : startDate || "Flexible";

    // ✅ AI prompt
    const prompt = `
You are a smart AI travel planner.

Destination: ${to}
From: ${from}
Date: ${date}
Budget: ₹${budget}
People: ${people}
Travel Type: ${travelType}
Notes: ${notes || "None"}

Generate:
- Travel options
- Hotel suggestions
- Day-wise itinerary
- Budget breakdown

Use bullet points only.
`;

    // ✅ call Groq
    const aiReply = await generateTripPlan([
      {
        role: "user",
        parts: [{ text: prompt }]
      }
    ]);

    if (!aiReply) {
      return res.status(500).json({
        success: false,
        msg: "AI failed"
      });
    }

    // ✅ save trip
    const newTrip = await Trip.create({
      userId,
      title: to,
      from,
      to,
      date,
      budget,
      people,
      travelType,
      notes,
      fullPlan: aiReply
    });

    // ✅ response
    res.json({
      success: true,
      trip: newTrip,
      data: aiReply
    });

  } catch (err) {
    console.error("🔥 CREATE TRIP ERROR:", err);

    res.status(500).json({
      success: false,
      msg: "Failed to generate trip",
      error: err.message
    });
  }
});

/* =====================================================
   🧑‍💼 ADMIN - GET ALL TRIPS
===================================================== */
router.get("/admin/all", async (req, res) => {
  try {
    const trips = await Trip.find()
      .populate("userId", "username name email")
      .sort({ createdAt: -1 });

    res.json(trips);
  } catch (err) {
    console.error("Admin fetch error:", err);
    res.status(500).json({ msg: "Failed to fetch admin trips" });
  }
});

/* =====================================================
   🔍 ADMIN FILTER TRIPS
===================================================== */
router.get("/admin/filter", async (req, res) => {
  try {
    const { from, to } = req.query;

    let query = {};

    if (from) query.from = new RegExp(from, "i");
    if (to) query.to = new RegExp(to, "i");

    const trips = await Trip.find(query)
      .populate("userId", "username name email")
      .sort({ createdAt: -1 });

    res.json(trips);
  } catch (err) {
    console.error("Filter error:", err);
    res.status(500).json({ msg: "Filter failed" });
  }
});

/* =====================================================
   🌍 EXPLORE TRIPS
===================================================== */
router.get("/explore/:userId", async (req, res) => {
  try {
    const user = await Users.findById(req.params.userId);

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    const preferences = Array.isArray(user.preferences)
      ? user.preferences
      : [];

    if (preferences.length === 0) {
      const trips = await Trip.find().sort({ createdAt: -1 });
      return res.json(trips);
    }

    const regexList = preferences.map((p) => new RegExp(p, "i"));

    const trips = await Trip.find({
      $or: [
        { title: { $in: regexList } },
        { from: { $in: regexList } },
        { to: { $in: regexList } },
        { fullPlan: { $in: regexList } }
      ]
    }).sort({ createdAt: -1 });

    res.json(trips);
  } catch (err) {
    console.error("Explore error:", err);
    res.status(500).json({ msg: "Explore failed" });
  }
});

/* =====================================================
   ❤️ GET SAVED TRIPS
===================================================== */
router.get("/saved/:userId", async (req, res) => {
  try {
    const trips = await Trip.find({
      userId: req.params.userId,
      isSaved: true
    }).sort({ createdAt: -1 });

    res.json(trips);
  } catch (err) {
    res.status(500).json({ msg: "Failed to fetch saved trips" });
  }
});

/* =====================================================
   📄 GET SINGLE TRIP
===================================================== */
router.get("/single/:id", async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id)
      .populate("userId", "username name email");

    if (!trip) {
      return res.status(404).json({ msg: "Trip not found" });
    }

    res.json(trip);
  } catch (err) {
    res.status(500).json({ msg: "Failed to fetch trip" });
  }
});

/* =====================================================
   ❤️ SAVE / UNSAVE
===================================================== */
router.patch("/save/:id", async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);

    if (!trip) {
      return res.status(404).json({ msg: "Trip not found" });
    }

    trip.isSaved = !trip.isSaved;
    await trip.save();

    res.json({ isSaved: trip.isSaved });
  } catch (err) {
    res.status(500).json({ msg: "Failed to save trip" });
  }
});

/* =====================================================
   👤 USER TRIPS
===================================================== */
router.get("/:userId", async (req, res) => {
  try {
    const trips = await Trip.find({ userId: req.params.userId })
      .sort({ createdAt: -1 });

    res.json(trips);
  } catch (err) {
    res.status(500).json({ msg: "Failed to fetch trips" });
  }
});

/* =====================================================
   🗑️ DELETE TRIP
===================================================== */
router.delete("/:id", async (req, res) => {
  try {
    await Trip.findByIdAndDelete(req.params.id);
    res.json({ msg: "Trip deleted successfully" });
  } catch (err) {
    res.status(500).json({ msg: "Delete failed" });
  }
});

module.exports = router;