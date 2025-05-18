import React, { useState, useEffect } from 'react';
import CountryList from './components/CountryList';
import CountryDetails from './components/CountryDetails';

const App = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (searchTerm) {
      fetch(`https://studies.cs.helsinki.fi/restcountries/api/all`)
        .then(response => response.json())
        .then(data => {
          const filteredCountries = data.filter(country =>
            country.name.common.toLowerCase().includes(searchTerm.toLowerCase())
          );

          if (filteredCountries.length > 10) {
            setErrorMessage('Too many matches, specify another filter');
            setCountries([]);
            setSelectedCountry(null);
          } else if (filteredCountries.length > 1 && filteredCountries.length <= 10) {
            setErrorMessage('');
            setCountries(filteredCountries);
            setSelectedCountry(null);
          } else if (filteredCountries.length === 1) {
            setErrorMessage('');
            setCountries([]);
            setSelectedCountry(filteredCountries[0]);
          } else {
            setErrorMessage('No countries found');
            setCountries([]);
            setSelectedCountry(null);
          }
        })
        .catch(error => {
          console.error('Error fetching data:', error);
          setErrorMessage('Failed to fetch data');
          setCountries([]);
          setSelectedCountry(null);
        });
    } else {
      setCountries([]);
      setSelectedCountry(null);
      setErrorMessage('');
    }
  }, [searchTerm]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleShowCountry = (country) => {
    setSelectedCountry(country);
    setCountries([]);
    setErrorMessage('');
    setSearchTerm(country.name.common); // Update search term for clarity
  };

  return (
    <div>
      <h1>Country Information</h1>
      <div>
        find countries <input type="text" value={searchTerm} onChange={handleSearchChange} />
      </div>
      {errorMessage && <p>{errorMessage}</p>}
      {countries.length > 0 && (
        <CountryList countries={countries} onShowCountry={handleShowCountry} />
      )}
      {selectedCountry && <CountryDetails country={selectedCountry} />}
    </div>
  );
};

export default App;