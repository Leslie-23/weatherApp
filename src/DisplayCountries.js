import React, { useState, useEffect } from "react";
import axios from "axios";

const countries = ["USA", "UK", "France", "Germany", "Japan", "Australia"];

const DisplayCountriesWeather = () => {
  const [countriesWeather, setCountriesWeather] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const apiKey = "2a2391096eb24c028f694542240905";

  useEffect(() => {
    const fetchWeatherData = async () => {
      const subset = countries.slice(currentIndex, currentIndex + 3);
      const responses = await Promise.all(
        subset.map((country) =>
          axios.get(
            `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${country}`
          )
        )
      );

      setCountriesWeather(
        responses.map((res, index) => ({
          name: subset[index],
          temp: res.data.current.temp_c,
          condition: res.data.current.condition.text,
        }))
      );
    };

    fetchWeatherData();

    const intervalId = setInterval(() => {
      setCurrentIndex((prev) => (prev + 3 >= countries.length ? 0 : prev + 3));
    }, 10000);

    return () => clearInterval(intervalId);
  }, [currentIndex]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
      {countriesWeather.map((country) => (
        <div
          key={country.name}
          className="p-6 rounded-lg shadow-lg bg-gray-900 text-white"
        >
          <h3 className="text-xl font-bold">{country.name}</h3>
          <p>Temp: {country.temp}°C</p>
          <p>{country.condition}</p>
        </div>
      ))}
    </div>
  );
};

export default DisplayCountriesWeather;
