import React, { useEffect, useRef, useState } from "react";
import { geoEquirectangular, geoPath } from "d3-geo";
import { select } from "d3-selection";
import { zoom, zoomIdentity } from "d3-zoom";
import * as d3 from "d3";
import { feature } from "topojson-client";
import "./WorldMap.css";
import { getCountryByName } from "../data/countriesData";

const WorldMap = ({
  knownCountry,
  targetCountry,
  guesses = [],
  gameStatus,
  onSelectCountry,
  selectedCountry,
}) => {
  const svgRef = useRef(null);
  const worldData = useRef(null);
  const [hoveredCountry, setHoveredCountry] = useState(null);
  const [mapError, setMapError] = useState(false);
  const containerRef = useRef(null);
  const zoomRef = useRef(null);
  const initialZoomDone = useRef(false);

  // Map country names between our data and the map data
  const getMapCountryName = (appCountryName) => {
    // Add mappings for countries with different names in the map data
    const nameMap = {
      "United States": "United States of America",
      "Czech Republic": "Czechia",
      // Add other mappings as needed
    };
    return nameMap[appCountryName] || appCountryName;
  };

  // Load world map data
  useEffect(() => {
    fetch("/data/world-110m.json")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Could not load world map data");
        }
        return response.json();
      })
      .then((data) => {
        worldData.current = data;
        drawMap();
      })
      .catch((err) => {
        console.error("Error loading world data:", err);
        setMapError(true);
      });
  }, []);

  // Redraw the map when game state changes
  useEffect(() => {
    if (worldData.current) {
      drawMap();
    }
  }, [guesses, gameStatus, selectedCountry, knownCountry, targetCountry]);

  // Smooth zoom to a country - only used for initial zoom
  const smoothZoomToCountry = (country) => {
    if (
      !worldData.current ||
      !svgRef.current ||
      !zoomRef.current ||
      !country ||
      !country.latitude ||
      !country.longitude
    ) {
      return;
    }

    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;

    const projection = geoEquirectangular()
      .scale((width * 0.9) / (2 * Math.PI))
      .translate([width / 2, height / 2]);

    const [x, y] = projection([country.longitude, country.latitude]);

    if (isNaN(x) || isNaN(y)) return;

    const scale = 4; // Zoom level
    const translateX = width / 2 - scale * x;
    const translateY = height / 2 - scale * y;

    select(svgRef.current)
      .transition()
      .duration(1000)
      .call(
        zoomRef.current.transform,
        zoomIdentity.translate(translateX, translateY).scale(scale)
      );
  };

  // Initial zoom effect
  useEffect(() => {
    if (
      worldData.current &&
      knownCountry &&
      !initialZoomDone.current &&
      zoomRef.current
    ) {
      const timer = setTimeout(() => {
        smoothZoomToCountry(knownCountry);
        initialZoomDone.current = true;
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [worldData.current, knownCountry, zoomRef.current]);

  const getCountryNameFromFeature = (feature) => {
    return feature.properties.name;
  };

  const drawMap = () => {
    if (!worldData.current || !svgRef.current) return;

    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;
    const svg = select(svgRef.current);

    // Clear previous content
    svg.selectAll("*").remove();

    // Initialize projection
    const projection = geoEquirectangular()
      .scale((width * 0.9) / (2 * Math.PI))
      .translate([width / 2, height / 2]);

    const path = geoPath().projection(projection);

    // Initialize zoom behavior
    zoomRef.current = zoom()
      .scaleExtent([1, 8])
      .on("zoom", (event) => {
        // Allow zoom ONLY from user wheel/touch or from programmatic calls
        if (
          !event.sourceEvent || // Programmatic (for initial zoom)
          event.sourceEvent.type === "wheel" ||
          event.sourceEvent.type === "touchmove"
        ) {
          g.attr("transform", event.transform);
        }
      });

    // Apply zoom behavior to SVG but disable unwanted behaviors
    svg
      .call(zoomRef.current)
      .on("mousedown.zoom", null) // Disable drag-to-zoom (we'll handle our own dragging)
      .on("dblclick.zoom", null); // Disable double-click zoom

    // Create a group for all map elements
    const g = svg.append("g");

    // Add water background
    g.append("rect")
      .attr("width", width)
      .attr("height", height)
      .attr("fill", "#e6f7ff");

    // Add countries
    const countries = feature(
      worldData.current,
      worldData.current.objects.countries
    ).features;

    const countryPaths = g
      .selectAll(".country")
      .data(countries)
      .enter()
      .append("path")
      .attr("d", path)
      .attr("class", "country")
      .attr("fill", (d) => {
        const countryName = getCountryNameFromFeature(d);

        // Known country - always green
        if (
          knownCountry &&
          (countryName === knownCountry.name ||
            countryName === getMapCountryName(knownCountry.name))
        ) {
          return "#4CAF50"; // Green
        }

        // Target country
        if (
          targetCountry &&
          (countryName === targetCountry.name ||
            countryName === getMapCountryName(targetCountry.name))
        ) {
          if (
            guesses.some((g) => g.name === targetCountry.name) ||
            gameStatus === "lost"
          ) {
            return "#4CAF50"; // Green
          }
          return "#d8d8d8"; // Default gray
        }

        // Incorrect guesses
        if (
          guesses.some(
            (g) =>
              countryName === g.name ||
              countryName === getMapCountryName(g.name)
          )
        ) {
          return "#F44336"; // Red
        }

        // Selected country
        if (
          selectedCountry &&
          (countryName === selectedCountry.name ||
            countryName === getMapCountryName(selectedCountry.name))
        ) {
          return "#9C27B0"; // Purple
        }

        // Default
        return "#d8d8d8"; // Light gray
      })
      .attr("stroke", "#fff")
      .attr("stroke-width", 0.5);

    // Add hover/click events to countries
    countryPaths
      .on("mouseover", function (event, d) {
        // Show tooltip on hover
        const countryName = getCountryNameFromFeature(d);
        setHoveredCountry({
          name: countryName,
          x: event.clientX,
          y: event.clientY,
        });
        select(this).classed("hovered", true);

        // Stop propagation but don't prevent default
        event.stopPropagation();
      })
      .on("mousemove", function (event, d) {
        // Update tooltip position
        setHoveredCountry({
          name: getCountryNameFromFeature(d),
          x: event.clientX,
          y: event.clientY,
        });

        // Stop propagation
        event.stopPropagation();
      })
      .on("mouseout", function (event, d) {
        // Hide tooltip
        setHoveredCountry(null);
        select(this).classed("hovered", false);

        // Stop propagation
        event.stopPropagation();
      })
      .on("click", function (event, d) {
        // IMPORTANT: This prevents zoom from being triggered
        event.stopPropagation();

        // Only allow selection in playing state
        if (gameStatus === "playing" && onSelectCountry) {
          const countryName = getCountryNameFromFeature(d);
          const country = getCountryByName(countryName);

          if (country) {
            onSelectCountry(country);
          }
        }
      });

    // Add reset view button (as SVG element since we're in SVG context)
    g.append("g")
      .attr("transform", `translate(${width - 100}, ${height - 40})`)
      .append("rect")
      .attr("width", 80)
      .attr("height", 30)
      .attr("rx", 4)
      .attr("fill", "rgba(255, 255, 255, 0.9)")
      .attr("stroke", "#ddd")
      .style("cursor", "pointer")
      .on("click", function (event) {
        event.stopPropagation();
        select(svgRef.current)
          .transition()
          .duration(750)
          .call(zoomRef.current.transform, zoomIdentity);
      });

    g.append("text")
      .attr("x", width - 60)
      .attr("y", height - 20)
      .attr("text-anchor", "middle")
      .attr("fill", "#333")
      .style("font-size", "12px")
      .style("font-weight", "600")
      .style("cursor", "pointer")
      .text("Reset View")
      .on("click", function (event) {
        event.stopPropagation();
        select(svgRef.current)
          .transition()
          .duration(750)
          .call(zoomRef.current.transform, zoomIdentity);
      });
  };

  return (
    <div className="world-map-container" ref={containerRef}>
      {mapError ? (
        <div className="map-error">
          <p>Map data could not be loaded. Please try refreshing.</p>
        </div>
      ) : (
        <>
          <svg ref={svgRef} className="world-map"></svg>

          {hoveredCountry && (
            <div
              className="map-tooltip"
              style={{
                left: hoveredCountry.x + 15,
                top: hoveredCountry.y - 10,
              }}
            >
              {hoveredCountry.name}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default WorldMap;
