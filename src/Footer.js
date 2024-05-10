import React from "react";
import styled, { keyframes } from "styled-components";

// Define keyframes for the animation
const moveUp = keyframes`
    0% {
        transform: translateY(0);
    }
    50% {
        transform: translateY(-10px);
    }
    100% {
        transform: translateY(0);
    }
`;

// Styled components for the footer and animated link
const FooterWrapper = styled.footer`
  background-color: #333;
  color: #fff;
  padding: 20px 0;
  text-align: center;
`;

const AnimatedLink = styled.a`
  color: #fff;
  text-decoration: none;
  margin-right: 20px;
  transition: color 0.3s ease;
  animation: ${moveUp} 1s ease-in-out infinite;
`;
const date = new Date().getFullYear();

const Footer = () => {
  return (
    <FooterWrapper>
      <div className="footer-content">
        <p>© {date} palTech.co</p>
        <div className="footer-links">
          <AnimatedLink href="#">Home</AnimatedLink>
          <AnimatedLink href="#">About</AnimatedLink>
          <AnimatedLink href="#">Services</AnimatedLink>
          <AnimatedLink href="#">Contact</AnimatedLink>
        </div>
      </div>
    </FooterWrapper>
  );
};

export default Footer;
