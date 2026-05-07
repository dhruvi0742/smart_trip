import React, { useEffect, useState } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function AdminContacts() {

  const [messages, setMessages] = useState([]);
  const [search, setSearch] = useState("");
  const [reply, setReply] = useState("");
  const [selectedId, setSelectedId] = useState(null);

  // ================= FETCH =================
  const fetchMessages = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/contact/admin/all");
      setMessages(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  // ================= FILTER =================
  const filtered = messages.filter((m) =>
    m.message.toLowerCase().includes(search.toLowerCase())
  );

  // ================= STATS =================
  const total = messages.length;
  const replied = messages.filter(m => m.adminReply).length;
  const pending = total - replied;

  // ================= REPLY =================
  const handleReply = async (id) => {
    if (!reply) return alert("Write reply");

    await axios.put(
      `http://localhost:5000/api/contact/admin/reply/${id}`,
      { reply }
    );

    setReply("");
    setSelectedId(null);
    fetchMessages();
  };

  // ================= PDF REPORT =================
  const downloadPDF = () => {

    const pdf = new jsPDF();

    // TITLE
    pdf.setFontSize(18);
    pdf.text("Contact Messages Report", 14, 15);

    // TABLE HEADER
    const tableColumn = ["Message", "User", "Date"];

    // TABLE ROWS
    const tableRows = [];

    messages.forEach((msg) => {
      const rowData = [
        msg.message,
        msg.userId?.name || "User",
        new Date(msg.createdAt).toLocaleDateString()
      ];
      tableRows.push(rowData);
    });

    // TABLE DESIGN
    autoTable(pdf, {
  startY: 25,
  head: [tableColumn],
  body: tableRows,
  theme: "striped",
  styles: {
    fontSize: 10
  },
  headStyles: {
    fillColor: [41, 128, 185],
    textColor: 255
  }
});

    pdf.save("contact-report.pdf");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#020617] text-white p-6">

      {/* HEADER */}
      <h1 className="text-4xl font-bold text-center mb-8 tracking-wide">
        Contact Dashboard
      </h1>

      {/* ================= STATS ================= */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-6">

        <div className="bg-blue-500/10 border border-blue-500/30 p-5 rounded-xl text-center shadow-lg">
          <p className="text-sm text-gray-300">Today</p>
          <h2 className="text-2xl font-bold text-blue-400">0</h2>
        </div>

        <div className="bg-green-500/10 border border-green-500/30 p-5 rounded-xl text-center shadow-lg">
          <p className="text-sm text-gray-300">Month</p>
          <h2 className="text-2xl font-bold text-green-400">{total}</h2>
        </div>

        <div className="bg-purple-500/10 border border-purple-500/30 p-5 rounded-xl text-center shadow-lg">
          <p className="text-sm text-gray-300">Year</p>
          <h2 className="text-2xl font-bold text-purple-400">{total}</h2>
        </div>

        <div className="bg-red-500/10 border border-red-500/30 p-5 rounded-xl text-center shadow-lg">
          <p className="text-sm text-gray-300">Total</p>
          <h2 className="text-2xl font-bold text-red-400">{total}</h2>
        </div>

        <div className="bg-cyan-500/10 border border-cyan-500/30 p-5 rounded-xl text-center shadow-lg col-span-2 md:col-span-2">
          <p className="text-sm text-gray-300">Replied</p>
          <h2 className="text-2xl font-bold text-cyan-400">{replied}</h2>
        </div>

        <div className="bg-yellow-500/10 border border-yellow-500/30 p-5 rounded-xl text-center shadow-lg col-span-2 md:col-span-2">
          <p className="text-sm text-gray-300">Pending</p>
          <h2 className="text-2xl font-bold text-yellow-400">{pending}</h2>
        </div>

      </div>

      {/* ================= SEARCH + BUTTON ================= */}
      <div className="flex gap-4 mb-6">

        <input
          type="text"
          placeholder="Search messages..."
          className="bg-[#1e293b] border border-gray-600 p-3 rounded-lg w-72 focus:outline-none"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select className="bg-[#1e293b] border border-gray-600 p-3 rounded-lg">
          <option>All</option>
          <option>Replied</option>
          <option>Pending</option>
        </select>

        <button
          onClick={downloadPDF}
          className="ml-auto bg-indigo-600 hover:bg-indigo-700 px-5 py-2 rounded-lg shadow"
        >
          📄 Download PDF
        </button>

      </div>

      {/* ================= MESSAGE CARD ================= */}
      <div className="space-y-4 max-w-3xl">

        {filtered.map((msg) => (

          <div
            key={msg._id}
            className="bg-[#1e293b] p-5 rounded-xl shadow-lg border border-gray-700"
          >

            <p className="text-lg text-gray-200">{msg.message}</p>

            {msg.adminReply && (
              <p className="text-green-400 mt-2">
                Reply: {msg.adminReply}
              </p>
            )}

            <div className="flex gap-3 mt-3">

              <button
                onClick={() => setSelectedId(msg._id)}
                className="bg-blue-600 hover:bg-blue-700 px-4 py-1 rounded"
              >
                Reply
              </button>

              <button className="bg-red-600 hover:bg-red-700 px-4 py-1 rounded">
                Delete
              </button>

            </div>

            {selectedId === msg._id && (
              <div className="mt-3">
                <textarea
                  className="w-full p-2 bg-black border border-gray-600 rounded"
                  value={reply}
                  onChange={(e) => setReply(e.target.value)}
                />
                <button
                  onClick={() => handleReply(msg._id)}
                  className="bg-green-600 mt-2 px-4 py-2 rounded"
                >
                  Send
                </button>
              </div>
            )}

          </div>

        ))}

      </div>

    </div>
  );
}