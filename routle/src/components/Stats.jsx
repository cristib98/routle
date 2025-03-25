import React, { useEffect, useState } from "react";
import "./Modal.css";
import "./Stats.css";

const Stats = ({ onClose, gameStats }) => {
  const [animateStats, setAnimateStats] = useState(false);

  // Sample stats for development (replace with actual stats later)
  const stats = gameStats || {
    gamesPlayed: 24,
    gamesWon: 19,
    currentStreak: 5,
    maxStreak: 8,
    guessDistribution: [3, 7, 6, 2, 1, 0],
  };

  const winPercentage = stats.gamesPlayed
    ? Math.round((stats.gamesWon / stats.gamesPlayed) * 100)
    : 0;

  // Find the max value in guess distribution for scaling the bars
  const maxDistribution = Math.max(...stats.guessDistribution, 1);

  useEffect(() => {
    // Trigger animation after component mounts
    const timer = setTimeout(() => {
      setAnimateStats(true);
    }, 100);

    // Add escape key handler
    const handleEscKey = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    // Add event listener
    document.addEventListener("keydown", handleEscKey);

    return () => {
      clearTimeout(timer);
      document.removeEventListener("keydown", handleEscKey);
    };
  }, [onClose]);

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

        <div className="stats-content">
          <div className="stats-summary">
            <div className="stat-box">
              <div className="stat-value">{stats.gamesPlayed}</div>
              <div className="stat-label">Played</div>
            </div>
            <div className="stat-box">
              <div className="stat-value">{winPercentage}%</div>
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

          <div className="guess-distribution">
            <h3>Guess Distribution</h3>

            <div className="distribution-bars">
              {stats.guessDistribution.map((count, index) => (
                <div className="distribution-row" key={index}>
                  <div className="guess-number">{index + 1}</div>
                  <div className="guess-bar-container">
                    <div
                      className={`guess-bar ${animateStats ? "animate" : ""}`}
                      style={{
                        width: animateStats
                          ? `${(count / maxDistribution) * 100}%`
                          : "0%",
                        backgroundColor:
                          count > 0
                            ? "var(--color-primary)"
                            : "var(--color-bg-secondary)",
                      }}
                    >
                      {count > 0 && (
                        <span className="guess-count">{count}</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="stats-achievements">
            <h3>Achievements</h3>
            <div className="achievements-grid">
              <div className="achievement">
                <div className="achievement-icon">🌍</div>
                <div className="achievement-details">
                  <div className="achievement-name">Globe Trotter</div>
                  <div className="achievement-desc">Win 5 games in a row</div>
                  <div
                    className={`achievement-status ${
                      stats.currentStreak >= 5 ? "achieved" : ""
                    }`}
                  >
                    {stats.currentStreak >= 5
                      ? "Unlocked!"
                      : `${stats.currentStreak}/5`}
                  </div>
                </div>
              </div>

              <div className="achievement">
                <div className="achievement-icon">🎯</div>
                <div className="achievement-details">
                  <div className="achievement-name">First Try!</div>
                  <div className="achievement-desc">
                    Guess correctly on first try
                  </div>
                  <div
                    className={`achievement-status ${
                      stats.guessDistribution[0] > 0 ? "achieved" : ""
                    }`}
                  >
                    {stats.guessDistribution[0] > 0 ? "Unlocked!" : "Not yet"}
                  </div>
                </div>
              </div>

              <div className="achievement">
                <div className="achievement-icon">🔥</div>
                <div className="achievement-details">
                  <div className="achievement-name">On Fire</div>
                  <div className="achievement-desc">Win 10 games total</div>
                  <div
                    className={`achievement-status ${
                      stats.gamesWon >= 10 ? "achieved" : ""
                    }`}
                  >
                    {stats.gamesWon >= 10
                      ? "Unlocked!"
                      : `${stats.gamesWon}/10`}
                  </div>
                </div>
              </div>

              <div className="achievement">
                <div className="achievement-icon">🧠</div>
                <div className="achievement-details">
                  <div className="achievement-name">Quick Learner</div>
                  <div className="achievement-desc">
                    Win with 3 or fewer guesses
                  </div>
                  <div
                    className={`achievement-status ${
                      stats.guessDistribution
                        .slice(0, 3)
                        .some((count) => count > 0)
                        ? "achieved"
                        : ""
                    }`}
                  >
                    {stats.guessDistribution
                      .slice(0, 3)
                      .some((count) => count > 0)
                      ? "Unlocked!"
                      : "Not yet"}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="stats-footer">
            <button
              className="share-stats-button"
              onClick={() => alert("Share functionality would go here")}
            >
              Share Stats
            </button>
          </div>
        </div>

        <div className="modal-footer">
          <button className="primary-button" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default Stats;
