const router = require("express").Router();
const generateTripPlan = require("../groq");
const Chat = require("../models/Chat");
const Trip = require("../models/Trip");
const { v4: uuidv4 } = require("uuid");

// ================= HELPER FUNCTIONS =================

// Recommendation intent
const isRecommendationQuery = (msg) => {
  const text = msg.toLowerCase();

  return (
    text.includes("places") ||
    text.includes("destinations") ||
    text.includes("best") ||
    text.includes("top") ||
    text.includes("cheapest") ||
    text.includes("romantic") ||
    text.includes("near")
  );
};

// Trip intent
const isTripPlanning = (msg) => {
  const text = msg.toLowerCase();

  return (
    text.includes("trip") ||
    text.includes("travel") ||
    text.includes("plan") ||
    text.includes("go")
  );
};

// Extract destination
const extractDestination = (text) => {
  if (!text) return null;

  text = text
    .toLowerCase()
    .replace(/[^\w\s]/gi, "")
    .trim();

  // make a trip to dubai
  let match = text.match(/(?:to|visit|in)\s+([a-zA-Z\s]+)/i);
  if (match) {
    return match[1].trim();
  }

  // 5 day itinerary for kashmir
  match = text.match(/(?:for)\s+([a-zA-Z\s]+)/i);
  if (match) {
    return match[1].trim();
  }

  // kashmir trip
  match = text.match(/^([a-zA-Z\s]+)\s*(trip|travel|plan|itinerary)?/i);
  if (match) {
    return match[1].trim();
  }

  return null;
};

// Extract date
const extractDate = (text) => {
  const match =
    text.match(/(\d{1,2}\s\w+\s?to\s?\d{1,2}\s\w+)/i) ||
    text.match(/(\d{1,2}\s\w+)/i) ||
    text.match(/(\d{1,2}\/\d{1,2}\/\d{2,4})/) ||
    text.match(/(\d{1,2}-\d{1,2}-\d{2,4})/);

  return match ? match[0] : null;
};

// Extract budget
const extractBudget = (text) => {
  const match = text.match(/(\d+\s?k|\d+\s?rs)/i);
  return match ? match[0] : null;
};

// Extract people count
const extractPeopleCount = (text) => {
  const match = text.match(
    /(\d+)\s?(people|persons|members|adults)/i
  );

  if (match) return match[1];

  return null;
};

// Extract total days
const extractTotalDays = (text) => {
  const match = text.match(/(\d+)\s?(days|day|nights)/i);

  if (match) return match[1];

  return null;
};

// Transport detection
const detectTransport = (text) => {
  const lower = text.toLowerCase();

  if (lower.includes("car")) return "car";
  if (lower.includes("bus")) return "bus";
  if (lower.includes("train")) return "train";
  if (lower.includes("flight") || lower.includes("plane"))
    return "flight";

  return null;
};

// Ask helper
const ask = async (res, userId, chatId, text) => {
  await Chat.create({
    userId,
    role: "bot",
    message: text,
    chatId,
  });

  return res.json({
    reply: text,
    chatId,
  });
};

// ================= MAIN ROUTE =================

