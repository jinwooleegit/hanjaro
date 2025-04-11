const fs = require('fs');
const path = require('path');

/**
 * 7급 중급 한자 데이터 확장 스크립트
 * 기존의 7급 한자 데이터를 더 풍부하게 확장합니다.
 */

// 파일 경로 설정
const gradeDataDir = path.resolve(__dirname, '../data/new-structure/characters/by-grade');
const inputFilePath = path.join(gradeDataDir, 'grade_7.json');
const outputFilePath = path.join(gradeDataDir, 'grade_7.json');

// 데이터 읽기
let grade7Data;
try {
  const fileContent = fs.readFileSync(inputFilePath, 'utf8');
  grade7Data = JSON.parse(fileContent);
  console.log(`Successfully read grade 7 data: ${grade7Data.characters.length} characters`);
} catch (error) {
  console.error(`Error reading grade 7 data: ${error.message}`);
  process.exit(1);
}

// 추가할 한자 데이터
const additionalCharacters = [
  {
    "id": "HJ-07-0004-5DE5",
    "character": "工",
    "unicode": "5DE5",
    "meaning": "장인 공",
    "pronunciation": "공",
    "stroke_count": 3,
    "radical": "工",
    "grade": 7,
    "order": 4,
    "tags": [
      "radical:工",
      "strokes:3",
      "category:occupation",
      "level:intermediate"
    ],
    "extended_data": {
      "detailed_meaning": "장인, 기술, 공사, 일, 공업의 의미를 가진 한자",
      "etymology": "도구나 자를 든 장인의 모습을 본뜬 상형문자로, 일하는 사람이나 그 기술을 의미합니다.",
      "mnemonics": "자(尺)를 든 사람이 작업하는 모습으로 '장인'을 의미한다고 기억할 수 있습니다.",
      "common_words": [
        {
          "word": "工事",
          "meaning": "공사",
          "pronunciation": "공사",
          "example_sentence": "도로 工事가 진행 중입니다.",
          "usage": "건설이나 수리 작업을 표현할 때 사용"
        },
        {
          "word": "工夫",
          "meaning": "공부",
          "pronunciation": "공부",
          "example_sentence": "열심히 工夫하여 합격했다.",
          "usage": "학문을 닦거나 연구하는 것을 표현할 때 사용"
        },
        {
          "word": "工場",
          "meaning": "공장",
          "pronunciation": "공장",
          "example_sentence": "새 工場이 문을 열었다.",
          "usage": "제품을 만드는 건물을 표현할 때 사용"
        }
      ],
      "example_sentences": [
        {
          "sentence": "工欲善其事",
          "meaning": "공욕선기사 - 장인이 그 일을 잘하고자 함",
          "pronunciation": "공욕선기사",
          "difficulty": "intermediate"
        },
        {
          "sentence": "工小易成",
          "meaning": "공소이성 - 작은 일은 쉽게 이룬다",
          "pronunciation": "공소이성",
          "difficulty": "intermediate"
        }
      ],
      "cultural_notes": "동아시아 전통 사회에서 '工'은 사농공상(士農工商)의 사회 계층 중 하나로, 장인과 기술자를 가리켰습니다. 특히 중국과 한국에서는 다양한 장인들이 각각의 전문 분야(陶工: 도공, 木工: 목공 등)에서 높은 기술을 발전시켰습니다.",
      "pronunciation_guide": {
        "korean": "공 (gong)",
        "japanese_on": "こう (kou), く (ku)",
        "japanese_kun": "たくみ (takumi)",
        "mandarin": "gōng",
        "cantonese": "gung1"
      },
      "stroke_order": {
        "description": "가로획을 먼저 긋고, 중앙의 세로획, 마지막으로 아래 가로획을 긋습니다.",
        "directions": []
      },
      "related_characters": [
        "技", "匠", "業", "勞"
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
    "id": "HJ-07-0005-4E16",
    "character": "世",
    "unicode": "4E16",
    "meaning": "세상 세",
    "pronunciation": "세",
    "stroke_count": 5,
    "radical": "一",
    "grade": 7,
    "order": 5,
    "tags": [
      "radical:一",
      "strokes:5",
      "category:concept",
      "level:intermediate"
    ],
    "extended_data": {
      "detailed_meaning": "세상, 세대, 세기, 일생의 의미를 가진 한자",
      "etymology": "삼대(三代)를 뜻하는 형태로, 세대를 거치면서 이어지는 세상을 의미합니다.",
      "mnemonics": "세 개(三)의 시간대가 십(十)자로 연결된 모습으로 '세상'을 의미한다고 기억할 수 있습니다.",
      "common_words": [
        {
          "word": "世界",
          "meaning": "세계",
          "pronunciation": "세계",
          "example_sentence": "넓은 世界를 여행하다.",
          "usage": "전 지구적인 범위를 표현할 때 사용"
        },
        {
          "word": "世代",
          "meaning": "세대",
          "pronunciation": "세대",
          "example_sentence": "다음 世代에게 물려주다.",
          "usage": "같은 시대를 살아가는 연령층을 표현할 때 사용"
        },
        {
          "word": "世紀",
          "meaning": "세기",
          "pronunciation": "세기",
          "example_sentence": "20世紀의 역사",
          "usage": "100년 단위의 시간을 표현할 때 사용"
        }
      ],
      "example_sentences": [
        {
          "sentence": "世外桃源",
          "meaning": "세외도원 - 세상 밖의 이상향",
          "pronunciation": "세외도원",
          "difficulty": "intermediate"
        },
        {
          "sentence": "歷世不忘",
          "meaning": "역세불망 - 세상이 바뀌어도 잊지 않음",
          "pronunciation": "역세불망",
          "difficulty": "intermediate"
        }
      ],
      "cultural_notes": "동아시아 문화에서 '世'는 시간의 흐름과 세대 간 연속성을 중시하는 개념으로, 특히 유교 문화에서는 가문과 혈통의 계승을 통한 '世世代代'(세세대대)의 연속성이 중요하게 여겨졌습니다.",
      "pronunciation_guide": {
        "korean": "세 (se)",
        "japanese_on": "せい (sei), せ (se)",
        "japanese_kun": "よ (yo)",
        "mandarin": "shì",
        "cantonese": "sai3"
      },
      "stroke_order": {
        "description": "세로획을 먼저 긋고, 왼쪽 상단의 가로획, 중앙의 가로획, 오른쪽 상단의 가로획, 마지막으로 아래쪽의 가로획을 긋습니다.",
        "directions": []
      },
      "related_characters": [
        "代", "紀", "時", "年"
      ],
      "variants": [],
      "level_info": {
        "jlpt": "N4",
        "hsk": "2급",
        "korean_standard": "중급"
      }
    }
  },
  {
    "id": "HJ-07-0006-670D",
    "character": "服",
    "unicode": "670D",
    "meaning": "옷 복",
    "pronunciation": "복",
    "stroke_count": 8,
    "radical": "月",
    "grade": 7,
    "order": 6,
    "tags": [
      "radical:月",
      "strokes:8",
      "category:clothing",
      "level:intermediate"
    ],
    "extended_data": {
      "detailed_meaning": "옷, 복장, 복용하다, 따르다의 의미를 가진 한자",
      "etymology": "육(肉, 월(月)로 표기)과 수복할 복(𠬝)의 결합으로, '신체에 입는 것'이라는 의미에서 '옷'을 뜻하게 되었습니다.",
      "mnemonics": "몸(月)에 맞게 만들어(𠬝) 입는 '옷'을 의미한다고 기억할 수 있습니다.",
      "common_words": [
        {
          "word": "衣服",
          "meaning": "의복",
          "pronunciation": "의복",
          "example_sentence": "새 衣服을 입다.",
          "usage": "입는 옷을 표현할 때 사용"
        },
        {
          "word": "服用",
          "meaning": "복용",
          "pronunciation": "복용",
          "example_sentence": "약을 服用하다.",
          "usage": "약을 먹는 것을 표현할 때 사용"
        },
        {
          "word": "制服",
          "meaning": "제복",
          "pronunciation": "제복",
          "example_sentence": "학생들이 制服을 입는다.",
          "usage": "규정된 옷을 표현할 때 사용"
        }
      ],
      "example_sentences": [
        {
          "sentence": "服勤如儀",
          "meaning": "복근여의 - 직무를 성실히 수행함",
          "pronunciation": "복근여의",
          "difficulty": "intermediate"
        },
        {
          "sentence": "服膺銘記",
          "meaning": "복응명기 - 마음에 새겨 잊지 않음",
          "pronunciation": "복응명기",
          "difficulty": "intermediate"
        }
      ],
      "cultural_notes": "동아시아 전통 사회에서 '服'은 단순한 옷 이상의 의미를 가졌습니다. 관복(官服), 제복(祭服) 등은 신분과 계급, 의례의 중요성을 나타냈으며, 유교 문화에서는 상복(喪服)의 종류와 착용 기간을 통해 친족 관계의 친소를 표현했습니다.",
      "pronunciation_guide": {
        "korean": "복 (bok)",
        "japanese_on": "ふく (fuku)",
        "japanese_kun": "したが(う) (shitaga(u))",
        "mandarin": "fú",
        "cantonese": "fuk6"
      },
      "stroke_order": {
        "description": "왼쪽의 월(月) 부분을 먼저 쓰고, 오른쪽의 복(𠬝) 부분을 씁니다.",
        "directions": []
      },
      "related_characters": [
        "衣", "裝", "着", "袍"
      ],
      "variants": [],
      "level_info": {
        "jlpt": "N3",
        "hsk": "3급",
        "korean_standard": "중급"
      }
    }
  },
  {
    "id": "HJ-07-0007-9053",
    "character": "道",
    "unicode": "9053",
    "meaning": "길 도",
    "pronunciation": "도",
    "stroke_count": 12,
    "radical": "辵",
    "grade": 7,
    "order": 7,
    "tags": [
      "radical:辵",
      "strokes:12",
      "category:concept",
      "level:intermediate"
    ],
    "extended_data": {
      "detailed_meaning": "길, 도로, 방법, 도리, 말하다의 의미를 가진 한자",
      "etymology": "행도변(辶)과 머리 수(首)의 결합으로, '머리로 이끌어 가는 길'이라는 의미에서 '길'을 뜻하게 되었습니다.",
      "mnemonics": "사람들이 걸어가는(辶) 방향을 머리(首)로 이끄는 '길'을 의미한다고 기억할 수 있습니다.",
      "common_words": [
        {
          "word": "道路",
          "meaning": "도로",
          "pronunciation": "도로",
          "example_sentence": "넓은 道路가 개통되었다.",
          "usage": "차가 다니는 길을 표현할 때 사용"
        },
        {
          "word": "報道",
          "meaning": "보도",
          "pronunciation": "보도",
          "example_sentence": "뉴스에서 報道했다.",
          "usage": "소식을 알리는 것을 표현할 때 사용"
        },
        {
          "word": "道德",
          "meaning": "도덕",
          "pronunciation": "도덕",
          "example_sentence": "道德적으로 올바른 행동",
          "usage": "옳고 그름의 기준을 표현할 때 사용"
        }
      ],
      "example_sentences": [
        {
          "sentence": "大道至簡",
          "meaning": "대도지간 - 큰 도리는 지극히 간단하다",
          "pronunciation": "대도지간",
          "difficulty": "intermediate"
        },
        {
          "sentence": "道不同不相爲謀",
          "meaning": "도불동불상위모 - 도가 다르면 함께 도모하지 않는다",
          "pronunciation": "도불동불상위모",
          "difficulty": "intermediate"
        }
      ],
      "cultural_notes": "동아시아 철학에서 '道'는 가장 근본적인 개념 중 하나로, 도교(道敎)의 핵심 개념이자 유교와 불교에서도 중요한 의미를 가집니다. '道'는 우주의 근본 원리, 자연의 섭리, 인간이 따라야 할 바른 길을 의미하며, 특히 노자(老子)의 '道德經'(도덕경)에서는 '道'를 모든 존재의 근원으로 보았습니다.",
      "pronunciation_guide": {
        "korean": "도 (do)",
        "japanese_on": "どう (dou), とう (tou)",
        "japanese_kun": "みち (michi), い(う) (i(u))",
        "mandarin": "dào",
        "cantonese": "dou6"
      },
      "stroke_order": {
        "description": "오른쪽의 수(首) 부분을 먼저 쓰고, 왼쪽의 행도변(辶) 부분을 씁니다.",
        "directions": []
      },
      "related_characters": [
        "路", "徑", "理", "途"
      ],
      "variants": [],
      "level_info": {
        "jlpt": "N4",
        "hsk": "2급",
        "korean_standard": "중급"
      }
    }
  },
  {
    "id": "HJ-07-0008-5BA4",
    "character": "室",
    "unicode": "5BA4",
    "meaning": "방 실",
    "pronunciation": "실",
    "stroke_count": 9,
    "radical": "宀",
    "grade": 7,
    "order": 8,
    "tags": [
      "radical:宀",
      "strokes:9",
      "category:building",
      "level:intermediate"
    ],
    "extended_data": {
      "detailed_meaning": "방, 실내, 집안, 가정의 의미를 가진 한자",
      "etymology": "집 면(宀)과 흙 토(土)와 무릇 율(律)의 결합으로, '집 안의 구분된 공간'이라는 의미에서 '방'을 뜻하게 되었습니다.",
      "mnemonics": "지붕(宀) 아래 흙(土)으로 만든 벽으로 구분된 '방'을 의미한다고 기억할 수 있습니다.",
      "common_words": [
        {
          "word": "敎室",
          "meaning": "교실",
          "pronunciation": "교실",
          "example_sentence": "1학년 敎室에 가다.",
          "usage": "학교에서 수업을 하는 방을 표현할 때 사용"
        },
        {
          "word": "室內",
          "meaning": "실내",
          "pronunciation": "실내",
          "example_sentence": "室內 온도를 조절하다.",
          "usage": "방 안의 공간을 표현할 때 사용"
        },
        {
          "word": "寢室",
          "meaning": "침실",
          "pronunciation": "침실",
          "example_sentence": "아늑한 寢室을 꾸미다.",
          "usage": "잠을 자는 방을 표현할 때 사용"
        }
      ],
      "example_sentences": [
        {
          "sentence": "室如懸磬",
          "meaning": "실여현경 - 방이 텅 비어 있다",
          "pronunciation": "실여현경",
          "difficulty": "intermediate"
        },
        {
          "sentence": "室家之道",
          "meaning": "실가지도 - 가정을 다스리는 방법",
          "pronunciation": "실가지도",
          "difficulty": "intermediate"
        }
      ],
      "cultural_notes": "동아시아 전통 건축에서 '室'은 가족 생활의 중심 공간이었으며, 특히 중국과 한국의 전통 가옥은 여러 개의 '室'이 중정(中庭)을 중심으로 배치되는 구조였습니다. 또한 유교적 관점에서 '齊家'(제가, 가정을 바르게 다스림)는 '治國'(치국, 나라를 다스림)의 기초로 여겨져, '室'의 질서는 사회 질서의 출발점으로 중시되었습니다.",
      "pronunciation_guide": {
        "korean": "실 (sil)",
        "japanese_on": "しつ (shitsu)",
        "japanese_kun": "むろ (muro)",
        "mandarin": "shì",
        "cantonese": "sat1"
      },
      "stroke_order": {
        "description": "위쪽의 집 면(宀) 부분을 먼저 쓰고, 중간의 토(土) 부분, 마지막으로 아래쪽의 율(律) 부분을 씁니다.",
        "directions": []
      },
      "related_characters": [
        "屋", "房", "宅", "廳"
      ],
      "variants": [],
      "level_info": {
        "jlpt": "N4",
        "hsk": "2급",
        "korean_standard": "중급"
      }
    }
  }
];

// 데이터 확장
grade7Data.characters = [...grade7Data.characters, ...additionalCharacters];
grade7Data.metadata.total_characters = grade7Data.characters.length;
grade7Data.metadata.last_updated = new Date().toISOString();

// 파일 저장
try {
  fs.writeFileSync(outputFilePath, JSON.stringify(grade7Data, null, 2), 'utf8');
  console.log(`Enhanced grade 7 data saved with ${grade7Data.characters.length} characters`);
} catch (error) {
  console.error(`Error saving enhanced grade 7 data: ${error.message}`);
  process.exit(1);
} 