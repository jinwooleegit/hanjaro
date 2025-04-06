const fs = require('fs');
const path = require('path');

// 새로운 데이터베이스 생성
const newDatabase = {
  basic: {
    name: "초등학생용 기초 한자",
    description: "초등학생과 중학생을 위한 한자 모음",
    total_characters: 620,
    levels: {
      level1: {
        name: "1단계 (초등 1학년 수준)",
        description: "초등학교 1학년 과정에서 배우는 한자",
        characters: []
      },
      level2: {
        name: "2단계 (초등 2-3학년 수준)",
        description: "초등학교 2-3학년 과정에서 배우는 한자",
        characters: []
      },
      level3: {
        name: "3단계 (초등 4학년 수준)",
        description: "초등학교 4학년 과정에서 배우는 한자",
        characters: []
      },
      level4: {
        name: "4단계 (초등 5-6학년 수준)",
        description: "초등학교 5-6학년 과정에서 배우는 한자",
        characters: []
      },
      level5: {
        name: "5단계 (중학교 1학년 수준)",
        description: "중학교 1학년 과정에서 배우는 한자 100자",
        characters: [
          {
            "character": "功",
            "meaning": "공 공",
            "pronunciation": "공",
            "stroke_count": 5,
            "radical": "力",
            "examples": [
              {
                "word": "成功",
                "meaning": "성공",
                "pronunciation": "성공"
              },
              {
                "word": "功績",
                "meaning": "공적",
                "pronunciation": "공적"
              }
            ],
            "level": 5,
            "order": 1
          },
          {
            "character": "績",
            "meaning": "길쌈할 적",
            "pronunciation": "적",
            "stroke_count": 17,
            "radical": "糸",
            "examples": [
              {
                "word": "功績",
                "meaning": "공적",
                "pronunciation": "공적"
              },
              {
                "word": "成績",
                "meaning": "성적",
                "pronunciation": "성적"
              }
            ],
            "level": 5,
            "order": 2
          },
          {
            "character": "結",
            "meaning": "맺을 결",
            "pronunciation": "결",
            "stroke_count": 12,
            "radical": "糸",
            "examples": [
              {
                "word": "結果",
                "meaning": "결과",
                "pronunciation": "결과"
              },
              {
                "word": "結論",
                "meaning": "결론",
                "pronunciation": "결론"
              }
            ],
            "level": 5,
            "order": 3
          }
        ]
      },
      level6: {
        name: "6단계 (중학교 2학년 수준)",
        description: "중학교 2학년 과정에서 배우는 한자",
        characters: []
      }
    }
  }
};

// 파일 저장
const filePath = path.join(__dirname, 'data', 'hanja_database_fixed.json');
fs.writeFileSync(filePath, JSON.stringify(newDatabase, null, 2), 'utf8');

console.log(`데이터베이스가 다음 위치에 저장되었습니다: ${filePath}`);
console.log('모든 레벨을 포함한 데이터로 저장했습니다. 서버를 재시작하세요.'); 