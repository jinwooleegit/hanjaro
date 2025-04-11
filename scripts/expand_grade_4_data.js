const fs = require('fs');
const path = require('path');

/**
 * 4급 고급 한자 데이터 확장 스크립트
 * 기존의 4급 한자 데이터를 더 풍부하게 확장합니다.
 */

// 파일 경로 설정
const gradeDataDir = path.resolve(__dirname, '../data/new-structure/characters/by-grade');
const inputFilePath = path.join(gradeDataDir, 'grade_4.json');
const outputFilePath = path.join(gradeDataDir, 'grade_4.json');

// 데이터 읽기
let grade4Data;
try {
  const fileContent = fs.readFileSync(inputFilePath, 'utf8');
  grade4Data = JSON.parse(fileContent);
  console.log(`Successfully read grade 4 data: ${grade4Data.characters.length} characters`);
} catch (error) {
  console.error(`Error reading grade 4 data: ${error.message}`);
  process.exit(1);
}

// 추가할 한자 데이터
const additionalCharacters = [
  {
    "id": "HJ-04-0004-6C34",
    "character": "水",
    "unicode": "6C34",
    "meaning": "물 수",
    "pronunciation": "수",
    "stroke_count": 4,
    "radical": "水",
    "grade": 4,
    "order": 4,
    "tags": [
      "radical:水",
      "strokes:4",
      "category:nature",
      "level:advanced"
    ],
    "extended_data": {
      "detailed_meaning": "물, 액체, 수분, 수액의 의미를 가진 한자",
      "etymology": "물이 흘러내리는 모습을 본뜬 상형문자입니다. 물이 양쪽으로 흘러내리는 형태를 도식화했습니다.",
      "mnemonics": "물이 양쪽으로 흘러내리는 모습을 형상화한 것으로 '물'을 의미한다고 기억할 수 있습니다.",
      "common_words": [
        {
          "word": "水分",
          "meaning": "수분",
          "pronunciation": "수분",
          "example_sentence": "피부에 水分이 부족하다.",
          "usage": "물기나 습기를 표현할 때 사용"
        },
        {
          "word": "水曜日",
          "meaning": "수요일",
          "pronunciation": "수요일",
          "example_sentence": "오늘은 水曜日입니다.",
          "usage": "요일을 표현할 때 사용"
        },
        {
          "word": "海水",
          "meaning": "해수",
          "pronunciation": "해수",
          "example_sentence": "海水 온도가 상승하고 있다.",
          "usage": "바닷물을 표현할 때 사용"
        }
      ],
      "example_sentences": [
        {
          "sentence": "水火不容",
          "meaning": "수화불용 - 물과 불이 서로 용납하지 않음",
          "pronunciation": "수화불용",
          "difficulty": "advanced"
        },
        {
          "sentence": "上善若水",
          "meaning": "상선약수 - 최고의 선은 물과 같다",
          "pronunciation": "상선약수",
          "difficulty": "advanced"
        }
      ],
      "cultural_notes": "동아시아 문화에서 물(水)은 오행(五行)의 하나로, 생명과 순환, 적응력, 지혜의 상징입니다. 도교에서는 물의 부드러움과 낮은 곳으로 흐르는 겸손함이 사람이 본받아야 할 덕목으로 여겨집니다.",
      "pronunciation_guide": {
        "korean": "수 (su)",
        "japanese_on": "すい (sui)",
        "japanese_kun": "みず (mizu)",
        "mandarin": "shuǐ",
        "cantonese": "seoi2"
      },
      "stroke_order": {
        "description": "중앙의 세로획을 먼저 그리고, 왼쪽 빗금, 오른쪽 빗금, 마지막으로 아래의 가로획을 그립니다.",
        "directions": []
      },
      "related_characters": [
        "海", "河", "湖", "流"
      ],
      "variants": [],
      "level_info": {
        "jlpt": "N5",
        "hsk": "1급",
        "korean_standard": "고급"
      }
    }
  },
  {
    "id": "HJ-04-0005-6728",
    "character": "朋",
    "unicode": "6728",
    "meaning": "벗 붕",
    "pronunciation": "붕",
    "stroke_count": 8,
    "radical": "月",
    "grade": 4,
    "order": 5,
    "tags": [
      "radical:月",
      "strokes:8",
      "category:relationship",
      "level:advanced"
    ],
    "extended_data": {
      "detailed_meaning": "벗, 친구, 동료의 의미를 가진 한자",
      "etymology": "두 개의 '월(月, 고대에는 육(肉))'이 나란히 있는 모습으로, '서로 돕는 관계'를 의미하게 되었습니다.",
      "mnemonics": "두 사람(月+月)이 나란히 서 있는 모습으로 '벗'을 의미한다고 기억할 수 있습니다.",
      "common_words": [
        {
          "word": "朋友",
          "meaning": "붕우",
          "pronunciation": "붕우",
          "example_sentence": "그는 나의 소중한 朋友이다.",
          "usage": "친구를 표현할 때 사용"
        },
        {
          "word": "親朋",
          "meaning": "친붕",
          "pronunciation": "친붕",
          "example_sentence": "親朋들이 모두 모였다.",
          "usage": "가까운 친구들을 표현할 때 사용"
        },
        {
          "word": "朋黨",
          "meaning": "붕당",
          "pronunciation": "붕당",
          "example_sentence": "朋黨을 이루어 정치적 활동을 했다.",
          "usage": "정치적 당파를 표현할 때 사용"
        }
      ],
      "example_sentences": [
        {
          "sentence": "朋來有信",
          "meaning": "붕래유신 - 친구가 와서 소식이 있다",
          "pronunciation": "붕래유신",
          "difficulty": "advanced"
        },
        {
          "sentence": "朋自遠方來",
          "meaning": "붕자원방래 - 친구가 먼 곳에서 왔다",
          "pronunciation": "붕자원방래",
          "difficulty": "advanced"
        }
      ],
      "cultural_notes": "유교 문화에서 '朋'은 사회적 관계의 기본으로 여겨지며, 공자는 '朋友有信'(붕우유신, 친구 사이에는 믿음이 있어야 한다)를 강조했습니다. 전통적으로 동아시아에서는 친구 관계가 단순한 사교가 아닌 상호 성장과 도덕적 발전을 위한 관계로 인식되었습니다.",
      "pronunciation_guide": {
        "korean": "붕 (bung)",
        "japanese_on": "ほう (hou)",
        "japanese_kun": "とも (tomo)",
        "mandarin": "péng",
        "cantonese": "pang4"
      },
      "stroke_order": {
        "description": "왼쪽의 월(月) 부분을 먼저 쓰고, 오른쪽의 월(月) 부분을 씁니다.",
        "directions": []
      },
      "related_characters": [
        "友", "交", "親", "伴"
      ],
      "variants": [],
      "level_info": {
        "jlpt": "N2",
        "hsk": "4급",
        "korean_standard": "고급"
      }
    }
  },
  {
    "id": "HJ-04-0006-9762",
    "character": "音",
    "unicode": "9762",
    "meaning": "소리 음",
    "pronunciation": "음",
    "stroke_count": 9,
    "radical": "音",
    "grade": 4,
    "order": 6,
    "tags": [
      "radical:音",
      "strokes:9",
      "category:sound",
      "level:advanced"
    ],
    "extended_data": {
      "detailed_meaning": "소리, 음악, 음성, 음향의 의미를 가진 한자",
      "etymology": "옛날에 실에 구슬을 꿰어 늘어뜨려 소리를 내는 악기를 본뜬 상형문자입니다.",
      "mnemonics": "말(言)이 있는 곳에 해(日)가 있는 모습으로 '소리'를 의미한다고 기억할 수 있습니다.",
      "common_words": [
        {
          "word": "音樂",
          "meaning": "음악",
          "pronunciation": "음악",
          "example_sentence": "좋은 音樂을 들었다.",
          "usage": "음악을 표현할 때 사용"
        },
        {
          "word": "音聲",
          "meaning": "음성",
          "pronunciation": "음성",
          "example_sentence": "그의 音聲이 들렸다.",
          "usage": "사람의 목소리를 표현할 때 사용"
        },
        {
          "word": "發音",
          "meaning": "발음",
          "pronunciation": "발음",
          "example_sentence": "정확한 發音이 중요하다.",
          "usage": "소리를 내는 방법을 표현할 때 사용"
        }
      ],
      "example_sentences": [
        {
          "sentence": "音容宛在",
          "meaning": "음용완재 - 소리와 모습이 완연히 있는 듯함",
          "pronunciation": "음용완재",
          "difficulty": "advanced"
        },
        {
          "sentence": "一音成律",
          "meaning": "일음성률 - 한 소리가 음률을 이룸",
          "pronunciation": "일음성률",
          "difficulty": "advanced"
        }
      ],
      "cultural_notes": "동아시아 전통 문화에서 '音'은 우주의 조화를 나타내는 중요한 개념으로, 음악은 단순한 오락이 아닌 자연과 사회의 조화를 반영하는 것으로 여겨졌습니다. 특히 유교에서는 예악(禮樂)을 통한 사회 질서 확립을 중시했습니다.",
      "pronunciation_guide": {
        "korean": "음 (eum)",
        "japanese_on": "おん (on), いん (in)",
        "japanese_kun": "おと (oto)",
        "mandarin": "yīn",
        "cantonese": "jam1"
      },
      "stroke_order": {
        "description": "상단의 언(言) 부분을 먼저 쓰고, 하단의 일(日) 부분을 씁니다.",
        "directions": []
      },
      "related_characters": [
        "聲", "響", "樂", "韻"
      ],
      "variants": [],
      "level_info": {
        "jlpt": "N4",
        "hsk": "3급",
        "korean_standard": "고급"
      }
    }
  },
  {
    "id": "HJ-04-0007-661F",
    "character": "星",
    "unicode": "661F",
    "meaning": "별 성",
    "pronunciation": "성",
    "stroke_count": 9,
    "radical": "日",
    "grade": 4,
    "order": 7,
    "tags": [
      "radical:日",
      "strokes:9",
      "category:nature",
      "level:advanced"
    ],
    "extended_data": {
      "detailed_meaning": "별, 행성, 천체, 성좌의 의미를 가진 한자",
      "etymology": "해(日)와 생길 생(生)의 결합으로, '해에서 생겨난 빛나는 것'이라는 의미에서 '별'을 뜻하게 되었습니다.",
      "mnemonics": "해(日)로부터 생겨난(生) 작은 빛으로 '별'을 의미한다고 기억할 수 있습니다.",
      "common_words": [
        {
          "word": "星座",
          "meaning": "성좌",
          "pronunciation": "성좌",
          "example_sentence": "그의 星座는 물고기자리이다.",
          "usage": "별자리를 표현할 때 사용"
        },
        {
          "word": "惑星",
          "meaning": "혹성",
          "pronunciation": "혹성",
          "example_sentence": "화성은 붉은 惑星이다.",
          "usage": "행성을 표현할 때 사용"
        },
        {
          "word": "星空",
          "meaning": "성공",
          "pronunciation": "성공",
          "example_sentence": "맑은 夜空에 星空이 빛난다.",
          "usage": "별이 빛나는 하늘을 표현할 때 사용"
        }
      ],
      "example_sentences": [
        {
          "sentence": "繁星點點",
          "meaning": "번성점점 - 별이 많이 빛나다",
          "pronunciation": "번성점점",
          "difficulty": "advanced"
        },
        {
          "sentence": "星火燎原",
          "meaning": "성화료원 - 작은 불씨가 들판을 태움",
          "pronunciation": "성화료원",
          "difficulty": "advanced"
        }
      ],
      "cultural_notes": "동아시아의 전통 천문학에서 별(星)은 천체 관측의 기본이었으며, 계절 변화와, 농경 활동, 그리고 명과 운세를 점치는 데 중요한 역할을 했습니다. 중국 고대 천문학은 28수(宿)라는 별자리 체계를 발전시켰고, 이는 한국과 일본에도 영향을 미쳤습니다.",
      "pronunciation_guide": {
        "korean": "성 (seong)",
        "japanese_on": "せい (sei), しょう (shou)",
        "japanese_kun": "ほし (hoshi)",
        "mandarin": "xīng",
        "cantonese": "sing1"
      },
      "stroke_order": {
        "description": "왼쪽의 해 일(日) 부분을 먼저 쓰고, 오른쪽의 생길 생(生) 부분을 씁니다.",
        "directions": []
      },
      "related_characters": [
        "月", "宿", "晨", "辰"
      ],
      "variants": [],
      "level_info": {
        "jlpt": "N4",
        "hsk": "3급",
        "korean_standard": "고급"
      }
    }
  },
  {
    "id": "HJ-04-0008-6587",
    "character": "斷",
    "unicode": "6587",
    "meaning": "끊을 단",
    "pronunciation": "단",
    "stroke_count": 18,
    "radical": "斤",
    "grade": 4,
    "order": 8,
    "tags": [
      "radical:斤",
      "strokes:18",
      "category:action",
      "level:advanced"
    ],
    "extended_data": {
      "detailed_meaning": "끊다, 단절하다, 결정하다, 판단하다의 의미를 가진 한자",
      "etymology": "연(㕣), 갗 단(㫃), 도끼 근(斤)의 결합으로, '도끼로 확실하게 자르다'는 의미에서 '끊다'의 뜻을 갖게 되었습니다.",
      "mnemonics": "도끼(斤)로 확실히 잘라서 '단절'을 의미한다고 기억할 수 있습니다.",
      "common_words": [
        {
          "word": "斷定",
          "meaning": "단정",
          "pronunciation": "단정",
          "example_sentence": "섣불리 斷定하지 마세요.",
          "usage": "확실히 판단하는 것을 표현할 때 사용"
        },
        {
          "word": "中斷",
          "meaning": "중단",
          "pronunciation": "중단",
          "example_sentence": "공사가 中斷되었다.",
          "usage": "도중에 그치는 것을 표현할 때 사용"
        },
        {
          "word": "斷絶",
          "meaning": "단절",
          "pronunciation": "단절",
          "example_sentence": "두 나라의 관계가 斷絶되었다.",
          "usage": "완전히 끊어짐을 표현할 때 사용"
        }
      ],
      "example_sentences": [
        {
          "sentence": "斷織勸學",
          "meaning": "단직권학 - 베 짜기를 끊어 학문을 권함",
          "pronunciation": "단직권학",
          "difficulty": "advanced"
        },
        {
          "sentence": "斷雲逐電",
          "meaning": "단운축전 - 구름을 끊고 번개를 쫓는다",
          "pronunciation": "단운축전",
          "difficulty": "advanced"
        }
      ],
      "cultural_notes": "동아시아 철학에서 '斷'은 결단력과 판단력을 나타내는 중요한 개념입니다. 유교에서는 올바른 판단을 내리기 위한 지식과 덕목을 강조했으며, 불교에서는 '斷惑'(단혹)을 통해 미혹을 끊고 깨달음을 얻는 것을 중시했습니다.",
      "pronunciation_guide": {
        "korean": "단 (dan)",
        "japanese_on": "だん (dan)",
        "japanese_kun": "た(つ) (ta(tsu)), ことわ(る) (kotowa(ru))",
        "mandarin": "duàn",
        "cantonese": "dyun6"
      },
      "stroke_order": {
        "description": "상단의 연(㕣) 부분을 먼저 쓰고, 중간의 단(㫃) 부분, 마지막으로 하단의 근(斤) 부분을 씁니다.",
        "directions": []
      },
      "related_characters": [
        "切", "絶", "決", "判"
      ],
      "variants": [],
      "level_info": {
        "jlpt": "N2",
        "hsk": "5급",
        "korean_standard": "고급"
      }
    }
  }
];

// 데이터 확장
grade4Data.characters = [...grade4Data.characters, ...additionalCharacters];
grade4Data.metadata.total_characters = grade4Data.characters.length;
grade4Data.metadata.last_updated = new Date().toISOString();

// 파일 저장
try {
  fs.writeFileSync(outputFilePath, JSON.stringify(grade4Data, null, 2), 'utf8');
  console.log(`Enhanced grade 4 data saved with ${grade4Data.characters.length} characters`);
} catch (error) {
  console.error(`Error saving enhanced grade 4 data: ${error.message}`);
  process.exit(1);
} 