import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function CreateTrip() {
  const userId = localStorage.getItem("userId");
  const navigate = useNavigate();

  const [form, setForm] = useState({
    from: "",
    to: "",
    startDate: "",
    endDate: "",
    budget: 10000,
    people: 1,
    travelType: "",
    notes: ""
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const calculateDays = () => {
    if (!form.startDate || !form.endDate) return 5;
    const start = new Date(form.startDate);
    const end = new Date(form.endDate);
    const diffTime = end - start;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return Math.max(1, diffDays);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userId) {
      setError("Please login first");
      return;
    }
    setLoading(true);
    setError("");
    setSuccess(null);

    const days = calculateDays();

    try {
      const response = await axios.post("http://localhost:5000/api/trip/create", {
        userId,
        ...form,
        days
      });

      if (response.data.success) {
        setSuccess({
          trip: response.data.trip,
          data: response.data.data // JSON structure
        });
        // Auto redirect after 3s
        setTimeout(() => navigate("/trips"), 3000);
      }
    } catch (err) {
      setError(err.response?.data?.msg || "Failed to generate trip");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center w-full p-10 min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="bg-white rounded-3xl shadow-2xl p-10 w-full max-w-4xl max-h-[90vh] overflow-y-auto">

        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
          Plan Your Dream Trip ✈️
        </h1>
        <p className="text-gray-500 mb-8 text-lg">
          AI-powered itinerary with hotels, transport & booking
        </p>

        {success ? (
          <div className="space-y-4 p-8 bg-green-50 border-2 border-green-200 rounded-2xl">
            <h2 className="text-2xl font-bold text-green-800">✅ Trip Generated Successfully!</h2>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div><strong>{success.trip.from}</strong> → <strong>{success.trip.to}</strong></div>
              <div>{success.trip.days} days • ₹{success.trip.booking.totalPrice}</div>
            </div>
            <pre className="bg-white p-4 rounded-xl text-xs overflow-auto max-h-40 font-mono">
              {JSON.stringify(success.data, null, 2)}
            </pre>
            <button
              onClick={() => navigate("/trips")}
              className="w-full bg-green-600 text-white py-3 rounded-xl font-bold"
            >
              View All Trips →
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <input
                name="from"
                placeholder="From (City)"
                className="input"
                onChange={handleChange}
                required
              />
              <input
                name="to"
                placeholder="To (Destination)"
                className="input"
                onChange={handleChange}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <input
                type="date"
                name="startDate"
                className="input"
                onChange={handleChange}
              />
              <input
                type="date"
                name="endDate"
                className="input"
                onChange={handleChange}
              />
              <p className="col-span-2 text-sm text-gray-500">Days: <strong>{calculateDays()}</strong></p>
            </div>

            <div>
              <label className="text-sm font-medium">
                Budget ₹{form.budget.toLocaleString()}
              </label>
              <input
                type="range"
                min="5000"
                max="200000"
                step="5000"
                name="budget"
                value={form.budget}
                onChange={handleChange}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <input
                type="number"
                name="people"
                min="1"
                max="10"
                placeholder="People"
                className="input"
                onChange={handleChange}
                required
              />

              <select
                name="travelType"
                className="input"
                onChange={handleChange}
                required
              >
                <option value="">Travel Type</option>
                <option>Adventure</option>
                <option>Relaxation</option>
                <option>Family</option>
                <option>Honeymoon</option>
                <option>Group</option>
              </select>
            </div>

            <textarea
              name="notes"
              placeholder="Special requirements, preferences..."
              className="input h-32"
              onChange={handleChange}
            />

            {error && (
              <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded-xl">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !userId}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-4 rounded-2xl font-bold text-xl flex justify-center items-center gap-2 shadow-xl hover:shadow-2xl transition-all disabled:opacity-50"
            >
              {loading ? (
                <>
                  <span className="animate-spin">⏳</span>
                  Generating smart itinerary...
                </>
              ) : (
                <>
                  Create Smart Trip 🚀
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
