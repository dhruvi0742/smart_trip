const axios = require("axios");

const GROQ_API_KEY = process.env.GROQ_API_KEY;
const AI_PROVIDER = process.env.AI_PROVIDER || "groq";

// ================= MAIN =================

async function generateTripPlan(conversationHistory) {
  if (AI_PROVIDER === "groq") {
    return await generateWithGroq(conversationHistory);
  } else {
    return "⚠️ Only Groq is enabled";
  }
}

// ================= SYSTEM PROMPT =================
const SYSTEM_PROMPT = `
You are a Smart Trip AI assistant.

RULES:

1. If user already provides details (destination, date, transport, etc), DO NOT ask again.
2. Only ask questions if something is clearly missing.
3. If enough details are available → directly generate FULL trip plan.
4. Do NOT follow fixed question order blindly.
5. Be smart and context-aware.

6.If transport is not provided:
- Suggest best transport based on distance
- For nearby → car/bus
- For long distance → train/flight
FINAL PLAN FORMAT:

🌴 {Destination} Travel Plan

📌 Trip Overview
• From:
• To:
• Date:

🗓️ Day-wise Itinerary
• Day 1:
  - Activity 1
  - Activity 2

• Day 2:
  - Activity 1
  - Activity 2

💰 Budget Estimate
• Travel:
• Stay:
• Food:

💡 Travel Tips
• Tip 1
• Tip 2

IMPORTANT:
- Use bullet format
- No unnecessary questions
- Ask questions ONLY if clearly missing and important.
- Do not repeat the same question again.
- Never assume budget.
- Always ask for budget if missing.
- Always include transport suggestions based on destination.
- Do not confuse number of days with budget.
- If data is enough → generate plan directly
`;

// ================= GROQ =================

async function generateWithGroq(conversationHistory) {
  const url = "https://api.groq.com/openai/v1/chat/completions";

  try {

    // ✅ FIXED conversation mapping (NO CRASH)
    const messages = [
      { role: "system", content: SYSTEM_PROMPT },

      ...conversationHistory.map(chat => ({
        // ✅ FIXED role handling
        role: chat.role === "model" ? "assistant" : "user",

        // ✅ SAFE content extraction
        content: chat.parts?.[0]?.text || chat.message || ""
      }))
    ];

    const response = await axios.post(
      url,
      {
        // ✅ BEST MODEL (IMPORTANT FIX)
        model: "llama-3.3-70b-versatile",

        messages,

        // ✅ Balanced output
        temperature: 0.7,

        max_tokens: 2048
      },
      {
        headers: {
          Authorization: `Bearer ${GROQ_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    const aiResponse =
      response.data?.choices?.[0]?.message?.content ||
      "⚠️ Unable to generate trip plan.";

    // ================= RETURN =================
    // ⚠️ IMPORTANT: yahi jagah pe tum weather/image add karte ho

    return aiResponse;

  } catch (err) {
    console.error("🔥 Groq Error:", err.response?.data || err.message);

    return fallback();
  }
}

// ================= FALLBACK =================

function fallback() {
  return "⚠️ AI service unavailable";
}

module.exports = generateTripPlan;