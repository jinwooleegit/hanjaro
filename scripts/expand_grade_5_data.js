const fs = require('fs');
const path = require('path');

/**
 * 5급 고급 한자 데이터 확장 스크립트
 * 기존의 5급 한자 데이터를 더 풍부하게 확장합니다.
 */

// 파일 경로 설정
const gradeDataDir = path.resolve(__dirname, '../data/new-structure/characters/by-grade');
const inputFilePath = path.join(gradeDataDir, 'grade_5.json');
const outputFilePath = path.join(gradeDataDir, 'grade_5.json');

// 데이터 읽기
let grade5Data;
try {
  const fileContent = fs.readFileSync(inputFilePath, 'utf8');
  grade5Data = JSON.parse(fileContent);
  console.log(`Successfully read grade 5 data: ${grade5Data.characters.length} characters`);
} catch (error) {
  console.error(`Error reading grade 5 data: ${error.message}`);
  process.exit(1);
}

// 추가할 한자 데이터
const additionalCharacters = [
  {
    "id": "HJ-05-0004-611B",
    "character": "愛",
    "unicode": "611B",
    "meaning": "사랑 애",
    "pronunciation": "애",
    "stroke_count": 13,
    "radical": "心",
    "grade": 5,
    "order": 4,
    "tags": [
      "radical:心",
      "strokes:13",
      "category:emotion",
      "level:advanced"
    ],
    "extended_data": {
      "detailed_meaning": "사랑하다, 아끼다, 즐기다의 의미를 가진 한자",
      "etymology": "위의 爫(조탁)은 손을 의미하고, 중간의 冖(멱)은 덮는 것을, 아래의 心(심)은 마음을 의미하여 '손으로 마음을 덮고 보호한다'는 의미에서 '사랑'을 뜻하게 되었습니다.",
      "mnemonics": "손(爫)으로 마음(心)을 보호하는(冖) 모습으로 '사랑'을 의미한다고 기억할 수 있습니다.",
      "common_words": [
        {
          "word": "愛情",
          "meaning": "애정",
          "pronunciation": "애정",
          "example_sentence": "그는 가족에 대한 愛情이 깊다.",
          "usage": "사랑하는 마음을 표현할 때 사용"
        },
        {
          "word": "戀愛",
          "meaning": "연애",
          "pronunciation": "연애",
          "example_sentence": "그들은 戀愛 중이다.",
          "usage": "남녀 간의 사랑을 표현할 때 사용"
        },
        {
          "word": "愛國",
          "meaning": "애국",
          "pronunciation": "애국",
          "example_sentence": "애국심으로 가득 찬 愛國者",
          "usage": "나라를 사랑하는 마음을 표현할 때 사용"
        }
      ],
      "example_sentences": [
        {
          "sentence": "博愛無私",
          "meaning": "박애무사 - 널리 사랑하고 사사로움이 없음",
          "pronunciation": "박애무사",
          "difficulty": "advanced"
        },
        {
          "sentence": "愛之欲其生",
          "meaning": "애지욕기생 - 사랑하면 그가 잘 살기를 바람",
          "pronunciation": "애지욕기생",
          "difficulty": "advanced"
        }
      ],
      "cultural_notes": "동아시아 문화에서 '愛'는 단순한 감정을 넘어 가족, 국가, 인류에 대한 헌신과 책임을 포함하는 포괄적인 개념입니다. 유교 문화에서는 효(孝)와 함께 중요한 덕목으로 여겨집니다.",
      "pronunciation_guide": {
        "korean": "애 (ae)",
        "japanese_on": "あい (ai)",
        "japanese_kun": "いと(しい) (ito(shii))",
        "mandarin": "ài",
        "cantonese": "oi3"
      },
      "stroke_order": {
        "description": "위의 爫(조탁) 부분을 먼저 쓰고, 중간의 冖(멱) 부분을 쓴 다음, 아래의 心(심) 부분을 씁니다.",
        "directions": []
      },
      "related_characters": [
        "情", "慕", "戀", "憐"
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
    "id": "HJ-05-0005-672C",
    "character": "本",
    "unicode": "672C",
    "meaning": "근본 본",
    "pronunciation": "본",
    "stroke_count": 5,
    "radical": "木",
    "grade": 5,
    "order": 5,
    "tags": [
      "radical:木",
      "strokes:5",
      "category:concept",
      "level:advanced"
    ],
    "extended_data": {
      "detailed_meaning": "근본, 원래, 책, 이것의 의미를 가진 한자",
      "etymology": "나무(木)의 뿌리를 표시하는 가로선 하나를 추가하여 '나무의 근본'이라는 의미에서 '근본'을 뜻하게 되었습니다.",
      "mnemonics": "나무(木)에 그 뿌리(一)를 표시하여 '근본'을 의미한다고 기억할 수 있습니다.",
      "common_words": [
        {
          "word": "基本",
          "meaning": "기본",
          "pronunciation": "기본",
          "example_sentence": "基本 지식을 먼저 익혀야 한다.",
          "usage": "기초적인 토대를 표현할 때 사용"
        },
        {
          "word": "日本",
          "meaning": "일본",
          "pronunciation": "일본",
          "example_sentence": "日本은 섬나라이다.",
          "usage": "국가명으로 사용"
        },
        {
          "word": "本人",
          "meaning": "본인",
          "pronunciation": "본인",
          "example_sentence": "本人 확인이 필요합니다.",
          "usage": "해당 당사자를 표현할 때 사용"
        }
      ],
      "example_sentences": [
        {
          "sentence": "本末倒置",
          "meaning": "본말도치 - 근본과 말단을 뒤바꿈",
          "pronunciation": "본말도치",
          "difficulty": "advanced"
        },
        {
          "sentence": "見本忘末",
          "meaning": "견본망말 - 근본을 보고 말단을 잊음",
          "pronunciation": "견본망말",
          "difficulty": "advanced"
        }
      ],
      "cultural_notes": "동아시아 문화에서 '本'은 모든 것의 근원과 기원을 중시하는 사상을 반영합니다. 특히 유교와 도교에서는 '本'을 찾고 이해하는 것이 지혜의 시작으로 여겨집니다.",
      "pronunciation_guide": {
        "korean": "본 (bon)",
        "japanese_on": "ほん (hon)",
        "japanese_kun": "もと (moto)",
        "mandarin": "běn",
        "cantonese": "bun2"
      },
      "stroke_order": {
        "description": "먼저 가로획(一)을 긋고, 그 아래에 나무(木)를 씁니다.",
        "directions": []
      },
      "related_characters": [
        "基", "源", "根", "元"
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
    "id": "HJ-05-0006-8B70",
    "character": "議",
    "unicode": "8B70",
    "meaning": "의논할 의",
    "pronunciation": "의",
    "stroke_count": 20,
    "radical": "言",
    "grade": 5,
    "order": 6,
    "tags": [
      "radical:言",
      "strokes:20",
      "category:communication",
      "level:advanced"
    ],
    "extended_data": {
      "detailed_meaning": "의논하다, 논의하다, 토의하다의 의미를 가진 한자",
      "etymology": "말씀(言)과 의심할 의(疑)의 결합으로, '말로 의심을 해소한다'는 의미에서 '의논하다'의 뜻을 갖게 되었습니다.",
      "mnemonics": "말(言)로 의심(疑)을 풀어가는 과정으로 '의논'을 의미한다고 기억할 수 있습니다.",
      "common_words": [
        {
          "word": "會議",
          "meaning": "회의",
          "pronunciation": "회의",
          "example_sentence": "중요한 會議가 있습니다.",
          "usage": "모여서 논의하는 자리를 표현할 때 사용"
        },
        {
          "word": "議論",
          "meaning": "의론",
          "pronunciation": "의론",
          "example_sentence": "그 문제에 대해 議論하다.",
          "usage": "논의나 토론을 표현할 때 사용"
        },
        {
          "word": "國會議員",
          "meaning": "국회의원",
          "pronunciation": "국회의원",
          "example_sentence": "그는 國會議員으로 선출되었다.",
          "usage": "국회에서 의정활동을 하는 사람을 지칭할 때 사용"
        }
      ],
      "example_sentences": [
        {
          "sentence": "衆議一決",
          "meaning": "중의일결 - 여러 사람의 의견을 모아 하나로 결정함",
          "pronunciation": "중의일결",
          "difficulty": "advanced"
        },
        {
          "sentence": "議而不決",
          "meaning": "의이불결 - 의논만 하고 결정하지 못함",
          "pronunciation": "의이불결",
          "difficulty": "advanced"
        }
      ],
      "cultural_notes": "동아시아 전통 문화에서 '議'는 중요한 결정을 내리기 전에 여러 의견을 모으는 과정을 강조합니다. 특히 유교 사회에서는 현명한 군주가 신하들의 의견을 널리 듣는 '集議'(집의)를 중시했습니다.",
      "pronunciation_guide": {
        "korean": "의 (ui)",
        "japanese_on": "ぎ (gi)",
        "japanese_kun": "はか(る) (haka(ru))",
        "mandarin": "yì",
        "cantonese": "ji5"
      },
      "stroke_order": {
        "description": "왼쪽 말씀 언(言) 부분을 먼저 쓰고, 오른쪽 의심할 의(疑) 부분을 씁니다.",
        "directions": []
      },
      "related_characters": [
        "論", "討", "商", "評"
      ],
      "variants": [],
      "level_info": {
        "jlpt": "N2",
        "hsk": "5급",
        "korean_standard": "고급"
      }
    }
  },
  {
    "id": "HJ-05-0007-53E5",
    "character": "句",
    "unicode": "53E5",
    "meaning": "글귀 구",
    "pronunciation": "구",
    "stroke_count": 5,
    "radical": "口",
    "grade": 5,
    "order": 7,
    "tags": [
      "radical:口",
      "strokes:5",
      "category:language",
      "level:advanced"
    ],
    "extended_data": {
      "detailed_meaning": "문장, 글귀, 구절의 의미를 가진 한자",
      "etymology": "입(口)과 갈고리(勹)의 결합으로, '말을 묶는다'는 의미에서 '글귀'를 뜻하게 되었습니다.",
      "mnemonics": "입(口)에서 나온 말을 갈고리(勹)로 묶어 '문장'을 만든다고 기억할 수 있습니다.",
      "common_words": [
        {
          "word": "文句",
          "meaning": "문구",
          "pronunciation": "문구",
          "example_sentence": "인상적인 文句를 인용했다.",
          "usage": "글의 일부를 표현할 때 사용"
        },
        {
          "word": "句節",
          "meaning": "구절",
          "pronunciation": "구절",
          "example_sentence": "이 句節을 암기하세요.",
          "usage": "문장의 한 부분을 표현할 때 사용"
        },
        {
          "word": "名句",
          "meaning": "명구",
          "pronunciation": "명구",
          "example_sentence": "그 시의 名句를 기억하고 있다.",
          "usage": "유명한 문장을 표현할 때 사용"
        }
      ],
      "example_sentences": [
        {
          "sentence": "千古絶句",
          "meaning": "천고절구 - 천 년 동안 남을 뛰어난 시구",
          "pronunciation": "천고절구",
          "difficulty": "advanced"
        },
        {
          "sentence": "一句千金",
          "meaning": "일구천금 - 한 구절이 천금의 가치가 있음",
          "pronunciation": "일구천금",
          "difficulty": "advanced"
        }
      ],
      "cultural_notes": "동아시아 문학 전통에서 '句'는 특히 시가 문학에서 중요한 단위입니다. 한시(漢詩)에서는 '絶句'(절구), '律句'(율구) 등 다양한 형식이 발전했으며, 간결하면서도 깊은 의미를 담은 구절이 높이 평가되었습니다.",
      "pronunciation_guide": {
        "korean": "구 (gu)",
        "japanese_on": "く (ku)",
        "japanese_kun": "","mandarin": "jù",
        "cantonese": "geoi3"
      },
      "stroke_order": {
        "description": "왼쪽의 갈고리(勹) 부분을 먼저 쓰고, 오른쪽의 입(口) 부분을 씁니다.",
        "directions": []
      },
      "related_characters": [
        "文", "詞", "章", "節"
      ],
      "variants": [],
      "level_info": {
        "jlpt": "N3",
        "hsk": "4급",
        "korean_standard": "고급"
      }
    }
  },
  {
    "id": "HJ-05-0008-52D5",
    "character": "動",
    "unicode": "52D5",
    "meaning": "움직일 동",
    "pronunciation": "동",
    "stroke_count": 11,
    "radical": "力",
    "grade": 5,
    "order": 8,
    "tags": [
      "radical:力",
      "strokes:11",
      "category:action",
      "level:advanced"
    ],
    "extended_data": {
      "detailed_meaning": "움직이다, 작동하다, 감동하다의 의미를 가진 한자",
      "etymology": "무거울 중(重)과 힘 력(力)의 결합으로, '큰 힘을 써서 무거운 것을 옮긴다'는 의미에서 '움직이다'의 뜻을 갖게 되었습니다.",
      "mnemonics": "무거운 것(重)을 힘(力)으로 옮기는 '움직임'을 의미한다고 기억할 수 있습니다.",
      "common_words": [
        {
          "word": "運動",
          "meaning": "운동",
          "pronunciation": "운동",
          "example_sentence": "規則的으로 運動을 하다.",
          "usage": "신체 활동을 표현할 때 사용"
        },
        {
          "word": "動作",
          "meaning": "동작",
          "pronunciation": "동작",
          "example_sentence": "그의 動作이 우아하다.",
          "usage": "몸의 움직임을 표현할 때 사용"
        },
        {
          "word": "感動",
          "meaning": "감동",
          "pronunciation": "감동",
          "example_sentence": "그 이야기에 感動했다.",
          "usage": "마음이 움직이는 상태를 표현할 때 사용"
        }
      ],
      "example_sentences": [
        {
          "sentence": "動靜有常",
          "meaning": "동정유상 - 움직임과 고요함에 일정한 법도가 있음",
          "pronunciation": "동정유상",
          "difficulty": "advanced"
        },
        {
          "sentence": "不動如山",
          "meaning": "부동여산 - 산처럼 움직이지 않음",
          "pronunciation": "부동여산",
          "difficulty": "advanced"
        }
      ],
      "cultural_notes": "동아시아 철학에서 '動'은 '靜'(정, 고요함)과 함께 우주의 기본 원리를 설명하는 개념입니다. 특히 도교에서는 모든 변화의 근원으로 여겨지며, 자연의 순환과 변화를 이해하는 핵심 개념입니다.",
      "pronunciation_guide": {
        "korean": "동 (dong)",
        "japanese_on": "どう (dou)",
        "japanese_kun": "うご(く) (ugo(ku))",
        "mandarin": "dòng",
        "cantonese": "dung6"
      },
      "stroke_order": {
        "description": "상단의 중(重) 부분을 먼저 쓰고, 하단의 력(力) 부분을 씁니다.",
        "directions": []
      },
      "related_characters": [
        "靜", "活", "運", "移"
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
    "id": "HJ-05-0009-516C",
    "character": "公",
    "unicode": "516C",
    "meaning": "공평할 공",
    "pronunciation": "공",
    "stroke_count": 4,
    "radical": "八",
    "grade": 5,
    "order": 9,
    "tags": [
      "radical:八",
      "strokes:4",
      "category:society",
      "level:advanced"
    ],
    "extended_data": {
      "detailed_meaning": "공평하다, 공적인, 공개적인, 공작의 의미를 가진 한자",
      "etymology": "팔(八)과 사사로울 사(厶)의 대립되는, '사사로움을 벗어난 공평함'을 의미하게 되었습니다.",
      "mnemonics": "팔방(八)으로 열린 마음에서 사사로움(厶)을 버리는 '공평함'을 의미한다고 기억할 수 있습니다.",
      "common_words": [
        {
          "word": "公共",
          "meaning": "공공",
          "pronunciation": "공공",
          "example_sentence": "公共의 이익을 위해 일하다.",
          "usage": "모두를 위한 것을 표현할 때 사용"
        },
        {
          "word": "公式",
          "meaning": "공식",
          "pronunciation": "공식",
          "example_sentence": "公式 발표가 있었다.",
          "usage": "정식으로 인정된 것을 표현할 때 사용"
        },
        {
          "word": "公平",
          "meaning": "공평",
          "pronunciation": "공평",
          "example_sentence": "公平한 판결을 내렸다.",
          "usage": "치우침 없는 상태를 표현할 때 사용"
        }
      ],
      "example_sentences": [
        {
          "sentence": "公私分明",
          "meaning": "공사분명 - 공적인 일과 사적인 일을 명확히 구분함",
          "pronunciation": "공사분명",
          "difficulty": "advanced"
        },
        {
          "sentence": "大公無私",
          "meaning": "대공무사 - 크게 공평하고 사사로움이 없음",
          "pronunciation": "대공무사",
          "difficulty": "advanced"
        }
      ],
      "cultural_notes": "유교 문화에서 '公'은 치우침 없는 정의로운 통치의 근본 원칙으로 강조됩니다. 군주가 개인적 이익보다 공공의 이익을 우선시하는 '大公'(대공) 정신은 이상적인 통치의 핵심으로 여겨졌습니다.",
      "pronunciation_guide": {
        "korean": "공 (gong)",
        "japanese_on": "こう (kou)",
        "japanese_kun": "おおやけ (ooyake)",
        "mandarin": "gōng",
        "cantonese": "gung1"
      },
      "stroke_order": {
        "description": "위쪽의 팔(八) 부분을 먼저 쓰고, 아래쪽의 사(厶) 부분을 씁니다.",
        "directions": []
      },
      "related_characters": [
        "私", "正", "平", "官"
      ],
      "variants": [],
      "level_info": {
        "jlpt": "N4",
        "hsk": "2급",
        "korean_standard": "고급"
      }
    }
  }
];

// 데이터 확장
grade5Data.characters = [...grade5Data.characters, ...additionalCharacters];
grade5Data.metadata.total_characters = grade5Data.characters.length;
grade5Data.metadata.last_updated = new Date().toISOString();

// 파일 저장
try {
  fs.writeFileSync(outputFilePath, JSON.stringify(grade5Data, null, 2), 'utf8');
  console.log(`Enhanced grade 5 data saved with ${grade5Data.characters.length} characters`);
} catch (error) {
  console.error(`Error saving enhanced grade 5 data: ${error.message}`);
  process.exit(1);
} 