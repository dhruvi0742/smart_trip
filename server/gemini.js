const axios = require("axios");

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

async function generateTripPlan(conversationHistory) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;

  const systemInstruction = `
You are a professional AI travel planner.

STRICT RULES:

1. Ask ONLY ONE question at a time.
2. Follow this order strictly:
   - Destination
   - From
   - Travel date
   - Duration (number of days)
   - Number of travelers
   - Budget
   - Preferences
3. If any information is missing, ask ONLY the next missing item.
4. Do NOT ask multiple questions.
5. Keep questions short and natural.
6. When ALL details are collected → generate FINAL PLAN.

FINAL PLAN FORMAT (VERY IMPORTANT):

🌴 {Destination} Travel Plan

📌 Trip Overview
• From:
• To:
• Date:
• Duration:
• Group Size:

🚆✈️ Travel Options
• Flights:
• Trains:
• Buses:
• Local Transport:

🏨 Stay Suggestions
• Best Areas:
• Recommended Stay Type:

🗓️ Day-wise Itinerary
• Day 1:
- Activity 1
- Activity 2

• Day 2:
- Activity 1
- Activity 2

💰 Estimated Budget (Per Person)
• Travel:
• Stay:
• Food:
• Local Transport:
• Activities:
• Total:

💡 Travel Tips
• Tip 1
• Tip 2
• Tip 3

🎯 Closing Note

IMPORTANT:
- Use clean formatting
- Use bullet points
- No long paragraphs
- Output must be structured
`;

  try {

    // 🔥 FIX: Proper role usage
    const contents = [
      {
        role: "model",
        parts: [{ text: systemInstruction }]
      },
      ...conversationHistory
    ];

    const response = await axios.post(
      url,
      {
        contents,
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 2048
        }
      },
      {
        headers: {
          "Content-Type": "application/json"
        }
      }
    );

    return (
      response.data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "⚠️ Unable to generate trip plan."
    );

  } catch (err) {
    console.error("🔥 Gemini API Error:", err.response?.data || err.message);

    return "⚠️ AI service temporarily unavailable. Please try again.";
  }
}

module.exports = generateTripPlan;