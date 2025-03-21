// src/hooks/useGameState.js
import { useState, useEffect, useCallback } from 'react';
import swordData from '../data/swordData';
import setsData from '../data/setsData';

const useGameState = () => {
  // 기본 게임 상태
  const [gameState, setGameState] = useState({
    gold: 1000,
    playerLevel: 1,
    swordLevel: 0,
    swordPower: 10,
    swordName: '초보자의 검',
    swordImage: 'images/sword_0.png',
    enhancementCost: 100,
    successRate: 90,
    collectedSwords: [], // 수집한 검 배열
    resultMessage: null,
    lastEnhanceSuccess: false,
    enhancing: false
  });

  // UI 상태
  const [collectionModalVisible, setCollectionModalVisible] = useState(false);
  const [fusionModalVisible, setFusionModalVisible] = useState(false);
  const [notification, setNotification] = useState(null);
  const [lastFusedSword, setLastFusedSword] = useState(null);

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
        ...prevState,
        ...savedState,
        // 일부 계산된 값은 다시 계산
        enhancementCost: Math.floor(100 * Math.pow(1.5, savedState.swordLevel)),
        successRate: Math.max(5, 90 - (savedState.swordLevel * 7)),
      }));
    }
  }, []);

  // 게임 상태 초기화 (로컬스토리지 또는 텔레그램 클라우드 스토리지에서 로드)
  useEffect(() => {
    const loadGameState = async () => {
      let savedState = null;
      
      // 텔레그램 웹앱이 있는지 확인
      if (window.Telegram?.WebApp) {
        try {
          // 텔레그램 클라우드 스토리지에서 로드
          window.Telegram.WebApp.CloudStorage.getItem('swordGameState', (error, value) => {
            if (!error && value) {
              savedState = JSON.parse(value);
              applyGameState(savedState);
            }
          });
        } catch (e) {
          console.error('텔레그램 스토리지 로드 에러:', e);
        }
      } else {
        // 로컬스토리지에서 로드 (개발 및 테스트용)
        const storedState = localStorage.getItem('swordGameState');
        if (storedState) {
          savedState = JSON.parse(storedState);
          applyGameState(savedState);
        }
      }
    };

    loadGameState();
  }, [applyGameState]);

  // 게임 상태 저장 함수
  const saveGameState = useCallback(() => {
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
      localStorage.setItem('swordGameState', JSON.stringify(stateToSave));
    }
  }, [gameState]);

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
  // 검 강화 함수를 수정
const enhanceSword = useCallback(() => {
  setGameState(prevState => {
    // 이미 강화 중이면 중복 실행 방지
    if (prevState.enhancing) {
      return prevState;
    }
    
    // 골드가 부족하면 강화 불가
    if (prevState.gold < prevState.enhancementCost) {
      showNotificationMessage('골드가 부족합니다!');
      return prevState;
    }
    
    // 최대 레벨 검사
    if (prevState.swordLevel >= 10) {
      showNotificationMessage('이미 최대 레벨에 도달했습니다!');
      return prevState;
    }

    // 강화할 검의 레벨 (현재 레벨)
    const currentLevel = prevState.swordLevel;
    
    // 골드 차감 및 강화 애니메이션 시작
    const newState = {
      ...prevState,
      gold: prevState.gold - prevState.enhancementCost,
      enhancing: true,
      resultMessage: null
    };

    // 애니메이션 타이밍에 맞춰 결과 처리를 위한 타이머 설정
    setTimeout(() => {
      const success = Math.random() * 100 < prevState.successRate;
      
      if (success) {
        // 강화 성공 - 다음 레벨로 진행
        const newSwordLevel = currentLevel + 1;
        const newSword = swordData.find(sword => sword.level === newSwordLevel);
        
        // 강화 성공한 검을 컬렉션에 추가 (이미 있는 경우 제외)
        setGameState(currentState => {
          const today = new Date().toLocaleDateString();
          
          // 컬렉션에 이미 있는지 확인
          const alreadyCollected = currentState.collectedSwords.some(
            sword => sword.level === newSwordLevel
          );
          
          let updatedCollection = [...currentState.collectedSwords];
          
          // 아직 컬렉션에 없는 경우에만 추가
          if (!alreadyCollected && newSword) {
            const collectedSword = {
              ...newSword,
              obtainedDate: today
            };
            
            updatedCollection = [...updatedCollection, collectedSword];
          }
          
          return {
            ...currentState,
            swordLevel: newSwordLevel,
            swordName: newSword?.name || currentState.swordName,
            swordPower: newSword?.power || currentState.swordPower,
            swordImage: newSword?.imageSrc || currentState.swordImage,
            playerLevel: Math.floor(newSwordLevel / 2) + 1,
            enhancementCost: Math.floor(100 * Math.pow(1.5, newSwordLevel)),
            successRate: Math.max(5, 90 - (newSwordLevel * 7)),
            collectedSwords: updatedCollection,
            enhancing: false,
            resultMessage: '강화 성공!',
            lastEnhanceSuccess: true
          };
        });
      } else {
        // 강화 실패 - 레벨을 0으로 완전 초기화
        const newSwordLevel = 0;
        const newSword = swordData.find(sword => sword.level === newSwordLevel);
        
        setGameState(currentState => ({
          ...currentState,
          swordLevel: newSwordLevel,
          swordName: newSword?.name || currentState.swordName,
          swordPower: newSword?.power || currentState.swordPower,
          swordImage: newSword?.imageSrc || currentState.swordImage,
          playerLevel: Math.floor(newSwordLevel / 2) + 1,
          enhancementCost: Math.floor(100 * Math.pow(1.5, newSwordLevel)),
          successRate: Math.max(5, 90 - (newSwordLevel * 7)),
          enhancing: false,
          resultMessage: '강화 실패!',
          lastEnhanceSuccess: false
         }));
       }
     }, 1000);

     return newState;
   });
 }, [showNotificationMessage]);

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
        swordName: initialSword?.name || '초보자의 검',
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
    lastFusedSword
  };
};

export default useGameState;