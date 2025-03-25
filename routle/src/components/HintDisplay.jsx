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
      case "temperature":
        return "🌡️";
      case "timezone":
        return "⏰";
      default:
        return "💡";
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
        <span className="hint-icon">{getHintIcon(hint.type)}</span>
        <span className="hint-text">
          <span className="hint-type">{hint.type}:</span> {hintValue}
        </span>
      </>
    );
  };

  if (!hints || hints.length === 0) {
    return null;
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
