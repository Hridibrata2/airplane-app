import React from 'react'
import './Header.css'

const Header = () => {
  return (
    <div className="header">
      <div className="title">
        AeroLocate
      </div>
      <div className="subtitle">
        <input 
          type="text" 
          placeholder="Search for Cities..." 
          className="search-bar" 
        />
        <div>
            <h5>
                Updated in Real Time
            </h5>
        </div>
      </div>
    </div>
  );
}


export default Header