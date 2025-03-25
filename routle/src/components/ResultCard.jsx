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

      <div className="result-content">
        <div className="result-header">
          {onClose && (
            <button
              className="close-button"
              onClick={onClose}
              aria-label="Close"
            >
              <svg
                viewBox="0 0 24 24"
                width="24"
                height="24"
                stroke="currentColor"
                strokeWidth="2"
                fill="none"
              >
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          )}

          {won ? (
            <>
              <div className="result-emoji" aria-hidden="true">
                🎉
              </div>
              <h2 className="result-title success">You Found It!</h2>
              <div className="result-subtitle">
                <span className="guess-score">
                  <span className="guess-count">{guessCount}</span>
                  <span className="guess-divider">/</span>
                  <span className="max-guesses">{maxGuesses}</span>
                </span>
                <span className="guess-text">guesses</span>
              </div>
            </>
          ) : (
            <>
              <div className="result-emoji" aria-hidden="true">
                😢
              </div>
              <h2 className="result-title failure">Better Luck Next Time</h2>
              <div className="result-subtitle">
                <span>The country was </span>
                <span className="target-country">
                  {typeof targetCountry === "object" ? (
                    <>
                      <span className="country-flag">{targetCountry.flag}</span>
                      <span className="country-name">{targetCountry.name}</span>
                    </>
                  ) : (
                    targetCountry
                  )}
                </span>
              </div>
            </>
          )}
        </div>

        <div className="result-journey">
          <div className="journey-from">
            <div className="journey-flag">
              {typeof knownCountry === "object" ? knownCountry.flag : "🏁"}
            </div>
            <div className="journey-name">
              {typeof knownCountry === "object"
                ? knownCountry.name
                : knownCountry}
            </div>
          </div>

          <div className="journey-path">
            <div className="journey-line"></div>
            <div className="journey-plane">✈️</div>
          </div>

          <div className="journey-to">
            <div className="journey-flag">
              {typeof targetCountry === "object" ? targetCountry.flag : "🏁"}
            </div>
            <div className="journey-name">
              {typeof targetCountry === "object"
                ? targetCountry.name
                : targetCountry}
            </div>
          </div>
        </div>

        <div className="result-stats">
          <div className="guess-distribution">
            {[...Array(maxGuesses)].map((_, i) => (
              <div
                key={i}
                className={`guess-bar ${
                  i + 1 === guessCount && won ? "correct" : ""
                } ${i + 1 < guessCount ? "used" : ""}`}
              >
                {i + 1 === guessCount && won && "✓"}
                {i + 1 < guessCount && "✗"}
              </div>
            ))}
          </div>
        </div>

        <div className="next-puzzle">
          <div className="next-label">Next Routle in</div>
          <div className="countdown">{timeUntilNext}</div>
        </div>

        <div className="result-actions">
          <button className="share-button" onClick={shareResults}>
            {copied ? (
              <>
                <span className="share-icon">✓</span>
                <span>Copied!</span>
              </>
            ) : (
              <>
                <span className="share-icon">📋</span>
                <span>Share Results</span>
              </>
            )}
          </button>

          {onClose && (
            <button className="close-button-main" onClick={onClose}>
              Close
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResultCard;
