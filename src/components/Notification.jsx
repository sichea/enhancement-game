// src/components/Notification.jsx
import React, { useEffect } from 'react';

const Notification = ({ message, onHide, duration = 3000 }) => {
  useEffect(() => {
    // 지정된 시간 후 알림 숨기기
    const timer = setTimeout(() => {
      onHide();
    }, duration);

    // 컴포넌트가 언마운트되면 타이머 정리
    return () => clearTimeout(timer);
  }, [onHide, duration]);

  return (
    <div className="notification">
      {message}
    </div>
  );
};

export default Notification;