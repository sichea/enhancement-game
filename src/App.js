// src/App.js
import React, { useEffect } from 'react';
import './App.css';
import Header from './components/Header';
import SwordDisplay from './components/SwordDisplay';
import EnhanceSection from './components/EnhanceSection';
import SwordCollection from './components/SwordCollection';
import SwordSetFusion from './components/SwordSetFusion';
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
    currentSellPrice,
    // 세트 합성 관련 상태와 함수
    fusionModalVisible,
    showFusionModal,
    hideFusionModal,
    fuseSwords,
    setsData
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
        onFusionClick={showFusionModal} // 합성 버튼 클릭 핸들러 추가
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
      
      {fusionModalVisible && (
        <SwordSetFusion
          collectedSwords={gameState.collectedSwords}
          setsData={setsData}
          onFuse={fuseSwords}
          onClose={hideFusionModal}
          playerGold={gameState.gold}
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