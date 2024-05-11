import { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";
//mport DisplayCountriesWeather from "./DisplayCountries";

function App() {
  const [city, setCity] = useState("");
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState("");

  const apiKey = "2a2391096eb24c028f694542240905";

  const fetchWeatherData = async () => {
    try {
      const response = await axios.get(
        `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}`
      );
      setWeatherData(response.data);
      setError("");
    } catch (error) {
      setWeatherData(null);
      setError("Error fetching weather data. Please try again.");
    }
  };

  const handleSearch = () => {
    if (city.trim() !== "") {
      fetchWeatherData();
    }
  };
  // const cities = ["London", "New York", "Tokyo", "Paris", "Berlin"];
  // useEffect(() => {
  //   cities.forEach(element => {

  //   });
  // },[])

  return (
    <div className="container">
      {/* <div>{weatherData.location.}</div> */}
      <div className="weather-app">
        {/* <h1 className="weather-appH1">Weather App</h1> */}
        <input
          type="text"
          placeholder="Enter city name"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        <button onClick={handleSearch}>Search</button>
        {error && <p>{error}</p>}
        {weatherData && (
          <div className="weatherDisplay section">
            <h2>
              {weatherData.location.name}, {weatherData.location.country}
            </h2>
            <p>
              Temperature: {weatherData.current.temp_c}°C or{" "}
              {weatherData.current.temp_f}°F
            </p>
            {/* <p>{weatherData.current.wind_degree}</p>
            <p>{weatherData.current.feelslike_c}</p>
            <p>{weatherData.current.feelslike_f}</p> */}

            <p>Weather: {weatherData.current.condition.text}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
