// src/App.js - 메인 앱 컴포넌트
import React, { useEffect } from 'react';
import './App.css';
import Header from './components/Header';
import SwordDisplay from './components/SwordDisplay';
import EnhanceSection from './components/EnhanceSection';
import QuestModal from './components/QuestModal';
import Notification from './components/Notification';
import useGameState from './hooks/useGameState';
import { initTelegramWebApp } from './utils/telegramUtils';

function App() {
  const {
    gameState,
    enhanceSword,
    sellSword,
    completeQuest,
    showQuestModal,
    hideQuestModal,
    notification,
    hideNotification,
    questModalVisible,
    currentSellPrice
  } = useGameState();

  // 텔레그램 웹앱 초기화
  useEffect(() => {
    initTelegramWebApp();
  }, []);

  return (
    <div className="game-container">
      <Header gold={gameState.gold} playerLevel={gameState.playerLevel} />
      
      <SwordDisplay 
        swordName={gameState.swordName}
        swordLevel={gameState.swordLevel}
        swordPower={gameState.swordPower}
        swordImage={gameState.swordImage}
        enhancing={gameState.enhancing}
      />
      
      <EnhanceSection 
        enhancementCost={gameState.enhancementCost}
        successRate={gameState.successRate}
        sellPrice={currentSellPrice}
        swordLevel={gameState.swordLevel}
        onEnhance={enhanceSword}
        onSell={sellSword}
        onQuestClick={showQuestModal}
      />
      
      {gameState.resultMessage && (
        <div className={`result-display ${gameState.lastEnhanceSuccess ? 'success' : 'failure'}`}>
          {gameState.resultMessage}
        </div>
      )}
      
      {questModalVisible && (
        <QuestModal 
          quests={Array.isArray(gameState.quests) ? gameState.quests : []}
          playerLevel={gameState.playerLevel}
          onComplete={completeQuest}
          onClose={hideQuestModal}
        />
      )}
      
      {notification && (
        <Notification 
          message={notification} 
          onHide={hideNotification} 
        />
      )}
    </div>
  );
}

export default App;