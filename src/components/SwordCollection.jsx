// src/components/SwordCollection.jsx
import React from 'react';

const SwordCollection = ({ collectedSwords, onClose }) => {
  return (
    <div className="collection-modal">
      <div className="collection-content">
        <h2>검 컬렉션</h2>
        
        {collectedSwords.length > 0 ? (
          <div className="collection-grid">
            {collectedSwords.map((sword) => (
              <div key={sword.level} className="collection-item">
                <img 
                  src={sword.imageSrc} 
                  alt={sword.name} 
                  className="collection-sword-image"
                />
                <div className="collection-sword-info">
                  <div className="collection-sword-name">{sword.name}</div>
                  <div className="collection-sword-level">레벨: {sword.level}</div>
                  <div className="collection-sword-power">공격력: {sword.power}</div>
                  <div className="collection-sword-date">획득일: {sword.obtainedDate}</div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-collection">
            아직 수집된 검이 없습니다. 강화를 성공하여 검을 수집해보세요!
          </div>
        )}
        
        <button className="close-button" onClick={onClose}>
          닫기
        </button>
      </div>
    </div>
  );
};

export default SwordCollection;