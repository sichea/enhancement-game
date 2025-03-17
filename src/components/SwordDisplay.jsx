// src/components/SwordDisplay.jsx - 검 표시 컴포넌트
import React from 'react';

const SwordDisplay = ({ swordName, swordLevel, swordPower, swordImage, enhancing }) => {
  return (
    <div className="sword-display">
      <img 
        id="sword-image" 
        src={swordImage} 
        alt="검" 
        className={enhancing ? 'enhancing' : ''}
      />
      <div className="sword-info">
        <div className="sword-name">{swordName}</div>
        <div className="sword-level">강화 단계: <span>{swordLevel}</span></div>
        <div className="sword-power">공격력: <span>{swordPower}</span></div>
      </div>
    </div>
  );
};

export default SwordDisplay;