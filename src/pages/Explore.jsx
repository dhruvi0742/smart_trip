import { useEffect, useState } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import TripCard from "../components/TripCard";

// 🔹 REMOVE EMOJIS & SPECIAL CHARACTERS FOR PDF
const cleanTextForPDF = (text = "") => {
  return text
    .replace(/[\u{1F300}-\u{1F6FF}]/gu, "")
    .replace(/[\u{1F900}-\u{1F9FF}]/gu, "")
    .replace(/[\u2600-\u26FF]/gu, "")
    .replace(/[^\x00-\x7F]/g, "");
};

export default function Explore() {
  const userId = localStorage.getItem("userId");

  const [trips, setTrips] = useState([]);
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [loading, setLoading] = useState(true);

  // ================= 🌍 FETCH EXPLORE TRIPS =================
  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    axios
      .get(`http://localhost:5000/api/trip/explore/${userId}`)
      .then((res) => {
        console.log("EXPLORE DATA 👉", res.data); // 🔥 DEBUG
        setTrips(Array.isArray(res.data) ? res.data : []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Explore fetch error:", err);
        setLoading(false);
      });
  }, [userId]);

  // ================= 👁 VIEW SINGLE TRIP =================
  const openTrip = async (id) => {
    const res = await axios.get(
      `http://localhost:5000/api/trip/single/${id}`
    );
    setSelectedTrip(res.data);
  };

  // ================= 📄 DOWNLOAD PDF =================
  const downloadPDF = (trip) => {
  const doc = new jsPDF("p", "mm", "a4");

  let y = 20;
  const marginX = 18;
  const pageHeight = 280;
  const pageWidth = doc.internal.pageSize.getWidth() - marginX * 2;

  const text = cleanTextForPDF(trip.fullPlan || "");
  const lines = text.split("\n");

  const addPageIfNeeded = (space = 8) => {
    if (y + space > pageHeight) {
      doc.addPage();
      y = 20;
    }
  };

  lines.forEach((line, index) => {
    line = line.trim();
    if (!line) {
      y += 4;
      return;
    }

    // 🔥 MAIN TITLE
    if (index === 0) {
      addPageIfNeeded(20);
      doc.setFont("Helvetica", "bold");
      doc.setFontSize(20);
      doc.text(line, marginX, y);
      y += 14;
      return;
    }

    // 🔹 SECTION HEADINGS
    if (
      line.includes("Trip Overview") ||
      line.includes("Travel Options") ||
      line.includes("Stay Suggestions") ||
      line.includes("Day-wise Itinerary") ||
      line.includes("Estimated Budget") ||
      line.includes("Travel Tips") ||
      line.includes("Closing Note")
    ) {
      addPageIfNeeded(14);
      doc.setFont("Helvetica", "bold");
      doc.setFontSize(14);
      doc.text(line, marginX, y);
      y += 8;
      doc.setFont("Helvetica", "normal");
      return;
    }

    // 🔹 DAY HEADINGS
    if (line.startsWith("Day")) {
      addPageIfNeeded(10);
      doc.setFont("Helvetica", "bold");
      doc.setFontSize(12);
      doc.text(line, marginX, y);
      y += 7;
      doc.setFont("Helvetica", "normal");
      return;
    }

    // 🔹 BULLET POINTS
    if (line.startsWith("•") || line.startsWith("-")) {
      addPageIfNeeded(8);
      doc.setFontSize(11);
      const wrapped = doc.splitTextToSize(line, pageWidth - 6);
      doc.text(wrapped, marginX + 4, y);
      y += wrapped.length * 6;
      return;
    }

    // 🔹 NORMAL TEXT
    addPageIfNeeded(8);
    doc.setFontSize(11);
    const wrapped = doc.splitTextToSize(line, pageWidth);
    doc.text(wrapped, marginX, y);
    y += wrapped.length * 6;
  });

  doc.save("Trip_Plan_Full.pdf");
};

  // ================= 🔍 SINGLE TRIP VIEW =================
  if (selectedTrip) {
    return (
      <div className="h-full overflow-y-auto bg-gradient-to-br from-gray-50 to-white px-6 py-10">
        <button
          onClick={() => setSelectedTrip(null)}
          className="mb-6 text-sm font-semibold text-blue-600 hover:underline"
        >
          ← Back to Explore
        </button>

        <div className="max-w-6xl mx-auto bg-white rounded-3xl shadow-2xl p-10">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-extrabold">
              {selectedTrip.title || "Trip Plan ✨"}
            </h1>

            <button
              onClick={() => downloadPDF(selectedTrip)}
              className="px-4 py-2 rounded-full bg-black text-white text-sm hover:opacity-80"
            >
              Download PDF
            </button>
          </div>

          <div className="whitespace-pre-line text-gray-800 leading-relaxed">
            {selectedTrip.fullPlan}
          </div>
        </div>
      </div>
    );
  }

  // ================= 📦 CARD VIEW =================
  return (
    <div className="h-full overflow-y-auto bg-gradient-to-br from-gray-50 to-white px-6 py-10">
      <h1 className="text-3xl font-extrabold mb-2 bg-gradient-to-r from-green-600 to-blue-600 text-transparent bg-clip-text">
        Explore Trips 🌍
      </h1>

      <p className="text-gray-500 mb-10">
        Discover trips created by other travelers
      </p>

      {loading ? (
        <p className="text-gray-400">Loading trips...</p>
      ) : trips.length === 0 ? (
        <div className="mt-32 text-center">
          <div className="text-6xl mb-4">🧭</div>
          <p className="text-gray-500 text-lg">
            No trips available
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 auto-rows-fr">
          {trips.map((trip) => (
            <TripCard
              key={trip._id}
              trip={trip}
              onView={openTrip}   // ✅ view plan WORKING
              onDelete={null}     // ❌ no delete in explore
            />
          ))}
        </div>
      )}
    </div>
  );
}
