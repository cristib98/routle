import React from "react";
import "./Header.css";

const Header = ({ onOpenInstructions, onOpenStats }) => {
  return (
    <header className="app-header">
      <div className="header-left">
        <div className="app-title">
          <span className="title-text">Routle</span>
          <div className="airplane-container">
            <span className="airplane-icon">✈️</span>
          </div>
        </div>
        <p className="app-subtitle">The Country Discovery Game</p>
      </div>

      <div className="header-right">
        <button
          className="icon-button"
          onClick={onOpenInstructions}
          aria-label="Instructions"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="24"
            height="24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="16" x2="12" y2="12" />
            <line x1="12" y1="8" x2="12.01" y2="8" />
          </svg>
        </button>

        <button
          className="icon-button"
          onClick={onOpenStats}
          aria-label="Statistics"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="24"
            height="24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="20" x2="18" y2="10" />
            <line x1="12" y1="20" x2="12" y2="4" />
            <line x1="6" y1="20" x2="6" y2="14" />
          </svg>
        </button>
      </div>
    </header>
  );
};

export default Header;
