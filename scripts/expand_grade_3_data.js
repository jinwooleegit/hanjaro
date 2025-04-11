const fs = require('fs');
const path = require('path');

/**
 * 3급 고급 한자 데이터 확장 스크립트
 * 기존의 3급 한자 데이터를 더 풍부하게 확장합니다.
 */

// 파일 경로 설정
const gradeDataDir = path.resolve(__dirname, '../data/new-structure/characters/by-grade');
const inputFilePath = path.join(gradeDataDir, 'grade_3.json');
const outputFilePath = path.join(gradeDataDir, 'grade_3.json');

// 데이터 읽기
let grade3Data;
try {
  const fileContent = fs.readFileSync(inputFilePath, 'utf8');
  grade3Data = JSON.parse(fileContent);
  console.log(`Successfully read grade 3 data: ${grade3Data.characters.length} characters`);
} catch (error) {
  console.error(`Error reading grade 3 data: ${error.message}`);
  process.exit(1);
}

// 추가할 한자 데이터
const additionalCharacters = [
  {
    "id": "HJ-03-0004-8B58",
    "character": "識",
    "unicode": "8B58",
    "meaning": "알 식",
    "pronunciation": "식",
    "stroke_count": 19,
    "radical": "言",
    "grade": 3,
    "order": 4,
    "tags": [
      "radical:言",
      "strokes:19",
      "category:knowledge",
      "level:advanced"
    ],
    "extended_data": {
      "detailed_meaning": "알다, 식별하다, 지식, 견문의 의미를 가진 한자",
      "etymology": "말씀 언(言)과 식(戠)의 결합으로, '말로 구별한다'는 의미에서 '알다'의 뜻을 갖게 되었습니다.",
      "mnemonics": "말(言)로 구별할 줄 아는(戠) '지식'을 의미한다고 기억할 수 있습니다.",
      "common_words": [
        {
          "word": "知識",
          "meaning": "지식",
          "pronunciation": "지식",
          "example_sentence": "폭넓은 知識을 갖추고 있다.",
          "usage": "배워서 알게 된 내용을 표현할 때 사용"
        },
        {
          "word": "常識",
          "meaning": "상식",
          "pronunciation": "상식",
          "example_sentence": "그것은 基本 常識이다.",
          "usage": "일상적으로 알고 있는 지식을 표현할 때 사용"
        },
        {
          "word": "識別",
          "meaning": "식별",
          "pronunciation": "식별",
          "example_sentence": "두 제품을 識別하기 어렵다.",
          "usage": "구별하여 알아보는 것을 표현할 때 사용"
        }
      ],
      "example_sentences": [
        {
          "sentence": "見識卓越",
          "meaning": "견식탁월 - 식견이 뛰어남",
          "pronunciation": "견식탁월",
          "difficulty": "advanced"
        },
        {
          "sentence": "識時務者",
          "meaning": "식시무자 - 시대의 변화를 아는 사람",
          "pronunciation": "식시무자",
          "difficulty": "advanced"
        }
      ],
      "cultural_notes": "동아시아 철학에서 '識'은 단순한 지식을 넘어 세상을 이해하고 분별하는 능력을 의미합니다. 불교에서는 '八識'(팔식)으로 인간의 의식 작용을 설명하며, 유교에서는 '見識'(견식)이 현명한 판단의 기초로 여겨집니다.",
      "pronunciation_guide": {
        "korean": "식 (sik)",
        "japanese_on": "しき (shiki)",
        "japanese_kun": "し(る) (shi(ru))",
        "mandarin": "shí, zhì",
        "cantonese": "sik1"
      },
      "stroke_order": {
        "description": "왼쪽의 말씀 언(言) 부분을 먼저 쓰고, 오른쪽의 식(戠) 부분을 씁니다.",
        "directions": []
      },
      "related_characters": [
        "知", "解", "悟", "認"
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
    "id": "HJ-03-0005-91CD",
    "character": "重",
    "unicode": "91CD",
    "meaning": "무거울 중",
    "pronunciation": "중",
    "stroke_count": 9,
    "radical": "里",
    "grade": 3,
    "order": 5,
    "tags": [
      "radical:里",
      "strokes:9",
      "category:attribute",
      "level:advanced"
    ],
    "extended_data": {
      "detailed_meaning": "무겁다, 중요하다, 거듭, 겹치다의 의미를 가진 한자",
      "etymology": "동이(東) 위에 사람(人)이 있는 형태로, '무거운 짐을 짊어진 사람'의 모습에서 '무겁다'는 의미가 생겼습니다.",
      "mnemonics": "사람(人)이 무거운 것을 짊어진 모습으로 '무겁다'를 의미한다고 기억할 수 있습니다.",
      "common_words": [
        {
          "word": "重要",
          "meaning": "중요",
          "pronunciation": "중요",
          "example_sentence": "이것은 매우 重要한 문제이다.",
          "usage": "가치나 의미가 큰 것을 표현할 때 사용"
        },
        {
          "word": "重量",
          "meaning": "중량",
          "pronunciation": "중량",
          "example_sentence": "이 물건의 重量은 5kg이다.",
          "usage": "물체의 무게를 표현할 때 사용"
        },
        {
          "word": "輕重",
          "meaning": "경중",
          "pronunciation": "경중",
          "example_sentence": "사안의 輕重을 판단해야 한다.",
          "usage": "가벼움과 무거움의 정도를 표현할 때 사용"
        }
      ],
      "example_sentences": [
        {
          "sentence": "一言九鼎重",
          "meaning": "일언구정중 - 한 마디 말이 아홉 솥만큼 무겁다",
          "pronunciation": "일언구정중",
          "difficulty": "advanced"
        },
        {
          "sentence": "重壓之下",
          "meaning": "중압지하 - 무거운 압박 아래",
          "pronunciation": "중압지하",
          "difficulty": "advanced"
        }
      ],
      "cultural_notes": "동아시아 문화에서 '重'은 단순한 물리적 무게를 넘어 도덕적, 사회적 책임감과 중요성을 나타냅니다. 유교 사상에서는 '禮有輕重'(예유경중, 예에는 경중이 있다)이라 하여 의례와 도덕적 행동의 중요도를 구분했습니다.",
      "pronunciation_guide": {
        "korean": "중 (jung)",
        "japanese_on": "じゅう (juu), ちょう (chou)",
        "japanese_kun": "おも(い) (omo(i)), かさ(ねる) (kasa(neru))",
        "mandarin": "zhòng",
        "cantonese": "zung6, cung5"
      },
      "stroke_order": {
        "description": "상단의 가로획을 먼저 긋고, 세로획을 내린 후, 아래쪽 부분을 씁니다.",
        "directions": []
      },
      "related_characters": [
        "輕", "量", "複", "疊"
      ],
      "variants": [],
      "level_info": {
        "jlpt": "N4",
        "hsk": "2급",
        "korean_standard": "고급"
      }
    }
  },
  {
    "id": "HJ-03-0006-4EBA",
    "character": "人",
    "unicode": "4EBA",
    "meaning": "사람 인",
    "pronunciation": "인",
    "stroke_count": 2,
    "radical": "人",
    "grade": 3,
    "order": 6,
    "tags": [
      "radical:人",
      "strokes:2",
      "category:person",
      "level:advanced"
    ],
    "extended_data": {
      "detailed_meaning": "사람, 인간, 다른 사람, 인격의 의미를 가진 한자",
      "etymology": "서 있는 사람의 모습을 본뜬 상형문자입니다. 두 다리가 벌어진 사람의 형상을 도식화했습니다.",
      "mnemonics": "두 다리로 서 있는 사람의 모습으로 '사람'을 의미한다고 기억할 수 있습니다.",
      "common_words": [
        {
          "word": "人間",
          "meaning": "인간",
          "pronunciation": "인간",
          "example_sentence": "人間의 존엄성을 존중해야 한다.",
          "usage": "사람으로서의 존재를 표현할 때 사용"
        },
        {
          "word": "他人",
          "meaning": "타인",
          "pronunciation": "타인",
          "example_sentence": "他人의 의견을 존중하라.",
          "usage": "다른 사람을 가리킬 때 사용"
        },
        {
          "word": "人物",
          "meaning": "인물",
          "pronunciation": "인물",
          "example_sentence": "그는 훌륭한 人物이다.",
          "usage": "사람의 됨됨이를 표현할 때 사용"
        }
      ],
      "example_sentences": [
        {
          "sentence": "人不知而不慍",
          "meaning": "인부지이불온 - 남이 알아주지 않아도 서운해하지 않는다",
          "pronunciation": "인부지이불온",
          "difficulty": "advanced"
        },
        {
          "sentence": "人生如夢",
          "meaning": "인생여몽 - 인생은 꿈과 같다",
          "pronunciation": "인생여몽",
          "difficulty": "advanced"
        }
      ],
      "cultural_notes": "동아시아 철학에서 '人'은 단순한 생물학적 존재를 넘어 도덕적, 사회적 존재로서의 인간을 의미합니다. 특히 유교에서는 '仁'(어질 인)이라는 덕목이 '人'(사람)과 밀접하게 연관되어, 인간다움의 핵심으로 여겨집니다.",
      "pronunciation_guide": {
        "korean": "인 (in)",
        "japanese_on": "じん (jin), にん (nin)",
        "japanese_kun": "ひと (hito)",
        "mandarin": "rén",
        "cantonese": "jan4"
      },
      "stroke_order": {
        "description": "왼쪽 빗금을 먼저 긋고, 오른쪽 빗금을 그립니다.",
        "directions": []
      },
      "related_characters": [
        "仁", "個", "人", "衆"
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
    "id": "HJ-03-0007-524D",
    "character": "前",
    "unicode": "524D",
    "meaning": "앞 전",
    "pronunciation": "전",
    "stroke_count": 9,
    "radical": "刀",
    "grade": 3,
    "order": 7,
    "tags": [
      "radical:刀",
      "strokes:9",
      "category:position",
      "level:advanced"
    ],
    "extended_data": {
      "detailed_meaning": "앞, 전면, 이전, 이끌다의 의미를 가진 한자",
      "etymology": "도끼 부(斧)와 힘 력(力)의 결합으로, '도끼로 앞을 개척한다'는 의미에서 '앞'을 뜻하게 되었습니다.",
      "mnemonics": "도끼(斧)로 힘(力)을 써서 앞을 개척하는 모습으로 '앞'을 의미한다고 기억할 수 있습니다.",
      "common_words": [
        {
          "word": "前方",
          "meaning": "전방",
          "pronunciation": "전방",
          "example_sentence": "前方을 주시하십시오.",
          "usage": "앞쪽 방향을 표현할 때 사용"
        },
        {
          "word": "以前",
          "meaning": "이전",
          "pronunciation": "이전",
          "example_sentence": "以前보다 나아졌다.",
          "usage": "시간상 앞서 있음을 표현할 때 사용"
        },
        {
          "word": "前進",
          "meaning": "전진",
          "pronunciation": "전진",
          "example_sentence": "꾸준히 前進하고 있다.",
          "usage": "앞으로 나아감을 표현할 때 사용"
        }
      ],
      "example_sentences": [
        {
          "sentence": "前事不忘後事之師",
          "meaning": "전사불망후사지사 - 앞일을 잊지 않으면 뒷일의 스승이 된다",
          "pronunciation": "전사불망후사지사",
          "difficulty": "advanced"
        },
        {
          "sentence": "前途光明",
          "meaning": "전도광명 - 앞길이 밝음",
          "pronunciation": "전도광명",
          "difficulty": "advanced"
        }
      ],
      "cultural_notes": "동아시아 문화에서 '前'은 공간적 위치뿐만 아니라 시간적 개념과 사회적 위계, 그리고 발전의 방향성을 나타냅니다. 유교 사상에서는 '前人種樹, 後人乘涼'(전인종수, 후인승량 - 앞 사람이 나무를 심으면 뒷사람이 그늘을 즐긴다)이라는 말로 선대와 후대의 관계를 설명합니다.",
      "pronunciation_guide": {
        "korean": "전 (jeon)",
        "japanese_on": "ぜん (zen)",
        "japanese_kun": "まえ (mae), さき (saki)",
        "mandarin": "qián",
        "cantonese": "cin4"
      },
      "stroke_order": {
        "description": "위쪽의 횡절곡(亠)을 먼저 쓰고, 중간의 두점(丷), 마지막으로 아래쪽의 월(月) 부분을 씁니다.",
        "directions": []
      },
      "related_characters": [
        "後", "先", "進", "向"
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
    "id": "HJ-03-0008-5BAE",
    "character": "宮",
    "unicode": "5BAE",
    "meaning": "집 궁",
    "pronunciation": "궁",
    "stroke_count": 10,
    "radical": "宀",
    "grade": 3,
    "order": 8,
    "tags": [
      "radical:宀",
      "strokes:10",
      "category:building",
      "level:advanced"
    ],
    "extended_data": {
      "detailed_meaning": "궁궐, 왕궁, 큰 집, 관아의 의미를 가진 한자",
      "etymology": "집 면(宀)과 공 공(公)의 결합으로, '공적인 큰 집'이라는 의미에서 '궁궐'을 뜻하게 되었습니다.",
      "mnemonics": "지붕(宀) 아래 있는 공적인(公) 건물로 '궁궐'을 의미한다고 기억할 수 있습니다.",
      "common_words": [
        {
          "word": "宮殿",
          "meaning": "궁전",
          "pronunciation": "궁전",
          "example_sentence": "화려한 宮殿을 방문했다.",
          "usage": "왕이나 귀족이 사는 큰 건물을 표현할 때 사용"
        },
        {
          "word": "王宮",
          "meaning": "왕궁",
          "pronunciation": "왕궁",
          "example_sentence": "王宮 관람이 시작됩니다.",
          "usage": "왕이 거주하는 궁을 표현할 때 사용"
        },
        {
          "word": "宮中",
          "meaning": "궁중",
          "pronunciation": "궁중",
          "example_sentence": "宮中 의례가 열렸다.",
          "usage": "궁궐 안의 공간을 표현할 때 사용"
        }
      ],
      "example_sentences": [
        {
          "sentence": "深宮之中",
          "meaning": "심궁지중 - 깊은 궁중 속에",
          "pronunciation": "심궁지중",
          "difficulty": "advanced"
        },
        {
          "sentence": "宮室之美",
          "meaning": "궁실지미 - 궁궐과 방의 아름다움",
          "pronunciation": "궁실지미",
          "difficulty": "advanced"
        }
      ],
      "cultural_notes": "동아시아 전통 문화에서 '宮'은 단순한 건물이 아닌 권력의 중심이자 우주 질서의 상징이었습니다. 중국의 자금성(紫禁城)이나 한국의 경복궁(景福宮)은 천지의 질서를 반영한 배치와 구조를 가지고 있으며, 또한 음악에서 '宮'은 오음(五音) 중 하나로 귀족적 정서를 표현했습니다.",
      "pronunciation_guide": {
        "korean": "궁 (gung)",
        "japanese_on": "きゅう (kyuu), ぐう (guu)",
        "japanese_kun": "みや (miya)",
        "mandarin": "gōng",
        "cantonese": "gung1"
      },
      "stroke_order": {
        "description": "위쪽의 집 면(宀) 부분을 먼저 쓰고, 아래쪽의 공 공(公) 부분을 씁니다.",
        "directions": []
      },
      "related_characters": [
        "殿", "閣", "城", "寢"
      ],
      "variants": [],
      "level_info": {
        "jlpt": "N2",
        "hsk": "4급",
        "korean_standard": "고급"
      }
    }
  }
];

// 데이터 확장
grade3Data.characters = [...grade3Data.characters, ...additionalCharacters];
grade3Data.metadata.total_characters = grade3Data.characters.length;
grade3Data.metadata.last_updated = new Date().toISOString();

// 파일 저장
try {
  fs.writeFileSync(outputFilePath, JSON.stringify(grade3Data, null, 2), 'utf8');
  console.log(`Enhanced grade 3 data saved with ${grade3Data.characters.length} characters`);
} catch (error) {
  console.error(`Error saving enhanced grade 3 data: ${error.message}`);
  process.exit(1);
} 