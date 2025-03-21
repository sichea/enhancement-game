// src/components/EnhancementParticles.jsx
import React, { useEffect, useRef } from 'react';

const EnhancementParticles = ({ active, success }) => {
  const particlesRef = useRef(null);
  
  useEffect(() => {
    if (!active || !particlesRef.current) return;
    
    // 기존 파티클 제거
    while (particlesRef.current.firstChild) {
      particlesRef.current.removeChild(particlesRef.current.firstChild);
    }
    
    // 성공/실패에 따른 파티클 색상 설정
    const particleColor = success ? '#ffd700' : '#e74c3c';
    
    // 파티클 생성
    const particleCount = success ? 50 : 20;
    
    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      particle.classList.add('particle');
      
      // 파티클 위치 및 크기 랜덤화
      const size = Math.floor(Math.random() * 6) + 4; // 4px ~ 10px
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      particle.style.background = particleColor;
      
      // 파티클 위치 및 움직임 설정
      const startX = 40 + Math.random() * 20;
      const startY = 30 + Math.random() * 40;
      const angle = Math.random() * Math.PI * 2; // 0-360도 랜덤 각도
      const distance = success ? 50 + Math.random() * 100 : 20 + Math.random() * 40;
      
      // 시작 위치 (검 중앙 부근)
      particle.style.left = `${startX}%`;
      particle.style.top = `${startY}%`;
      
      // 애니메이션 속성 추가
      const duration = 0.5 + Math.random() * 1; // 0.5-1.5초
      const delay = Math.random() * 0.3; // 0-0.3초 지연
      
      particle.style.animation = `success-particles ${duration}s ease-out ${delay}s forwards`;
      
      // translateX, translateY로 움직임
      const endX = startX + Math.cos(angle) * distance;
      const endY = startY + Math.sin(angle) * distance;
      particle.style.transform = `translate(${endX - startX}%, ${endY - startY}%)`;
      
      particlesRef.current.appendChild(particle);
    }
    
  }, [active, success]);
  
  return (
    <div 
      ref={particlesRef}
      className={`enhancement-particles ${active ? 'active' : ''}`}
    ></div>
  );
};

export default EnhancementParticles;