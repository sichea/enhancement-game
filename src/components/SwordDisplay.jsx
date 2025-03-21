// src/components/SwordDisplay.jsx - 검 표시 컴포넌트
import React, { useState, useEffect } from 'react';

const SwordDisplay = ({ 
  swordName, 
  swordLevel, 
  swordPower, 
  swordImage, 
  enhancing,
  lastEnhanceSuccess 
}) => {
  const [shakeEffect, setShakeEffect] = useState(false);
  
  // 강화 상태 변화 감지
  useEffect(() => {
    if (enhancing) {
      // 강화 시작 시 효과 초기화
      setShakeEffect(false);
    } else if (lastEnhanceSuccess !== undefined && !lastEnhanceSuccess) {
      // 강화 실패 시 흔들림 효과
      setShakeEffect(true);
      setTimeout(() => setShakeEffect(false), 500);
    }
  }, [enhancing, lastEnhanceSuccess]);
  
  return (
    <div className="sword-display">
      <img 
        id="sword-image" 
        src={swordImage} 
        alt="검" 
        className={`
          ${enhancing ? 'enhancing' : ''}
          ${shakeEffect ? 'sword-shake' : ''}
        `}
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