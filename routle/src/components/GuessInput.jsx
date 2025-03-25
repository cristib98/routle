import React, { useState, useRef, useEffect } from "react";
import Select from "react-select";
import { countryOptions } from "../data/countriesData";
import "./CountryInput.css";

const CountryInput = ({
  onSelectCountry,
  onConfirmSelection,
  selectedCountry,
  previousGuesses = [],
  knownCountry,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const inputRef = useRef(null);

  // Filter out previously guessed countries and the known starting country
  const availableOptions = countryOptions.filter(
    (option) =>
      !previousGuesses.includes(option.value) && option.value !== knownCountry
  );

  useEffect(() => {
    // Focus on field when component mounts
    if (inputRef.current) {
      setTimeout(() => {
        inputRef.current.focus();
      }, 100);
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!selectedCountry || isSubmitting) return;

    setIsSubmitting(true);

    // Add animation before submitting
    setTimeout(() => {
      onConfirmSelection();
      setIsSubmitting(false);

      // Focus back on input field
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 300);
  };

  const handleChange = (option) => {
    onSelectCountry(
      option
        ? {
            name: option.value,
            flag: option.label.split(" ")[0], // Extract flag emoji
            // You might need to add other properties from your country data
          }
        : null
    );
  };

  // Custom styles for react-select
  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      borderColor: state.isFocused
        ? "var(--color-primary)"
        : "var(--color-border)",
      boxShadow: state.isFocused ? "0 0 0 1px var(--color-primary)" : "none",
      "&:hover": {
        borderColor: "var(--color-primary)",
      },
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected
        ? "var(--color-primary)"
        : state.isFocused
        ? "var(--color-bg-secondary)"
        : "transparent",
      color: state.isSelected ? "white" : "var(--color-text)",
    }),
  };

  return (
    <div className="guess-input-container">
      <form
        className={`guess-form ${isSubmitting ? "submitting" : ""}`}
        onSubmit={handleSubmit}
      >
        <div className="input-row">
          <div className="input-group">
            <Select
              ref={inputRef}
              className="country-select"
              classNamePrefix="select"
              value={
                selectedCountry
                  ? {
                      value: selectedCountry.name,
                      label: `${selectedCountry.flag} ${selectedCountry.name}`,
                    }
                  : null
              }
              onChange={handleChange}
              options={availableOptions}
              placeholder="Guess the mystery country..."
              isDisabled={isSubmitting}
              styles={customStyles}
              isClearable
            />
          </div>

          <button
            type="submit"
            className="submit-button"
            disabled={!selectedCountry || isSubmitting}
          >
            {isSubmitting ? (
              <span className="loading-spinner"></span>
            ) : (
              <>
                <span className="button-icon">🔍</span>
                <span className="button-text">Guess</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CountryInput;
