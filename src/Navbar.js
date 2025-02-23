import React, { useState } from "react";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="bg-black text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <a href="#" className="text-green-500 text-2xl font-bold">
          PALtech Weather
        </a>
        <div className="hidden md:flex space-x-6">
          {["Home", "About", "Services", "Contact"].map((item) => (
            <a key={item} href="#" className="hover:text-green-500">
              {item}
            </a>
          ))}
        </div>
        <button
          className="md:hidden focus:outline-none"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          ☰
        </button>
      </div>
      {menuOpen && (
        <div className="md:hidden bg-gray-800 p-4">
          {["Home", "About", "Services", "Contact"].map((item) => (
            <a
              key={item}
              href="#"
              className="block text-white py-2 hover:text-green-500"
            >
              {item}
            </a>
          ))}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
