import React, { useState, useEffect } from "react";
import Game from "./components/Game";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Instructions from "./components/Instructions";
import Stats from "./components/Stats";
import { getDailyPair } from "./data/routeData";
import "./App.css";

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [gameStats, setGameStats] = useState({
    gamesPlayed: 0,
    gamesWon: 0,
    currentStreak: 0,
    maxStreak: 0,
    guessDistribution: [0, 0, 0, 0, 0, 0],
  });
  const [dailyPair, setDailyPair] = useState(null);

  // Check for dark mode preference on initial load
  useEffect(() => {
    const savedDarkMode = localStorage.getItem("darkMode") === "true";
    setDarkMode(savedDarkMode);

    // Load game stats from localStorage
    const savedStats = localStorage.getItem("gameStats");
    if (savedStats) {
      setGameStats(JSON.parse(savedStats));
    }

    // Get the daily country pair
    setDailyPair(getDailyPair());

    // Show instructions for first-time visitors
    const hasVisitedBefore = localStorage.getItem("visitedBefore");
    if (!hasVisitedBefore) {
      setShowInstructions(true);
      localStorage.setItem("visitedBefore", "true");
    }
  }, []);

  // Update body class and localStorage when dark mode changes
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  // Save stats to localStorage when they change
  useEffect(() => {
    localStorage.setItem("gameStats", JSON.stringify(gameStats));
  }, [gameStats]);

  const toggleDarkMode = () => {
    setDarkMode((prevMode) => !prevMode);
  };

  const updateGameStats = (won, guessCount) => {
    setGameStats((prevStats) => {
      const newStats = { ...prevStats };
      newStats.gamesPlayed++;

      if (won) {
        newStats.gamesWon++;
        newStats.currentStreak++;
        newStats.maxStreak = Math.max(
          newStats.maxStreak,
          newStats.currentStreak
        );

        // Update guess distribution (0-indexed in the array)
        if (guessCount >= 1 && guessCount <= 6) {
          newStats.guessDistribution[guessCount - 1]++;
        }
      } else {
        newStats.currentStreak = 0;
      }

      return newStats;
    });
  };

  return (
    <div className="app-container">
      <Header
        onOpenInstructions={() => setShowInstructions(true)}
        onOpenStats={() => setShowStats(true)}
        darkMode={darkMode}
        onToggleDarkMode={toggleDarkMode}
      />

      <main className="main-content">
        {dailyPair && (
          <Game
            knownCountry={dailyPair.knownCountry}
            targetCountry={dailyPair.targetCountry}
            onGameComplete={updateGameStats}
          />
        )}
      </main>

      <Footer />

      {showInstructions && (
        <Instructions onClose={() => setShowInstructions(false)} />
      )}

      {showStats && (
        <Stats onClose={() => setShowStats(false)} gameStats={gameStats} />
      )}
    </div>
  );
}

export default App;
