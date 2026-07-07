import React, { useState } from "react";
import { Menu, X, Cloud, CloudRain, Sun, CloudSnow } from "lucide-react";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const navItems = [
    { name: "Home", icon: Sun },
    { name: "Forecast", icon: CloudRain },
    { name: "Maps", icon: Cloud },
    { name: "Alerts", icon: CloudSnow },
    { name: "About", icon: Sun },
  ];

  return (
    <nav className="bg-black text-white shadow-2xl sticky top-0 z-50">
      {/* Main Navbar */}
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          {/* Logo/Brand */}
          <div className="flex items-center space-x-3 group cursor-pointer">
            <div className="bg-white/20 p-2 rounded-xl group-hover:bg-white/30 transition-all duration-300">
              <Cloud className="h-8 w-8 text-cyan-300 animate-float" />
            </div>
            <div>
              <h1 className="text-2xl font-bold ">PALtech Weather</h1>
              <p className="text-xs text-cyan-200 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                Accurate forecasts, beautiful insights
              </p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => {
              const IconComponent = item.icon;
              return (
                <a
                  key={item.name}
                  href="#"
                  className="flex items-center space-x-2 px-4 py-3 rounded-xl transition-all duration-300 hover:bg-white/10 hover:scale-105 group"
                >
                  <IconComponent className="h-5 w-5 text-cyan-300 group-hover:text-green-300 transition-colors" />
                  <span className="font-medium group-hover:text-cyan-100">
                    {item.name}
                  </span>
                </a>
              );
            })}
            <button className="ml-4 bg-gradient-to-r from-green-400 to-cyan-400 text-gray-900 px-6 py-3 rounded-xl font-semibold hover:from-green-300 hover:to-cyan-300 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-cyan-500/25">
              Get App
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden bg-white/10 p-3 rounded-xl hover:bg-white/20 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-cyan-300"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? (
              <X className="h-6 w-6 text-cyan-300" />
            ) : (
              <Menu className="h-6 w-6 text-cyan-300" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div
        className={`lg:hidden bg-gradient-to-b from-blue-800/95 to-cyan-800/95 backdrop-blur-lg transition-all duration-500 ease-in-out ${
          menuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        } overflow-hidden`}
      >
        <div className="container mx-auto px-4 py-4">
          <div className="space-y-2">
            {navItems.map((item) => {
              const IconComponent = item.icon;
              return (
                <a
                  key={item.name}
                  href="#"
                  className="flex items-center space-x-3 px-4 py-4 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-300 group border border-white/5 hover:border-cyan-400/30"
                  onClick={() => setMenuOpen(false)}
                >
                  <IconComponent className="h-5 w-5 text-cyan-300 group-hover:text-green-300 transition-colors" />
                  <span className="font-medium text-white group-hover:text-cyan-100">
                    {item.name}
                  </span>
                </a>
              );
            })}
            <button className="w-full bg-gradient-to-r from-green-400 to-cyan-400 text-gray-900 px-6 py-4 rounded-xl font-semibold hover:from-green-300 hover:to-cyan-300 transition-all duration-300 mt-4 shadow-lg">
              Download Weather App
            </button>
          </div>
        </div>
      </div>

      {/* Weather Status Bar */}
      <div className="bg-black/30 backdrop-blur-sm border-t border-cyan-500/20">
        <div className="container mx-auto px-4 py-2">
          <div className="flex justify-between items-center text-sm">
            <div className="flex items-center space-x-4">
              <span className="text-cyan-300">📍 Current Location</span>
              <span className="text-green-300">🌡️ 72°F</span>
              <span className="text-blue-300">💨 5 mph</span>
            </div>
            <div className="hidden md:block">
              <span className="text-cyan-200">Updated just now</span>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
