import { useEffect, useState } from "react";
import axios from "axios";
import { Users } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");

  // ================= FETCH USERS =================
  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:5000/api/users");
      setUsers(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // ================= FILTER =================
  const filteredUsers = users.filter((u) =>
    u.name?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase())
  );

  // ================= TOGGLE =================
  const toggleStatus = async (id, status) => {
    const newStatus = status === "active" ? "inactive" : "active";

    await axios.put(`http://127.0.0.1:5000/api/users/${id}`, {
      status: newStatus,
    });

    fetchUsers();
  };

  // ================= DELETE =================
  const deleteUser = async (id) => {
    if (!window.confirm("Delete user?")) return;

    await axios.delete(`http://127.0.0.1:5000/api/users/${id}`);
    fetchUsers();
  };

  // ================= DOWNLOAD PDF REPORT =================
  const downloadReport = () => {
    const doc = new jsPDF();

    // Title
    doc.setFontSize(18);
    doc.text("Users Report", 14, 20);

    // Columns
    const tableColumn = ["Name", "Email", "Status"];

    // Rows
    const tableRows = filteredUsers.map((u) => [
      u.name,
      u.email,
      u.status || "active",
    ]);

    // Table
    autoTable(doc, {
      startY: 30,
      head: [tableColumn],
      body: tableRows,

      styles: {
        fontSize: 10,
        cellPadding: 4,
      },

      headStyles: {
        fillColor: [41, 128, 185], // Blue header
        textColor: 255,
        halign: "left",
      },

      alternateRowStyles: {
        fillColor: [240, 240, 240], // Light gray rows
      },
    });

    // Save
    doc.save("Users_Report.pdf");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#020617] to-[#0f172a] text-white px-6 py-10">

      {/* HEADER */}
      <div className="max-w-6xl mx-auto mb-8 flex justify-between items-center">
        <h1 className="text-2xl font-semibold flex items-center gap-2">
          <Users size={22}/> Users Management
        </h1>

        <button
          onClick={downloadReport}
          className="bg-purple-600 px-5 py-2 rounded-lg hover:bg-purple-700 transition"
        >
          Download Report
        </button>
      </div>

      {/* SEARCH */}
      <div className="max-w-6xl mx-auto mb-6">
        <input
          type="text"
          placeholder="Search user..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-80 p-3 rounded-lg bg-[#1e293b] border border-gray-600 text-white focus:outline-none"
        />
      </div>

      {/* TABLE */}
      <div className="max-w-6xl mx-auto bg-[#1e293b] rounded-xl overflow-hidden shadow-xl">

        <table className="w-full text-sm text-left">

          <thead className="bg-[#334155] text-gray-300 uppercase text-xs">
            <tr>
              <th className="p-4">Name</th>
              <th>Email</th>
              <th>Status</th>
              <th className="text-center">Action</th>
            </tr>
          </thead>

          <tbody>
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center py-6 text-gray-400">
                  No users found
                </td>
              </tr>
            ) : (
              filteredUsers.map((u) => (
                <tr
                  key={u._id}
                  className="border-b border-gray-700 hover:bg-[#273449] transition"
                >
                  <td className="p-4 font-medium">{u.name}</td>

                  <td>{u.email}</td>

                  <td>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        u.status === "inactive"
                          ? "bg-red-500/80"
                          : "bg-green-500/80"
                      }`}
                    >
                      {u.status || "active"}
                    </span>
                  </td>

                  <td className="text-center space-x-2">

                    <button
                      onClick={() => toggleStatus(u._id, u.status)}
                      className="bg-yellow-500 hover:bg-yellow-600 px-3 py-1 rounded text-xs"
                    >
                      Toggle
                    </button>

                    <button
                      onClick={() => deleteUser(u._id)}
                      className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded text-xs"
                    >
                      Delete
                    </button>

                  </td>
                </tr>
              ))
            )}
          </tbody>

        </table>
      </div>
    </div>
  );
};

export default AdminUsers;