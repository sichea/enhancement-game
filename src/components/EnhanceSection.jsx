// src/components/EnhanceSection.jsx - 강화 섹션 컴포넌트
import React from 'react';

const EnhanceSection = ({ 
  enhancementCost, 
  successRate, 
  sellPrice,
  swordLevel,
  onEnhance, 
  onSell, 
  onQuestClick 
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
      >
        강화하기
      </button>
      
      <div className="actions">
        <button 
          className="action-button"
          onClick={onSell}
          disabled={swordLevel === 0}
          title={swordLevel === 0 ? "판매할 검이 없습니다" : `${sellPrice} 골드에 판매하기`}
        >
          검 판매하기
        </button>
        <button 
          className="action-button"
          onClick={onQuestClick}
        >
          퀘스트 가기
        </button>
      </div>
    </div>
  );
};

export default EnhanceSection;