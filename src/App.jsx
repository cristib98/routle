import React, { useState, useEffect } from "react";
import Game from "./components/Game";
import Instructions from "./components/Instructions";
import Header from "./components/Header";
import Statistics from "./components/Statistics";
import Footer from "./components/Footer";
import DeveloperControls from "./components/DeveloperControls";
import DevTools from "./components/DevTools";
import { getDailyPair } from "./data/routeData";
import "./App.css";
import InstructionsModal from "./components/InstructionsModal";
import StatsModal from "./components/StatsModal";
import ResultModal from "./components/ResultModal";

function App() {
  const [showInstructions, setShowInstructions] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("darkMode") === "true"
  );
  const [gameStats, setGameStats] = useState({
    gamesPlayed: 0,
    gamesWon: 0,
    currentStreak: 0,
    maxStreak: 0,
    guessDistribution: [0, 0, 0, 0, 0, 0],
  });
  const [dailyPair, setDailyPair] = useState(null);
  const [gameStatus, setGameStatus] = useState("loading"); // loading, playing, won, lost
  const [guesses, setGuesses] = useState([]);
  const [todaysDate, setTodaysDate] = useState(new Date().toDateString());
  const [loading, setLoading] = useState(true);
  const [isDevelopment, setIsDevelopment] = useState(true);

  // Check user's preferred color scheme
  useEffect(() => {
    if (
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
    ) {
      setDarkMode(true);
    }

    // Add listener for changes
    window
      .matchMedia("(prefers-color-scheme: dark)")
      .addEventListener("change", (event) => {
        setDarkMode(event.matches);
      });

    // Check if user has previously set dark mode preference
    const savedDarkMode = localStorage.getItem("darkMode");
    if (savedDarkMode !== null) {
      setDarkMode(JSON.parse(savedDarkMode));
    }

    // Add online/offline detection
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // Save dark mode preference
  useEffect(() => {
    document.body.classList.toggle("dark-mode", darkMode);
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
  }, [darkMode]);

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
    try {
      const pair = getDailyPair();
      console.log("Daily pair loaded:", pair); // Debug log
      setDailyPair(pair);
      setGameStatus("playing");

      // Load saved game state for today
      const savedGame = localStorage.getItem(`routle_game_${todaysDate}`);
      if (savedGame) {
        const gameData = JSON.parse(savedGame);
        setGuesses(gameData.guesses || []);
        setGameStatus(gameData.status || "playing");

        // If game was completed, show results automatically
        if (gameData.status === "won" || gameData.status === "lost") {
          // Small delay to ensure everything is loaded
          setTimeout(() => {
            setShowResults(true);
          }, 500);
        }
      }
    } catch (error) {
      console.error("Error loading daily pair:", error);
      setGameStatus("error");
    } finally {
      setLoading(false);
    }

    // Show instructions for first-time visitors
    const hasVisitedBefore = localStorage.getItem("visitedBefore");
    if (!hasVisitedBefore) {
      setShowInstructions(true);
      localStorage.setItem("visitedBefore", "true");
    }

    // Add escape key handler for modals
    const handleEscKey = (event) => {
      if (event.key === "Escape") {
        if (showInstructions) setShowInstructions(false);
        if (showStats) setShowStats(false);
      }
    };

    document.addEventListener("keydown", handleEscKey);

    return () => {
      document.removeEventListener("keydown", handleEscKey);
    };
  }, [showInstructions, showStats, todaysDate]);

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

  // Developer functions
  const handleResetGame = () => {
    // Clear saved game state for this pair
    localStorage.removeItem(`routle_game_${todaysDate}`);

    // Reset states
    setGuesses([]);
    setGameStatus("playing");
    setShowResults(false);
  };

  const handleChangeCountries = () => {
    // This is a temporary solution - in a real app, you'd have a more sophisticated
    // way to change the country pair without reloading the page
    window.location.reload();
  };

  const handleGameStateChange = (newStatus, updatedGuesses) => {
    setGameStatus(newStatus);
    setGuesses(updatedGuesses);

    // Save game state
    if (dailyPair) {
      localStorage.setItem(
        `routle_game_${todaysDate}`,
        JSON.stringify({
          status: newStatus,
          guesses: updatedGuesses,
          knownCountry: dailyPair.knownCountry,
          targetCountry: dailyPair.targetCountry,
        })
      );
    }

    // Show results if game is won or lost
    if (newStatus === "won" || newStatus === "lost") {
      setShowResults(true);
    }
  };

  return (
    <div className={`app-container ${darkMode ? "dark-mode" : ""}`}>
      <Header
        onOpenInstructions={() => setShowInstructions(true)}
        onOpenStats={() => setShowStats(true)}
        darkMode={darkMode}
        onToggleDarkMode={toggleDarkMode}
      />

      <main className="main-content">
        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading today's route...</p>
          </div>
        ) : dailyPair && dailyPair.knownCountry && dailyPair.targetCountry ? (
          <Game
            knownCountry={dailyPair.knownCountry}
            targetCountry={dailyPair.targetCountry}
            initialGuesses={guesses}
            gameStatus={gameStatus}
            onGameStateChange={handleGameStateChange}
            onShowResults={() => setShowResults(true)}
            onResetGame={handleResetGame}
            onChangeCountries={handleChangeCountries}
          />
        ) : (
          <div className="error-container">
            <p>There was an error loading today's game.</p>
            <button onClick={() => window.location.reload()}>Try Again</button>
          </div>
        )}
      </main>

      <Footer />

      {showInstructions && (
        <InstructionsModal onClose={() => setShowInstructions(false)} />
      )}

      {showStats && <StatsModal onClose={() => setShowStats(false)} />}

      {showResults && dailyPair && (
        <ResultModal
          onClose={() => setShowResults(false)}
          knownCountry={dailyPair.knownCountry}
          targetCountry={dailyPair.targetCountry}
          gameStatus={gameStatus}
          guesses={guesses}
          date={todaysDate}
        />
      )}
    </div>
  );
}

export default App;
