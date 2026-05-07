const axios = require("axios");

const getWeather = async (city) => {
  const API_KEY = process.env.WEATHER_API_KEY;

  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`;

  const res = await axios.get(url);

  return {
    city: res.data.name,
    temp: res.data.main.temp,
    feelsLike: res.data.main.feels_like,
    humidity: res.data.main.humidity,
    wind: res.data.wind.speed,
    description: res.data.weather[0].description,
    icon: res.data.weather[0].icon
  };
};

module.exports = { getWeather };