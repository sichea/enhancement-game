// src/utils/telegramUtils.js - 텔레그램 유틸리티
export const initTelegramWebApp = () => {
  if (window.Telegram?.WebApp) {
    window.Telegram.WebApp.expand(); // 전체 화면으로 확장
    window.Telegram.WebApp.ready(); // 웹앱이 준비되었음을 텔레그램에 알림
  }
};