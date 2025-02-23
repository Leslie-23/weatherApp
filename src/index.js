import React from "react";
import ReactDOM from "react-dom/client";
import Navbar from "./Navbar";
import App from "./App";
import DisplayCountriesWeather from "./DisplayCountries";
import Footer from "./Footer";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Navbar />
    <App />
    <DisplayCountriesWeather />
    <Footer />
  </React.StrictMode>
);
