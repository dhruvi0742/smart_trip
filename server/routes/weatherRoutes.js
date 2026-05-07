const express = require("express");
const router = express.Router();
const { getWeather } = require("../services/weatherService");

router.get("/:city", async (req, res) => {
  try {
    const data = await getWeather(req.params.city);
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: "City not found" });
  }
});

module.exports = router;