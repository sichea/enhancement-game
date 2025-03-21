// src/components/SwordSetFusion.jsx
import React, { useState, useEffect } from 'react';

const SwordSetFusion = ({ 
  collectedSwords, 
  setsData, 
  onFuse, 
  onClose,
  playerGold
}) => {
  const [selectedSetId, setSelectedSetId] = useState(null);
  const [selectedSwords, setSelectedSwords] = useState([]);
  const [fusionCost, setFusionCost] = useState(0);

  // 세트 선택 시 초기화
  useEffect(() => {
    setSelectedSwords([]);
  }, [selectedSetId]);

  // 선택된 세트 정보 가져오기
  const selectedSet = selectedSetId ? setsData.find(set => set.id === selectedSetId) : null;

  // 세트 합성에 필요한 검 목록
  const getRequiredSwords = () => {
    if (!selectedSet) return [];
    
    return selectedSet.requiredSwords.map(requiredId => {
      const matchingSword = collectedSwords.find(sword => sword.level === requiredId);
      return {
        id: requiredId,
        available: !!matchingSword,
        name: matchingSword ? matchingSword.name : `레벨 ${requiredId}의 검`,
        sword: matchingSword
      };
    });
  };

  // 검 선택 처리
  const handleSwordSelect = (requiredId) => {
    const matchingSword = collectedSwords.find(sword => sword.level === requiredId);
    
    if (!matchingSword) return;
    
    // 이미 선택되어 있으면 제거, 없으면 추가
    if (selectedSwords.some(sword => sword.level === requiredId)) {
      setSelectedSwords(selectedSwords.filter(sword => sword.level !== requiredId));
    } else {
      setSelectedSwords([...selectedSwords, matchingSword]);
    }
  };

  // 세트 합성 가능 여부 확인
  const canFuse = () => {
    if (!selectedSet) return false;
    
    // 필요한 모든 검이 선택되었는지 확인
    const allSelected = selectedSet.requiredSwords.every(
      requiredId => selectedSwords.some(sword => sword.level === requiredId)
    );
    
    // 골드가 충분한지 확인
    const hasEnoughGold = playerGold >= fusionCost;
    
    return allSelected && hasEnoughGold;
  };

  // 합성 실행
  const executeFusion = () => {
    if (!canFuse() || !selectedSet) return;
    
    // 세트 검 생성 정보 준비
    const setResultSword = {
      ...selectedSet.resultSword,
      level: 999, // 세트 검은 특별한 레벨 표시
      isSetItem: true,
      setId: selectedSet.id,
      obtainedDate: new Date().toLocaleDateString()
    };
    
    // 합성 실행 (선택된 검, 결과물, 비용 전달)
    onFuse(selectedSwords, setResultSword, fusionCost);
  };

  // 세트 비용 계산 (세트의 강력함에 따라 조정)
  useEffect(() => {
    if (selectedSet) {
      // 예: 필요한 검 레벨의 합 * 100
      const baseCost = selectedSet.requiredSwords.reduce((sum, level) => sum + level, 0) * 100;
      setFusionCost(baseCost);
    } else {
      setFusionCost(0);
    }
  }, [selectedSet]);

  return (
    <div className="fusion-modal">
      <div className="fusion-content">
        <h2>검 세트 합성</h2>
        
        {/* 세트 선택 영역 */}
        <div className="set-selection">
          <h3>합성 가능한 세트</h3>
          <div className="sets-list">
            {setsData.map(set => {
              // 해당 세트에 필요한 검 중 컬렉션에 있는 검의 수 계산
              const availableSwordsCount = set.requiredSwords.filter(
                requiredId => collectedSwords.some(sword => sword.level === requiredId)
              ).length;
              
              // 필요한 검의 총 개수
              const totalRequired = set.requiredSwords.length;
              
              return (
                <div 
                  key={set.id} 
                  className={`set-item ${selectedSetId === set.id ? 'selected' : ''} ${availableSwordsCount === totalRequired ? 'available' : 'unavailable'}`}
                  onClick={() => setSelectedSetId(set.id)}
                >
                  <div className="set-name">{set.name}</div>
                  <div className="set-availability">
                    보유: {availableSwordsCount}/{totalRequired}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        
        {/* 선택된 세트의 상세 정보 영역 */}
        {selectedSet && (
          <div className="selected-set-details">
            <h3>{selectedSet.name}</h3>
            <p className="set-description">{selectedSet.description}</p>
            
            <div className="required-swords">
              <h4>필요한 검</h4>
              <div className="required-swords-list">
                {getRequiredSwords().map(req => (
                  <div 
                    key={req.id}
                    className={`required-sword-item ${req.available ? 'available' : 'unavailable'} ${selectedSwords.some(s => s.level === req.id) ? 'selected' : ''}`}
                    onClick={() => req.available && handleSwordSelect(req.id)}
                  >
                    <div className="required-sword-name">{req.name}</div>
                    <div className="required-sword-status">
                      {req.available ? (
                        selectedSwords.some(s => s.level === req.id) ? '선택됨' : '선택 가능'
                      ) : '보유하지 않음'}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="fusion-result">
              <h4>합성 결과</h4>
              <div className="result-sword">
                <div className="result-sword-name">{selectedSet.resultSword.name}</div>
                <div className="result-sword-power">공격력: {selectedSet.resultSword.power}</div>
                <div className="result-sword-special">특수 효과: {selectedSet.resultSword.special}</div>
              </div>
              <div className="fusion-cost">
                <span>합성 비용: </span>
                <span className={playerGold >= fusionCost ? 'gold-text' : 'insufficient-gold'}>
                  {fusionCost} 골드
                </span>
              </div>
            </div>
            
            <button 
              className="fusion-button"
              disabled={!canFuse()}
              onClick={executeFusion}
            >
              세트 합성하기
            </button>
          </div>
        )}
        
        <button className="close-button" onClick={onClose}>
          닫기
        </button>
      </div>
    </div>
  );
};

export default SwordSetFusion;