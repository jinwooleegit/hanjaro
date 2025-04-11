const fs = require('fs');
const path = require('path');

/**
 * 8급 중급 한자 데이터 확장 스크립트
 * 기존의 8급 한자 데이터를 더 풍부하게 확장합니다.
 */

// 파일 경로 설정
const gradeDataDir = path.resolve(__dirname, '../data/new-structure/characters/by-grade');
const inputFilePath = path.join(gradeDataDir, 'grade_8.json');
const outputFilePath = path.join(gradeDataDir, 'grade_8.json');

// 데이터 읽기
let grade8Data;
try {
  const fileContent = fs.readFileSync(inputFilePath, 'utf8');
  grade8Data = JSON.parse(fileContent);
  console.log(`Successfully read grade 8 data: ${grade8Data.characters.length} characters`);
} catch (error) {
  console.error(`Error reading grade 8 data: ${error.message}`);
  process.exit(1);
}

// 추가할 한자 데이터
const additionalCharacters = [
  {
    "id": "HJ-08-0004-6C60",
    "character": "水",
    "unicode": "6C60",
    "meaning": "물 수",
    "pronunciation": "수",
    "stroke_count": 4,
    "radical": "水",
    "grade": 8,
    "order": 4,
    "tags": [
      "radical:水",
      "strokes:4",
      "category:nature",
      "level:intermediate"
    ],
    "extended_data": {
      "detailed_meaning": "물, 액체, 수분, 수액의 의미를 가진 한자",
      "etymology": "물이 흘러내리는 모습을 본뜬 상형문자입니다.",
      "mnemonics": "물이 흐르는 모습을 형상화한 것으로 '물'을 의미한다고 기억할 수 있습니다.",
      "common_words": [
        {
          "word": "水分",
          "meaning": "수분",
          "pronunciation": "수분",
          "example_sentence": "水分을 충분히 섭취하세요.",
          "usage": "물기를 표현할 때 사용"
        },
        {
          "word": "水泳",
          "meaning": "수영",
          "pronunciation": "수영",
          "example_sentence": "水泳을 배우다.",
          "usage": "물에서 헤엄치는 것을 표현할 때 사용"
        },
        {
          "word": "水曜日",
          "meaning": "수요일",
          "pronunciation": "수요일",
          "example_sentence": "明日은 水曜日이다.",
          "usage": "요일을 표현할 때 사용"
        }
      ],
      "example_sentences": [
        {
          "sentence": "水落石出",
          "meaning": "수락석출 - 물이 빠지면 돌이 드러남",
          "pronunciation": "수락석출",
          "difficulty": "intermediate"
        },
        {
          "sentence": "飲水思源",
          "meaning": "음수사원 - 물을 마시면서 그 근원을 생각함",
          "pronunciation": "음수사원",
          "difficulty": "intermediate"
        }
      ],
      "cultural_notes": "동아시아 문화에서 '水'는 오행(五行)의 하나로, 생명과 정화, 유연함의 상징입니다. 도교에서는 '上善若水'(상선약수)라 하여 가장 높은 선은 물과 같다고 표현했는데, 이는 물이 낮은 곳에 머물고 모든 것에 이로움을 주기 때문입니다.",
      "pronunciation_guide": {
        "korean": "수 (su)",
        "japanese_on": "すい (sui)",
        "japanese_kun": "みず (mizu)",
        "mandarin": "shuǐ",
        "cantonese": "seoi2"
      },
      "stroke_order": {
        "description": "중앙의 세로획을 먼저 긋고, 왼쪽 빗금, 오른쪽 빗금, 마지막으로 아래 가로획을 긋습니다.",
        "directions": []
      },
      "related_characters": [
        "川", "江", "湖", "海"
      ],
      "variants": [],
      "level_info": {
        "jlpt": "N5",
        "hsk": "1급",
        "korean_standard": "초급"
      }
    }
  },
  {
    "id": "HJ-08-0005-6728",
    "character": "木",
    "unicode": "6728",
    "meaning": "나무 목",
    "pronunciation": "목",
    "stroke_count": 4,
    "radical": "木",
    "grade": 8,
    "order": 5,
    "tags": [
      "radical:木",
      "strokes:4",
      "category:nature",
      "level:intermediate"
    ],
    "extended_data": {
      "detailed_meaning": "나무, 목재, 목질의 의미를 가진 한자",
      "etymology": "나무의 형태를 단순화한 상형문자입니다. 뿌리, 줄기, 가지를 표현했습니다.",
      "mnemonics": "나무의 줄기와 가지를 형상화한 것으로 '나무'를 의미한다고 기억할 수 있습니다.",
      "common_words": [
        {
          "word": "木曜日",
          "meaning": "목요일",
          "pronunciation": "목요일",
          "example_sentence": "明日은 木曜日이다.",
          "usage": "요일을 표현할 때 사용"
        },
        {
          "word": "木材",
          "meaning": "목재",
          "pronunciation": "목재",
          "example_sentence": "品質 좋은 木材를 사용했다.",
          "usage": "건축이나 가구에 쓰이는 재료를 표현할 때 사용"
        },
        {
          "word": "木工",
          "meaning": "목공",
          "pronunciation": "목공",
          "example_sentence": "木工 기술을 배우다.",
          "usage": "나무를 다루는 일을 표현할 때 사용"
        }
      ],
      "example_sentences": [
        {
          "sentence": "見木不見林",
          "meaning": "견목불견림 - 나무는 보고 숲은 보지 못함",
          "pronunciation": "견목불견림",
          "difficulty": "intermediate"
        },
        {
          "sentence": "木已成舟",
          "meaning": "목이성주 - 나무가 이미 배가 됨",
          "pronunciation": "목이성주",
          "difficulty": "intermediate"
        }
      ],
      "cultural_notes": "동아시아 문화에서 '木'은 오행(五行)의 하나로, 성장과 생명력의 상징입니다. 중국의 전통 가구와 건축물, 한국의 목조 건축, 일본의 종이문(障子)과 같은 전통 문화에 깊이 연관되어 있습니다. 또한 나무는 세대를 이어가는 생명의 상징으로, 가문의 계보를 '가계수(家系樹)'라고 표현하기도 합니다.",
      "pronunciation_guide": {
        "korean": "목 (mok)",
        "japanese_on": "もく (moku), ぼく (boku)",
        "japanese_kun": "き (ki)",
        "mandarin": "mù",
        "cantonese": "muk6"
      },
      "stroke_order": {
        "description": "세로획을 먼저 긋고, 왼쪽 빗금, 오른쪽 빗금, 마지막으로 아래 가로획을 긋습니다.",
        "directions": []
      },
      "related_characters": [
        "林", "森", "樹", "叢"
      ],
      "variants": [],
      "level_info": {
        "jlpt": "N5",
        "hsk": "1급",
        "korean_standard": "초급"
      }
    }
  },
  {
    "id": "HJ-08-0006-4EBA",
    "character": "人",
    "unicode": "4EBA",
    "meaning": "사람 인",
    "pronunciation": "인",
    "stroke_count": 2,
    "radical": "人",
    "grade": 8,
    "order": 6,
    "tags": [
      "radical:人",
      "strokes:2",
      "category:person",
      "level:intermediate"
    ],
    "extended_data": {
      "detailed_meaning": "사람, 인류, 인간, 타인의 의미를 가진 한자",
      "etymology": "서 있는 사람의 모습을 단순화한 상형문자입니다.",
      "mnemonics": "두 다리로 서 있는 사람의 모습으로 '사람'을 의미한다고 기억할 수 있습니다.",
      "common_words": [
        {
          "word": "人間",
          "meaning": "인간",
          "pronunciation": "인간",
          "example_sentence": "人間의 본성에 대해 생각했다.",
          "usage": "사람을 표현할 때 사용"
        },
        {
          "word": "外人",
          "meaning": "외인",
          "pronunciation": "외인",
          "example_sentence": "그는 이 모임에서 外人이다.",
          "usage": "외부인을 표현할 때 사용"
        },
        {
          "word": "人口",
          "meaning": "인구",
          "pronunciation": "인구",
          "example_sentence": "이 도시의 人口는 100만 명이다.",
          "usage": "사람의 수를 표현할 때 사용"
        }
      ],
      "example_sentences": [
        {
          "sentence": "人生如夢",
          "meaning": "인생여몽 - 인생은 꿈과 같다",
          "pronunciation": "인생여몽",
          "difficulty": "intermediate"
        },
        {
          "sentence": "人無完人",
          "meaning": "인무완인 - 사람에게 완벽한 사람은 없다",
          "pronunciation": "인무완인",
          "difficulty": "intermediate"
        }
      ],
      "cultural_notes": "동아시아 문화에서 '人'은 개인으로서의 인간뿐만 아니라 사회적 관계 속에서의 인간을 의미합니다. 유교에서는 '仁'(어질 인)이 '人'에서 파생된 글자로, 사람됨의 핵심 덕목으로 여겨졌습니다. 특히 '君子'(군자)라는 이상적 인간상을 추구하며, 끊임없는 자기 수양과 도덕적 발전을 강조했습니다.",
      "pronunciation_guide": {
        "korean": "인 (in)",
        "japanese_on": "じん (jin), にん (nin)",
        "japanese_kun": "ひと (hito)",
        "mandarin": "rén",
        "cantonese": "jan4"
      },
      "stroke_order": {
        "description": "왼쪽 빗금을 먼저 긋고, 오른쪽 빗금을 긋습니다.",
        "directions": []
      },
      "related_characters": [
        "仁", "個", "僧", "僚"
      ],
      "variants": ["亻"],
      "level_info": {
        "jlpt": "N5",
        "hsk": "1급",
        "korean_standard": "초급"
      }
    }
  },
  {
    "id": "HJ-08-0007-65E5",
    "character": "日",
    "unicode": "65E5",
    "meaning": "날 일",
    "pronunciation": "일",
    "stroke_count": 4,
    "radical": "日",
    "grade": 8,
    "order": 7,
    "tags": [
      "radical:日",
      "strokes:4",
      "category:time",
      "level:intermediate"
    ],
    "extended_data": {
      "detailed_meaning": "날, 태양, 하루, 일요일의 의미를 가진 한자",
      "etymology": "태양의 모습을 단순화한 상형문자입니다. 중간에 획이 있는 것은 태양의 흑점을 표현한 것입니다.",
      "mnemonics": "태양의 모습을 네모 안에 표현한 것으로 '날' 또는 '태양'을 의미한다고 기억할 수 있습니다.",
      "common_words": [
        {
          "word": "日本",
          "meaning": "일본",
          "pronunciation": "일본",
          "example_sentence": "日本에 여행 갔다.",
          "usage": "국가 이름을 표현할 때 사용"
        },
        {
          "word": "日曜日",
          "meaning": "일요일",
          "pronunciation": "일요일",
          "example_sentence": "오늘은 日曜日이다.",
          "usage": "요일을 표현할 때 사용"
        },
        {
          "word": "明日",
          "meaning": "내일",
          "pronunciation": "내일",
          "example_sentence": "明日 만나자.",
          "usage": "다음 날을 표현할 때 사용"
        }
      ],
      "example_sentences": [
        {
          "sentence": "日月如梭",
          "meaning": "일월여사 - 해와 달이 북처럼 빨리 지나감",
          "pronunciation": "일월여사",
          "difficulty": "intermediate"
        },
        {
          "sentence": "日新月異",
          "meaning": "일신월이 - 날로 새롭고 달로 다름",
          "pronunciation": "일신월이",
          "difficulty": "intermediate"
        }
      ],
      "cultural_notes": "동아시아 문화에서 '日'은 시간의 기본 단위이자 태양 숭배와 연관된 중요한 상징입니다. 특히 일본(日本)은 '해가 뜨는 나라'라는 의미를 담고 있으며, 국기에도 태양이 표현되어 있습니다. 또한 농경 사회에서 태양의 움직임은 계절과 농사의 시기를 알려주는 중요한 지표였습니다.",
      "pronunciation_guide": {
        "korean": "일 (il)",
        "japanese_on": "にち (nichi), じつ (jitsu)",
        "japanese_kun": "ひ (hi), か (ka)",
        "mandarin": "rì",
        "cantonese": "jat6"
      },
      "stroke_order": {
        "description": "외곽선을 먼저 그리고 중앙의 가로획을 긋습니다.",
        "directions": []
      },
      "related_characters": [
        "月", "星", "晴", "曜"
      ],
      "variants": [],
      "level_info": {
        "jlpt": "N5",
        "hsk": "1급",
        "korean_standard": "초급"
      }
    }
  }
];

// 데이터 확장
grade8Data.characters = [...grade8Data.characters, ...additionalCharacters];
grade8Data.metadata.total_characters = grade8Data.characters.length;
grade8Data.metadata.last_updated = new Date().toISOString();

// 파일 저장
try {
  fs.writeFileSync(outputFilePath, JSON.stringify(grade8Data, null, 2), 'utf8');
  console.log(`Enhanced grade 8 data saved with ${grade8Data.characters.length} characters`);
} catch (error) {
  console.error(`Error saving enhanced grade 8 data: ${error.message}`);
  process.exit(1);
} 