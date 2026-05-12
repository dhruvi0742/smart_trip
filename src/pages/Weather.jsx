import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Search,
  MapPin,
  Wind,
  Droplets
} from "lucide-react";

const Weather = ({ city }) => {

  const [inputCity, setInputCity] = useState("");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  // 🔥 GET SAVED TRIP DATA
  const savedTrip =
    JSON.parse(localStorage.getItem("tripData"));

  const tripCity =
    savedTrip?.city || city || "Surat";

  const tripDate =
    savedTrip?.date || "";

  // ================= FETCH WEATHER =================

  const fetchWeather = async (cityName) => {

    if (!cityName) return;

    try {

      setLoading(true);

      const res = await axios.get(
        `http://localhost:5000/api/weather/${cityName}`
      );

      setData(res.data);

    } catch {

      alert("City not found");

    } finally {

      setLoading(false);

    }
  };

  // ================= AUTO LOAD =================

  useEffect(() => {

    fetchWeather(tripCity);

  }, [tripCity]);

  // ================= MOCK FORECAST =================

  const forecast = [
    { day: "Today", high: 32, low: 23 },
    { day: "Fri", high: 34, low: 22 },
    { day: "Sat", high: 35, low: 23 },
    { day: "Sun", high: 33, low: 24 },
    { day: "Mon", high: 31, low: 22 },
    { day: "Tue", high: 30, low: 21 },
    { day: "Wed", high: 29, low: 20 }
  ];

  return (

    <div
      className="
      h-screen
      overflow-y-auto
      scroll-smooth
      w-full
      bg-gradient-to-b
      from-[#050B2D]
      via-[#0B1E52]
      to-[#1B2E67]
      text-white
      flex
      justify-center
      items-start
      px-4
      py-10
      relative
    "
    >

      {/* STARS BACKGROUND */}
      <div className="absolute inset-0 opacity-30 pointer-events-none">

        <div
          className="
          w-full
          h-full
          bg-[radial-gradient(white_1px,transparent_1px)]
          [background-size:30px_30px]
        "
        />

      </div>

      {/* MAIN */}
      <div className="relative z-10 w-full max-w-md">

        {/* SEARCH */}
        <div
          className="
          flex
          items-center
          gap-2
          bg-white/10
          backdrop-blur-xl
          rounded-2xl
          p-3
          border
          border-white/20
          mb-8
        "
        >

          <Search size={18} />

          <input
            type="text"
            placeholder="Search city..."
            value={inputCity}
            onChange={(e) => setInputCity(e.target.value)}
            className="
              bg-transparent
              outline-none
              flex-1
              placeholder:text-gray-300
            "
          />

          <button
            onClick={() => fetchWeather(inputCity)}
            className="
              bg-white/20
              px-4
              py-1.5
              rounded-xl
              hover:bg-white/30
              transition
            "
          >
            Search
          </button>

        </div>

        {/* LOADING */}
        {loading && (
          <p className="text-center text-lg animate-pulse">
            Loading...
          </p>
        )}

        {/* WEATHER UI */}
        {data && (

          <>

            {/* TOP SECTION */}
            <div className="text-center mb-8">

              <div className="flex justify-center items-center gap-2 mb-2">

                <MapPin size={18} />

                <h1 className="text-5xl font-light">
                  {data.city}
                </h1>

              </div>

              {/* 🔥 TRIP DATE */}
              {tripDate && (

                <p className="text-gray-300 mt-2 text-lg">

                  🌤 Weather During Your Trip
                  <br />
                  📅 {tripDate}

                </p>

              )}

              <h2 className="text-[120px] font-thin leading-none">

                {Math.round(data.temp)}°

              </h2>

              <p className="text-2xl capitalize text-gray-200">

                {data.description}

              </p>

              <p className="text-xl text-gray-300 mt-2">

                H:{Math.round(data.temp + 3)}°
                {" "}
                L:{Math.round(data.temp - 4)}°

              </p>

            </div>

            {/* HOURLY FORECAST */}
            <div
              className="
              bg-white/10
              backdrop-blur-xl
              rounded-3xl
              p-5
              border
              border-white/10
              mb-6
            "
            >

              <p className="text-lg text-gray-200 mb-5">

                Clear conditions tonight,
                continuing through the morning.

              </p>

              <div className="flex justify-between overflow-x-auto gap-4">

                {[1, 2, 3, 4, 5, 6].map((item) => (

                  <div
                    key={item}
                    className="
                    flex
                    flex-col
                    items-center
                    min-w-[60px]
                  "
                  >

                    <p className="text-sm mb-3">

                      {item === 1
                        ? "Now"
                        : `${9 + item}PM`}

                    </p>

                    <img
                      src={`https://openweathermap.org/img/wn/${data.icon}@2x.png`}
                      alt=""
                      className="w-10 h-10"
                    />

                    <p className="mt-2 text-lg">

                      {Math.round(data.temp - item + 1)}°

                    </p>

                  </div>

                ))}

              </div>

            </div>

            {/* 10 DAY FORECAST */}
            <div
              className="
              bg-white/10
              backdrop-blur-xl
              rounded-3xl
              p-5
              border
              border-white/10
            "
            >

              <h3 className="text-gray-300 mb-5 text-sm tracking-wide">

                10-DAY FORECAST

              </h3>

              {forecast.map((day, index) => (

                <div
                  key={index}
                  className="
                  flex
                  items-center
                  justify-between
                  py-4
                  border-b
                  border-white/10
                  last:border-none
                "
                >

                  <p className="w-20 text-xl">

                    {day.day}

                  </p>

                  <img
                    src={`https://openweathermap.org/img/wn/${data.icon}@2x.png`}
                    alt=""
                    className="w-10 h-10"
                  />

                  <p className="text-gray-300">

                    {day.low}°

                  </p>

                  <div
                    className="
                    flex-1
                    mx-4
                    h-2
                    bg-white/10
                    rounded-full
                    overflow-hidden
                  "
                  >

                    <div
                      className="
                      h-full
                      bg-gradient-to-r
                      from-yellow-300
                      to-orange-400
                      rounded-full
                    "
                      style={{
                        width: `${day.high * 2}%`
                      }}
                    />

                  </div>

                  <p className="text-2xl">

                    {day.high}°

                  </p>

                </div>

              ))}

            </div>

            {/* EXTRA CARDS */}
            <div
              className="
              grid
              grid-cols-2
              gap-4
              mt-6
              mb-10
            "
            >

              {/* WIND */}
              <div
                className="
                bg-white/10
                backdrop-blur-xl
                rounded-3xl
                p-5
                border
                border-white/10
              "
              >

                <div className="flex items-center gap-2 mb-3">

                  <Wind size={18} />

                  <p>Wind</p>

                </div>

                <h2 className="text-3xl font-light">

                  {data.wind} km/h

                </h2>

              </div>

              {/* HUMIDITY */}
              <div
                className="
                bg-white/10
                backdrop-blur-xl
                rounded-3xl
                p-5
                border
                border-white/10
              "
              >

                <div className="flex items-center gap-2 mb-3">

                  <Droplets size={18} />

                  <p>Humidity</p>

                </div>

                <h2 className="text-3xl font-light">

                  {data.humidity}%

                </h2>

              </div>

            </div>

          </>

        )}

      </div>
    </div>
  );
};

export default Weather;