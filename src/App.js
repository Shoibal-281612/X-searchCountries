import React, { useState, useEffect } from 'react';
import CSS from "./App.css"

const App = () => {
  const [allCountries, setAllCountries] = useState([]);
  const [filteredCountries, setFilteredCountries] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_URL = "https://countries-search-data-prod-812920491762.asia-south1.run.app/countries";

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await fetch(API_URL);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        
        const formattedData = data.map(country => ({
            name: country.common,
            flag: country.png,
        }));
        
        setAllCountries(formattedData);
        setFilteredCountries(formattedData);
      } catch (e) {
        console.error("Error fetching country data:", e);
        setError("Failed to load countries. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchCountries();
  }, []); 

  const filterCountries = (term, countries) => {
    if (!term) {
      return countries;
    }
    
    const regex = new RegExp(term, 'i');
    
    return countries.filter(country => 
      regex.test(country.name)
    );
  };

  const handleSearchChange = (e) => {
    const newSearchTerm = e.target.value;
    setSearchTerm(newSearchTerm);

    const filtered = filterCountries(newSearchTerm, allCountries);
    setFilteredCountries(filtered);
  };

  const renderContent = () => {
    if (loading) {
      return <p className="text-xl text-center text-gray-500 font-inter">Loading countries...</p>;
    }

    if (error) {
      return <p className="text-xl text-center text-red-500 font-inter">{error}</p>;
    }

    if (filteredCountries.length === 0) {
      return <p className="text-xl text-center text-gray-500 font-inter">No countries found matching your search.</p>;
    }

    return (
      <div className="countries-grid">
        {filteredCountries.map((country) => (
          <div key={country.name} className="country-card-container">
            <div className="countryCard">
              <img
                src={country.flag}
                alt={`${country.name} flag`}
                className="country-flag"
                onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/400x160/cccccc/000000?text=No+Flag"; }}
              />
              <div className="country-info">
                <p className="country-name">{country.name}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
      <div className="app-container">
        <div className="content-wrapper">
          <h1 className="header">
            Country Finder
          </h1>
          <div className="search-bar-container">
            <input
              type="text"
              id="searchBar"
              placeholder="Search for a country..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="search-bar"
            />
          </div>
          {renderContent()}
        </div>
      </div>
  )
};

export default App;
