import React, { useState, useEffect } from "react";
import "./ResultCard.css";

const ResultCard = ({
  status,
  guessCount,
  maxGuesses,
  knownCountry,
  targetCountry,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);
  const [timeUntilNext, setTimeUntilNext] = useState("");
  const won = status === "won";
  const [showConfetti, setShowConfetti] = useState(won);

  // Add escape key handler
  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === "Escape" && onClose) {
        onClose();
      }
    };

    // Add event listener
    document.addEventListener("keydown", handleEscKey);

    return () => {
      document.removeEventListener("keydown", handleEscKey);
    };
  }, [onClose]);

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);

      const diff = tomorrow - now;
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeUntilNext(
        `${hours.toString().padStart(2, "0")}:${minutes
          .toString()
          .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
      );
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);

    // Hide confetti after a few seconds
    if (won) {
      const timer = setTimeout(() => {
        setShowConfetti(false);
      }, 5000);
      return () => {
        clearInterval(interval);
        clearTimeout(timer);
      };
    }

    return () => clearInterval(interval);
  }, [won]);

  const shareResults = () => {
    const date = new Date().toLocaleDateString();
    const guessSymbols = [];

    for (let i = 0; i < maxGuesses; i++) {
      if (i < guessCount - 1) {
        guessSymbols.push("❌"); // Wrong guesses
      } else if (i === guessCount - 1 && won) {
        guessSymbols.push("✅"); // Correct guess
      } else {
        guessSymbols.push("⬜"); // Unused guesses
      }
    }

    // Get the country names as strings
    const knownCountryName =
      typeof knownCountry === "object" ? knownCountry.name : knownCountry;
    const knownCountryFlag =
      typeof knownCountry === "object" ? knownCountry.flag : "";
    const targetCountryName =
      typeof targetCountry === "object" ? targetCountry.name : targetCountry;
    const targetCountryFlag =
      typeof targetCountry === "object" ? targetCountry.flag : "";

    const shareText = `Routle - ${date}\n${knownCountryFlag} ${knownCountryName} ✈️ ${targetCountryFlag} ${targetCountryName}\n${guessSymbols.join(
      ""
    )}\n${won ? `${guessCount}/${maxGuesses}` : "X/6"}\nPlay at routle.io`;

    if (navigator.clipboard) {
      navigator.clipboard
        .writeText(shareText)
        .then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        })
        .catch((err) => {
          console.error("Could not copy text: ", err);
        });
    } else {
      // Fallback for browsers that don't support the clipboard API
      const textArea = document.createElement("textarea");
      textArea.value = shareText;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="result-card">
      {showConfetti && (
        <div className="confetti-container">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="confetti"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                backgroundColor: [
                  "#4361ee",
                  "#3a56d4",
                  "#4895ef",
                  "#f72585",
                  "#4ade80",
                  "#fbbf24",
                ][Math.floor(Math.random() * 6)],
              }}
            ></div>
          ))}
        </div>
      )}

      <div className="result-header">
        <h2>{status === "won" ? "You found it!" : "Better luck next time"}</h2>
        <button className="close-button" onClick={onClose}>
          ×
        </button>
      </div>

      <div className="result-content">
        <div className="result-journey">
          <div className="country-card start">
            <div className="country-flag">{knownCountry.flag}</div>
            <div className="country-name">{knownCountry.name}</div>
          </div>

          <div className="journey-arrow">
            <span>→</span>
          </div>

          <div className="country-card end">
            <div className="country-flag">{targetCountry.flag}</div>
            <div className="country-name">{targetCountry.name}</div>
          </div>
        </div>

        <div className="result-stats">
          <div className="stat-item">
            <span className="stat-label">Distance</span>
            <span className="stat-value">
              {Math.round(getDistance(knownCountry, targetCountry))} km
            </span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Time Zone Difference</span>
            <span className="stat-value">
              {getTimezoneDifference(knownCountry, targetCountry)}
            </span>
          </div>
        </div>
      </div>

      <div className="result-footer">
        <p className="next-game">
          Next Routle in <span className="countdown">{formatTime()}</span>
        </p>
        <button className="close-result-button" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
};

// Helper functions for calculations
const getDistance = (country1, country2) => {
  // Simple placeholder - you may already have this function implemented elsewhere
  return 5731; // Example distance
};

const getTimezoneDifference = (country1, country2) => {
  // Simple placeholder - you may already have this function implemented elsewhere
  return "1 hour";
};

const formatTime = () => {
  // Return the time in HH:MM:SS format (placeholder)
  return "08:26:36";
};

export default ResultCard;
