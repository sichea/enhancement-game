// src/components/Header.jsx
import React from 'react';

const Header = ({ gold, playerLevel }) => {
  return (
    <div className="header">
      <div className="user-info">
        <div className="gold-container">
          <img src="images/gold.png" alt="gold" className="gold-icon" />
          <span id="gold">{gold}</span>
        </div>
        <div className="level-container">
          <span>레벨: </span>
          <span id="player-level">{playerLevel}</span>
        </div>
      </div>
    </div>
  );
};

export default Header;