import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  MapPin,
  Thermometer,
  Eye,
  Wind,
  Gauge,
  Cloud,
  Sun,
  CloudRain,
  CloudSnow,
  CloudDrizzle,
} from "lucide-react";

const countries = [
  { name: "New York", code: "USA", emoji: "🇺🇸" },
  { name: "London", code: "UK", emoji: "🇬🇧" },
  { name: "Paris", code: "France", emoji: "🇫🇷" },
  { name: "Berlin", code: "Germany", emoji: "🇩🇪" },
  { name: "Tokyo", code: "Japan", emoji: "🇯🇵" },
  { name: "Sydney", code: "Australia", emoji: "🇦🇺" },
];

const getWeatherIcon = (condition) => {
  const lowerCondition = condition.toLowerCase();
  if (lowerCondition.includes("sun") || lowerCondition.includes("clear")) {
    return Sun;
  } else if (
    lowerCondition.includes("rain") ||
    lowerCondition.includes("drizzle")
  ) {
    return CloudRain;
  } else if (
    lowerCondition.includes("snow") ||
    lowerCondition.includes("ice")
  ) {
    return CloudSnow;
  } else if (lowerCondition.includes("cloud")) {
    return Cloud;
  } else {
    return CloudDrizzle;
  }
};

const getTemperatureColor = (temp) => {
  if (temp >= 30) return "text-red-400";
  if (temp >= 20) return "text-orange-400";
  if (temp >= 10) return "text-yellow-400";
  return "text-blue-400";
};

const getBackgroundGradient = (temp) => {
  if (temp >= 30) return "from-red-500/10 to-orange-500/10";
  if (temp >= 20) return "from-orange-500/10 to-yellow-500/10";
  if (temp >= 10) return "from-yellow-500/10 to-green-500/10";
  return "from-blue-500/10 to-cyan-500/10";
};

const DisplayCountriesWeather = () => {
  const [countriesWeather, setCountriesWeather] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  const apiKey = "2a2391096eb24c028f694542240905";

  useEffect(() => {
    const fetchWeatherData = async () => {
      setLoading(true);
      try {
        const subset = countries.slice(currentIndex, currentIndex + 3);
        const responses = await Promise.all(
          subset.map((country) =>
            axios.get(
              `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${country.code}`
            )
          )
        );

        const weatherData = responses.map((res, index) => {
          const data = res.data;
          return {
            name: subset[index].name,
            code: subset[index].code,
            emoji: subset[index].emoji,
            temp: data.current.temp_c,
            condition: data.current.condition.text,
            humidity: data.current.humidity,
            wind: data.current.wind_kph,
            pressure: data.current.pressure_mb,
            visibility: data.current.vis_km,
            feelsLike: data.current.feelslike_c,
            icon: getWeatherIcon(data.current.condition.text),
          };
        });

        setCountriesWeather(weatherData);
      } catch (error) {
        console.error("Error fetching weather data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchWeatherData();

    const intervalId = setInterval(() => {
      setCurrentIndex((prev) => (prev + 3 >= countries.length ? 0 : prev + 3));
    }, 10000);

    return () => clearInterval(intervalId);
  }, [currentIndex]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
        {[1, 2, 3].map((item) => (
          <div
            key={item}
            className="p-6 rounded-2xl bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 animate-pulse"
          >
            <div className="h-6 bg-gray-700 rounded mb-4"></div>
            <div className="h-4 bg-gray-700 rounded mb-2"></div>
            <div className="h-4 bg-gray-700 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-green-400 bg-clip-text text-transparent mb-2">
          Global Weather Overview
        </h2>
        <p className="text-gray-400">
          Live updates from major cities worldwide
        </p>
      </div>

      {/* Weather Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {countriesWeather.map((country) => {
          const WeatherIcon = country.icon;
          return (
            <div
              key={country.name}
              className={`p-6 rounded-2xl bg-gradient-to-br ${getBackgroundGradient(
                country.temp
              )} border border-white/10 backdrop-blur-sm hover:scale-105 transition-all duration-300 shadow-2xl`}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{country.emoji}</span>
                  <div>
                    <h3 className="text-xl font-bold text-white">
                      {country.name}
                    </h3>
                    <p className="text-gray-300 text-sm flex items-center">
                      <MapPin className="h-4 w-4 mr-1" />
                      {country.code}
                    </p>
                  </div>
                </div>
                <WeatherIcon className="h-8 w-8 text-cyan-400" />
              </div>

              {/* Temperature */}
              <div className="text-center mb-6">
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <Thermometer className="h-5 w-5 text-red-400" />
                  <span
                    className={`text-4xl font-bold ${getTemperatureColor(
                      country.temp
                    )}`}
                  >
                    {country.temp}°C
                  </span>
                </div>
                <p className="text-gray-300 text-sm">
                  Feels like {country.feelsLike}°C
                </p>
                <p className="text-cyan-300 font-medium">{country.condition}</p>
              </div>

              {/* Weather Details */}
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/10">
                <div className="flex items-center space-x-2">
                  <Gauge className="h-4 w-4 text-blue-400" />
                  <div>
                    <p className="text-xs text-gray-400">Pressure</p>
                    <p className="text-white font-medium">
                      {country.pressure} hPa
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Eye className="h-4 w-4 text-green-400" />
                  <div>
                    <p className="text-xs text-gray-400">Visibility</p>
                    <p className="text-white font-medium">
                      {country.visibility} km
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Cloud className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-400">Humidity</p>
                    <p className="text-white font-medium">
                      {country.humidity}%
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Wind className="h-4 w-4 text-cyan-400" />
                  <div>
                    <p className="text-xs text-gray-400">Wind</p>
                    <p className="text-white font-medium">
                      {country.wind} km/h
                    </p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Navigation Dots */}
      <div className="flex justify-center space-x-2 mt-8">
        {[0, 1].map((dot) => (
          <button
            key={dot}
            onClick={() => setCurrentIndex(dot * 3)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              currentIndex === dot * 3 ? "bg-cyan-400 scale-125" : "bg-gray-600"
            }`}
          />
        ))}
      </div>

      {/* Auto-rotate Notice */}
      <div className="text-center mt-4">
        <p className="text-gray-500 text-sm flex items-center justify-center">
          <span className="animate-pulse mr-2">🔄</span>
          Auto-rotating every 10 seconds
        </p>
      </div>
    </div>
  );
};

export default DisplayCountriesWeather;
