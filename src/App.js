// src/App.js
import React, { useEffect } from 'react';
import './App.css';
import Header from './components/Header';
import SwordDisplay from './components/SwordDisplay';
import EnhanceSection from './components/EnhanceSection';
import SwordCollection from './components/SwordCollection';
import Notification from './components/Notification';
import useGameState from './hooks/useGameState';
import { initTelegramWebApp } from './utils/telegramUtils';

function App() {
  const {
    gameState,
    enhanceSword,
    sellSword,
    showCollectionModal,
    hideCollectionModal,
    notification,
    hideNotification,
    collectionModalVisible,
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
        lastEnhanceSuccess={gameState.lastEnhanceSuccess}
      />
      
      <EnhanceSection 
        enhancementCost={gameState.enhancementCost}
        successRate={gameState.successRate}
        sellPrice={currentSellPrice}
        swordLevel={gameState.swordLevel}
        enhancing={gameState.enhancing}
        onEnhance={enhanceSword}
        onSell={sellSword}
        onCollectionClick={showCollectionModal}
      />
      
      {gameState.resultMessage && (
        <div className={`result-display ${gameState.lastEnhanceSuccess ? 'success' : 'failure'}`}>
          {gameState.resultMessage}
        </div>
      )}
      
      {collectionModalVisible && (
        <SwordCollection 
          collectedSwords={gameState.collectedSwords}
          onClose={hideCollectionModal}
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