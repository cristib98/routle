import React, { useState } from "react";
import { countries } from "../data/countriesData";
import "./DeveloperControls.css";

const DeveloperControls = ({
  onReset,
  onChangeCountries,
  knownCountry,
  targetCountry,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [newKnownCountry, setNewKnownCountry] = useState(null);
  const [newTargetCountry, setNewTargetCountry] = useState(null);

  const handleReset = () => {
    if (window.confirm("Are you sure you want to reset the game?")) {
      onReset();
    }
  };

  const handleChangeCountries = () => {
    if (newKnownCountry && newTargetCountry) {
      onChangeCountries(newKnownCountry, newTargetCountry);
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

    setNewKnownCountry(randomKnown);
    setNewTargetCountry(randomTarget);
  };

  return (
    <div className={`dev-controls ${isExpanded ? "expanded" : "collapsed"}`}>
      <div className="dev-header" onClick={() => setIsExpanded(!isExpanded)}>
        <h3>Developer Controls {isExpanded ? "▼" : "▶"}</h3>
      </div>

      {isExpanded && (
        <div className="dev-content">
          <div className="dev-section">
            <h4>Current Game</h4>
            <div className="countries-info">
              <div className="country-info">
                <span>Known Country:</span>
                <span className="country-value">
                  {knownCountry
                    ? `${knownCountry.flag} ${knownCountry.name}`
                    : "Not set"}
                </span>
              </div>
              <div className="country-info">
                <span>Target Country:</span>
                <span className="country-value">
                  {targetCountry
                    ? `${targetCountry.flag} ${targetCountry.name}`
                    : "Not set"}
                </span>
              </div>
            </div>

            <button className="dev-button" onClick={handleReset}>
              Reset Game
            </button>
          </div>

          <div className="dev-section">
            <h4>Change Countries</h4>
            <div className="country-selector">
              <div className="select-row">
                <label>Known:</label>
                <select
                  onChange={(e) => {
                    const selected = countries.find(
                      (c) => c.name === e.target.value
                    );
                    setNewKnownCountry(selected);
                  }}
                  value={newKnownCountry?.name || ""}
                >
                  <option value="">Select country...</option>
                  {countries.map((country) => (
                    <option key={country.code} value={country.name}>
                      {country.flag} {country.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="select-row">
                <label>Target:</label>
                <select
                  onChange={(e) => {
                    const selected = countries.find(
                      (c) => c.name === e.target.value
                    );
                    setNewTargetCountry(selected);
                  }}
                  value={newTargetCountry?.name || ""}
                >
                  <option value="">Select country...</option>
                  {countries.map((country) => (
                    <option key={country.code} value={country.name}>
                      {country.flag} {country.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="buttons-row">
                <button className="dev-button" onClick={handleRandomCountries}>
                  Random Pair
                </button>

                <button
                  className="dev-button primary"
                  onClick={handleChangeCountries}
                  disabled={!newKnownCountry || !newTargetCountry}
                >
                  Apply Changes
                </button>
              </div>
            </div>
          </div>

          <div className="dev-note">
            <p>These controls are for development purposes only.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeveloperControls;
