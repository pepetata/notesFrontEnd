import React, { useState, useEffect, useCallback } from 'react';
import countryService from './services/countries'
import Button from './components/Button'
import Notification from './components/Notification'
import './App.css';


const FilterName = ({ filterName, handleFilterNameChange }) => {
  return (
    <div>
      find countries
      <input
        name='filterName'
        value={filterName}
        onChange={handleFilterNameChange}
      />
    </div>
  );
};

const App = () => {
  const [countries, setCountries] = useState([]);
  const [countrySelected, setCountrySelected] = useState(null);
  const [filterName, setFilterName] = useState('');
  const noMessage = { type: '', message: '' }
  const [msg, setMsg] = useState(noMessage)

  const Countries = ({ countries: countries }) => {
    if (!filterName) return
    const arr = countries.filter(country => country.name.common.toLowerCase().includes(filterName.toLowerCase()))
    console.log('arr', arr, arr.length, 'filterName=', filterName, countries.length);
    if (arr.length > 10) {
      // setMsg({ type: 'error', message: 'asdfaf' })
      return
    }
    return (
      <div>
        {/* {!countrySelected && (<CountryList countries={countries} button={arr.length <= 5} />)} */}
        {countrySelected ? (<CountryDetails />) : (<CountryList countries={countries} button={arr.length <= 5} />)}
      </div>
    )

  }

  const CountryList = ({ countries, button }) => {
    return (
      <div>
        <h2>Countries List</h2>
        {countries.map(country => {
          if (country.name.common.toLowerCase().includes(filterName.toLowerCase())) {
            const but = button ? <Button onClick={() => showDetails(country)} text='Show Details' /> : ''
            console.log('button', button, but);
            return <p key={country.name.official}>{country.name.common} {but}</p>
          }
        })}
      </div>
    )
  }

  const CountryDetails = () => {
    console.log('CountryDetails conutry', countrySelected);
    return (
      <div>
        <h2>{countrySelected.name.common}</h2>
        <p>Capital: {countrySelected.capital && countrySelected.capital.join(', ')}</p>
        <p>Area: {countrySelected.area} sq km</p>
        <h3>Languages:</h3>
        <ul>
          {countrySelected.languages && Object.values(countrySelected.languages).map(lang => (
            <li key={lang}>{lang}</li>
          ))}
        </ul>
        <img src={countrySelected.flags.png} alt={`Flag of ${countrySelected.name.common}`} style={{ maxWidth: '200px' }} />
          <h3>Weather in {countrySelected.capital}:</h3>
      </div>
    );

  }

  const handleFilterNameChange = useCallback((event) => {
    setFilterName(event.target.value);
    console.log('filterName', event.target.value);
  }, []);

  useEffect(() => {
    if (countries.length === 0)
      countryService
        .getAll()
        .then(data => {
          console.log('getAll resp', data);
          setCountries(data);
        })
        .catch(error => {
          console.error('Failed to fetch notes:', error);
          setCountries([]); // Fallback to an empty array on error
        });
    else if (filterName) {
      const filteredCountries = countries.filter(country =>
        country.name.common.toLowerCase().includes(filterName.toLowerCase())
      );

      if (filteredCountries.length > 10) {
        setMsg({ type: 'error', message: 'Too many matches, specify another filter' });
        console.log('============ >10',);
      } else if (filteredCountries.length > 1 && filteredCountries.length <= 10) {
        setMsg(noMessage);
        // setCountries(filteredCountries);
      } else if (filteredCountries.length === 1) {
        setMsg(noMessage);
        // setCountries([]);
      } else {
        setMsg('error', 'No countries found');
        // setCountries([]);
        setMsg('error', null);
      }
    }

  }, [filterName]);

  const showDetails = (country) => setCountrySelected(country)

  return (
    <div>
      <h1>Countries</h1>
      <Notification type={msg.type} message={msg.message} />
      <FilterName filterName={filterName} handleFilterNameChange={handleFilterNameChange} />
      <Countries countries={countries} />
    </div>
  )
}

export default App
