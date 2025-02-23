import React, { useState } from "react";
import axios from "axios";

const App = () => {
  const [city, setCity] = useState("");
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState("");

  const apiKey = "2a2391096eb24c028f694542240905";

  const fetchWeatherData = async () => {
    try {
      const response = await axios.get(
        `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${city}&days=3&alerts=yes`
      );
      setWeatherData(response.data);
      setError("");
    } catch (error) {
      setWeatherData(null);
      setError("Error fetching weather data. Please try again.");
    }
  };

  return (
    <div className=" mb-24 flex flex-col items-center p-12 bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg text-center w-full max-w-lg">
        <input
          type="text"
          placeholder="Enter city name"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
        />
        <button
          onClick={fetchWeatherData}
          className="mt-4 w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600"
        >
          Search
        </button>
        {error && <p className="text-red-500 mt-2">{error}</p>}
        {weatherData && (
          <div className="mt-6">
            <h2 className="text-2xl font-semibold">
              {weatherData.location.name}, {weatherData.location.country}
            </h2>
            <p>Temperature: {weatherData.current.temp_c}°C</p>
            <p>Weather: {weatherData.current.condition.text}</p>
            <p>
              Forecast: {weatherData.forecast.forecastday[0].day.condition.text}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
