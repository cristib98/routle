import React, { useEffect, useState } from "react";
import "./HintDisplay.css";

const HintDisplay = ({ hints = [] }) => {
  const [animatedHints, setAnimatedHints] = useState([]);

  useEffect(() => {
    // Animate hints in sequence
    if (hints.length > 0) {
      const timers = [];
      hints.forEach((hint, index) => {
        const timer = setTimeout(() => {
          setAnimatedHints((prev) => [...prev, index]);
        }, index * 300); // 300ms delay between each hint
        timers.push(timer);
      });

      return () => {
        timers.forEach((timer) => clearTimeout(timer));
      };
    }
  }, [hints]);

  const getHintIcon = (type) => {
    switch (type) {
      case "distance":
        return "📏";
      case "direction":
        return "🧭";
      case "hemisphere":
        return "🌐";
      case "continent":
        return "🗺️";
      case "region":
        return "🌍";
      case "temperature":
        return "🌡️";
      case "timezone":
        return "🕒";
      case "population":
        return "👥";
      case "geography":
        return "🌊";
      case "area":
        return "📐";
      case "language":
        return "🗣️";
      case "capital":
        return "🏛️";
      case "flag":
        return "🚩";
      case "currency":
        return "💰";
      case "name":
        return "🔤";
      default:
        return "💡";
    }
  };

  const getHintColor = (type) => {
    switch (type) {
      case "distance":
        return "#4caf50"; // Green
      case "direction":
        return "#2196f3"; // Blue
      case "hemisphere":
        return "#9c27b0"; // Purple
      case "continent":
      case "region":
        return "#ff9800"; // Orange
      case "temperature":
        return "#f44336"; // Red
      case "timezone":
        return "#009688"; // Teal
      case "population":
        return "#3f51b5"; // Indigo
      case "geography":
        return "#00bcd4"; // Cyan
      case "area":
        return "#795548"; // Brown
      case "language":
        return "#673ab7"; // Deep Purple
      case "capital":
        return "#ff5722"; // Deep Orange
      case "flag":
        return "#e91e63"; // Pink
      case "currency":
        return "#ffc107"; // Amber
      case "name":
        return "#607d8b"; // Blue Grey
      default:
        return "#9e9e9e"; // Grey
    }
  };

  const getHintContent = (hint) => {
    if (!hint) {
      console.error("Invalid hint:", hint);
      return <span className="hint-error">Invalid hint data</span>;
    }

    // Handle both formats (text from generateHint and value from localStorage)
    const hintValue = hint.value !== undefined ? hint.value : hint.text;

    if (!hint.type || !hintValue) {
      console.error("Invalid hint format:", hint);
      return <span className="hint-error">Invalid hint data</span>;
    }

    return (
      <>
        <div className="hint-icon-wrapper">
          <span className="hint-icon">{getHintIcon(hint.type)}</span>
        </div>
        <div className="hint-content">
          <span className="hint-type">{hint.type}</span>
          <span className="hint-text">{hintValue}</span>
        </div>
      </>
    );
  };

  if (!hints || hints.length === 0) {
    return (
      <div className="hints-container empty">
        <p className="no-hints-message">Make a guess to get a hint!</p>
      </div>
    );
  }

  return (
    <div className="hints-container">
      <h3 className="hints-title">Hints</h3>
      <div className="hints-list">
        {hints.map((hint, index) => (
          <div
            key={index}
            className={`hint-item ${
              animatedHints.includes(index) ? "animate" : ""
            }`}
            style={{
              borderLeftColor: getHintColor(hint.type),
              animationDelay: `${index * 0.1}s`,
            }}
            data-hint-type={hint.type}
          >
            {getHintContent(hint)}
          </div>
        ))}
      </div>
    </div>
  );
};

export default HintDisplay;
