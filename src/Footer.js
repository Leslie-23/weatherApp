import React from "react";
//import styled, { keyframes } from "styled-components";
import "./Footer.css";
const date = new Date().getFullYear();

const Footer = () => {
  return (
    // <div className="wavy-border"></div>
    <div className="footer ">
      <p>© {date} palTech.co</p>
      <div className="footer-links">
        <a className="footer-link" href="#">
          Home
        </a>
        <a className="footer-link" href="#">
          About
        </a>
        <a className="footer-link" href="#">
          Services
        </a>
        <a className="footer-link" href="#">
          Contact
        </a>
      </div>
    </div>
  );
};

export default Footer;
