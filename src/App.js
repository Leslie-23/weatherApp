import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
  Activity,
  AlertTriangle,
  CalendarDays,
  Clock,
  Compass,
  Droplets,
  Eye,
  Gauge,
  MapPin,
  Navigation,
  Newspaper,
  Radio,
  Search,
  ShieldAlert,
  Sunrise,
  Sunset,
  Thermometer,
  Umbrella,
  Wind,
} from "lucide-react";
import "./App.css";

const API_KEY =
  process.env.REACT_APP_WEATHER_API_KEY || "2a2391096eb24c028f694542240905";

const DEFAULT_CITY = "New York";
const TRENDING_CITIES = ["Atlanta", "Miami", "Chicago", "Denver", "Seattle", "London"];

const topStories = [
  {
    label: "Climate",
    title: "Weekend weather pattern favors rapid swings across major travel hubs",
    summary:
      "Airports and highways can see quick changes when wind shifts collide with humid air. Check hourly windows before leaving.",
  },
  {
    label: "Health",
    title: "Heat, humidity, and air quality are the practical numbers to watch",
    summary:
      "The headline temperature is only part of the story. Feels-like temperature, UV, and air quality give a better risk picture.",
  },
  {
    label: "Preparedness",
    title: "Severe-weather alerts deserve a plan, not a glance",
    summary:
      "Keep battery backups charged, know the safest room, and review local emergency alerts when watches or warnings appear.",
  },
];

const formatDate = (value, options = {}) =>
  new Intl.DateTimeFormat("en-US", options).format(new Date(value));

const formatHour = (value) =>
  new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));

const round = (value) => Math.round(Number(value));

const getAqiLabel = (index) => {
  if (!index) return "Unavailable";
  if (index <= 3) return "Low";
  if (index <= 6) return "Moderate";
  if (index <= 9) return "High";
  return "Very high";
};

const getUvLabel = (uv) => {
  if (uv < 3) return "Low";
  if (uv < 6) return "Moderate";
  if (uv < 8) return "High";
  if (uv < 11) return "Very high";
  return "Extreme";
};

const getWeatherTone = (condition = "") => {
  const lower = condition.toLowerCase();
  if (lower.includes("rain") || lower.includes("drizzle") || lower.includes("storm")) {
    return "rain";
  }
  if (lower.includes("snow") || lower.includes("ice") || lower.includes("sleet")) {
    return "cold";
  }
  if (lower.includes("clear") || lower.includes("sunny")) {
    return "clear";
  }
  if (lower.includes("cloud") || lower.includes("overcast")) {
    return "cloud";
  }
  return "neutral";
};

const buildBriefing = (weatherData) => {
  if (!weatherData) return [];

  const current = weatherData.current;
  const today = weatherData.forecast.forecastday[0];
  const alerts = weatherData.alerts?.alert || [];
  const rainChance = today.day.daily_chance_of_rain;
  const tempSpread = Math.abs(today.day.maxtemp_f - today.day.mintemp_f);
  const wind = round(current.wind_mph);
  const uv = current.uv;

  const lead =
    alerts.length > 0
      ? `${alerts.length} active weather alert${alerts.length > 1 ? "s" : ""} in effect. Review timing and instructions before travel.`
      : `${weatherData.location.name} is under ${current.condition.text.toLowerCase()} skies with a ${round(
          current.feelslike_f
        )}° feels-like temperature.`;

  return [
    {
      title: "Right now",
      body: lead,
      severity: alerts.length > 0 ? "high" : "normal",
    },
    {
      title: "Next decision point",
      body:
        rainChance >= 50
          ? `Rain chances reach ${rainChance}% today. Build extra time into outdoor plans and commutes.`
          : `Rain risk is ${rainChance}% today, so temperature, wind, and UV are the main planning factors.`,
      severity: rainChance >= 70 ? "medium" : "normal",
    },
    {
      title: "Comfort outlook",
      body:
        tempSpread >= 18
          ? `Temperatures swing about ${round(tempSpread)}° from morning to afternoon. Layers will matter.`
          : `A tighter ${round(tempSpread)}° temperature range should keep conditions more consistent through the day.`,
      severity: "normal",
    },
    {
      title: "Outdoor risk",
      body: `Wind is near ${wind} mph and UV is ${uv} (${getUvLabel(
        uv
      )}). Sunscreen, shade, or wind protection may be needed.`,
      severity: uv >= 8 || wind >= 25 ? "medium" : "normal",
    },
  ];
};

