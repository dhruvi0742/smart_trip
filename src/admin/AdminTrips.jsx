import React, { useEffect, useState } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

export default function AdminTrips() {
  const [trips, setTrips] = useState([]);
  const [search, setSearch] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [selectedTripId, setSelectedTripId] = useState(null);

  // ================= FETCH =================
  const fetchTrips = async () => {
    const res = await axios.get("http://localhost:5000/api/trip/admin/all");
    setTrips(res.data);
  };

  useEffect(() => {
    fetchTrips();
  }, []);

  // ================= FILTER =================
  const filteredTrips = trips.filter((trip) => {
    const matchSearch = trip.to
      ?.toLowerCase()
      .includes(search.toLowerCase());

    const matchDate = dateFilter
      ? new Date(trip.createdAt).toISOString().slice(0, 10) === dateFilter
      : true;

    return matchSearch && matchDate;
  });

  // ================= PDF =================
  const exportPDF = () => {
    const doc = new jsPDF();

    doc.text("Trips Report", 14, 15);

    autoTable(doc, {
      startY: 20,
      head: [["Destination", "User", "Date"]],
      body: filteredTrips.map((trip) => [
        trip.to,
        trip.userId?.username ||
          trip.userId?.name ||
          trip.userId?.email ||
          "Unknown",
        new Date(trip.createdAt).toLocaleDateString(),
      ]),
    });

    doc.save("trips-report.pdf");
  };

  // ================= DESTINATION GRAPH =================
  const destinationData = Object.values(
    trips.reduce((acc, trip) => {
      const key = trip.to?.trim().toLowerCase() || "unknown";

      if (!acc[key]) {
        acc[key] = {
          name: trip.to || "Unknown",
          count: 0,
        };
      }

      acc[key].count += 1;

      return acc;
    }, {})
  );

  // ================= MONTH GRAPH =================
  const monthData = Object.values(
    trips.reduce((acc, trip) => {
      const month = new Date(trip.createdAt).toLocaleString("default", {
        month: "short",
        year: "numeric",
      });

      if (!acc[month]) {
        acc[month] = { month, trips: 0 };
      }

      acc[month].trips += 1;

      return acc;
    }, {})
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] to-[#020617] text-white p-8">

      <h1 className="text-3xl font-bold mb-6">✈️ Trips Management</h1>

      {/* FILTER */}
      <div className="flex justify-between mb-6 flex-wrap gap-3">

        <div className="flex gap-3">
          <input
            type="text"
            placeholder="Filter Trip..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-[#1e293b] px-4 py-2 rounded-lg border border-gray-600"
          />

          <input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="bg-[#1e293b] px-4 py-2 rounded-lg border border-gray-600"
          />
        </div>

        <button
          onClick={exportPDF}
          className="bg-gradient-to-r from-purple-500 to-indigo-500 px-5 py-2 rounded-lg"
        >
          Generate Report
        </button>

      </div>

      {/* TABLE */}
      <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-gray-700">

        <table className="w-full text-sm">

          <thead>
            <tr className="text-gray-400 border-b border-gray-700">
              <th>Destination</th>
              <th>User</th>
              <th>Date</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {filteredTrips.map((trip) => (
              <React.Fragment key={trip._id}>

                {/* MAIN ROW */}
                <tr className="border-b border-gray-700">
                  <td className="py-3">{trip.to}</td>

                  <td>
                    {trip.userId?.username ||
                      trip.userId?.name ||
                      trip.userId?.email ||
                      "Unknown"}
                  </td>

                  <td>
                    {new Date(trip.createdAt).toLocaleDateString()}
                  </td>

                  <td>
                    <button
                      onClick={() =>
                        setSelectedTripId(
                          selectedTripId === trip._id ? null : trip._id
                        )
                      }
                      className="bg-blue-500 px-3 py-1 rounded"
                    >
                      {selectedTripId === trip._id ? "Hide" : "Select"}
                    </button>
                  </td>
                </tr>

                {/* 🔥 DETAILS ROW */}
                {selectedTripId === trip._id && (
                  <tr className="bg-black/40">
                    <td colSpan="4" className="p-4">

                      <div className="bg-white/5 p-4 rounded-lg border border-gray-600">
                        
                        <p><b>From:</b> {trip.from}</p>
                        <p><b>To:</b> {trip.to}</p>

                        <p className="mt-3 text-gray-300 whitespace-pre-line">
                          {trip.fullPlan}
                        </p>

                      </div>

                    </td>
                  </tr>
                )}

              </React.Fragment>
            ))}
          </tbody>

        </table>
      </div>

      {/* ===== GRAPHS ===== */}
      <div className="grid md:grid-cols-2 gap-6 mt-10">

        {/* DESTINATION GRAPH */}
        <div className="bg-white/10 p-6 rounded-xl">
          <h3 className="mb-3">🌍 Trips by Destination</h3>

          <div className="overflow-x-auto">
            <div style={{ minWidth: destinationData.length * 80 }}>

              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={destinationData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="name"
                    interval={0}
                    angle={-30}
                    textAnchor="end"
                  />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#8b5cf6" />
                </BarChart>
              </ResponsiveContainer>

            </div>
          </div>

        </div>

        {/* MONTH GRAPH */}
        <div className="bg-white/10 p-6 rounded-xl">
          <h3 className="mb-3">📅 Trips per Month</h3>

          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="trips" fill="#06b6d4" />
            </BarChart>
          </ResponsiveContainer>
        </div>

      </div>

    </div>
  );
}