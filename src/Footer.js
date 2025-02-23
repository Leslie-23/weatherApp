import React from "react";

const Footer = () => {
  const date = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white mt-24 py-4 text-center">
      <p>© {date} palTech.co</p>
      <div className="flex justify-center space-x-6 mt-3">
        {["Home", "About", "Services", "Contact"].map((item) => (
          <a key={item} href="#" className="text-blue-400 hover:text-blue-600">
            {item}
          </a>
        ))}
      </div>
    </footer>
  );
};

export default Footer;
