import React, { useState, useEffect } from "react";
import WorldMap from "./WorldMap";
import CountryInput from "./CountryInput";
import HintDisplay from "./HintDisplay";
import ResultCard from "./ResultCard";
import { generateHint } from "../utils/hintGenerator";
import { countries } from "../data/countriesData";
import DevTools from "./DevTools";
import "./Game.css";

const MAX_GUESSES = 6;

const Game = ({ knownCountry, targetCountry, onGameComplete }) => {
  const [guesses, setGuesses] = useState([]);
  const [hints, setHints] = useState([]);
  const [gameStatus, setGameStatus] = useState("playing"); // playing, won, lost
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [visibleTips, setVisibleTips] = useState([]);

  // Check if there's a saved game state in localStorage
  useEffect(() => {
    const savedGame = localStorage.getItem(
      `game-${knownCountry.name}-${new Date().toDateString()}`
    );

    if (savedGame) {
      const {
        guesses: savedGuesses,
        hints: savedHints,
        status,
      } = JSON.parse(savedGame);

      // Make sure to set both guesses and visibleTips
      setGuesses(savedGuesses);
      setHints(savedHints);
      setVisibleTips(savedHints); // This is critical to show hints immediately
      setGameStatus(status);
      setGameCompleted(status !== "playing");

      // If game was completed, also show the result
      if (status !== "playing") {
        setShowResult(true);
      }
    }
  }, [knownCountry]);

  // Save game state to localStorage when it changes
  useEffect(() => {
    if (guesses.length > 0 || hints.length > 0 || gameStatus !== "playing") {
      const gameState = {
        guesses,
        hints,
        status: gameStatus,
      };

      localStorage.setItem(
        `game-${knownCountry.name}-${new Date().toDateString()}`,
        JSON.stringify(gameState)
      );
    }
  }, [guesses, hints, gameStatus, knownCountry]);

  // When game ends, notify parent component and show result
  useEffect(() => {
    if (gameStatus === "won" || gameStatus === "lost") {
      if (!gameCompleted) {
        onGameComplete(gameStatus === "won", guesses.length);
        setGameCompleted(true);
        setShowResult(true);
      }
    }
  }, [gameStatus, guesses.length, onGameComplete, gameCompleted]);

  // Handle a new guess
  const handleGuess = (country) => {
    if (gameStatus !== "playing") return;

    const newGuesses = [...guesses, country];
    setGuesses(newGuesses);

    if (country.name === targetCountry.name) {
      // Correct guess - game won
      setGameStatus("won");
      setGameCompleted(true);
      if (onGameComplete) {
        onGameComplete(true, newGuesses.length);
      }
    } else {
      // Incorrect guess - generate a hint
      const newHint = generateHint(country, targetCountry, hints.length + 1);
      const updatedHints = [...hints, newHint];
      setHints(updatedHints);

      // Make sure all hints are immediately visible
      setVisibleTips(updatedHints);

      // Check if max guesses reached
      if (newGuesses.length >= MAX_GUESSES) {
        setGameStatus("lost");
        setGameCompleted(true);
        if (onGameComplete) {
          onGameComplete(false, MAX_GUESSES);
        }
      }
    }

    // Reset selected country
    setSelectedCountry(null);
  };

  const handleSelectCountry = (country) => {
    if (gameStatus === "playing") {
      setSelectedCountry(country);
    }
  };

  // Handle confirming a country selection
  const handleConfirmSelection = () => {
    if (selectedCountry) {
      handleGuess(selectedCountry);
    }
  };

  // Handle closing the result card
  const handleCloseResult = () => {
    setShowResult(false);
  };

  // Handle reopening the result card
  const handleShowResult = () => {
    setShowResult(true);
  };

  return (
    <div className="game-container">
      {process.env.NODE_ENV === "development" && (
        <DevTools
          knownCountry={knownCountry}
          targetCountry={targetCountry}
          onReset={() => {
            // Clear saved game
            localStorage.removeItem(
              `game-${knownCountry.name}-${new Date().toDateString()}`
            );
            // Reset states
            setGuesses([]);
            setHints([]);
            setGameStatus("playing");
            setGameCompleted(false);
            setShowResult(false);
          }}
          onChangeCountries={(newKnown, newTarget) => {
            // This would need to be handled by a prop from the parent component
            // For now, we'll just reload the page
            window.location.reload();
          }}
        />
      )}

      <div className="game-status">
        <div className="status-info">
          <div className="game-journey">
            <div className="country-info known">
              <span className="country-flag">{knownCountry.flag}</span>
              <span className="country-name">{knownCountry.name}</span>
            </div>
            <div className="journey-arrow">→</div>
            <div className="country-info target">
              <span className="country-flag">?</span>
              <span className="country-name">
                {gameStatus !== "playing" ? targetCountry.name : "???"}
              </span>
            </div>
          </div>
          <div className="guess-counter">
            Guess {guesses.length}/{MAX_GUESSES}
          </div>
        </div>
      </div>

      <WorldMap
        knownCountry={knownCountry}
        targetCountry={targetCountry}
        guesses={guesses}
        gameStatus={gameStatus}
        onSelectCountry={handleSelectCountry}
        selectedCountry={selectedCountry}
      />

      <div className="hints-section">
        <HintDisplay hints={visibleTips} />
      </div>

      {gameStatus === "playing" ? (
        <div className="input-section">
          <CountryInput
            onSelectCountry={handleSelectCountry}
            onConfirmSelection={handleConfirmSelection}
            selectedCountry={selectedCountry}
            previousGuesses={guesses.map((g) => g.name)}
            allCountries={countries}
          />
        </div>
      ) : (
        <>
          {showResult ? (
            <ResultCard
              status={gameStatus}
              guessCount={guesses.length}
              maxGuesses={MAX_GUESSES}
              knownCountry={knownCountry}
              targetCountry={targetCountry}
              onClose={handleCloseResult}
            />
          ) : (
            <div className="game-completed">
              <p className="completed-message">
                Game completed:{" "}
                {gameStatus === "won"
                  ? "You found the country!"
                  : "Better luck next time!"}
              </p>
              <button className="view-result-button" onClick={handleShowResult}>
                View Results
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Game;
