const fs = require('fs');
const path = require('path');

// 데이터베이스 파일 로드
const filePath = path.join(__dirname, 'data', 'hanja_database_fixed.json');

try {
  const fileContent = fs.readFileSync(filePath, 'utf8');
  const db = JSON.parse(fileContent);
  
  console.log('데이터베이스 로드 성공');
  
  // level5 데이터가 비어있거나 없는 경우 샘플 데이터 추가
  if (!db.basic.levels.level5 || !db.basic.levels.level5.characters || db.basic.levels.level5.characters.length === 0) {
    console.log('level5에 샘플 데이터를 추가합니다.');
    
    // level5가 없으면 생성
    if (!db.basic.levels.level5) {
      db.basic.levels.level5 = {
        name: "5단계 (중학교 1학년 수준)",
        description: "중학교 1학년 과정에서 배우는 한자 100자",
        characters: []
      };
    }
    
    // 샘플 데이터 추가
    db.basic.levels.level5.characters = [
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
      },
      {
        "character": "果",
        "meaning": "열매 과",
        "pronunciation": "과",
        "stroke_count": 8,
        "radical": "木",
        "examples": [
          {
            "word": "結果",
            "meaning": "결과",
            "pronunciation": "결과"
          },
          {
            "word": "果物",
            "meaning": "과일",
            "pronunciation": "과물"
          }
        ],
        "level": 5,
        "order": 4
      },
      {
        "character": "修",
        "meaning": "닦을 수",
        "pronunciation": "수",
        "stroke_count": 10,
        "radical": "彡",
        "examples": [
          {
            "word": "修理",
            "meaning": "수리",
            "pronunciation": "수리"
          },
          {
            "word": "修正",
            "meaning": "수정",
            "pronunciation": "수정"
          }
        ],
        "level": 5,
        "order": 5
      }
    ];
    
    // 파일 저장
    fs.writeFileSync(filePath, JSON.stringify(db, null, 2), 'utf8');
    console.log('level5에 샘플 데이터를 추가했습니다.');
    console.log(`데이터베이스가 다음 위치에 저장되었습니다: ${filePath}`);
    console.log('서버를 재시작하세요.');
  } else {
    console.log(`level5에 이미 ${db.basic.levels.level5.characters.length}개의 한자 데이터가 있습니다.`);
  }
} catch (error) {
  console.error('데이터베이스 처리 중 오류 발생:', error);
} 