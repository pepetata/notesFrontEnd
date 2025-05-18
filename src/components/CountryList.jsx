import React from 'react';

const CountryList = ({ countries, onShowCountry }) => {
  return (
    <div>
      {countries.map(country => (
        <div key={country.cca3}>
          {country.name.common} <button onClick={() => onShowCountry(country)}>show</button>
        </div>
      ))}
    </div>
  );
};

export default CountryList;