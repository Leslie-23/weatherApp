export const WEATHER_API_KEY = process.env.REACT_APP_WEATHER_API_KEY?.trim() || "";

export const WEATHER_API_KEY_ERROR =
  "Missing REACT_APP_WEATHER_API_KEY. Add it to .env.local and restart the app.";
