// src/components/EnhanceSection.jsx
import React from 'react';

const EnhanceSection = ({ 
  enhancementCost, 
  successRate, 
  sellPrice,
  swordLevel,
  enhancing,
  onEnhance, 
  onSell, 
  onCollectionClick,
  onFusionClick  // 합성 버튼 핸들러 추가
}) => {
  return (
    <div className="enhancement-section">
      <div className="cost-info">
        <span>강화 비용: </span>
        <span id="enhancement-cost">{enhancementCost}</span>
        <span> 골드</span>
      </div>
      <div className="success-rate">
        <span>성공 확률: </span>
        <span id="success-rate">{successRate}</span>
        <span>%</span>
      </div>
      {swordLevel > 0 && (
        <div className="sell-price-info">
          <span>판매 가격: </span>
          <span id="sell-price" className="gold-text">{sellPrice}</span>
          <span> 골드</span>
        </div>
      )}
      <button 
        className="enhance-button"
        onClick={onEnhance}
        disabled={swordLevel >= 10 || enhancing}
        title={swordLevel >= 10 ? "최대 레벨에 도달했습니다" : enhancing ? "강화 중..." : "강화하기"}
      >
        {enhancing ? "강화 중..." : "강화하기"}
      </button>
      
      <div className="actions">
        <button 
          className="action-button"
          onClick={onSell}
          disabled={swordLevel === 0 || enhancing}
          title={
            enhancing ? "강화 중에는 판매할 수 없습니다" : 
            swordLevel === 0 ? "판매할 검이 없습니다" : 
            `${sellPrice} 골드에 판매하기`
          }
        >
          검 판매하기
        </button>
        <button 
          className="action-button"
          onClick={onCollectionClick}
          disabled={enhancing}
          title={enhancing ? "강화 중에는 컬렉션을 볼 수 없습니다" : "지금까지 수집한 검 보기"}
        >
          검 컬렉션
        </button>
        <button 
          className="action-button"
          onClick={onFusionClick}
          disabled={enhancing}
          title={enhancing ? "강화 중에는 합성할 수 없습니다" : "검 세트 합성하기"}
        >
          검 세트 합성
        </button>
      </div>
    </div>
  );
};

export default EnhanceSection;