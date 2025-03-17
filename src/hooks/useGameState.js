// src/hooks/useGameState.js
import { useState, useEffect, useCallback } from 'react';
import swordData from '../data/swordData';
import questData from '../data/questData';

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
    quests: questData || [], // null 또는 undefined일 경우 빈 배열 사용
    questsCompleted: 0,
    resultMessage: null,
    lastEnhanceSuccess: false,
    enhancing: false
  });

  // UI 상태
  const [questModalVisible, setQuestModalVisible] = useState(false);
  const [notification, setNotification] = useState(null);

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

  // 퀘스트 모달 표시/숨기기 함수
  const showQuestModal = useCallback(() => setQuestModalVisible(true), []);
  const hideQuestModal = useCallback(() => setQuestModalVisible(false), []);

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
      
      // 퀘스트 데이터 콘솔에 출력 (디버깅용)
      console.log("퀘스트 데이터 로드:", questData);
      
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
      quests: gameState.quests,
      questsCompleted: gameState.questsCompleted,
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
    gameState.questsCompleted,
    saveGameState
  ]);

  // 검 강화 함수
  const enhanceSword = useCallback(() => {
    setGameState(prevState => {
      // 골드가 부족하면 강화 불가
      if (prevState.gold < prevState.enhancementCost) {
        showNotificationMessage('골드가 부족합니다!');
        return prevState;
      }

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
        let newSwordLevel = prevState.swordLevel;
        
        if (success) {
          newSwordLevel = prevState.swordLevel + 1;
        } else {
          // 강화 실패 - 레벨을 0으로 완전 초기화
          newSwordLevel = 0;
        }

        // 검 데이터 업데이트
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
          resultMessage: success ? '강화 성공!' : '강화 실패!',
          lastEnhanceSuccess: success
        }));
      }, 1000);

      return newState;
    });
  }, [showNotificationMessage]);

  // 검 판매 함수
  const sellSword = useCallback(() => {
    setGameState(prevState => {
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

  // 퀘스트 완료 함수
  const completeQuest = useCallback((questId) => {
    setGameState(prevState => {
      const questIndex = prevState.quests.findIndex(q => q.id === questId);
      
      if (questIndex === -1 || 
          prevState.quests[questIndex].completed || 
          prevState.playerLevel < prevState.quests[questIndex].requireLevel) {
        return prevState;
      }
      
      const updatedQuests = [...prevState.quests];
      updatedQuests[questIndex] = {
        ...updatedQuests[questIndex],
        completed: true
      };
      
      const reward = prevState.quests[questIndex].reward;
      showNotificationMessage(`퀘스트 완료! ${reward} 골드를 획득했습니다.`);
      
      return {
        ...prevState,
        gold: prevState.gold + reward,
        quests: updatedQuests,
        questsCompleted: prevState.questsCompleted + 1
      };
    });
  }, [showNotificationMessage]);

  // 현재 검의 판매 가격 계산
  const currentSellPrice = gameState.swordLevel > 0 ? calculateSellPrice(gameState.swordPower) : 0;

  return {
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
  };
};

export default useGameState;