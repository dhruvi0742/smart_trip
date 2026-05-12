import { useState } from "react";
import axios from "axios";

import {
  MapPinned,
  CalendarDays,
  Wallet,
  Users,
  Plane,
  Sparkles
} from "lucide-react";

export default function CreateTrip({ onTripGenerated }) {

  const userId = localStorage.getItem("userId");

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

  const [error, setError] = useState("");

  // ================= HANDLE CHANGE =================

  const handleChange = (e) => {

    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  // ================= CALCULATE DAYS =================

  const calculateDays = () => {

    if (!form.startDate || !form.endDate) return 1;

    const start = new Date(form.startDate);

    const end = new Date(form.endDate);

    const diffTime = end - start;

    const diffDays =
      Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

    return Math.max(1, diffDays);
  };

  // ================= SUBMIT =================

  const handleSubmit = async (e) => {

    e.preventDefault();

    if (!userId) {

      setError("Please login first");

      return;
    }

    setLoading(true);

    setError("");

    const days = calculateDays();

    try {

      const response = await axios.post(
        "http://localhost:5000/api/trip/create",
        {
          userId,
          ...form,
          days
        }
      );

      if (response.data.success) {

        onTripGenerated();

      }

    } catch (err) {

      setError(
        err.response?.data?.msg ||
        "Failed to generate trip"
      );

    } finally {

      setLoading(false);
    }
  };

  // ================= UI =================

  return (

    <div
      className="
      min-h-screen
      w-full
      bg-gradient-to-br
      from-[#FFFBE6]
      via-[#FFF9D6]
      to-[#FFF3BF]
      flex
      justify-center
      items-center
      p-3
      md:p-6
    "
    >

      {/* MAIN CARD */}
      <div
        className="
        w-full
        max-w-4xl
        h-[92vh]
        overflow-y-auto
        bg-white/90
        backdrop-blur-xl
        rounded-[35px]
        shadow-2xl
        border
        border-[#F4C400]/20
      "
      >

        {/* TOP SECTION */}
        <div
          className="
          bg-[#F4C400]
          p-7
          md:p-8
          text-black
          relative
        "
        >

          <div
            className="
            absolute
            top-0
            right-0
            w-56
            h-56
            bg-white/10
            rounded-full
            blur-3xl
          "
          />

          <div className="relative z-10">

            <div className="flex items-center gap-4 mb-4">

              <div
                className="
                w-14
                h-14
                rounded-2xl
                bg-black/10
                flex
                items-center
                justify-center
              "
              >

                <Plane
                  size={28}
                  className="text-black"
                />

              </div>

              <div>

                <h1
                  className="
                  text-3xl
                  md:text-4xl
                  font-black
                "
                >

                  Create Smart Trip

                </h1>

                <p className="mt-1 text-black/70">

                  AI-powered travel planner

                </p>

              </div>

            </div>

            <div
              className="
              flex
              items-center
              gap-2
              bg-black/10
              w-fit
              px-4
              py-2
              rounded-full
              mt-3
            "
            >

              <Sparkles
                size={16}
                className="text-black"
              />

              <span className="text-sm text-black">

                Smart itinerary enabled

              </span>

            </div>

          </div>

        </div>

        {/* FORM SECTION */}
        <div className="p-5 md:p-8">

          <form
            onSubmit={handleSubmit}
            className="space-y-6"
          >

            {/* FROM & TO */}
            <div className="grid md:grid-cols-2 gap-5">

              <div>

                <label className="label">

                  From City

                </label>

                <div className="inputBox">

                  <MapPinned
                    size={18}
                    className="text-[#B8860B]"
                  />

                  <input
                    type="text"
                    name="from"
                    placeholder="Departure city"
                    value={form.from}
                    onChange={handleChange}
                    className="inputStyle"
                    required
                  />

                </div>

              </div>

              <div>

                <label className="label">

                  Destination

                </label>

                <div className="inputBox">

                  <Plane
                    size={18}
                    className="text-[#B8860B]"
                  />

                  <input
                    type="text"
                    name="to"
                    placeholder="Destination city"
                    value={form.to}
                    onChange={handleChange}
                    className="inputStyle"
                    required
                  />

                </div>

              </div>

            </div>

            {/* DATES */}
            <div className="grid md:grid-cols-2 gap-5">

              <div>

                <label className="label">

                  Start Date

                </label>

                <div className="inputBox">

                  <CalendarDays
                    size={18}
                    className="text-[#B8860B]"
                  />

                  <input
                    type="date"
                    name="startDate"
                    value={form.startDate}
                    onChange={handleChange}
                    className="inputStyle"
                  />

                </div>

              </div>

              <div>

                <label className="label">

                  End Date

                </label>

                <div className="inputBox">

                  <CalendarDays
                    size={18}
                    className="text-[#B8860B]"
                  />

                  <input
                    type="date"
                    name="endDate"
                    value={form.endDate}
                    onChange={handleChange}
                    className="inputStyle"
                  />

                </div>

              </div>

            </div>

            {/* DAYS */}
            <div
              className="
              bg-[#FFF8CC]
              border
              border-[#F4C400]
              rounded-2xl
              p-4
              flex
              justify-between
              items-center
            "
            >

              <div>

                <p className="text-gray-500 text-sm">

                  Trip Duration

                </p>

                <h2 className="text-2xl font-bold text-[#B8860B]">

                  {calculateDays()} Days

                </h2>

              </div>

              <CalendarDays
                size={34}
                className="text-[#F4C400]"
              />

            </div>

            {/* BUDGET */}
            <div>

              <div className="flex justify-between mb-3">

                <label className="label flex items-center gap-2">

                  <Wallet
                    size={18}
                    className="text-[#B8860B]"
                  />

                  Budget

                </label>

                <span
                  className="
                  text-lg
                  font-bold
                  text-[#B8860B]
                "
                >

                  ₹{form.budget.toLocaleString()}

                </span>

              </div>

              <input
                type="range"
                min="5000"
                max="200000"
                step="5000"
                name="budget"
                value={form.budget}
                onChange={handleChange}
                className="
                w-full
                accent-[#F4C400]
                cursor-pointer
              "
              />

            </div>

            {/* PEOPLE & TYPE */}
            <div className="grid md:grid-cols-2 gap-5">

              <div>

                <label className="label">

                  Travelers

                </label>

                <div className="inputBox">

                  <Users
                    size={18}
                    className="text-[#B8860B]"
                  />

                  <input
                    type="number"
                    min="1"
                    max="10"
                    name="people"
                    value={form.people}
                    onChange={handleChange}
                    className="inputStyle"
                    required
                  />

                </div>

              </div>

              <div>

                <label className="label">

                  Travel Type

                </label>

                <div className="inputBox">

                  <Sparkles
                    size={18}
                    className="text-[#B8860B]"
                  />

                  <select
                    name="travelType"
                    value={form.travelType}
                    onChange={handleChange}
                    className="inputStyle bg-transparent"
                    required
                  >

                    <option value="">
                      Select Type
                    </option>

                    <option>
                      Adventure
                    </option>

                    <option>
                      Relaxation
                    </option>

                    <option>
                      Family
                    </option>

                    <option>
                      Honeymoon
                    </option>

                    <option>
                      Group
                    </option>

                  </select>

                </div>

              </div>

            </div>

            {/* NOTES */}
            <div>

              <label className="label">

                Additional Notes

              </label>

              <textarea
                name="notes"
                placeholder="Food, activities, hotel preferences..."
                value={form.notes}
                onChange={handleChange}
                className="
                w-full
                h-32
                rounded-3xl
                border
                border-[#F4C400]/30
                bg-[#FFFBE6]
                p-5
                outline-none
                focus:ring-4
                focus:ring-[#F4C400]/20
                transition
                resize-none
              "
              />

            </div>

            {/* ERROR */}
            {error && (

              <div
                className="
                bg-red-100
                border
                border-red-300
                text-red-600
                rounded-2xl
                p-4
                font-medium
              "
              >

                {error}

              </div>

            )}

            {/* BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className="
              w-full
              py-4
              rounded-3xl
              bg-[#F4C400]
              hover:bg-[#E5B800]
              text-black
              text-lg
              font-bold
              shadow-xl
              hover:scale-[1.01]
              transition-all
              duration-300
              disabled:opacity-50
            "
            >

              {loading
                ? "Generating Smart Trip..."
                : "Create Smart Trip ✨"}

            </button>

          </form>

        </div>

      </div>

      {/* HELPERS */}
      <style>
        {`
          .label{
            display:block;
            margin-bottom:8px;
            font-weight:600;
            color:#374151;
          }

          .inputBox{
            display:flex;
            align-items:center;
            gap:12px;
            border:1px solid rgba(244,196,0,0.3);
            background:#FFFBE6;
            padding:14px 16px;
            border-radius:22px;
            transition:0.3s;
          }

          .inputBox:focus-within{
            border-color:#F4C400;
            box-shadow:0 0 0 4px rgba(244,196,0,0.15);
            background:white;
          }

          .inputStyle{
            width:100%;
            background:transparent;
            outline:none;
            font-size:15px;
          }

          ::-webkit-scrollbar{
            width:8px;
          }

          ::-webkit-scrollbar-thumb{
            background:#F4C400;
            border-radius:20px;
          }
        `}
      </style>

    </div>
  );
}