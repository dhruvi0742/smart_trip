import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

export default function ChatPanel({
  
  messages,
  setMessages,
  setSelectedPlace,
  chatId,
  setChatId,
  setRefreshChats,
  destination
}){
  const formatTripPlan = (text) => {
  if (!text) return "";

  return text
    .replace(/🌴 (.*)/g, `<h2 class="text-xl font-bold text-green-600 mt-3">$1</h2>`)
    .replace(/📌 (.*)/g, `<h3 class="font-semibold mt-3 text-blue-600">$1</h3>`)
    .replace(/🗓️ (.*)/g, `<h3 class="font-semibold mt-3 text-purple-600">$1</h3>`)
    .replace(/💰 (.*)/g, `<h3 class="font-semibold mt-3 text-yellow-600">$1</h3>`)
    .replace(/💡 (.*)/g, `<h3 class="font-semibold mt-3 text-pink-600">$1</h3>`)
    .replace(/🎯 (.*)/g, `<h3 class="font-semibold mt-3 text-gray-700">$1</h3>`)

    .replace(/Day (\d+):/g, `<h4 class="font-bold mt-2 text-indigo-600">Day $1</h4>`)

    .replace(/🌅 Morning:/g, `<p class="font-semibold mt-2">🌅 Morning</p>`)
    .replace(/☀️ Afternoon:/g, `<p class="font-semibold mt-2">☀️ Afternoon</p>`)
    .replace(/🌙 Evening:/g, `<p class="font-semibold mt-2">🌙 Evening</p>`)

    .replace(/• (.*)/g, `<li class="ml-4 list-disc">$1</li>`)
    .replace(/- (.*)/g, `<li class="ml-8 list-[circle]">$1</li>`);
};

  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [days, setDays] = useState([]);
  const [suggestedQuestions, setSuggestedQuestions] = useState([]);
  const chatEndRef = useRef(null);
  const [mapLocked, setMapLocked] = useState(false);

  const userId = localStorage.getItem("userId") || "123";

  // ✅ 🔥 ADD THIS (MAP FIX)
 const extractPlaceSimple = (text) => {
  const lower = text.toLowerCase();

  // ❌ agar question hai to ignore
  if (
  destination &&
  destination.length > 2 &&
  destination !== "travel" &&
  destination !== "trip"
) {
    return null;
  }

  // ✔ sirf simple place (jaise: goa, manali)
  const words = text.trim().split(" ");
  return words[words.length - 1];
};

  // 🔥 extractDate
  const extractDate = (text) => {
    const match = text.match(/(\d{1,2})\/(\d{1,2})\/(\d{4})/);
    if (!match) return null;

    const day = match[1].padStart(2, "0");
    const month = match[2].padStart(2, "0");
    const year = match[3];

    return `${year}-${month}-${day}`;
  };

  // 🔥 load chat
  useEffect(() => {
    if (!chatId) return;

    const fetchChat = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/chat/${userId}`
        );

        const filtered = res.data.filter(c => c.chatId === chatId);

        const formatted = filtered.map(m => ({
          role: m.role,
          text: m.message
        }));

        setMessages(formatted);
        setDays([]);

      } catch (err) {
        console.log(err);
      }
    };

    fetchChat();
  }, [chatId]);

  const getPlaceImage = async (place) => {
    try {
      const placeName =
        typeof place === "string" ? place : place?.name || "";

      if (!placeName) return "https://via.placeholder.com/300";

      const formatted = place.split(" ").slice(0, 2).join("_");

       
      const res = await fetch(
        `https://en.wikipedia.org/api/rest_v1/page/summary/${formatted}`
      );

      const data = await res.json();

      return data.thumbnail?.source || "https://via.placeholder.com/300";
    } catch {
      return "https://via.placeholder.com/300";
    }
  };

  const openMap = (place) => {
    window.open(
      `https://www.google.com/maps/search/?api=1&query=${place}`,
      "_blank"
    );
  };

  const tripQuestions = [
    "Plan a 3-day trip to Goa",
    "Best places to visit in Manali?",
    "Budget trip plan for Rajasthan",
    "Top romantic destinations in India",
    "Best time to visit Kerala?",
    "5-day itinerary for Kashmir",
    "Cheapest hill stations near Gujarat",
    "Family trip plan for Ooty",
    "Best international budget destinations",
    "Honeymoon trip under ₹50,000"
  ];

  useEffect(() => {
    const shuffled = [...tripQuestions].sort(() => 0.5 - Math.random());
    setSuggestedQuestions(shuffled.slice(0, 4));
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing, days]);

  const saveToHistory = (newMessage) => {
    const existing =
      JSON.parse(localStorage.getItem("chat_history")) || [];
    existing.push(newMessage);
    localStorage.setItem("chat_history", JSON.stringify(existing));
  };

  const extractDestination = (text) => {
    const match = text.match(/to\s([A-Za-z\s]+)/i);
    return match ? match[1].trim() : "";
  };

  // 🔥 MAIN FUNCTION
  const sendMessage = async (customMessage) => {

    const messageToSend = customMessage || input;
    if (!messageToSend.trim() || typing) return;

    // ✅ 🔥 MAP UPDATE (CORRECT PLACE)
   const place = extractPlaceSimple(messageToSend);

// 🔥 only first time update
if (place && !mapLocked) {
  setSelectedPlace(place);
  setMapLocked(true);   // 🔒 lock map
}

    setDays([]);

    const userMessage = { role: "user", text: messageToSend };
    setMessages(prev => [...prev, userMessage]);
    saveToHistory(userMessage);

    setInput("");
    setTyping(true);

    try {
      const res = await axios.post("http://localhost:5000/api/chat", {
        userId,
        message: messageToSend,
        chatId
      });

      const botText = res.data?.reply || "";

      const botMessage = { role: "bot", text: botText };
      setMessages(prev => [...prev, botMessage]);
      setChatId(res.data.chatId);
      setRefreshChats(prev => !prev);
      saveToHistory(botMessage);

      const daysWithImages = await Promise.all(
        (res.data.days || []).map(async (day) => {
          const placesWithImages = await Promise.all(
            (day.places || []).map(async (place) => {
              const placeName =
                typeof place === "string"
                  ? place
                  : place?.name || "Unknown";

              return {
                name: placeName,
                image: await getPlaceImage(placeName),
              };
            })
          );

          return {
            ...day,
            places: placesWithImages,
          };
        })
      );

      setDays(daysWithImages);

      let destination = "";

      if (res.data.destination) {
        destination = res.data.destination;
      } else {
        destination = extractDestination(botText);
      }

      if (destination) {
        setSelectedPlace(destination);
      }

      const travelDate = extractDate(messageToSend);

      if (destination && travelDate) {
        localStorage.setItem(
          "trip_weather",
          JSON.stringify({
            place: destination,
            date: travelDate
          })
        );
      }

    } catch (error) {
      console.error("❌ ERROR:", error);

      const errorMessage = {
        role: "bot",
        text: "⚠️ AI service temporarily unavailable."
      };

      setMessages(prev => [...prev, errorMessage]);
      saveToHistory(errorMessage);

    } finally {
      setTyping(false);
    }
  };

  return (
    <section className="flex-1 h-screen flex flex-col justify-between p-8 bg-gradient-to-br from-gray-50 to-gray-100">

      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-700">
          Smart Travel Assistant 🌍
        </h2>
      </div>

      <div className="flex-1 overflow-auto space-y-4 pr-2">

        {messages.length === 0 ? (
          <div className="flex flex-col items-center text-center mt-20">
            <div className="text-6xl mb-4">✈️</div>
            <h1 className="text-3xl font-bold mb-2">Where to today?</h1>

            <div className="flex flex-wrap justify-center gap-3 max-w-2xl">
              {suggestedQuestions.map((q, index) => (
                <button
                  key={index}
                  onClick={() => sendMessage(q)}
                  className="bg-white border px-4 py-2 rounded-full text-sm hover:bg-black hover:text-white"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <>
           {messages.map((m, i) => (
  <div key={i}
    className={`p-5 rounded-2xl max-w-2xl text-sm shadow-lg ${
      m.role === "user"
        ? "bg-black text-white ml-auto"
        : "bg-white border"
    }`}
  >
    {m.role === "bot" ? (
      <div
        dangerouslySetInnerHTML={{
          __html: formatTripPlan(m.text)
        }}
      />
    ) : (
      m.text
    )}
  </div>
))}

{/* 🔥 ADD THIS EXACTLY HERE */}
{typing && (
  <div className="bg-white border p-4 rounded-2xl w-fit shadow">
    <div className="flex gap-1">
      <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></span>
      <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-150"></span>
      <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-300"></span>
    </div>
  </div>
)}

<div ref={chatEndRef}></div>
            <div ref={chatEndRef}></div>
          </>
        )}
      </div>

      <div className="mt-6">
        <div className="border bg-white rounded-full flex px-5 py-3 gap-3 shadow">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 outline-none"
            placeholder="Ask anything..."
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />
          <button onClick={() => sendMessage()} className="font-bold">
            ➤
          </button>
        </div>
      </div>

    </section>
  );
}