function Metric({ icon: Icon, label, value, detail }) {
  return (
    <article className="metric">
      <Icon className="metric-icon" aria-hidden="true" />
      <div>
        <p className="metric-label">{label}</p>
        <strong>{value}</strong>
        {detail && <span>{detail}</span>}
      </div>
    </article>
  );
}

function LoadingState() {
  return (
    <div className="loading-panel">
      <div className="loading-pulse" />
      <p>Loading live weather desk...</p>
    </div>
  );
}

export default function WeatherApp() {
  const [query, setQuery] = useState(DEFAULT_CITY);
  const [submittedCity, setSubmittedCity] = useState(DEFAULT_CITY);
  const [weatherData, setWeatherData] = useState(null);
  const [cityWeather, setCityWeather] = useState([]);
  const [activeDayIndex, setActiveDayIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [marketLoading, setMarketLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let ignore = false;

    async function fetchForecast() {
      setLoading(true);
      setError("");

      try {
        const response = await axios.get("https://api.weatherapi.com/v1/forecast.json", {
          params: {
            key: API_KEY,
            q: submittedCity,
            days: 3,
            alerts: "yes",
            aqi: "yes",
          },
        });

        if (!ignore) {
          setWeatherData(response.data);
          setActiveDayIndex(0);
        }
      } catch (err) {
        if (!ignore) {
          setWeatherData(null);
          setError("We could not load that forecast. Check the city name and try again.");
        }
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    fetchForecast();

    return () => {
      ignore = true;
    };
  }, [submittedCity]);

  useEffect(() => {
    let ignore = false;

    async function fetchMarkets() {
      setMarketLoading(true);

      try {
        const responses = await Promise.all(
          TRENDING_CITIES.map((city) =>
            axios.get("https://api.weatherapi.com/v1/current.json", {
              params: {
                key: API_KEY,
                q: city,
                aqi: "no",
              },
            })
          )
        );

        if (!ignore) {
          setCityWeather(responses.map((response) => response.data));
        }
      } catch (err) {
        if (!ignore) setCityWeather([]);
      } finally {
        if (!ignore) setMarketLoading(false);
      }
    }

    fetchMarkets();

    return () => {
      ignore = true;
    };
  }, []);

  const activeDay = weatherData?.forecast.forecastday[activeDayIndex];
  const visibleHours = useMemo(() => {
    if (!activeDay) return [];
    const nowEpoch = Math.floor(Date.now() / 1000);
    const hours = activeDay.hour.filter((hour) => hour.time_epoch >= nowEpoch);
    return (hours.length ? hours : activeDay.hour).slice(0, 8);
  }, [activeDay]);
  const briefing = useMemo(() => buildBriefing(weatherData), [weatherData]);
  const alerts = weatherData?.alerts?.alert || [];
  const tone = getWeatherTone(weatherData?.current.condition.text);
  const lastUpdated = weatherData?.current.last_updated
    ? formatDate(weatherData.current.last_updated.replace(" ", "T"), {
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
      })
    : "";

  const handleSubmit = (event) => {
    event.preventDefault();
    const city = query.trim();
    if (city) setSubmittedCity(city);
  };

  return (
    <main className={`weather-desk tone-${tone}`}>
      <header className="topbar">
        <a className="brand" href="#top" aria-label="PALtech Weather home">
          <span className="brand-mark">PW</span>
          <span>
            <strong>PALtech Weather</strong>
            <small>Forecast desk</small>
          </span>
        </a>
        <nav className="topnav" aria-label="Weather sections">
          <a href="#forecast">Forecast</a>
          <a href="#alerts">Alerts</a>
          <a href="#cities">Cities</a>
          <a href="#briefing">Briefing</a>
        </nav>
      </header>

      <section className="hero" id="top">
        <div
          className="hero-media"
          style={{
            backgroundImage: `url(${process.env.PUBLIC_URL}/stock-photo-photos-of-sky-during-different-weather-collage-banner-design-1899360634.jpg)`,
          }}
          aria-hidden="true"
        />
        <div className="hero-shade" />
        <div className="hero-content">
          <div className="kicker">
            <Radio size={16} />
            Live weather command center
          </div>
          <h1>Forecasts, alerts, and planning signals in one place.</h1>
          <p>
            Search any city for current conditions, hourly shifts, daily outlooks,
            alert coverage, and a concise newsroom-style weather briefing.
          </p>
          <form className="search-panel" onSubmit={handleSubmit}>
            <label htmlFor="city-search">Search city</label>
            <div>
              <Search aria-hidden="true" />
              <input
                id="city-search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="New York, Accra, Tokyo..."
                autoComplete="off"
              />
              <button type="submit" disabled={loading || !query.trim()}>
                {loading ? "Loading" : "Get forecast"}
              </button>
            </div>
          </form>
          {error && (
            <div className="error-banner" role="alert">
              <AlertTriangle size={18} />
              {error}
            </div>
          )}
        </div>
      </section>

      {loading && !weatherData ? (
        <LoadingState />
      ) : (
        weatherData && (
          <>
            <section className="current-grid" aria-label="Current weather">
              <article className="lead-panel">
                <div className="location-row">
                  <div>
                    <p className="section-label">Current conditions</p>
                    <h2>
                      {weatherData.location.name}
                      <span>{weatherData.location.region || weatherData.location.country}</span>
                    </h2>
                  </div>
                  <img
                    src={`https:${weatherData.current.condition.icon}`}
                    alt={weatherData.current.condition.text}
                  />
                </div>

                <div className="temperature-row">
                  <strong>{round(weatherData.current.temp_f)}°</strong>
                  <div>
                    <p>{weatherData.current.condition.text}</p>
                    <span>Feels like {round(weatherData.current.feelslike_f)}°F</span>
                  </div>
                </div>

                <div className="lead-summary">
                  <p>
                    Today reaches {round(activeDay.day.maxtemp_f)}° with a low near{" "}
                    {round(activeDay.day.mintemp_f)}°. Rain chance is{" "}
                    {activeDay.day.daily_chance_of_rain}% and max winds are near{" "}
                    {round(activeDay.day.maxwind_mph)} mph.
                  </p>
                </div>

                <div className="update-strip">
                  <Clock size={16} />
                  Updated {lastUpdated} local time
                </div>
              </article>

              <div className="metrics-grid">
                <Metric
                  icon={Wind}
                  label="Wind"
                  value={`${round(weatherData.current.wind_mph)} mph`}
                  detail={`${weatherData.current.wind_dir} gusts ${round(
                    weatherData.current.gust_mph
                  )} mph`}
                />
                <Metric
                  icon={Droplets}
                  label="Humidity"
                  value={`${weatherData.current.humidity}%`}
                  detail={`Dew point ${round(weatherData.current.dewpoint_f)}°`}
                />
                <Metric
                  icon={Eye}
                  label="Visibility"
                  value={`${round(weatherData.current.vis_miles)} mi`}
                  detail={`Cloud cover ${weatherData.current.cloud}%`}
                />
                <Metric
                  icon={Gauge}
                  label="Pressure"
                  value={`${round(weatherData.current.pressure_mb)} mb`}
                  detail={`Precip ${weatherData.current.precip_in}"`}
                />
                <Metric
                  icon={Thermometer}
                  label="UV index"
                  value={weatherData.current.uv}
                  detail={getUvLabel(weatherData.current.uv)}
                />
                <Metric
                  icon={Activity}
                  label="Air quality"
                  value={getAqiLabel(weatherData.current.air_quality?.["gb-defra-index"])}
                  detail={
                    weatherData.current.air_quality?.pm2_5
                      ? `PM2.5 ${round(weatherData.current.air_quality.pm2_5)}`
                      : "AQI unavailable"
                  }
                />
              </div>
            </section>

            <section className="content-layout">
              <div className="main-column">
                <section className="panel" id="forecast">
                  <div className="panel-heading">
                    <div>
                      <p className="section-label">Forecast timeline</p>
                      <h2>Hourly outlook</h2>
                    </div>
                    <span>{formatDate(activeDay.date, { weekday: "long", month: "short", day: "numeric" })}</span>
                  </div>

                  <div className="day-tabs" role="tablist" aria-label="Forecast days">
                    {weatherData.forecast.forecastday.map((day, index) => (
                      <button
                        key={day.date}
                        className={activeDayIndex === index ? "active" : ""}
                        onClick={() => setActiveDayIndex(index)}
                        type="button"
                      >
                        <span>
                          {index === 0
                            ? "Today"
                            : formatDate(day.date, { weekday: "short" })}
                        </span>
                        <strong>
                          {round(day.day.maxtemp_f)}° / {round(day.day.mintemp_f)}°
                        </strong>
                      </button>
                    ))}
                  </div>

                  <div className="hourly-strip">
                    {visibleHours.map((hour) => (
                      <article key={hour.time_epoch} className="hour-card">
                        <time>{formatHour(hour.time.replace(" ", "T"))}</time>
                        <img src={`https:${hour.condition.icon}`} alt={hour.condition.text} />
                        <strong>{round(hour.temp_f)}°</strong>
                        <span>{hour.chance_of_rain}% rain</span>
                      </article>
                    ))}
                  </div>
                </section>

                <section className="panel">
                  <div className="panel-heading">
                    <div>
                      <p className="section-label">Daily planning</p>
                      <h2>Three-day forecast</h2>
                    </div>
                    <CalendarDays aria-hidden="true" />
                  </div>

                  <div className="daily-list">
                    {weatherData.forecast.forecastday.map((day) => (
                      <article key={day.date} className="daily-row">
                        <div className="daily-date">
                          <strong>{formatDate(day.date, { weekday: "long" })}</strong>
                          <span>{formatDate(day.date, { month: "short", day: "numeric" })}</span>
                        </div>
                        <div className="daily-condition">
                          <img src={`https:${day.day.condition.icon}`} alt={day.day.condition.text} />
                          <span>{day.day.condition.text}</span>
                        </div>
                        <div className="daily-range" aria-label="Temperature range">
                          <span>{round(day.day.mintemp_f)}°</span>
                          <div>
                            <i
                              style={{
                                width: `${Math.max(
                                  18,
                                  Math.min(100, day.day.maxtemp_f - day.day.mintemp_f + 42)
                                )}%`,
                              }}
                            />
                          </div>
                          <strong>{round(day.day.maxtemp_f)}°</strong>
                        </div>
                        <div className="daily-extra">
                          <span>
                            <Umbrella size={15} /> {day.day.daily_chance_of_rain}%
                          </span>
                          <span>
                            <Wind size={15} /> {round(day.day.maxwind_mph)} mph
                          </span>
                        </div>
                      </article>
                    ))}
                  </div>
                </section>

                <section className="panel map-panel">
                  <div className="panel-heading">
                    <div>
                      <p className="section-label">Weather map</p>
                      <h2>Regional signal board</h2>
                    </div>
                    <Compass aria-hidden="true" />
                  </div>
                  <div
                    className="map-board"
                    style={{
                      backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.78), rgba(255, 255, 255, 0.78)), url(${process.env.PUBLIC_URL}/weather-banner-vector.jpg)`,
                    }}
                  >
                    <div className="map-point primary">
                      <MapPin size={18} />
                      {weatherData.location.name}
                    </div>
                    <div className="map-rings" />
                    <div className="map-data">
                      <span>Lat {weatherData.location.lat}</span>
                      <span>Lon {weatherData.location.lon}</span>
                      <span>Local {weatherData.location.localtime}</span>
                    </div>
                  </div>
                </section>
              </div>

              <aside className="side-column">
                <section className="panel alert-panel" id="alerts">
                  <div className="panel-heading">
                    <div>
                      <p className="section-label">Severe weather</p>
                      <h2>Active alerts</h2>
                    </div>
                    <ShieldAlert aria-hidden="true" />
                  </div>
                  {alerts.length ? (
                    <div className="alert-list">
                      {alerts.slice(0, 3).map((alert) => (
                        <article key={`${alert.event}-${alert.effective}`} className="alert-item">
                          <strong>{alert.event}</strong>
                          <span>{alert.headline}</span>
                          <p>{alert.desc}</p>
                        </article>
                      ))}
                    </div>
                  ) : (
                    <div className="quiet-alert">
                      <ShieldAlert size={28} />
                      <p>No active severe weather alerts for this location.</p>
                    </div>
                  )}
                </section>

                <section className="panel" id="briefing">
                  <div className="panel-heading">
                    <div>
                      <p className="section-label">Newsroom briefing</p>
                      <h2>What matters now</h2>
                    </div>
                    <Newspaper aria-hidden="true" />
                  </div>
                  <div className="briefing-list">
                    {briefing.map((item) => (
                      <article key={item.title} className={`briefing-item ${item.severity}`}>
                        <strong>{item.title}</strong>
                        <p>{item.body}</p>
                      </article>
                    ))}
                  </div>
                </section>

                <section className="panel sun-panel">
                  <div className="sun-times">
                    <div>
                      <Sunrise />
                      <span>Sunrise</span>
                      <strong>{activeDay.astro.sunrise}</strong>
                    </div>
                    <div>
                      <Sunset />
                      <span>Sunset</span>
                      <strong>{activeDay.astro.sunset}</strong>
                    </div>
                  </div>
                  <div className="moon-phase">
                    <span>Moon phase</span>
                    <strong>{activeDay.astro.moon_phase}</strong>
                  </div>
                </section>
              </aside>
            </section>

            <section className="city-section panel" id="cities">
              <div className="panel-heading">
                <div>
                  <p className="section-label">Major city watch</p>
                  <h2>Travel and business hubs</h2>
                </div>
                <Navigation aria-hidden="true" />
              </div>

              {marketLoading ? (
                <div className="city-grid loading-cities">
                  {TRENDING_CITIES.map((city) => (
                    <div key={city} className="city-card skeleton" />
                  ))}
                </div>
              ) : (
                <div className="city-grid">
                  {cityWeather.map((city) => (
                    <article key={city.location.name} className="city-card">
                      <div>
                        <strong>{city.location.name}</strong>
                        <span>{city.location.country}</span>
                      </div>
                      <img
                        src={`https:${city.current.condition.icon}`}
                        alt={city.current.condition.text}
                      />
                      <p>{round(city.current.temp_f)}°</p>
                      <small>{city.current.condition.text}</small>
                    </article>
                  ))}
                </div>
              )}
            </section>

            <section className="news-section" aria-label="Weather news">
              <div className="news-heading">
                <p className="section-label">Weather news</p>
                <h2>Latest planning angles</h2>
              </div>
              <div className="story-grid">
                {topStories.map((story) => (
                  <article key={story.title} className="story-card">
                    <span>{story.label}</span>
                    <h3>{story.title}</h3>
                    <p>{story.summary}</p>
                  </article>
                ))}
              </div>
            </section>
          </>
        )
      )}

      <footer className="site-footer">
        <span>Data: WeatherAPI.com</span>
        <span>Forecasts update from live API responses. Weather news briefs are editorial summaries generated from available conditions and alerts.</span>
      </footer>
    </main>
  );
}
