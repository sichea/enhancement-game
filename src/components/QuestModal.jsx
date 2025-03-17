// src/components/QuestModal.jsx
import React, { useEffect, useMemo } from 'react';

const QuestModal = ({ quests, playerLevel, onComplete, onClose }) => {
  // useMemo를 사용하여 questArray를 메모이제이션
  const questArray = useMemo(() => {
    return Array.isArray(quests) ? quests : [];
  }, [quests]);
  
  // 디버깅을 위한 콘솔 출력
  useEffect(() => {
    console.log("QuestModal 렌더링:");
    console.log("퀘스트 배열:", questArray);
    console.log("플레이어 레벨:", playerLevel);
    
    // 사용 가능한 퀘스트 계산
    const availableQuests = questArray.filter(quest => 
      !quest.completed && playerLevel >= quest.requireLevel
    );
    console.log("사용 가능한 퀘스트:", availableQuests);
  }, [questArray, playerLevel]);

  // 사용 가능한 퀘스트 (완료되지 않고 레벨 요구사항을 충족하는 퀘스트)
  const availableQuests = useMemo(() => {
    return questArray.filter(quest => 
      !quest.completed && playerLevel >= quest.requireLevel
    );
  }, [questArray, playerLevel]);

  return (
    <div className="quest-modal">
      <div className="quest-content">
        <h2>퀘스트</h2>
        <div className="quest-list">
          {availableQuests.length > 0 ? (
            availableQuests.map((quest) => (
              <div key={quest.id} className="quest-item">
                <div className="quest-name">{quest.name}</div>
                <div className="quest-description">{quest.description}</div>
                <div className="quest-reward">보상: {quest.reward} 골드</div>
                <div className="quest-requirement">필요 레벨: {quest.requireLevel}</div>
                
                <button 
                  className="action-button"
                  onClick={() => onComplete(quest.id)}
                >
                  퀘스트 수행
                </button>
              </div>
            ))
          ) : (
            <div className="no-quests">사용 가능한 퀘스트가 없습니다.</div>
          )}
        </div>
        
        <h3>다른 퀘스트</h3>
        <div className="quest-list">
          {questArray.filter(quest => 
            !quest.completed && playerLevel < quest.requireLevel
          ).map((quest) => (
            <div key={quest.id} className="quest-item level-required">
              <div className="quest-name">{quest.name}</div>
              <div className="quest-description">{quest.description}</div>
              <div className="quest-reward">보상: {quest.reward} 골드</div>
              <div className="quest-requirement">필요 레벨: {quest.requireLevel}</div>
              <div className="quest-status">레벨 부족</div>
            </div>
          ))}
        </div>
        
        <button className="close-button" onClick={onClose}>
          닫기
        </button>
      </div>
    </div>
  );
};

export default QuestModal;