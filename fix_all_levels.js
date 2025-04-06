const fs = require('fs');
const path = require('path');

// 데이터베이스 파일 경로
const dbPath = path.join(__dirname, 'data', 'hanja_database_fixed.json');

try {
  // 데이터베이스 파일 읽기
  const data = fs.readFileSync(dbPath, 'utf8');
  const db = JSON.parse(data);
  
  console.log('데이터베이스 로드 완료');
  
  // 레벨 1 (초등 1학년) 데이터 추가
  if (db.basic.levels.level1.characters.length === 0) {
    db.basic.levels.level1.characters = [
      {
        "character": "一",
        "meaning": "한 일",
        "pronunciation": "일",
        "stroke_count": 1,
        "radical": "一",
        "examples": [
          { "word": "一日", "meaning": "하루", "pronunciation": "일일" },
          { "word": "一年", "meaning": "일 년", "pronunciation": "일년" }
        ],
        "level": 1,
        "order": 1
      },
      {
        "character": "二",
        "meaning": "두 이",
        "pronunciation": "이",
        "stroke_count": 2,
        "radical": "二",
        "examples": [
          { "word": "二月", "meaning": "이월", "pronunciation": "이월" },
          { "word": "二十", "meaning": "스물", "pronunciation": "이십" }
        ],
        "level": 1,
        "order": 2
      },
      {
        "character": "三",
        "meaning": "석 삼",
        "pronunciation": "삼",
        "stroke_count": 3,
        "radical": "一",
        "examples": [
          { "word": "三月", "meaning": "삼월", "pronunciation": "삼월" },
          { "word": "三角", "meaning": "삼각형", "pronunciation": "삼각" }
        ],
        "level": 1,
        "order": 3
      },
      {
        "character": "人",
        "meaning": "사람 인",
        "pronunciation": "인",
        "stroke_count": 2,
        "radical": "人",
        "examples": [
          { "word": "人間", "meaning": "인간", "pronunciation": "인간" },
          { "word": "人口", "meaning": "인구", "pronunciation": "인구" }
        ],
        "level": 1,
        "order": 4
      },
      {
        "character": "大",
        "meaning": "큰 대",
        "pronunciation": "대",
        "stroke_count": 3,
        "radical": "大",
        "examples": [
          { "word": "大學", "meaning": "대학", "pronunciation": "대학" },
          { "word": "大韓", "meaning": "대한", "pronunciation": "대한" }
        ],
        "level": 1,
        "order": 5
      }
    ];
    console.log('레벨 1 데이터 추가 완료');
  }

  // 레벨 2 (초등 2-3학년) 데이터 추가
  if (db.basic.levels.level2.characters.length === 0) {
    db.basic.levels.level2.characters = [
      {
        "character": "山",
        "meaning": "뫼 산",
        "pronunciation": "산",
        "stroke_count": 3,
        "radical": "山",
        "examples": [
          { "word": "山水", "meaning": "산과 물", "pronunciation": "산수" },
          { "word": "登山", "meaning": "등산", "pronunciation": "등산" }
        ],
        "level": 2,
        "order": 1
      },
      {
        "character": "水",
        "meaning": "물 수",
        "pronunciation": "수",
        "stroke_count": 4,
        "radical": "水",
        "examples": [
          { "word": "水曜日", "meaning": "수요일", "pronunciation": "수요일" },
          { "word": "水泳", "meaning": "수영", "pronunciation": "수영" }
        ],
        "level": 2,
        "order": 2
      },
      {
        "character": "木",
        "meaning": "나무 목",
        "pronunciation": "목",
        "stroke_count": 4,
        "radical": "木",
        "examples": [
          { "word": "木曜日", "meaning": "목요일", "pronunciation": "목요일" },
          { "word": "木材", "meaning": "목재", "pronunciation": "목재" }
        ],
        "level": 2,
        "order": 3
      },
      {
        "character": "日",
        "meaning": "날 일",
        "pronunciation": "일",
        "stroke_count": 4,
        "radical": "日",
        "examples": [
          { "word": "日曜日", "meaning": "일요일", "pronunciation": "일요일" },
          { "word": "日本", "meaning": "일본", "pronunciation": "일본" }
        ],
        "level": 2,
        "order": 4
      },
      {
        "character": "月",
        "meaning": "달 월",
        "pronunciation": "월",
        "stroke_count": 4,
        "radical": "月",
        "examples": [
          { "word": "月曜日", "meaning": "월요일", "pronunciation": "월요일" },
          { "word": "一月", "meaning": "일월", "pronunciation": "일월" }
        ],
        "level": 2,
        "order": 5
      }
    ];
    console.log('레벨 2 데이터 추가 완료');
  }

  // 레벨 3 (초등 4학년) 데이터 추가
  if (db.basic.levels.level3.characters.length === 0) {
    db.basic.levels.level3.characters = [
      {
        "character": "金",
        "meaning": "쇠 금",
        "pronunciation": "금",
        "stroke_count": 8,
        "radical": "金",
        "examples": [
          { "word": "金曜日", "meaning": "금요일", "pronunciation": "금요일" },
          { "word": "金銀", "meaning": "금과 은", "pronunciation": "금은" }
        ],
        "level": 3,
        "order": 1
      },
      {
        "character": "火",
        "meaning": "불 화",
        "pronunciation": "화",
        "stroke_count": 4,
        "radical": "火",
        "examples": [
          { "word": "火曜日", "meaning": "화요일", "pronunciation": "화요일" },
          { "word": "火山", "meaning": "화산", "pronunciation": "화산" }
        ],
        "level": 3,
        "order": 2
      },
      {
        "character": "土",
        "meaning": "흙 토",
        "pronunciation": "토",
        "stroke_count": 3,
        "radical": "土",
        "examples": [
          { "word": "土曜日", "meaning": "토요일", "pronunciation": "토요일" },
          { "word": "國土", "meaning": "국토", "pronunciation": "국토" }
        ],
        "level": 3,
        "order": 3
      },
      {
        "character": "心",
        "meaning": "마음 심",
        "pronunciation": "심",
        "stroke_count": 4,
        "radical": "心",
        "examples": [
          { "word": "心臟", "meaning": "심장", "pronunciation": "심장" },
          { "word": "中心", "meaning": "중심", "pronunciation": "중심" }
        ],
        "level": 3,
        "order": 4
      },
      {
        "character": "手",
        "meaning": "손 수",
        "pronunciation": "수",
        "stroke_count": 4,
        "radical": "手",
        "examples": [
          { "word": "手帳", "meaning": "수첩", "pronunciation": "수첩" },
          { "word": "拍手", "meaning": "박수", "pronunciation": "박수" }
        ],
        "level": 3,
        "order": 5
      }
    ];
    console.log('레벨 3 데이터 추가 완료');
  }

  // 레벨 4 (초등 5-6학년) 데이터 추가
  if (db.basic.levels.level4.characters.length === 0) {
    db.basic.levels.level4.characters = [
      {
        "character": "天",
        "meaning": "하늘 천",
        "pronunciation": "천",
        "stroke_count": 4,
        "radical": "大",
        "examples": [
          { "word": "天國", "meaning": "천국", "pronunciation": "천국" },
          { "word": "天氣", "meaning": "천기", "pronunciation": "천기" }
        ],
        "level": 4,
        "order": 1
      },
      {
        "character": "地",
        "meaning": "땅 지",
        "pronunciation": "지",
        "stroke_count": 6,
        "radical": "土",
        "examples": [
          { "word": "地球", "meaning": "지구", "pronunciation": "지구" },
          { "word": "土地", "meaning": "토지", "pronunciation": "토지" }
        ],
        "level": 4,
        "order": 2
      },
      {
        "character": "學",
        "meaning": "배울 학",
        "pronunciation": "학",
        "stroke_count": 16,
        "radical": "子",
        "examples": [
          { "word": "學校", "meaning": "학교", "pronunciation": "학교" },
          { "word": "大學", "meaning": "대학", "pronunciation": "대학" }
        ],
        "level": 4,
        "order": 3
      },
      {
        "character": "生",
        "meaning": "날 생",
        "pronunciation": "생",
        "stroke_count": 5,
        "radical": "生",
        "examples": [
          { "word": "生日", "meaning": "생일", "pronunciation": "생일" },
          { "word": "學生", "meaning": "학생", "pronunciation": "학생" }
        ],
        "level": 4,
        "order": 4
      },
      {
        "character": "先",
        "meaning": "먼저 선",
        "pronunciation": "선",
        "stroke_count": 6,
        "radical": "儿",
        "examples": [
          { "word": "先生", "meaning": "선생", "pronunciation": "선생" },
          { "word": "先輩", "meaning": "선배", "pronunciation": "선배" }
        ],
        "level": 4,
        "order": 5
      }
    ];
    console.log('레벨 4 데이터 추가 완료');
  }

  // 레벨 6 (중학교 2학년) 데이터 추가
  if (db.basic.levels.level6.characters.length === 0) {
    db.basic.levels.level6.characters = [
      {
        "character": "過",
        "meaning": "지날 과",
        "pronunciation": "과",
        "stroke_count": 13,
        "radical": "辵",
        "examples": [
          { "word": "通過", "meaning": "통과", "pronunciation": "통과" },
          { "word": "過去", "meaning": "과거", "pronunciation": "과거" }
        ],
        "level": 6,
        "order": 1
      },
      {
        "character": "程",
        "meaning": "정도 정",
        "pronunciation": "정",
        "stroke_count": 12,
        "radical": "禾",
        "examples": [
          { "word": "程度", "meaning": "정도", "pronunciation": "정도" },
          { "word": "課程", "meaning": "과정", "pronunciation": "과정" }
        ],
        "level": 6,
        "order": 2
      },
      {
        "character": "度",
        "meaning": "법도 도",
        "pronunciation": "도",
        "stroke_count": 9,
        "radical": "广",
        "examples": [
          { "word": "程度", "meaning": "정도", "pronunciation": "정도" },
          { "word": "態度", "meaning": "태도", "pronunciation": "태도" }
        ],
        "level": 6,
        "order": 3
      },
      {
        "character": "次",
        "meaning": "버금 차",
        "pronunciation": "차",
        "stroke_count": 6,
        "radical": "欠",
        "examples": [
          { "word": "次第", "meaning": "차례", "pronunciation": "차제" },
          { "word": "一次", "meaning": "일차", "pronunciation": "일차" }
        ],
        "level": 6,
        "order": 4
      },
      {
        "character": "序",
        "meaning": "차례 서",
        "pronunciation": "서",
        "stroke_count": 7,
        "radical": "广",
        "examples": [
          { "word": "序論", "meaning": "서론", "pronunciation": "서론" },
          { "word": "秩序", "meaning": "질서", "pronunciation": "질서" }
        ],
        "level": 6,
        "order": 5
      }
    ];
    console.log('레벨 6 데이터 추가 완료');
  }

  // 업데이트된 데이터베이스를 파일에 저장
  fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), 'utf8');
  console.log('데이터베이스 저장 완료');
  console.log('모든 레벨에 샘플 데이터가 추가되었습니다.');

} catch (error) {
  console.error('오류 발생:', error);
} 