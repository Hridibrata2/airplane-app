import React, { useState } from 'react';
import './Header.css'; 


const Header = ({ handleSearch, loading }) => {

  const [searchCity, setSearchCity] = useState('');

  return (
    <div className="App-header">
      <div className="title">AeroLocate</div>
      <div className="subtitle">
        <div className="search-bar-container">
          <input
            value={searchCity}
            onChange={(e) => setSearchCity(e.target.value)}
            type="text"
            placeholder="Search for Cities..."
            className="search-input-field"
            onKeyPress={(e) => {
              if (e.key === 'Enter') handleSearch();
            }}
          />
          <button onClick={handleSearch} disabled={loading} className='search-button'>
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Header;