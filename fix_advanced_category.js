const fs = require('fs');
const path = require('path');

// 데이터베이스 파일 경로
const dbPath = path.join(__dirname, 'data', 'hanja_database_fixed.json');

try {
  // 데이터베이스 파일 읽기
  const data = fs.readFileSync(dbPath, 'utf8');
  const db = JSON.parse(data);
  
  console.log('데이터베이스 로드 완료');
  
  // advanced 카테고리가 없으면 추가
  if (!db.advanced) {
    console.log('advanced 카테고리 추가 중...');
    
    db.advanced = {
      "name": "전문분야 한자",
      "description": "전문 분야별 자주 사용되는 한자",
      "total_characters": 100,
      "levels": {
        "level1": {
          "name": "전문분야 1 (의학 및 과학 분야 한자)",
          "description": "의학 및 과학 분야에서 자주 사용되는 한자",
          "characters": [
            {
              "character": "醫",
              "meaning": "의사 의",
              "pronunciation": "의",
              "stroke_count": 18,
              "radical": "酉",
              "examples": [
                { "word": "醫師", "meaning": "의사", "pronunciation": "의사" },
                { "word": "醫學", "meaning": "의학", "pronunciation": "의학" }
              ],
              "level": 7,
              "order": 1
            },
            {
              "character": "藥",
              "meaning": "약 약",
              "pronunciation": "약",
              "stroke_count": 19,
              "radical": "艸",
              "examples": [
                { "word": "藥品", "meaning": "약품", "pronunciation": "약품" },
                { "word": "漢藥", "meaning": "한약", "pronunciation": "한약" }
              ],
              "level": 7,
              "order": 2
            },
            {
              "character": "病",
              "meaning": "병 병",
              "pronunciation": "병",
              "stroke_count": 10,
              "radical": "疒",
              "examples": [
                { "word": "病院", "meaning": "병원", "pronunciation": "병원" },
                { "word": "疾病", "meaning": "질병", "pronunciation": "질병" }
              ],
              "level": 7,
              "order": 3
            },
            {
              "character": "科",
              "meaning": "과목 과",
              "pronunciation": "과",
              "stroke_count": 9,
              "radical": "禾",
              "examples": [
                { "word": "科學", "meaning": "과학", "pronunciation": "과학" },
                { "word": "內科", "meaning": "내과", "pronunciation": "내과" }
              ],
              "level": 7,
              "order": 4
            },
            {
              "character": "化",
              "meaning": "될 화",
              "pronunciation": "화",
              "stroke_count": 4,
              "radical": "匕",
              "examples": [
                { "word": "化學", "meaning": "화학", "pronunciation": "화학" },
                { "word": "變化", "meaning": "변화", "pronunciation": "변화" }
              ],
              "level": 7,
              "order": 5
            }
          ]
        },
        "level2": {
          "name": "전문분야 2 (법률 및 경제 분야 한자)",
          "description": "법률 및 경제 분야에서 자주 사용되는 한자",
          "characters": [
            {
              "character": "法",
              "meaning": "법 법",
              "pronunciation": "법",
              "stroke_count": 8,
              "radical": "氵",
              "examples": [
                { "word": "法律", "meaning": "법률", "pronunciation": "법률" },
                { "word": "法規", "meaning": "법규", "pronunciation": "법규" }
              ],
              "level": 8,
              "order": 1
            },
            {
              "character": "律",
              "meaning": "법칙 률",
              "pronunciation": "률",
              "stroke_count": 9,
              "radical": "彳",
              "examples": [
                { "word": "法律", "meaning": "법률", "pronunciation": "법률" },
                { "word": "規律", "meaning": "규율", "pronunciation": "규율" }
              ],
              "level": 8,
              "order": 2
            },
            {
              "character": "稅",
              "meaning": "세금 세",
              "pronunciation": "세",
              "stroke_count": 12,
              "radical": "禾",
              "examples": [
                { "word": "稅金", "meaning": "세금", "pronunciation": "세금" },
                { "word": "所得稅", "meaning": "소득세", "pronunciation": "소득세" }
              ],
              "level": 8,
              "order": 3
            },
            {
              "character": "經",
              "meaning": "지날 경",
              "pronunciation": "경",
              "stroke_count": 13,
              "radical": "糸",
              "examples": [
                { "word": "經濟", "meaning": "경제", "pronunciation": "경제" },
                { "word": "經營", "meaning": "경영", "pronunciation": "경영" }
              ],
              "level": 8,
              "order": 4
            },
            {
              "character": "濟",
              "meaning": "건널 제",
              "pronunciation": "제",
              "stroke_count": 17,
              "radical": "氵",
              "examples": [
                { "word": "經濟", "meaning": "경제", "pronunciation": "경제" },
                { "word": "救濟", "meaning": "구제", "pronunciation": "구제" }
              ],
              "level": 8,
              "order": 5
            }
          ]
        }
      }
    };
    
    // 업데이트된 데이터베이스를 파일에 저장
    fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), 'utf8');
    console.log('advanced 카테고리 추가 완료');
  } else {
    console.log('advanced 카테고리가 이미 존재합니다.');
  }

} catch (error) {
  console.error('오류 발생:', error);
} 