router.post("/", async (req, res) => {
  try {
    const { userId, message, chatId } = req.body;

    if (!userId || !message) {
      return res.status(400).json({
        msg: "Missing data",
      });
    }

    const finalChatId = chatId || uuidv4();

    // SAVE USER MESSAGE
    await Chat.create({
      userId,
      role: "user",
      message,
      chatId: finalChatId,
    });

    // GET CHAT HISTORY
    const chatHistory = await Chat.find({
      userId,
      chatId: finalChatId,
    }).sort({ createdAt: 1 });

    // ================= RECOMMENDATION MODE =================

    if (isRecommendationQuery(message)) {
      const aiReply = await generateTripPlan([
        {
          role: "user",
          parts: [
            {
              text: `
User is asking for travel recommendations.

Query: ${message}

Give a list of destinations WITH details.

For each place include:
• Name
• Why it's good
• Best time to visit
• Approx budget

Format:

1. Place Name
• Description
• Best Time
• Budget

Do NOT ask questions.
Do NOT create full itinerary.
`,
            },
          ],
        },
      ]);

      await Chat.create({
        userId,
        role: "bot",
        message: aiReply,
        chatId: finalChatId,
      });

      return res.json({
        reply: aiReply,
        chatId: finalChatId,
      });
    }

    // ================= TRIP MODE =================

    let destination = null;
    let fromLocation = null;
    let travelDate = null;
    let budget = null;
    let transport = null;
    let peopleCount = null;
    let totalDays = null;

    chatHistory.forEach((chat) => {
      const msg = chat.message;

      if (!destination) {
        const d = extractDestination(msg);

        if (d) destination = d;
      }

      if (!travelDate) {
        const d = extractDate(msg);

        if (d) travelDate = d;
      }

      if (!budget) {
        const b = extractBudget(msg);

        if (b) budget = b;
      }

      if (!peopleCount) {
        const p = extractPeopleCount(msg);

        if (p) peopleCount = p;
      }

      if (!totalDays) {
        const d = extractTotalDays(msg);

        if (d) totalDays = d;
      }

      if (!transport && destination) {
        transport = detectTransport(msg);
      }

      // FROM LOCATION
      if (!fromLocation && chat.role === "user") {
        const lowerMsg = msg.toLowerCase().trim();

        if (
          !lowerMsg.includes("trip") &&
          !lowerMsg.includes("travel") &&
          !lowerMsg.includes("plan") &&
          !extractDate(msg) &&
          !extractBudget(msg) &&
          !extractPeopleCount(msg) &&
          !extractTotalDays(msg)
        ) {
          fromLocation = msg;
        }
      }
    });

    // ================= FLOW QUESTIONS =================

    if (!destination && isTripPlanning(message)) {
      return ask(
        res,
        userId,
        finalChatId,
        "🌍 Where would you like to travel?"
      );
    }

    if (destination && !fromLocation) {
      return ask(
        res,
        userId,
        finalChatId,
        "📍 Where are you traveling from?"
      );
    }

    if (destination && fromLocation && !travelDate) {
      return ask(
        res,
        userId,
        finalChatId,
        "📅 When are you planning your trip?"
      );
    }

    if (
      destination &&
      fromLocation &&
      travelDate &&
      !peopleCount
    ) {
      return ask(
        res,
        userId,
        finalChatId,
        "👨‍👩‍👧 How many people are traveling?"
      );
    }

    if (
      destination &&
      fromLocation &&
      travelDate &&
      peopleCount &&
      !totalDays
    ) {
      return ask(
        res,
        userId,
        finalChatId,
        "📆 How many days are you planning to stay?"
      );
    }

    if (
      destination &&
      fromLocation &&
      travelDate &&
      peopleCount &&
      totalDays &&
      !budget
    ) {
      return ask(
        res,
        userId,
        finalChatId,
        "💰 What is your total budget?"
      );
    }

    // SAFETY
    if (!destination) {
      return ask(
        res,
        userId,
        finalChatId,
        "🌍 Please tell me your destination so I can plan your trip."
      );
    }

    // ================= PROMPT =================

    const structuredPrompt = `
Destination: ${destination}
From: ${fromLocation}
Date: ${travelDate}
People: ${peopleCount}
Days: ${totalDays}
Budget: ${budget || "Not specified"}
Transport: ${transport || "Suggest best"}

Create a COMPLETE smart travel itinerary.

The itinerary MUST be based on:
- number of people
- total days
- total budget

Calculate:
- hotel cost
- food cost
- transport cost
- activity cost

Include:

1. DAY-WISE itinerary

Morning
Afternoon
Evening

2. 🏨 HOTEL SUGGESTIONS

- 2 Budget hotels
- 2 Mid-range hotels
- 2 Luxury hotels

Each hotel must include:
• Name
• Area
• Price per night
• Why recommended

3. 🚍 BUS DETAILS
- Bus names
- Operators
- Price
- Duration

4. 🚆 TRAIN DETAILS
- Train names
- Classes
- Fare
- Duration

5. ✈️ FLIGHT DETAILS
- Airlines
- Approx fare
- Duration
- Cheapest booking time

6. 🍽 Food recommendations

7. 🚗 Local transport

Rules:
- India → prefer Bus/Train
- International → Flight
- Make itinerary user friendly
- Give proper budget planning
`;

    const aiReply = await generateTripPlan([
      {
        role: "user",
        parts: [{ text: structuredPrompt }],
      },
    ]);

    // ================= FINAL REPLY =================

    const finalReply = `
🌴 ${destination} Travel Plan

📌 TRIP OVERVIEW

• From: ${fromLocation}
• To: ${destination}
• Date: ${travelDate}
• People: ${peopleCount}
• Days: ${totalDays}
• Budget: ${budget}
• Transport: ${transport || "Suggested by AI"}

${aiReply}

━━━━━━━━━━━━━━━━━━
🔗 BOOK YOUR TRIP
━━━━━━━━━━━━━━━━━━

🏨 HOTEL BOOKING

👉 <a href="https://www.booking.com" target="_blank"><b>Booking.com</b></a><br></br>

👉 <a href="https://www.goibibo.com/hotels" target="_blank"><b>Goibibo Hotels</b></a><br></br>

━━━━━━━━━━━━━━━━━━

🚆 TRAIN BOOKING

👉 <a href="https://www.irctc.co.in" target="_blank"><b>IRCTC Official</b></a><br></br>

━━━━━━━━━━━━━━━━━━

🚌 BUS BOOKING

👉 <a href="https://www.redbus.in" target="_blank"><b>RedBus</b></a><br></br>

━━━━━━━━━━━━━━━━━━

✈️ FLIGHT BOOKING

👉 <a href="https://www.makemytrip.com/flights" target="_blank"><b>MakeMyTrip Flights</b></a>

👉 <a href="https://www.skyscanner.co.in" target="_blank"><b>Skyscanner</b></a>

━━━━━━━━━━━━━━━━━━
`;

    // SAVE BOT MESSAGE
    await Chat.create({
      userId,
      role: "bot",
      message: finalReply,
      chatId: finalChatId,
    });

    // SAVE TRIP
    if (aiReply.includes("Day 1")) {
      await Trip.create({
        userId,
        title: destination,
        to: destination,
        fullPlan: finalReply,
      });
    }

    return res.json({
      reply: finalReply,
      chatId: finalChatId,
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      reply: "⚠️ AI service temporarily unavailable.",
      error: err.message,
    });
  }
});

