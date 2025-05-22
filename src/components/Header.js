import React from 'react'
import './Header.css'
import { useState } from 'react';

const Header = () => {

     const [city, setCity] = useState("");

  return (
    <div className="header">
      <div className="title">
        AeroLocate
      </div>
      <div className="subtitle">
        <input 
           value={city}
          onChange={(e) => setCity(e.target.value)}
          type="text" 
          placeholder="Search for Cities..." 
          className="search-bar" 
        />
      </div>
    </div>
  );
}


export default Header