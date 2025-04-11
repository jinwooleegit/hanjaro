const fs = require('fs');
const path = require('path');

/**
 * 6급 중급 한자 데이터 확장 스크립트
 * 기존의 6급 한자 데이터를 더 풍부하게 확장합니다.
 */

// 파일 경로 설정
const gradeDataDir = path.resolve(__dirname, '../data/new-structure/characters/by-grade');
const inputFilePath = path.join(gradeDataDir, 'grade_6.json');
const outputFilePath = path.join(gradeDataDir, 'grade_6.json');

// 데이터 읽기
let grade6Data;
try {
  const fileContent = fs.readFileSync(inputFilePath, 'utf8');
  grade6Data = JSON.parse(fileContent);
  console.log(`Successfully read grade 6 data: ${grade6Data.characters.length} characters`);
} catch (error) {
  console.error(`Error reading grade 6 data: ${error.message}`);
  process.exit(1);
}

// 추가할 한자 데이터
const additionalCharacters = [
  {
    "id": "HJ-06-0004-9AD8",
    "character": "高",
    "unicode": "9AD8",
    "meaning": "높을 고",
    "pronunciation": "고",
    "stroke_count": 10,
    "radical": "高",
    "grade": 6,
    "order": 4,
    "tags": [
      "radical:高",
      "strokes:10",
      "category:attribute",
      "level:intermediate"
    ],
    "extended_data": {
      "detailed_meaning": "높다, 고상하다, 고급의, 높이의 의미를 가진 한자",
      "etymology": "건물 위에 지붕이 있고 그 위에 누각이 있는 것을 표현한 형태로, '높다'는 의미를 가지게 되었습니다.",
      "mnemonics": "높은 건물 위에 다른 층(亠)이 있는 모습으로 '높다'를 의미한다고 기억할 수 있습니다.",
      "common_words": [
        {
          "word": "高級",
          "meaning": "고급",
          "pronunciation": "고급",
          "example_sentence": "高級 호텔에서 묵었다.",
          "usage": "품질이나 수준이 높을 때 사용"
        },
        {
          "word": "最高",
          "meaning": "최고",
          "pronunciation": "최고",
          "example_sentence": "그는 最高의 선수이다.",
          "usage": "가장 높거나 좋을 때 사용"
        },
        {
          "word": "高等",
          "meaning": "고등",
          "pronunciation": "고등",
          "example_sentence": "高等 교육을 받았다.",
          "usage": "수준이 높은 교육을 표현할 때 사용"
        }
      ],
      "example_sentences": [
        {
          "sentence": "高山仰止",
          "meaning": "고산앙지 - 높은 산을 우러러보다",
          "pronunciation": "고산앙지",
          "difficulty": "intermediate"
        },
        {
          "sentence": "高談闊論",
          "meaning": "고담활론 - 고상한 이야기를 널리 펼침",
          "pronunciation": "고담활론",
          "difficulty": "intermediate"
        }
      ],
      "cultural_notes": "동아시아 문화에서 '高'는 단순한 물리적 높이를 넘어 도덕적, 사회적 지위의 높음을 의미하기도 합니다. 유교 문화에서는 '高尙'(고상)이라는 덕목을 중시했으며, 높은 산은 종종 경외와 존경의 대상으로 여겨졌습니다.",
      "pronunciation_guide": {
        "korean": "고 (go)",
        "japanese_on": "こう (kou)",
        "japanese_kun": "たか(い) (taka(i))",
        "mandarin": "gāo",
        "cantonese": "gou1"
      },
      "stroke_order": {
        "description": "상단의 가로획과 세로획을 먼저 그리고, 중간 부분, 마지막으로 아래 부분을 그립니다.",
        "directions": []
      },
      "related_characters": [
        "低", "上", "升", "崇"
      ],
      "variants": [],
      "level_info": {
        "jlpt": "N5",
        "hsk": "1급",
        "korean_standard": "중급"
      }
    }
  },
  {
    "id": "HJ-06-0005-5929",
    "character": "天",
    "unicode": "5929",
    "meaning": "하늘 천",
    "pronunciation": "천",
    "stroke_count": 4,
    "radical": "大",
    "grade": 6,
    "order": 5,
    "tags": [
      "radical:大",
      "strokes:4",
      "category:nature",
      "level:intermediate"
    ],
    "extended_data": {
      "detailed_meaning": "하늘, 자연, 천지, 날씨, 신의 의미를 가진 한자",
      "etymology": "사람(人)의 머리 위에 가로획 하나를 그어 '사람 위에 있는 것'이라는 의미에서 '하늘'을 뜻하게 되었습니다.",
      "mnemonics": "사람(大)의 머리 위로 펼쳐진 공간을 '하늘'이라고 기억할 수 있습니다.",
      "common_words": [
        {
          "word": "天國",
          "meaning": "천국",
          "pronunciation": "천국",
          "example_sentence": "그는 天國에 갔다.",
          "usage": "죽은 후 간다고 여겨지는 이상향을 표현할 때 사용"
        },
        {
          "word": "天氣",
          "meaning": "천기",
          "pronunciation": "천기",
          "example_sentence": "오늘 天氣가 좋다.",
          "usage": "날씨를 표현할 때 사용"
        },
        {
          "word": "天才",
          "meaning": "천재",
          "pronunciation": "천재",
          "example_sentence": "그는 음악의 天才이다.",
          "usage": "타고난 재능이 뛰어난 사람을 표현할 때 사용"
        }
      ],
      "example_sentences": [
        {
          "sentence": "天人合一",
          "meaning": "천인합일 - 하늘과 사람이 하나가 됨",
          "pronunciation": "천인합일",
          "difficulty": "intermediate"
        },
        {
          "sentence": "天道酬勤",
          "meaning": "천도추근 - 하늘의 이치는 부지런함에 보답함",
          "pronunciation": "천도추근",
          "difficulty": "intermediate"
        }
      ],
      "cultural_notes": "동아시아 문화에서 '天'은 단순한 물리적 하늘을 넘어 자연의 법칙과 우주의 질서, 그리고 최고의 도덕적 원리를 상징합니다. 유교에서는 '天命'(천명)이라는 개념을 통해 통치의 정당성을 부여했으며, 도교에서는 '天道'(천도)라는 자연의 순리를 중시했습니다.",
      "pronunciation_guide": {
        "korean": "천 (cheon)",
        "japanese_on": "てん (ten)",
        "japanese_kun": "あめ (ame), あま (ama)",
        "mandarin": "tiān",
        "cantonese": "tin1"
      },
      "stroke_order": {
        "description": "왼쪽 사선을 먼저 그리고, 오른쪽 사선, 그 다음 가로획, 마지막으로 세로획을 그립니다.",
        "directions": []
      },
      "related_characters": [
        "空", "雲", "晴", "神"
      ],
      "variants": [],
      "level_info": {
        "jlpt": "N5",
        "hsk": "1급",
        "korean_standard": "중급"
      }
    }
  },
  {
    "id": "HJ-06-0006-6708",
    "character": "月",
    "unicode": "6708",
    "meaning": "달 월",
    "pronunciation": "월",
    "stroke_count": 4,
    "radical": "月",
    "grade": 6,
    "order": 6,
    "tags": [
      "radical:月",
      "strokes:4",
      "category:time",
      "level:intermediate"
    ],
    "extended_data": {
      "detailed_meaning": "달, 월, 한 달, 매달의 의미를 가진 한자",
      "etymology": "초승달의 모습을 본뜬 상형문자로, 달의 모양을 도식화했습니다.",
      "mnemonics": "초승달의 모양으로 '달'을 의미한다고 기억할 수 있습니다.",
      "common_words": [
        {
          "word": "一月",
          "meaning": "일월",
          "pronunciation": "일월",
          "example_sentence": "一月에 눈이 많이 온다.",
          "usage": "1월을 표현할 때 사용"
        },
        {
          "word": "月光",
          "meaning": "월광",
          "pronunciation": "월광",
          "example_sentence": "月光이 밝게 비친다.",
          "usage": "달빛을 표현할 때 사용"
        },
        {
          "word": "滿月",
          "meaning": "만월",
          "pronunciation": "만월",
          "example_sentence": "하늘에 滿月이 떴다.",
          "usage": "보름달을 표현할 때 사용"
        }
      ],
      "example_sentences": [
        {
          "sentence": "月滿則虧",
          "meaning": "월만즉휴 - 달이 차면 기울기 마련",
          "pronunciation": "월만즉휴",
          "difficulty": "intermediate"
        },
        {
          "sentence": "花好月圓",
          "meaning": "화호월원 - 꽃이 아름답고 달이 둥금",
          "pronunciation": "화호월원",
          "difficulty": "intermediate"
        }
      ],
      "cultural_notes": "동아시아 문화에서 '月'은 태양과 함께 우주 질서의 상징이었으며, 달의 주기는 농경 사회의 중요한 시간 체계였습니다. 특히 중추절(中秋節)은 한국의 추석, 중국의 중추절, 일본의 츠키미(月見)와 같이 달을 감상하는 중요한 명절로 자리잡았습니다. 또한 달은 시와 예술의 중요한 소재이자 영감의 원천이었습니다.",
      "pronunciation_guide": {
        "korean": "월 (wol)",
        "japanese_on": "げつ (getsu), がつ (gatsu)",
        "japanese_kun": "つき (tsuki)",
        "mandarin": "yuè",
        "cantonese": "jyut6"
      },
      "stroke_order": {
        "description": "왼쪽 세로획을 먼저 긋고, 위쪽 가로획, 오른쪽 세로획, 마지막으로 아래쪽 가로획을 긋습니다.",
        "directions": []
      },
      "related_characters": [
        "日", "星", "陰", "曜"
      ],
      "variants": [],
      "level_info": {
        "jlpt": "N5",
        "hsk": "1급",
        "korean_standard": "중급"
      }
    }
  },
  {
    "id": "HJ-06-0007-5927",
    "character": "大",
    "unicode": "5927",
    "meaning": "큰 대",
    "pronunciation": "대",
    "stroke_count": 3,
    "radical": "大",
    "grade": 6,
    "order": 7,
    "tags": [
      "radical:大",
      "strokes:3",
      "category:attribute",
      "level:intermediate"
    ],
    "extended_data": {
      "detailed_meaning": "크다, 대단하다, 위대하다, 넓다의 의미를 가진 한자",
      "etymology": "팔을 벌리고 서 있는 사람의 모습을 본뜬 상형문자로, 크기와 위대함을 상징합니다.",
      "mnemonics": "팔을 벌리고 서 있는 사람의 형태로 '크다'를 의미한다고 기억할 수 있습니다.",
      "common_words": [
        {
          "word": "大學",
          "meaning": "대학",
          "pronunciation": "대학",
          "example_sentence": "그는 大學에 입학했다.",
          "usage": "고등교육 기관을 표현할 때 사용"
        },
        {
          "word": "偉大",
          "meaning": "위대",
          "pronunciation": "위대",
          "example_sentence": "偉大한 업적을 이루었다.",
          "usage": "뛰어나게 훌륭함을 표현할 때 사용"
        },
        {
          "word": "大統領",
          "meaning": "대통령",
          "pronunciation": "대통령",
          "example_sentence": "新任 大統領이 취임했다.",
          "usage": "국가의 원수를 표현할 때 사용"
        }
      ],
      "example_sentences": [
        {
          "sentence": "大道無門",
          "meaning": "대도무문 - 큰 도에는 문이 없다",
          "pronunciation": "대도무문",
          "difficulty": "intermediate"
        },
        {
          "sentence": "大人不計小人過",
          "meaning": "대인불계소인과 - 큰 사람은 작은 사람의 허물을 계산하지 않는다",
          "pronunciation": "대인불계소인과",
          "difficulty": "intermediate"
        }
      ],
      "cultural_notes": "동아시아 문화에서 '大'는 단순한 물리적 크기를 넘어 도덕적, 정신적 위대함을 상징합니다. 유교의 '大學'(대학)은 단순한 교육 기관이 아닌 '위대한 학문'을 의미했으며, '大人'(대인)은 덕을 갖춘 위대한 인격자를 의미했습니다. 정치적으로는 '大同'(대동)이라는 이상 사회의 개념으로 발전했습니다.",
      "pronunciation_guide": {
        "korean": "대 (dae)",
        "japanese_on": "だい (dai), たい (tai)",
        "japanese_kun": "おお(きい) (oo(kii))",
        "mandarin": "dà",
        "cantonese": "daai6"
      },
      "stroke_order": {
        "description": "왼쪽 사선을 먼저 긋고, 오른쪽 사선, 마지막으로 중앙의 세로획을 긋습니다.",
        "directions": []
      },
      "related_characters": [
        "小", "巨", "廣", "多"
      ],
      "variants": [],
      "level_info": {
        "jlpt": "N5",
        "hsk": "1급",
        "korean_standard": "중급"
      }
    }
  }
];

// 데이터 확장
grade6Data.characters = [...grade6Data.characters, ...additionalCharacters];
grade6Data.metadata.total_characters = grade6Data.characters.length;
grade6Data.metadata.last_updated = new Date().toISOString();

// 파일 저장
try {
  fs.writeFileSync(outputFilePath, JSON.stringify(grade6Data, null, 2), 'utf8');
  console.log(`Enhanced grade 6 data saved with ${grade6Data.characters.length} characters`);
} catch (error) {
  console.error(`Error saving enhanced grade 6 data: ${error.message}`);
  process.exit(1);
} 