// ================= ADMIN GROUPED CHATS =================

router.get("/admin/grouped", async (req, res) => {
  try {
    const chats = await Chat.find()
      .populate("userId", "name email")
      .sort({ createdAt: -1 });

    const grouped = {};

    chats.forEach((chat) => {
      const userName = chat.userId?.name || "Unknown User";

      const date = new Date(chat.createdAt)
        .toISOString()
        .split("T")[0];

      if (!grouped[userName]) {
        grouped[userName] = {};
      }

      if (!grouped[userName][date]) {
        grouped[userName][date] = [];
      }

      grouped[userName][date].push(chat);
    });

    res.json(grouped);
  } catch (err) {
    console.error(err);

    res.status(500).json({
      msg: "Failed to group chats",
    });
  }
});

// ================= ADMIN FILTER =================

router.get("/admin/filter", async (req, res) => {
  try {
    const { user, startDate, endDate } = req.query;

    let query = {};

    if (user) {
      const users = await require("../models/User").find({
        name: new RegExp(user, "i"),
      });

      const userIds = users.map((u) => u._id);

      query.userId = {
        $in: userIds,
      };
    }

    if (startDate && endDate) {
      query.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    const chats = await Chat.find(query)
      .populate("userId", "name email")
      .sort({ createdAt: -1 });

    res.json(chats);
  } catch (err) {
    res.status(500).json({
      msg: "Filter failed",
    });
  }
});

// ================= HISTORY =================

router.get("/:userId", async (req, res) => {
  const chats = await Chat.find({
    userId: req.params.userId,
  }).sort({ createdAt: 1 });

  res.json(chats);
});

// DELETE CHAT

router.delete("/chat/:chatId", async (req, res) => {
  try {
    await Chat.deleteMany({
      chatId: req.params.chatId,
    });

    res.json({
      success: true,
    });
  } catch {
    res.status(500).json({
      error: "Delete failed",
    });
  }
});

// RENAME CHAT

router.put("/chat/rename/:chatId", async (req, res) => {
  try {
    const { title } = req.body;

    await Chat.updateMany(
      {
        chatId: req.params.chatId,
      },
      {
        title,
      }
    );

    res.json({
      success: true,
    });
  } catch {
    res.status(500).json({
      error: "Rename failed",
    });
  }
});

module.exports = router;