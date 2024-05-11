import React, { useState, useEffect } from "react";
import axios from "axios";
import "./DisplayCountries.css";

const countriesData = [
  { name: "USA", code: "us" },
  { name: "United Kingdom", code: "uk" },
  { name: "France", code: "fr" },
  { name: "Germany", code: "de" },
  { name: "Japan", code: "jp" },
  { name: "Australia", code: "au" },
  { name: "Canada", code: "ca" },
  { name: "China", code: "cn" },
  { name: "India", code: "in" },
  { name: "Brazil", code: "br" },
  { name: "Russia", code: "ru" },
  { name: "South Korea", code: "kr" },
  { name: "Italy", code: "it" },
  { name: "Spain", code: "es" },
  { name: "Mexico", code: "mx" },
  { name: "Indonesia", code: "id" },
  { name: "Netherlands", code: "nl" },
  { name: "Saudi Arabia", code: "sa" },
  { name: "Turkey", code: "tr" },
  { name: "Switzerland", code: "ch" },
  { name: "Sweden", code: "se" },
  { name: "Poland", code: "pl" },
  { name: "Belgium", code: "be" },
  { name: "Norway", code: "no" },
  { name: "Austria", code: "at" },
  { name: "Denmark", code: "dk" },
  { name: "South Africa", code: "za" },
  { name: "Finland", code: "fi" },
  { name: "Argentina", code: "ar" },
  { name: "Egypt", code: "eg" },
  { name: "Vietnam", code: "vn" },
  { name: "Ghana", code: "gh" },
  { name: "Sierra Leone", code: "sl" },
  // Add more countries as needed
];

const DisplayCountriesWeather = () => {
  const [countriesWeather, setCountriesWeather] = useState([]);
  const [currentCountriesIndex, setCurrentCountriesIndex] = useState(0);

  const apiKey = "2a2391096eb24c028f694542240905"; // Replace with your actual API key

  useEffect(() => {
    const fetchWeatherData = async () => {
      const currentCountries = countriesData.slice(
        currentCountriesIndex,
        currentCountriesIndex + 3
      );
      const promises = currentCountries.map((country) =>
        axios.get(
          `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${country.name}`
        )
      );

      try {
        const responses = await Promise.all(promises);
        const updatedCountriesWeather = responses.map((response, index) => ({
          name: currentCountries[index].name,
          weather: response.data.current,
        }));
        setCountriesWeather(updatedCountriesWeather);
      } catch (error) {
        console.error("Error fetching weather data:", error);
      }
    };

    fetchWeatherData();

    // Set interval to update countries every 10 seconds
    const intervalId = setInterval(() => {
      setCurrentCountriesIndex((prevIndex) =>
        prevIndex + 3 >= countriesData.length ? 0 : prevIndex + 3
      );
      fetchWeatherData();
    }, 10000); // Changed to update every 10 seconds

    return () => clearInterval(intervalId);
  }, [apiKey, currentCountriesIndex]); // Added apiKey and currentCountriesIndex as dependencies

  return (
    <div className="countries-weather">
      {countriesWeather.map((countryWeather) => (
        <div key={countryWeather.name} className="country-weather">
          <h3>{countryWeather.name}</h3>
          <p>Temperature: {countryWeather.weather.temp_c}°C</p>
          <p>Weather: {countryWeather.weather.condition.text}</p>
        </div>
      ))}
    </div>
  );
};

export default DisplayCountriesWeather;
