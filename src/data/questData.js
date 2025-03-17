// src/data/questData.js
const questData = [
  {
    id: 1,
    name: '숲의 고블린 처치',
    description: '숲에 출몰하는 고블린 5마리를 처치하세요.',
    reward: 200,
    requireLevel: 1,
    completed: false
  },
  {
    id: 2,
    name: '동굴의 거미 퇴치',
    description: '동굴에 서식하는 거대 거미를 퇴치하세요.',
    reward: 500,
    requireLevel: 2,
    completed: false
  },
  {
    id: 3,
    name: '산적 두목 처치',
    description: '마을을 괴롭히는 산적 두목을 처치하세요.',
    reward: 1000,
    requireLevel: 3,
    completed: false
  },
  {
    id: 4,
    name: '저주받은 유물 회수',
    description: '폐허에서 저주받은 유물을 회수하세요.',
    reward: 1500,
    requireLevel: 4,
    completed: false
  },
  {
    id: 5,
    name: '언데드 군단 퇴치',
    description: '묘지에 출몰한 언데드 군단을 퇴치하세요.',
    reward: 2000,
    requireLevel: 5,
    completed: false
  },
  {
    id: 6,
    name: '드래곤 토벌',
    description: '산맥에 서식하는 드래곤을 토벌하세요.',
    reward: 5000,
    requireLevel: 6,
    completed: false
  }
];

// 모듈 내보내기
export default questData;