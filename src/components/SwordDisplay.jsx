// src/components/SwordDisplay.jsx - 검 표시 컴포넌트
import React, { useState, useEffect, useRef } from 'react';

const SwordDisplay = ({ 
  swordName, 
  swordLevel, 
  swordPower, 
  swordImage, 
  enhancing,
  lastEnhanceSuccess 
}) => {
  const [shakeEffect, setShakeEffect] = useState(false);
  const [showFlash, setShowFlash] = useState(false);
  const isFirstRender = useRef(true);
  
  // 강화 상태 변화 감지
  useEffect(() => {
    // 첫 번째 렌더링(초기화/재시작)에서는 효과를 적용하지 않음
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    
    if (enhancing) {
      // 강화 시작 시 효과 초기화
      setShakeEffect(false);
      setShowFlash(false);
    } else if (lastEnhanceSuccess !== undefined && !lastEnhanceSuccess) {
      // 강화 실패 시 효과들 적용 (enhancing이 true에서 false로 바뀐 경우에만)
      setShowFlash(true);
      setShakeEffect(true);
      
      // 효과 제거 타이밍 설정
      setTimeout(() => {
        setShakeEffect(false);
        setShowFlash(false);
      }, 800);
    }
  }, [enhancing, lastEnhanceSuccess]);
  
  return (
    <div className="sword-display">
      {/* 실패 시 검 영역만 붉은 플래시 효과 */}
      {showFlash && <div className="sword-flash"></div>}
      
      {/* 검 이미지 */}
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