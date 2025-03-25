import React, { useEffect, useRef, useState } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup,
} from "react-simple-maps";
import { getCountryByName } from "../data/countriesData";
import "./WorldMap.css";

const WorldMap = ({
  knownCountry,
  targetCountry,
  guesses = [],
  gameStatus,
  onSelectCountry,
  selectedCountry,
}) => {
  const [hoveredCountry, setHoveredCountry] = useState(null);
  const [position, setPosition] = useState({ coordinates: [0, 0], zoom: 1 });
  const mapRef = useRef(null);
  const initialZoomDone = useRef(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (knownCountry && !initialZoomDone.current) {
      setPosition({
        coordinates: [0, 0],
        zoom: 1,
      });

      const timer = setTimeout(() => {
        setPosition({
          coordinates: [knownCountry.longitude, knownCountry.latitude],
          zoom: 4,
        });
        initialZoomDone.current = true;
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [knownCountry]);

  const getMapCountryName = (appCountryName) => {
    const nameMap = {
      "United States": "United States of America",
      "Czech Republic": "Czechia",
    };
    return nameMap[appCountryName] || appCountryName;
  };

  const handleCountryClick = (geo) => {
    if (gameStatus === "playing" && onSelectCountry) {
      const countryName = geo.properties.name;

      // Check if this country has already been guessed
      const alreadyGuessed = guesses.some(
        (g) =>
          countryName === g.name || countryName === getMapCountryName(g.name)
      );

      // Don't allow selecting already guessed countries
      if (alreadyGuessed) {
        return; // Exit early
      }

      const country = getCountryByName(countryName);

      if (country) {
        onSelectCountry(country);
      }
    }
  };

  const getCountryColor = (geo) => {
    const countryName = geo.properties.name;

    if (
      knownCountry &&
      (countryName === knownCountry.name ||
        countryName === getMapCountryName(knownCountry.name))
    ) {
      return "#4CAF50";
    }

    if (
      targetCountry &&
      (countryName === targetCountry.name ||
        countryName === getMapCountryName(targetCountry.name))
    ) {
      if (
        guesses.some((g) => g.name === targetCountry.name) ||
        gameStatus === "lost"
      ) {
        return "#4CAF50";
      }
      return "#d8d8d8";
    }

    if (
      guesses.some(
        (g) =>
          countryName === g.name || countryName === getMapCountryName(g.name)
      )
    ) {
      return "#F44336";
    }

    if (
      selectedCountry &&
      (countryName === selectedCountry.name ||
        countryName === getMapCountryName(selectedCountry.name))
    ) {
      return "#9C27B0";
    }

    return "#d8d8d8";
  };

  const zoomOut = () => {
    setPosition({
      coordinates: [0, 0],
      zoom: 1,
    });
  };

  const isGuessedCountry = (countryName) => {
    return guesses.some(
      (g) => countryName === g.name || countryName === getMapCountryName(g.name)
    );
  };

  return (
    <div className="world-map-container">
      <ComposableMap
        projection="geoEquirectangular"
        projectionConfig={{
          scale: 180,
        }}
        ref={mapRef}
      >
        <ZoomableGroup
          zoom={position.zoom}
          center={position.coordinates}
          minZoom={1}
          maxZoom={8}
          transitionDuration={1500}
          onMoveEnd={(position) => {
            setPosition(position);
          }}
          onMoveStart={(e) => {
            if (e.sourceEvent && e.sourceEvent.type === "click") {
              e.sourceEvent.stopPropagation();
              return false;
            }
            return true;
          }}
        >
          <Geographies
            geography={`${process.env.PUBLIC_URL}/data/world-110m.json`}
          >
            {({ geographies }) =>
              geographies.map((geo) => (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCountryClick(geo);
                  }}
                  onMouseEnter={(e) => {
                    setHoveredCountry(geo.properties.name);
                    setMousePosition({ x: e.clientX, y: e.clientY });
                  }}
                  onMouseMove={(e) => {
                    setMousePosition({ x: e.clientX, y: e.clientY });
                  }}
                  onMouseLeave={() => {
                    setHoveredCountry(null);
                  }}
                  fill={getCountryColor(geo)}
                  stroke="#FFF"
                  strokeWidth={0.5}
                  style={{
                    default: { outline: "none" },
                    hover: {
                      fill: isGuessedCountry(geo.properties.name)
                        ? "#F44336"
                        : "#1976d2",
                      outline: "none",
                      cursor: isGuessedCountry(geo.properties.name)
                        ? "not-allowed"
                        : "pointer",
                    },
                    pressed: { outline: "none" },
                  }}
                />
              ))
            }
          </Geographies>
        </ZoomableGroup>
      </ComposableMap>

      <button className="reset-view-button" onClick={zoomOut}>
        Zoom Out
      </button>

      {hoveredCountry && (
        <div
          className="map-tooltip"
          style={{
            left: mousePosition.x + 15,
            top: mousePosition.y - 10,
          }}
        >
          {hoveredCountry}
        </div>
      )}
    </div>
  );
};

export default WorldMap;
