
import { useEffect, useState } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import TripCard from "../components/TripCard";

const cleanTextForPDF = (text) => {
  return text
    .replace(/[\u{1F300}-\u{1F6FF}]/gu, "")
    .replace(/[\u{1F900}-\u{1F9FF}]/gu, "")
    .replace(/[\u2600-\u26FF]/gu, "")
    .replace(/[^\x00-\x7F]/g, "");
};

export default function Trips({ onlyFavorites = false }) {
  const userId = localStorage.getItem("userId");

  const [trips, setTrips] = useState([]);
  const [localTrips, setLocalTrips] = useState([]);   // ✅ NEW
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [loading, setLoading] = useState(true);

  // ================= FETCH BACKEND TRIPS =================
  useEffect(() => {
    if (!userId) return;

    setLoading(true);

    const url = onlyFavorites
      ? `http://localhost:5000/api/trip/saved/${userId}`
      : `http://localhost:5000/api/trip/${userId}`;

    axios
      .get(url)
      .then((res) => {
        setTrips(Array.isArray(res.data) ? res.data : []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch trips", err);
        setLoading(false);
      });

    // ✅ ALSO LOAD GENERATED TRIPS FROM LOCALSTORAGE
    const generated =
      JSON.parse(localStorage.getItem("generated_trips")) || [];
    setLocalTrips(generated);

  }, [userId, onlyFavorites]);

  // ================= OPEN SINGLE TRIP =================
  const openTrip = async (id) => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/trip/single/${id}`
      );
      setSelectedTrip(res.data);
    } catch (err) {
      console.error("Failed to open trip", err);
    }
  };

  // ================= DELETE TRIP =================
  const deleteTrip = async (id) => {
    if (!window.confirm("Delete this trip permanently?")) return;

    try {
      await axios.delete(`http://localhost:5000/api/trip/${id}`);
      setTrips((prev) => prev.filter((t) => t._id !== id));
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  // ================= DELETE LOCAL TRIP =================
  const deleteLocalTrip = (index) => {
    const updated = [...localTrips];
    updated.splice(index, 1);
    setLocalTrips(updated);
    localStorage.setItem("generated_trips", JSON.stringify(updated));
  };

  // ================= DOWNLOAD PDF =================
  const downloadPDF = (trip) => {
    const doc = new jsPDF("p", "mm", "a4");

    let y = 20;
    const marginX = 18;
    const pageWidth = doc.internal.pageSize.getWidth() - marginX * 2;

    const text = cleanTextForPDF(
      trip.tripPlan || trip.fullPlan || trip.itinerary || ""
    );

    const lines = text.split("\n");

    lines.forEach((line) => {
      doc.text(line, marginX, y);
      y += 7;
    });

    doc.save("SmartTrip_Plan.pdf");
  };

  // ================= SINGLE TRIP VIEW =================
  if (selectedTrip) {
    return (
      <div className="h-full overflow-y-auto bg-gradient-to-br from-gray-50 to-white px-6 py-10">
        <button
          onClick={() => setSelectedTrip(null)}
          className="mb-6 text-sm font-semibold text-blue-600 hover:underline"
        >
          ← Back
        </button>

        <div className="max-w-6xl mx-auto bg-white rounded-3xl shadow-2xl p-10">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-extrabold">Trip Plan ✨</h1>

            <button
              onClick={() => downloadPDF(selectedTrip)}
              className="px-4 py-2 rounded-full bg-black text-white text-sm hover:opacity-80"
            >
              Download PDF
            </button>
          </div>

          <div className="whitespace-pre-line text-gray-800 leading-relaxed">
            {selectedTrip.tripPlan || selectedTrip.fullPlan}
          </div>
        </div>
      </div>
    );
  }

  // ================= MERGE BACKEND + LOCAL TRIPS =================
  const allTrips = [...localTrips, ...trips];

  return (
    <div className="h-full overflow-y-auto bg-gradient-to-br from-gray-50 to-white px-6 py-10">

      <h1 className="text-3xl font-extrabold mb-2 bg-gradient-to-r from-purple-600 to-blue-600 text-transparent bg-clip-text">
        {onlyFavorites ? "Saved Trips ❤️" : "Your Trips ✨"}
      </h1>

      <p className="text-gray-500 mb-10">
        {onlyFavorites
          ? "Your favorite travel plans"
          : "All your AI-generated travel plans"}
      </p>

      {loading ? (
        <p className="text-gray-400">Loading trips...</p>
      ) : allTrips.length === 0 ? (
        <div className="mt-32 text-center">
          <div className="text-6xl mb-4">🧳</div>
          <p className="text-gray-500 text-lg">
            No trips yet. Start planning!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 auto-rows-fr">

          {/* ✅ LOCAL GENERATED TRIPS */}
          {localTrips.map((trip, index) => (
            <div
              key={`local-${index}`}
              className="bg-white p-6 rounded-2xl shadow"
            >
              <h3 className="font-bold text-lg mb-2">
                {trip.from} → {trip.to}
              </h3>

              <div
                className="text-sm text-gray-700 whitespace-pre-line mb-4"
              >
                {trip.itinerary}
              </div>

              <div className="flex justify-between">
                <button
                  onClick={() => downloadPDF(trip)}
                  className="text-sm bg-black text-white px-3 py-1 rounded-full"
                >
                  PDF
                </button>

                <button
                  onClick={() => deleteLocalTrip(index)}
                  className="text-sm text-red-500"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}

          {/* ✅ BACKEND TRIPS */}
          {trips.map((trip) => (
            <TripCard
              key={trip._id}
              trip={trip}
              onView={openTrip}
              onDelete={deleteTrip}
            />
          ))}

        </div>
      )}
    </div>
  );
}
