"use client";

import { useState } from "react";
import axios from "axios";
import { Search } from "lucide-react";
import "./App.css";

export default function WeatherApp() {
  const [city, setCity] = useState("");
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState(0);

  const apiKey = "2a2391096eb24c028f694542240905";

  const fetchWeatherData = async () => {
    if (!city.trim()) return;

    setLoading(true);
    try {
      const response = await axios.get(
        `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${city}&days=3&alerts=yes`
      );
      setWeatherData(response.data);
      setError("");
    } catch (error) {
      setWeatherData(null);
      setError("Error fetching weather data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      fetchWeatherData();
    }
  };

  return (
    <div className="weather-container">
      <div className="weather-card">
        <div className="weather-header">
          <h1 className="weather-title">Weather Forecast</h1>
          <p className="weather-subtitle">
            Get real-time weather information for any city
          </p>
        </div>

        <div className="weather-content">
          <div className="search-container">
            <input
              type="text"
              placeholder="Enter city name..."
              value={city}
              onChange={(e) => setCity(e.target.value)}
              onKeyDown={handleKeyDown}
              className="search-input"
            />
            <button
              onClick={fetchWeatherData}
              disabled={loading || !city.trim()}
              className="search-button"
            >
              {loading ? (
                <div className="spinner"></div>
              ) : (
                <Search className="search-icon" />
              )}
              Search
            </button>
          </div>

          {error && (
            <div className="error-alert">
              <p>{error}</p>
            </div>
          )}

          {weatherData && (
            <div className="weather-data">
              <div className="current-weather">
                <div className="location-info">
                  <img
                    src={`https:${weatherData.current.condition.icon}`}
                    alt={weatherData.current.condition.text}
                    className="weather-icon"
                  />
                  <div>
                    <h2 className="city-name">{weatherData.location.name}</h2>
                    <p className="region-name">
                      {weatherData.location.region},{" "}
                      {weatherData.location.country}
                    </p>
                  </div>
                </div>
                <div className="temperature-info">
                  <div className="current-temp">
                    {weatherData.current.temp_c}°C
                  </div>
                  <p className="weather-condition">
                    {weatherData.current.condition.text}
                  </p>
                </div>
              </div>

              <div className="weather-stats">
                <div className="stat-item">
                  <p className="stat-label">Feels Like</p>
                  <p className="stat-value">
                    {weatherData.current.feelslike_c}°C
                  </p>
                </div>
                <div className="stat-item">
                  <p className="stat-label">Humidity</p>
                  <p className="stat-value">{weatherData.current.humidity}%</p>
                </div>
                <div className="stat-item">
                  <p className="stat-label">Wind</p>
                  <p className="stat-value">
                    {weatherData.current.wind_kph} km/h
                  </p>
                </div>
                <div className="stat-item">
                  <p className="stat-label">UV Index</p>
                  <p className="stat-value">{weatherData.current.uv}</p>
                </div>
              </div>

              <div className="forecast-tabs">
                <div className="tabs-list">
                  {weatherData.forecast.forecastday.map((day, index) => (
                    <button
                      key={index}
                      className={`tab-button ${
                        activeTab === index ? "active" : ""
                      }`}
                      onClick={() => setActiveTab(index)}
                    >
                      {index === 0
                        ? "Today"
                        : index === 1
                        ? "Tomorrow"
                        : "Day After"}
                    </button>
                  ))}
                </div>

                <div className="tab-content">
                  {weatherData.forecast.forecastday.map((day, index) => (
                    <div
                      key={index}
                      className={`forecast-day ${
                        activeTab === index ? "active" : ""
                      }`}
                    >
                      <div className="day-header">
                        <div>
                          <p className="day-date">
                            {new Date(day.date).toLocaleDateString("en-US", {
                              weekday: "long",
                              month: "short",
                              day: "numeric",
                            })}
                          </p>
                          <p className="day-condition">
                            {day.day.condition.text}
                          </p>
                        </div>
                        <div className="day-temp">
                          <img
                            src={`https:${day.day.condition.icon}`}
                            alt={day.day.condition.text}
                            className="day-icon"
                          />
                          <div>
                            <p className="temp-range">
                              {day.day.maxtemp_c}° / {day.day.mintemp_c}°
                            </p>
                            <p className="temp-label">High / Low</p>
                          </div>
                        </div>
                      </div>

                      <div className="day-stats">
                        <div className="day-stat-item">
                          <p className="day-stat-label">Chance of Rain</p>
                          <p className="day-stat-value">
                            {day.day.daily_chance_of_rain}%
                          </p>
                        </div>
                        <div className="day-stat-item">
                          <p className="day-stat-label">Humidity</p>
                          <p className="day-stat-value">
                            {day.day.avghumidity}%
                          </p>
                        </div>
                        <div className="day-stat-item">
                          <p className="day-stat-label">Wind</p>
                          <p className="day-stat-value">
                            {day.day.maxwind_kph} km/h
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="weather-footer">Data provided by WeatherAPI.com</div>
      </div>
    </div>
  );
}
