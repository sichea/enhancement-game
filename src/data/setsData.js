// src/data/setsData.js
const setsData = [
  {
    id: 1,
    name: "전설의 영웅 세트",
    description: "고대의 영웅이 사용했던 전설적인 세트입니다. 엄청난 힘을 발휘합니다.",
    requiredSwords: [1, 2, 3],  // 필요한 검 레벨
    resultSword: {
      name: "전설의 영웅 검",
      power: 500,
      imageSrc: "images/set_sword_hero.png", // 이미지 파일 필요
      special: "모든 공격에 25% 추가 데미지"
    }
  },
  {
    id: 2,
    name: "마법의 정령 세트",
    description: "자연의 정령의 힘을 담은 신비로운 세트입니다. 정령의 힘을 느껴보세요.",
    requiredSwords: [3, 5, 8],
    resultSword: {
      name: "정령의 검",
      power: 450,
      imageSrc: "images/set_sword_elemental.png", // 이미지 파일 필요
      special: "적에게 마법 데미지 추가"
    }
  },
  {
    id: 3,
    name: "고대 왕국의 세트",
    description: "잊혀진 왕국의 장인들이 만든 세트입니다. 왕실의 권위가 느껴집니다.",
    requiredSwords: [1, 6, 9],
    resultSword: {
      name: "왕국의 검",
      power: 480,
      imageSrc: "images/set_sword_kingdom.png", // 이미지 파일 필요
      special: "골드 획득량 15% 증가"
    }
  }
];

export default setsData;