// src/hooks/useGameState.js
import { useState, useEffect, useCallback } from 'react';
import swordData from '../data/swordData';
import setsData from '../data/setsData';

// 초기 기본값 상수로 정의 (모든 환경에서 동일하게 사용됨)
const DEFAULT_GAME_STATE = {
  gold: 1000,
  playerLevel: 1,
  swordLevel: 0,
  swordPower: 10,
  swordName: '낡은 글라디우스',
  swordImage: 'images/sword_0.png',
  enhancementCost: 100,
  successRate: 90,
  collectedSwords: [],
  resultMessage: null,
  lastEnhanceSuccess: false,
  enhancing: false
};

const useGameState = () => {
  // 기본값으로 초기화
  const [gameState, setGameState] = useState(DEFAULT_GAME_STATE);
  
  // UI 상태
  const [collectionModalVisible, setCollectionModalVisible] = useState(false);
  const [fusionModalVisible, setFusionModalVisible] = useState(false);
  const [notification, setNotification] = useState(null);
  const [lastFusedSword, setLastFusedSword] = useState(null);
  // 초기화 완료 플래그
  const [initCompleted, setInitCompleted] = useState(false);

  // 알림 표시 함수
  const showNotificationMessage = useCallback((message) => {
    setNotification(message);
    setTimeout(() => {
      setNotification(null);
    }, 3000);
  }, []);

  // 알림 숨기기 함수
  const hideNotification = useCallback(() => {
    setNotification(null);
  }, []);

  // 컬렉션 및 합성 모달 표시/숨기기 함수
  const showCollectionModal = useCallback(() => setCollectionModalVisible(true), []);
  const hideCollectionModal = useCallback(() => setCollectionModalVisible(false), []);
  const showFusionModal = useCallback(() => setFusionModalVisible(true), []);
  const hideFusionModal = useCallback(() => setFusionModalVisible(false), []);

  // 판매 가격 계산 함수
  const calculateSellPrice = useCallback((swordPower) => {
    return Math.floor(swordPower * 10);
  }, []);

  // 게임 상태 로드 시 적용 함수
  const applyGameState = useCallback((savedState) => {
    if (savedState) {
      setGameState(prevState => ({
        ...DEFAULT_GAME_STATE, // 항상 기본값으로 시작
        ...savedState, // 저장된 값으로 덮어쓰기
        // 계산된 값은 다시 계산
        enhancementCost: Math.floor(100 * Math.pow(1.5, savedState.swordLevel)),
        successRate: Math.max(5, 90 - (savedState.swordLevel * 7)),
      }));
    } else {
      // 저장된 상태가 없으면 기본값 사용
      setGameState(DEFAULT_GAME_STATE);
    }
    // 초기화 완료 표시
    setInitCompleted(true);
  }, []);

  // 게임 상태 초기화
  useEffect(() => {
    const loadGameState = async () => {
      let savedState = null;
      
      // 텔레그램 웹앱이 있는지 확인
      if (window.Telegram?.WebApp) {
        try {
          // 텔레그램 클라우드 스토리지에서 로드
          window.Telegram.WebApp.CloudStorage.getItem('swordGameState', (error, value) => {
            if (!error && value) {
              try {
                savedState = JSON.parse(value);
                applyGameState(savedState);
              } catch (parseError) {
                console.error('텔레그램 데이터 파싱 에러:', parseError);
                applyGameState(null); // 파싱 에러 시 기본값 사용
              }
            } else {
              // 저장된 데이터가 없으면 기본값 사용
              applyGameState(null);
            }
          });
        } catch (e) {
          console.error('텔레그램 스토리지 로드 에러:', e);
          applyGameState(null); // 에러 시 기본값 사용
        }
      } else {
        // 로컬스토리지에서 로드 (개발 및 테스트용)
        try {
          const storedState = localStorage.getItem('swordGameState');
          if (storedState) {
            savedState = JSON.parse(storedState);
          }
        } catch (e) {
          console.error('로컬스토리지 로드 에러:', e);
        }
        
        // 저장된 상태 적용 또는 기본값 사용
        applyGameState(savedState);
      }
    };

    loadGameState();
  }, [applyGameState]);

  // 게임 상태 저장 함수
  const saveGameState = useCallback(() => {
    // 초기화가 완료된 후에만 저장
    if (!initCompleted) return;
    
    const stateToSave = {
      gold: gameState.gold,
      playerLevel: gameState.playerLevel,
      swordLevel: gameState.swordLevel,
      swordPower: gameState.swordPower,
      swordName: gameState.swordName,
      collectedSwords: gameState.collectedSwords
    };

    if (window.Telegram?.WebApp) {
      // 텔레그램 클라우드 스토리지에 저장
      window.Telegram.WebApp.CloudStorage.setItem(
        'swordGameState', 
        JSON.stringify(stateToSave)
      );
    } else {
      // 로컬스토리지에 저장 (개발 및 테스트용)
      try {
        localStorage.setItem('swordGameState', JSON.stringify(stateToSave));
      } catch (e) {
        console.error('로컬스토리지 저장 에러:', e);
      }
    }
  }, [gameState, initCompleted]);

  // 게임 상태가 변경될 때마다 저장
  useEffect(() => {
    saveGameState();
  }, [
    gameState.gold, 
    gameState.playerLevel, 
    gameState.swordLevel, 
    gameState.swordPower,
    gameState.collectedSwords,
    saveGameState
  ]);

  // 검 강화 함수
  const enhanceSword = useCallback(() => {
    // 현재 상태를 가져와서 강화 가능 여부 먼저 확인
    const currentState = { ...gameState };
    
    // 이미 강화 중이면 중복 실행 방지
    if (currentState.enhancing) {
      return;
    }
    
    // 골드가 부족하면 강화 불가
    if (currentState.gold < currentState.enhancementCost) {
      showNotificationMessage('골드가 부족합니다!');
      return;
    }
    
    // 최대 레벨 검사
    if (currentState.swordLevel >= 10) {
      showNotificationMessage('이미 최대 레벨에 도달했습니다!');
      return;
    }
  
    // 강화할 검의 레벨 (현재 레벨)
    const currentLevel = currentState.swordLevel;
    
    // 강화 비용 차감 및 애니메이션 시작 상태 설정
    setGameState(prevState => ({
      ...prevState,
      gold: prevState.gold - prevState.enhancementCost,
      enhancing: true,
      resultMessage: null
    }));
  
    // 애니메이션 타이밍에 맞춰 결과 처리를 위한 타이머 설정
    setTimeout(() => {
      // 강화 성공 확률 계산 (현재 설정된 확률 사용)
      const success = Math.random() * 100 < currentState.successRate;
      
      // 성공 또는 실패에 따른 상태 업데이트를 한 번에 처리
      setGameState(prevState => {
        // 결과에 따라 새로운 상태 계산
        if (success) {
          // 강화 성공
          const newSwordLevel = currentLevel + 1;
          const newSword = swordData.find(sword => sword.level === newSwordLevel);
          
          // 현재 컬렉션을 복사
          let updatedCollection = [...prevState.collectedSwords];
          
          // 이미 컬렉션에 있는지 확인
          const alreadyCollected = updatedCollection.some(
            sword => sword.level === newSwordLevel
          );
          
          // 아직 컬렉션에 없는 경우에만 추가
          if (!alreadyCollected && newSword) {
            const today = new Date().toLocaleDateString();
            const collectedSword = {
              ...newSword,
              obtainedDate: today
            };
            updatedCollection.push(collectedSword);
          }
          
          // 성공한 경우의 새 상태 반환
          return {
            ...prevState,
            swordLevel: newSwordLevel,
            swordName: newSword?.name || prevState.swordName,
            swordPower: newSword?.power || prevState.swordPower,
            swordImage: newSword?.imageSrc || prevState.swordImage,
            playerLevel: Math.floor(newSwordLevel / 2) + 1,
            enhancementCost: Math.floor(100 * Math.pow(1.5, newSwordLevel)),
            successRate: Math.max(5, 90 - (newSwordLevel * 7)),
            collectedSwords: updatedCollection,
            enhancing: false,
            resultMessage: '강화 성공!',
            lastEnhanceSuccess: true
          };
        } else {
          // 강화 실패
          const newSwordLevel = 0;
          const newSword = swordData.find(sword => sword.level === newSwordLevel);
          
          // 실패한 경우의 새 상태 반환 (컬렉션은 그대로 유지)
          return {
            ...prevState,
            swordLevel: newSwordLevel,
            swordName: newSword?.name || prevState.swordName,
            swordPower: newSword?.power || prevState.swordPower,
            swordImage: newSword?.imageSrc || prevState.swordImage,
            playerLevel: Math.floor(newSwordLevel / 2) + 1,
            enhancementCost: Math.floor(100 * Math.pow(1.5, newSwordLevel)),
            successRate: Math.max(5, 90 - (newSwordLevel * 7)),
            enhancing: false,
            resultMessage: '강화 실패!',
            lastEnhanceSuccess: false
          };
        }
      });
    }, 1000);
  }, [gameState, showNotificationMessage]);

  // 검 판매 함수
  const sellSword = useCallback(() => {
    setGameState(prevState => {
      // 강화 중에는 판매 불가
      if (prevState.enhancing) {
        showNotificationMessage('강화 중에는 검을 판매할 수 없습니다!');
        return prevState;
      }
      
      if (prevState.swordLevel === 0) {
        showNotificationMessage('판매할 검이 없습니다!');
        return prevState;
      }
      
      const sellPrice = calculateSellPrice(prevState.swordPower);
      const initialSword = swordData.find(sword => sword.level === 0);
      
      showNotificationMessage(`검을 ${sellPrice} 골드에 판매했습니다!`);
      
      return {
        ...prevState,
        gold: prevState.gold + sellPrice,
        swordLevel: 0,
        swordName: initialSword?.name || '낡은 글라디우스',
        swordPower: initialSword?.power || 10,
        swordImage: initialSword?.imageSrc || 'images/sword_0.png',
        playerLevel: 1, // 플레이어 레벨 초기화
        enhancementCost: 100,
        successRate: 90,
        resultMessage: null
      };
    });
  }, [calculateSellPrice, showNotificationMessage]);

  // 세트 합성 함수
  const fuseSwords = useCallback((selectedSwords, resultSword, cost) => {
    setGameState(prevState => {
      // 강화 중에는 합성 불가
      if (prevState.enhancing) {
        showNotificationMessage('강화 중에는 세트를 합성할 수 없습니다!');
        return prevState;
      }
      
      // 골드가 부족하면 합성 불가
      if (prevState.gold < cost) {
        showNotificationMessage('골드가 부족합니다!');
        return prevState;
      }
      
      // 선택된 검들의 ID 목록
      const selectedSwordLevels = selectedSwords.map(sword => sword.level);
      
      // 골드 차감 및 결과 검 추가
      const newGold = prevState.gold - cost;
      
      // 컬렉션에서 선택된 검 제거 (합성에 사용됨)
      const updatedCollection = prevState.collectedSwords.filter(
        sword => !selectedSwordLevels.includes(sword.level)
      );
      
      // 결과 검 추가
      updatedCollection.push(resultSword);
      
      // 합성 결과 알림
      showNotificationMessage(`${resultSword.name} 합성에 성공했습니다!`);
      
      // 마지막 합성 검 저장 (애니메이션용)
      setLastFusedSword(resultSword);
      
      return {
        ...prevState,
        gold: newGold,
        collectedSwords: updatedCollection
      };
    });
    
    // 모달 닫기
    hideFusionModal();
  }, [showNotificationMessage, hideFusionModal]);

  // 게임 상태 초기화 함수 (새 함수 추가)
  const resetGameState = useCallback(() => {
    // 상태를 기본값으로 리셋
    setGameState(DEFAULT_GAME_STATE);
    
    // 저장소도 지우기
    if (window.Telegram?.WebApp) {
      window.Telegram.WebApp.CloudStorage.removeItem('swordGameState');
    } else {
      localStorage.removeItem('swordGameState');
    }
    
    showNotificationMessage('게임이 초기화되었습니다.');
  }, [showNotificationMessage]);

  // 현재 검의 판매 가격 계산
  const currentSellPrice = gameState.swordLevel > 0 ? calculateSellPrice(gameState.swordPower) : 0;

  return {
    gameState,
    enhanceSword,
    sellSword,
    showCollectionModal,
    hideCollectionModal,
    notification,
    hideNotification,
    collectionModalVisible,
    currentSellPrice,
    // 세트 합성 관련 반환값
    fusionModalVisible,
    showFusionModal,
    hideFusionModal,
    fuseSwords,
    setsData,
    lastFusedSword,
    // 상태 초기화 함수 추가
    resetGameState
  };
};

export default useGameState;