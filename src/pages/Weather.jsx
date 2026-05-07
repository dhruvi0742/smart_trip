import React, { useState, useEffect } from "react";
import axios from "axios";
import "../css/Weather.css";

const Weather = ({ city }) => {

  const [inputCity, setInputCity] = useState("");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

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

  // 🔥 AUTO LOAD (default Surat)
  useEffect(() => {
    fetchWeather(city || "Surat");
  }, [city]);

  return (
    <div className="weather-bg">

      <div className="weather-wrapper">

        {/* SEARCH */}
        <div className="search-box">
          <input
            placeholder="Search city..."
            value={inputCity}
            onChange={(e) => setInputCity(e.target.value)}
          />
          <button onClick={() => fetchWeather(inputCity)}>
            Search
          </button>
        </div>

        {loading && <p className="loading">Loading...</p>}

        {/* WEATHER UI */}
        {data && (
          <div className="weather-card">

            <h1>{data.city}</h1>

            <img
              src={`https://openweathermap.org/img/wn/${data.icon}@2x.png`}
              alt="icon"
            />

            <h2 className="temp">{Math.round(data.temp)}°</h2>

            <p className="desc">{data.description}</p>

            <p className="hl">
              H:{Math.round(data.temp + 3)}°  L:{Math.round(data.temp - 4)}°
            </p>

            <div className="details">
              <div>
                <p>Feels Like</p>
                <h4>{Math.round(data.feelsLike)}°</h4>
              </div>
              <div>
                <p>Humidity</p>
                <h4>{data.humidity}%</h4>
              </div>
              <div>
                <p>Wind</p>
                <h4>{data.wind} km/h</h4>
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};

export default Weather;