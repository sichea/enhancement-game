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
  const [screenFlash, setScreenFlash] = React.useState(false);
  
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
  
  // 강화 실패 감지 및 화면 효과 추가
  useEffect(() => {
    if (gameState.lastEnhanceSuccess === false && !gameState.enhancing) {
      // 강화 실패 시 화면 플래시 효과
      setScreenFlash(true);
      
      // 일정 시간 후 효과 제거
      setTimeout(() => {
        setScreenFlash(false);
      }, 500);
    }
  }, [gameState.lastEnhanceSuccess, gameState.enhancing]);

  return (
    <div className="game-container">
      {/* 화면 플래시 효과 */}
      {screenFlash && <div className="screen-flash"></div>}
      
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