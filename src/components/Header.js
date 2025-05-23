import React, { useState } from 'react';
import './Header.css';

const Header = ({ loading }) => {
  const [searchIP, setSearchIP] = useState('');
  const [error, setError] = useState(null);

  const onSearch = async () => {
    if (!searchIP.trim()) {
      setError('Please enter an IP address');
      return;
    }

    setError(null);

    try {
      const GEOLOCATION_API_URL = `http://ip-api.com/json/${searchIP.trim()}`;
      const response = await fetch(GEOLOCATION_API_URL);
      
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();

      if (data.status === 'success') {
        const ipData = {
          ip: searchIP.trim(),
          city: data.city,
          region: data.regionName,
          country: data.country,
          lat: data.lat,
          lon: data.lon,
        };
        console.log('IP Data Found:', ipData);
      } else {
        setError('Invalid IP address or no data found.');
      }

    } catch (error) {
      console.error('Error fetching IP data:', error);
      setError(`Failed to fetch IP data: ${error.message}`);
    }
  };

  return (
    <div className="App-header">
      <div className="title">AeroLocate</div>
      <div className="subtitle">
        <div className="search-bar-container">
          <input
            value={searchIP}
            onChange={(e) => setSearchIP(e.target.value)}
            type="text"
            placeholder="Enter an IP address..."
            className="search-input-field"
            onKeyDown={(e) => {
              if (e.key === 'Enter') onSearch();
            }}
          />
          <button onClick={onSearch} disabled={loading} className="search-button">
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>
      </div>
      {error && <div className="error-message">{error}</div>}
    </div>
  );
};

export default Header;