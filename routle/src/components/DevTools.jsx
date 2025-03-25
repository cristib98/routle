import React from "react";
import { countries } from "../data/countriesData";
import "./DevTools.css";

const DevTools = ({
  onReset,
  onChangeCountries,
  knownCountry,
  targetCountry,
}) => {
  const handleReset = () => {
    if (window.confirm("Reset game? This will clear your progress.")) {
      // Clear ALL relevant localStorage items for this game
      localStorage.removeItem(
        `game-${knownCountry.name}-${new Date().toDateString()}`
      );
      localStorage.removeItem(`routle_game_${new Date().toDateString()}`);

      // Then call the provided reset function to reset state
      onReset();
    }
  };

  const handleRandomCountries = () => {
    // Randomly select two different countries
    const countryCount = countries.length;
    const knownIndex = Math.floor(Math.random() * countryCount);
    let targetIndex;
    do {
      targetIndex = Math.floor(Math.random() * countryCount);
    } while (targetIndex === knownIndex);

    const randomKnown = countries[knownIndex];
    const randomTarget = countries[targetIndex];

    if (
      window.confirm(`Change to random countries? 
From: ${randomKnown.name} ${randomKnown.flag}
To: ${randomTarget.name} ${randomTarget.flag}

This will reset your progress.`)
    ) {
      onChangeCountries(randomKnown, randomTarget);
    }
  };

  return (
    <div className="dev-tools-bar">
      <div className="dev-tools-title">DEV TOOLS</div>
      <div className="dev-tools-info">
        <span>
          Target: {targetCountry.name} {targetCountry.flag}
        </span>
      </div>
      <div className="dev-tools-actions">
        <button onClick={handleReset} className="dev-button reset">
          Reset Game
        </button>
        <button onClick={handleRandomCountries} className="dev-button random">
          Random Countries
        </button>
      </div>
    </div>
  );
};

export default DevTools;
