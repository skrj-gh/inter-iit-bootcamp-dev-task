// src/components/Hero/Hero.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo_lazarus.png'; // Import the logo image
import './hero.css'; // Import the combined CSS

const Hero = () => {
  return (
    <div className="hero-container">
      <nav className="navbar">
        <div className="navbar-logo">
          <Link to="/">
            <img src={logo} alt="Logo" />
          </Link>
        </div>
        <ul className="navbar-links">
          <li><Link to="/">Home</Link></li>
          <li><Link to="/login">Login</Link></li>
        </ul>
      </nav>

      <div className="hero-content">
        <h1>Welcome to LazarusAi</h1>
        <div className='grid-container'>
            <div className="item2">
                <h3>Smarter Conersations,<br /> Powered by AI</h3>
                <div>

                <p>Experience seamless interactions with LazarusAi. Whether you're looking for quick answers or deeper discussions, our AI adapts to your needs in real time.</p>
                </div>
            </div>
            <div className="item1">
                <h3>Share Code Effortlessly</h3>
                <div>

                <p>Simplify code sharing with LazarusAi—syntax highlighting and one-click copy for effortless collaboration.</p>
                </div>
            </div>
            <div className="item3">
                <h3>Talk, Don't Type</h3>
                <div>

                <p>Talk, don't type! Use LazarusAi's voice chat to convert speech to text and hear AI responses effortlessly.</p>
                </div>
            </div>
        </div>
        <Link to="/login" className="hero-login-button">
        Get Started with Google Login
        </Link>
      </div>
    </div>
  );
};

export default Hero;