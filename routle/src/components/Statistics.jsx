import React, { useEffect, useState } from "react";
import "./Modal.css";
import "./Statistics.css";

const Statistics = ({ onClose }) => {
  const [stats, setStats] = useState({
    gamesPlayed: 0,
    gamesWon: 0,
    currentStreak: 0,
    maxStreak: 0,
    guessDistribution: [0, 0, 0, 0, 0, 0],
    lastPlayed: null,
    lastWon: null,
  });

  useEffect(() => {
    // Load stats from localStorage
    const savedStats = localStorage.getItem("routleStats");
    if (savedStats) {
      setStats(JSON.parse(savedStats));
    }
  }, []);

  const renderGuessDistribution = () => {
    const maxGuesses = Math.max(...stats.guessDistribution, 1);

    return (
      <div className="guess-distribution">
        {stats.guessDistribution.map((count, index) => (
          <div className="distribution-row" key={index}>
            <div className="guess-label">{index + 1}</div>
            <div className="guess-bar-container">
              <div
                className="guess-bar"
                style={{
                  width: `${(count / maxGuesses) * 100}%`,
                  backgroundColor:
                    count > 0 ? "var(--color-primary)" : "var(--color-border)",
                }}
              >
                {count > 0 && <span className="guess-count">{count}</span>}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Never";

    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const calculateWinRate = () => {
    if (stats.gamesPlayed === 0) return 0;
    return Math.round((stats.gamesWon / stats.gamesPlayed) * 100);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Statistics</h2>
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

        <div className="statistics-content">
          <div className="stats-summary">
            <div className="stat-box">
              <div className="stat-value">{stats.gamesPlayed}</div>
              <div className="stat-label">Played</div>
            </div>

            <div className="stat-box">
              <div className="stat-value">{calculateWinRate()}%</div>
              <div className="stat-label">Win Rate</div>
            </div>

            <div className="stat-box">
              <div className="stat-value">{stats.currentStreak}</div>
              <div className="stat-label">Current Streak</div>
            </div>

            <div className="stat-box">
              <div className="stat-value">{stats.maxStreak}</div>
              <div className="stat-label">Max Streak</div>
            </div>
          </div>

          <div className="stats-section">
            <h3>Guess Distribution</h3>
            {stats.gamesPlayed > 0 ? (
              renderGuessDistribution()
            ) : (
              <div className="no-data-message">
                Play your first game to see your guess distribution!
              </div>
            )}
          </div>

          <div className="stats-section">
            <h3>Last Played</h3>
            <p className="date-info">{formatDate(stats.lastPlayed)}</p>
          </div>

          <div className="share-section">
            <p>Share your stats with friends!</p>
            <button
              className="share-button"
              onClick={() => {
                const text = `🛫 Routle Stats 🛬\n
Played: ${stats.gamesPlayed} | Win Rate: ${calculateWinRate()}%
Current Streak: ${stats.currentStreak} | Max Streak: ${stats.maxStreak}
\nGuess the daily flight route at routle.app`;

                if (navigator.share) {
                  navigator
                    .share({
                      title: "My Routle Stats",
                      text,
                    })
                    .catch((err) => console.error("Share failed:", err));
                } else {
                  navigator.clipboard
                    .writeText(text)
                    .then(() => alert("Stats copied to clipboard!"))
                    .catch((err) => console.error("Copy failed:", err));
                }
              }}
            >
              <svg
                viewBox="0 0 24 24"
                width="16"
                height="16"
                stroke="currentColor"
                strokeWidth="2"
                fill="none"
              >
                <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path>
                <polyline points="16 6 12 2 8 6"></polyline>
                <line x1="12" y1="2" x2="12" y2="15"></line>
              </svg>
              Share Stats
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Statistics;
