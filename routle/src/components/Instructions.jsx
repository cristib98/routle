import React, { useEffect } from "react";
import "./Modal.css";
import "./Instructions.css";

const Instructions = ({ onClose }) => {
  // Add escape key handler
  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    // Add event listener
    document.addEventListener("keydown", handleEscKey);

    // Cleanup
    return () => {
      document.removeEventListener("keydown", handleEscKey);
    };
  }, [onClose]);

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>How to Play Routle</h2>
          <button className="close-button" onClick={onClose}>
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
        </div>

        <div className="instructions-content">
          <p className="intro-text">
            Routle is a daily country guessing game. You start with a known
            country and must discover the mystery target country using hints!
          </p>

          <div className="instruction-step">
            <div className="step-number">1</div>
            <div className="step-content">
              <h3>Starting Point</h3>
              <p>
                Each day features a new pair of countries. One country is
                revealed to you as your starting point.
              </p>
            </div>
          </div>

          <div className="instruction-step">
            <div className="step-number">2</div>
            <div className="step-content">
              <h3>Make Your Guesses</h3>
              <p>
                You have 10 attempts to find the target country. Select
                countries on the map or use the search field to make your
                guesses.
              </p>
              <ul className="guess-results">
                <li>
                  <span className="dot green"></span> Correct guess will be
                  green on the map
                </li>
                <li>
                  <span className="dot red"></span> Incorrect guesses will be
                  red on the map
                </li>
              </ul>
            </div>
          </div>

          <div className="instruction-step">
            <div className="step-number">3</div>
            <div className="step-content">
              <h3>Get Progressive Hints</h3>
              <p>
                Each incorrect guess reveals a new hint about the target
                country, such as:
              </p>
              <div className="hint-examples">
                <div className="hint-example">
                  <span className="hint-icon">✈️</span>
                  <span className="hint-text">Flight Time</span>
                </div>
                <div className="hint-example">
                  <span className="hint-icon">🧭</span>
                  <span className="hint-text">Direction</span>
                </div>
                <div className="hint-example">
                  <span className="hint-icon">🌡️</span>
                  <span className="hint-text">Temperature</span>
                </div>
                <div className="hint-example">
                  <span className="hint-icon">🕒</span>
                  <span className="hint-text">Time Zone</span>
                </div>
                <div className="hint-example">
                  <span className="hint-icon">📏</span>
                  <span className="hint-text">Distance</span>
                </div>
              </div>
            </div>
          </div>

          <div className="instruction-step">
            <div className="step-number">4</div>
            <div className="step-content">
              <h3>Win the Game</h3>
              <p>Find the target country within 10 guesses to win!</p>
              <p>A new Routle challenge is available each day.</p>
            </div>
          </div>

          <div className="example-section">
            <h3>Example</h3>
            <div className="example-game">
              <div className="example-countries">
                <div className="example-country start">
                  <div className="country-dot known"></div>
                  <div className="country-name">France</div>
                </div>
                <div className="example-arrow">→</div>
                <div className="example-country end">
                  <div className="country-dot target"></div>
                  <div className="country-name">?</div>
                </div>
              </div>

              <div className="example-guesses">
                <div className="example-guess">
                  <div className="guess-number">1</div>
                  <div className="guess-country">Germany</div>
                  <div className="guess-result wrong">❌</div>
                  <div className="guess-hint">Hint: 3 hours flight time</div>
                </div>
                <div className="example-guess">
                  <div className="guess-number">2</div>
                  <div className="guess-country">Turkey</div>
                  <div className="guess-result wrong">❌</div>
                  <div className="guess-hint">Hint: Look South from France</div>
                </div>
                <div className="example-guess">
                  <div className="guess-number">3</div>
                  <div className="guess-country">Spain</div>
                  <div className="guess-result wrong">❌</div>
                  <div className="guess-hint">Hint: 4°C warmer than France</div>
                </div>
                <div className="example-guess">
                  <div className="guess-number">4</div>
                  <div className="guess-country">Morocco</div>
                  <div className="guess-result correct">✓</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button className="primary-button" onClick={onClose}>
            Got it
          </button>
        </div>
      </div>
    </div>
  );
};

export default Instructions;
