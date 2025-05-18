import React from 'react';

const CountryDetails = ({ country }) => {
  if (!country) {
    return null;
  }

  return (
    <div>
      <h2>{country.name.common}</h2>
      <p>Capital: {country.capital && country.capital.join(', ')}</p>
      <p>Area: {country.area} sq km</p>
      <h3>Languages:</h3>
      <ul>
        {country.languages && Object.values(country.languages).map(lang => (
          <li key={lang}>{lang}</li>
        ))}
      </ul>
      <img src={country.flags.png} alt={`Flag of ${country.name.common}`} style={{ maxWidth: '200px' }} />
    </div>
  );
};

export default CountryDetails;