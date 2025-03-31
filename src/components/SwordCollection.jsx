// src/components/SwordCollection.jsx - 단순화된 버전
import React, { useMemo, useRef, useState } from 'react';
import swordData from '../data/swordData';
import setsData from '../data/setsData';

// html2canvas를 동적으로 로드하는 함수
const loadHtml2Canvas = async () => {
  if (window.html2canvas) return window.html2canvas;
  
  const script = document.createElement('script');
  script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js';
  script.async = true;
  
  await new Promise((resolve, reject) => {
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
  
  return window.html2canvas;
};

const SwordCollection = ({ collectedSwords, onClose }) => {
  const [isCapturing, setIsCapturing] = useState(false);
  
  // 컬렉션 내용 ref
  const collectionRef = useRef(null);
  
  // 기본 검과 세트 검을 모두 포함한 전체 검 목록 생성 (기존 코드 유지)
  const allSwords = useMemo(() => {
    const basicSwords = swordData.map(sword => ({
      ...sword,
      isSetItem: false
    }));
    
    const setSwords = setsData.map(set => ({
      level: 999 + set.id,
      name: set.resultSword.name,
      power: set.resultSword.power,
      imageSrc: set.resultSword.imageSrc,
      special: set.resultSword.special,
      isSetItem: true,
      setId: set.id
    }));
    
    return [...basicSwords, ...setSwords];
  }, []);
  
  // 모든 검과 수집 상태를 합친 데이터 생성 (기존 코드 유지)
  const allSwordsWithStatus = useMemo(() => {
    return allSwords.map(sword => {
      const collectedSword = sword.isSetItem
        ? collectedSwords.find(
            collected => collected.isSetItem && collected.setId === sword.setId
          )
        : collectedSwords.find(
            collected => !collected.isSetItem && collected.level === sword.level
          );
      
      return {
        ...sword,
        collected: !!collectedSword,
        obtainedDate: collectedSword?.obtainedDate || null
      };
    });
  }, [allSwords, collectedSwords]);
  
  // 검 타입별로 분류
  const normalSwords = allSwordsWithStatus.filter(sword => !sword.isSetItem);
  const setSwords = allSwordsWithStatus.filter(sword => sword.isSetItem);
  
  // 획득한 검 수와 전체 검 수 (기본 검만)
  const collectedNormalCount = normalSwords.filter(sword => sword.collected).length;
  const totalNormalSwords = normalSwords.length;
  
  // 획득한 세트 검 수와 전체 세트 검 수
  const collectedSetCount = setSwords.filter(sword => sword.collected).length;
  const totalSetSwords = setSwords.length;
  
  // 전체 컬렉션 상태
  const totalCollected = collectedNormalCount + collectedSetCount;
  const totalSwords = totalNormalSwords + totalSetSwords;
  const collectionPercent = Math.round((totalCollected / totalSwords) * 100);
  
  // 컬렉션 캡처 함수 - 단순화된 버전
  const captureCollection = async () => {
    try {
      setIsCapturing(true);
      
      // 캡처 시작 알림
      const captureNotice = document.createElement('div');
      captureNotice.className = 'capture-notice';
      captureNotice.textContent = '캡처 중...';
      document.body.appendChild(captureNotice);
      
      // 캡처 전 미획득 검 이미지를 강제로 그레이스케일로 변환하는 함수
      const forceGrayscaleOnImages = async (container) => {
        const uncollectedItems = container.querySelectorAll('.uncollected');
        
        // 각 미획득 아이템에 대해
        for (const item of uncollectedItems) {
          const imageElement = item.querySelector('.collection-sword-image');
          if (!imageElement) continue;
          
          try {
            // 원본 이미지 URL 저장
            console.log(`이미지를 그레이스케일로 변환: ${imageElement.src}`);
            
            // 이미지가 로드될 때까지 대기
            await new Promise((resolve) => {
              if (imageElement.complete) {
                resolve();
              } else {
                imageElement.onload = resolve;
                imageElement.onerror = resolve;
              }
            });
            
            // 이미지를 캔버스에 그려서 그레이스케일 적용
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            canvas.width = imageElement.naturalWidth || 100;
            canvas.height = imageElement.naturalHeight || 100;
            
            try {
              // 이미지를 캔버스에 그리기
              ctx.drawImage(imageElement, 0, 0);
              
              // 그레이스케일 변환 수행
              const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
              const data = imageData.data;
              
              for (let i = 0; i < data.length; i += 4) {
                const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
                data[i] = avg * 0.7;     // R (밝기 감소)
                data[i + 1] = avg * 0.7; // G (밝기 감소)
                data[i + 2] = avg * 0.7; // B (밝기 감소)
                data[i + 3] = data[i + 3] * 0.7; // A (투명도 증가)
              }
              
              ctx.putImageData(imageData, 0, 0);
              
              // 원본 이미지를 그레이스케일 버전으로 교체
              const grayscaleImageUrl = canvas.toDataURL('image/png');
              imageElement.src = grayscaleImageUrl;
              
              // 그레이스케일 상태 표시
              imageElement.dataset.grayscaled = 'true';
              imageElement.style.filter = 'none'; // CSS 필터 제거 (이미 그레이스케일 적용됨)
            } catch (drawError) {
              console.error('이미지 그레이스케일 변환 중 오류:', drawError);
              // 그레이스케일 변환에 실패하면 원래 이미지에 CSS 필터를 강하게 적용
              imageElement.style.filter = 'grayscale(100%) brightness(0.5)';
              imageElement.style.opacity = '0.5';
            }
          } catch (err) {
            console.error('이미지 그레이스케일 적용 오류:', err);
          }
        }
      };
      
      // 원본 스타일 저장
      const originalContent = collectionRef.current;
      const originalStyles = {
        maxHeight: originalContent.style.maxHeight,
        height: originalContent.style.height,
        overflow: originalContent.style.overflow,
        position: originalContent.style.position
      };
      
      // 캡처 전에 스타일 변경
      originalContent.style.maxHeight = 'none';
      originalContent.style.height = 'auto';
      originalContent.style.overflow = 'visible';
      originalContent.style.position = 'relative';
      
      // 캡처 전 스타일 수정 - 텍스트 색상 강제 적용
      const textElements = originalContent.querySelectorAll('.collection-sword-name, .collection-sword-level, .collection-sword-power, .collection-sword-date, .collection-sword-status, h2, h3, span');
      textElements.forEach(el => {
        el.style.color = el.classList.contains('collection-sword-name') ? '#ffd700' : '#ffffff';
        if (el.classList.contains('set-sword-name')) {
          el.style.color = '#ffd700';
        }
        if (el.classList.contains('collection-sword-special')) {
          el.style.color = '#ff9800';
        }
        if (el.classList.contains('collection-sword-status')) {
          el.style.color = '#888888';
        }
        if (el.classList.contains('collection-percent')) {
          el.style.color = '#ffd700';
        }
      });
      
      // 미획득 검 아이템 배경 색상 어둡게
      const uncollectedItems = originalContent.querySelectorAll('.uncollected');
      uncollectedItems.forEach(item => {
        item.style.backgroundColor = '#1a1a2c';
      });
      
      // 미획득 검 이미지에 자바스크립트로 그레이스케일 적용
      await forceGrayscaleOnImages(originalContent);
      
      // 렌더링에 시간을 주기 위한 딜레이
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // html2canvas 로드
      const html2canvas = await loadHtml2Canvas();
      
      // 캡처 실행
      const canvas = await html2canvas(originalContent, {
        backgroundColor: '#2a2a3c',
        scale: 1.5,
        useCORS: true,
        allowTaint: true,
        logging: true,
        imageTimeout: 15000,
        onclone: async (document, clonedElement) => {
          // 클론된 요소에도 스타일 적용
          const clonedTexts = clonedElement.querySelectorAll('.collection-sword-name, .collection-sword-level, .collection-sword-power, .collection-sword-date, .collection-sword-status, h2, h3, span');
          clonedTexts.forEach(el => {
            el.style.color = el.classList.contains('collection-sword-name') ? '#ffd700' : '#ffffff';
            if (el.classList.contains('set-sword-name')) {
              el.style.color = '#ffd700';
            }
            if (el.classList.contains('collection-sword-special')) {
              el.style.color = '#ff9800';
            }
            if (el.classList.contains('collection-sword-status')) {
              el.style.color = '#888888';
            }
            if (el.classList.contains('collection-percent')) {
              el.style.color = '#ffd700';
            }
          });
          
          // 미획득 검 아이템 배경 색상 어둡게
          const clonedUncollectedItems = clonedElement.querySelectorAll('.uncollected');
          clonedUncollectedItems.forEach(item => {
            item.style.backgroundColor = '#1a1a2c';
          });
          
          // 클론된 요소에도 그레이스케일 적용
          await forceGrayscaleOnImages(clonedElement);
        }
      });
      
      // 원래 스타일로 복원
      Object.keys(originalStyles).forEach(key => {
        originalContent.style[key] = originalStyles[key];
      });
      
      // 캔버스를 이미지로 변환하여 다운로드
      const imageData = canvas.toDataURL('image/png');
      
      // 이미지 다운로드
      const link = document.createElement('a');
      link.href = imageData;
      link.download = `sword-collection-${new Date().toISOString().slice(0, 10)}.png`;
      link.click();
      
      // 알림 제거
      document.body.removeChild(captureNotice);
      
      // 완료 알림 표시
      const successNotice = document.createElement('div');
      successNotice.className = 'capture-success';
      successNotice.textContent = '컬렉션 이미지가 저장되었습니다!';
      document.body.appendChild(successNotice);
      
      // 3초 후 완료 알림 제거
      setTimeout(() => {
        document.body.removeChild(successNotice);
        setIsCapturing(false);
      }, 3000);
    } catch (error) {
      console.error('컬렉션 캡처 실패:', error);
      alert('컬렉션 캡처에 실패했습니다: ' + error.message);
      setIsCapturing(false);
    }
  };

  return (
    <div className="collection-modal">
      <div className="collection-content" ref={collectionRef}>
        <h2>검 컬렉션 <span className="collection-percent">({collectionPercent}% 완성)</span></h2>
        
        {/* 기본 검 진행 상태 */}
        <div className="collection-progress">
          <h3>일반 검</h3>
          <span>{collectedNormalCount}/{totalNormalSwords} 수집됨</span>
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${(collectedNormalCount / totalNormalSwords) * 100}%` }}
            ></div>
          </div>
        </div>
        
        {/* 일반 검 컬렉션 그리드 */}
        <div className="collection-grid">
          {normalSwords.map((sword) => (
            <div 
              key={`normal-${sword.level}`} 
              className={`collection-item ${sword.collected ? 'collected' : 'uncollected'}`}
            >
              <img 
                src={sword.imageSrc} 
                alt={sword.name} 
                crossOrigin="anonymous"
                className={`collection-sword-image ${!sword.collected ? 'grayscale' : ''}`}
              />
              <div className="collection-sword-info">
                <div className="collection-sword-name">{sword.name}</div>
                <div className="collection-sword-level">레벨: {sword.level}</div>
                <div className="collection-sword-power">공격력: {sword.power}</div>
                {sword.collected ? (
                  <div className="collection-sword-date">획득일: {sword.obtainedDate}</div>
                ) : (
                  <div className="collection-sword-status">미획득</div>
                )}
              </div>
            </div>
          ))}
        </div>
        
        {/* 세트 검 영역 */}
        <div className="collection-section set-items-section">
          <h3>세트 검</h3>
          <div className="collection-progress">
            <span>{collectedSetCount}/{totalSetSwords} 수집됨</span>
            <div className="progress-bar">
              <div 
                className="progress-fill set-progress-fill" 
                style={{ width: `${(collectedSetCount / totalSetSwords) * 100}%` }}
              ></div>
            </div>
          </div>
          
          {/* 세트 검 컬렉션 그리드 */}
          <div className="collection-grid">
            {setSwords.map((sword) => (
              <div 
                key={`set-${sword.setId}`} 
                className={`collection-item set-collection-item ${sword.collected ? 'collected' : 'uncollected'}`}
              >
                <div className="set-item-badge">세트</div>
                <img 
                  src={sword.imageSrc} 
                  alt={sword.name} 
                  crossOrigin="anonymous"
                  className={`collection-sword-image ${!sword.collected ? 'grayscale' : ''}`}
                />
                <div className="collection-sword-info">
                  <div className="collection-sword-name set-sword-name">{sword.name}</div>
                  <div className="collection-sword-power">공격력: {sword.power}</div>
                  {sword.special && (
                    <div className="collection-sword-special">특수 효과: {sword.special}</div>
                  )}
                  {sword.collected ? (
                    <div className="collection-sword-date">획득일: {sword.obtainedDate}</div>
                  ) : (
                    <div className="collection-sword-status">미획득</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* 워터마크 추가 */}
        <div className="collection-watermark">
          검 강화 게임 - {new Date().toLocaleDateString()}
        </div>
      </div>
      
      <div className="collection-actions">
        <button 
          className="capture-button" 
          onClick={captureCollection} 
          disabled={isCapturing}
        >
          {isCapturing ? '캡처 중...' : '컬렉션 캡처'}
        </button>
        <button className="close-button" onClick={onClose} disabled={isCapturing}>
          닫기
        </button>
      </div>
    </div>
  );
};

export default SwordCollection;