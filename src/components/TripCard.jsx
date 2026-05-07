import { useEffect, useState } from "react";
import axios from "axios";
import { Heart, Hotel, Plane, MapPin } from "lucide-react";

export default function TripCard({ 
  trip, 
  onView, 
  onDelete, 
  isAdmin = false,
  onDownload 
}) {
  const [isSaved, setIsSaved] = useState(Boolean(trip?.isSaved));
  const [dynamicTitle, setDynamicTitle] = useState("");

  useEffect(() => {
    setIsSaved(Boolean(trip?.isSaved));
    generateTitle();
  }, [trip]);

  // ❤️ Save / Unsave
  const toggleSave = async () => {
    try {
      const res = await axios.patch(
        `http://localhost:5000/api/trip/save/${trip._id}`
      );
      setIsSaved(res.data.isSaved);
    } catch (err) {
      console.error("Save trip failed", err);
    }
  };

  // 🧠 SMART TITLE GENERATOR
  const generateTitle = () => {
    if (trip?.title && trip.title.trim()) {
      setDynamicTitle(trip.title);
      return;
    }

    if (trip?.from && trip?.to) {
      setDynamicTitle(`${trip.from} → ${trip.to} Getaway`);
      return;
    }

    setDynamicTitle("AI Generated Trip");
  };

  const showSave = Boolean(onDelete);
  const numHotels = trip?.hotels?.length || 0;
  const numTransports = trip?.transport?.reduce((sum, t) => sum + t.options.length, 0) || 0;

  return (
    <div className="relative group h-full">

      {/* Glow */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500 to-blue-500 blur opacity-20 group-hover:opacity-40 transition" />

      <div className="relative bg-white rounded-2xl p-6 shadow-lg group-hover:shadow-2xl transition h-full flex flex-col">

        {/* ❤️ Save Icon */}
        {!isAdmin && showSave && (
          <button onClick={toggleSave} className="absolute top-4 right-4 z-10">
            <Heart className={`w-5 h-5 transition ${
              isSaved ? "fill-red-500 text-red-500" : "text-gray-400 hover:text-red-400"
            }`} />
          </button>
        )}

        {/* ===== HEADER ===== */}
        <div className="flex-1">
          <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-purple-600" />
            {dynamicTitle}
          </h3>

          {/* Teasers */}
          <div className="space-y-2 mb-4">
            {trip?.days && (
              <div className="flex items-center gap-2 text-xs bg-blue-50 px-3 py-1 rounded-full">
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                {trip.days} days
              </div>
            )}
            {numHotels > 0 && (
              <div className="flex items-center gap-2 text-xs bg-emerald-50 px-3 py-1 rounded-full">
                <Hotel className="w-4 h-4 text-emerald-600" />
                {numHotels} hotels curated
              </div>
            )}
            {numTransports > 0 && (
              <div className="flex items-center gap-2 text-xs bg-indigo-50 px-3 py-1 rounded-full">
                <Plane className="w-4 h-4 text-indigo-600" />
                {numTransports} transport options
              </div>
            )}
          </div>

          <p className="text-sm text-gray-600 line-clamp-2 mb-4 leading-relaxed">
            {trip?.fullPlan ? trip.fullPlan.substring(0, 100) + "..." : "Complete itinerary with hotels & transport ready!"}
          </p>

          <div className="text-xs text-gray-400 flex items-center gap-1">
            Created {trip?.createdAt ? new Date(trip.createdAt).toLocaleDateString() : "recently"}
            {trip?.hotels && (
              <span className="ml-2 px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                Ready to Book
              </span>
            )}
          </div>
        </div>

        {/* ===== ACTIONS ===== */}
        <div className="mt-auto pt-6">
          <div className="flex flex-wrap justify-between items-center gap-2">
            
            {/* ✅ YELLOW BUTTON */}
            <button
              onClick={() => onView(trip._id)}
              className="flex-1 px-4 py-2 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-500 text-black hover:from-yellow-500 hover:to-yellow-600 transition text-sm font-semibold"
            >
              View Full Plan
            </button>

            {isAdmin && onDownload && (
              <button
                onClick={() => onDownload(trip)}
                className="px-3 py-2 rounded-lg bg-black text-white text-xs hover:bg-gray-800"
                title="Download PDF"
              >
                PDF
              </button>
            )}

            {isAdmin && (
              <button
                onClick={() => onDelete(trip._id)}
                className="px-3 py-2 rounded-lg bg-red-500 text-white text-xs hover:bg-red-600"
              >
                Delete
              </button>
            )}

            {!isAdmin && onDelete && (
              <button
                onClick={() => onDelete(trip._id)}
                className="text-red-500 hover:text-red-700 text-sm font-semibold"
              >
                Delete
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}