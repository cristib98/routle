import React, { useState, useEffect } from "react";
import WorldMap from "./WorldMap";
import CountryInput from "./CountryInput";
import HintDisplay from "./HintDisplay";
import ResultCard from "./ResultCard";
import { generateHint } from "../utils/hintGenerator";
import { countries } from "../data/countriesData";
import DevTools from "./DevTools";
import "./Game.css";

const MAX_GUESSES = 10;

const Game = ({ knownCountry, targetCountry, onGameComplete }) => {
  const [guesses, setGuesses] = useState([]);
  const [hints, setHints] = useState([]);
  const [gameStatus, setGameStatus] = useState("playing"); // playing, won, lost
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [visibleTips, setVisibleTips] = useState([]);
  const [showResultCard, setShowResultCard] = useState(false);

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

      // If game was completed, make sure we show the result card
      if (status !== "playing") {
        setGameCompleted(true);
        setShowResultCard(true);
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

  // Handle a new guess
  const handleGuess = (country) => {
    if (gameStatus !== "playing") return;

    const newGuesses = [...guesses, country];
    setGuesses(newGuesses);

    const isCorrect = country.name === targetCountry.name;

    if (isCorrect) {
      setGameStatus("won");
      setGameCompleted(true);
      setShowResultCard(true);

      // If callback exists, call it
      if (onGameComplete) {
        onGameComplete(true, newGuesses.length);
      }
    } else {
      // Incorrect guess - generate a hint based on comparing the TARGET with the KNOWN country
      // (not the guessed country)
      const newHint = generateHint(
        knownCountry,
        targetCountry,
        hints.length + 1
      );
      const updatedHints = [...hints, newHint];
      setHints(updatedHints);

      // Make sure all hints are immediately visible
      setVisibleTips(updatedHints);

      // Check if max guesses reached
      if (newGuesses.length >= MAX_GUESSES) {
        setGameStatus("lost");
        setGameCompleted(true);
        setShowResultCard(true);

        // If callback exists, call it
        if (onGameComplete) {
          onGameComplete(false, newGuesses.length);
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

  // Add a close handler for the ResultCard
  const handleCloseResult = () => {
    setShowResultCard(false);
  };

  return (
    <div className="game-container">
      {/* {process.env.NODE_ENV === "development" && (
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
          }}
          onChangeCountries={(newKnown, newTarget) => {
            // This would need to be handled by a prop from the parent component
            // For now, we'll just reload the page
            window.location.reload();
          }}
        />
      )} */}
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
            Guess {guesses.length} of {MAX_GUESSES}
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
        <div className="game-completed">
          {/* Empty div to hold space if not showing result */}
        </div>
      )}

      {showResultCard && gameStatus !== "playing" && (
        <ResultCard
          status={gameStatus}
          guessCount={guesses.length}
          maxGuesses={MAX_GUESSES}
          knownCountry={knownCountry}
          targetCountry={targetCountry}
          onClose={handleCloseResult}
        />
      )}
    </div>
  );
};

export default Game;
