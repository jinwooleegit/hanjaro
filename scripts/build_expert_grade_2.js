const fs = require('fs');
const path = require('path');

/**
 * 전문가 2급 한자 데이터 구축 스크립트
 * 이 스크립트는 2급 한자 데이터를 구축합니다.
 */

// 파일 경로 설정
const outputDir = path.resolve(__dirname, '../data/new-structure/characters/by-grade');
const outputFilePath = path.join(outputDir, 'grade_2.json');

// 전문가 2급 한자는 대학 수준의 한자로, 한자능력검정시험 2급 수준에 해당합니다.
const grade2Data = {
  "metadata": {
    "version": "1.0.0",
    "last_updated": new Date().toISOString(),
    "grade": 2,
    "total_characters": 20,
    "category": "expert",
    "description": "전문가 1단계 - 대학 교양 수준의 한자"
  },
  "characters": [
    {
      "id": "HJ-02-0001-91CB",
      "character": "釋",
      "unicode": "91CB",
      "meaning": "풀 석",
      "pronunciation": "석",
      "stroke_count": 16,
      "radical": "金",
      "grade": 2,
      "order": 1,
      "tags": [
        "radical:金",
        "strokes:16",
        "category:philosophy",
        "level:expert"
      ],
      "extended_data": {
        "detailed_meaning": "풀이하다, 해석하다, 놓아주다의 의미를 가진 한자",
        "etymology": "쇠(金)를 놓아두는(睪) 모습에서 유래하여 '풀다', '놓아주다'의 의미를 갖게 되었습니다.",
        "mnemonics": "쇠(金)와 풀이(睪)를 결합하여 '무거운 것을 풀어낸다'는 의미로 기억할 수 있습니다.",
        "common_words": [
          {
            "word": "解釋",
            "meaning": "해석",
            "pronunciation": "해석",
            "example_sentence": "이 문장의 解釋이 무엇입니까?",
            "usage": "뜻을 풀이할 때 사용"
          },
          {
            "word": "釋明",
            "meaning": "석명",
            "pronunciation": "석명",
            "example_sentence": "이 개념을 釋明해 주십시오.",
            "usage": "명확히 풀이할 때 사용"
          },
          {
            "word": "釋迦",
            "meaning": "석가(부처의 성)",
            "pronunciation": "석가",
            "example_sentence": "釋迦牟尼佛은 불교의 창시자입니다.",
            "usage": "불교 관련 용어로 사용"
          }
        ],
        "example_sentences": [
          {
            "sentence": "釋然開朗",
            "meaning": "석연개랑 - 의문이 풀리고 마음이 환해짐",
            "pronunciation": "석연개랑",
            "difficulty": "advanced"
          },
          {
            "sentence": "千古一釋",
            "meaning": "천고일석 - 오랜 세월에 걸친 훌륭한 해석",
            "pronunciation": "천고일석",
            "difficulty": "advanced"
          }
        ],
        "cultural_notes": "불교에서는 '석가모니'의 '석'으로 특별한 의미를 갖습니다. 또한 한문 해석과 관련된 학문 분야에서 중요한 용어로 사용됩니다.",
        "pronunciation_guide": {
          "korean": "석 (seok)",
          "japanese_on": "しゃく (shaku)",
          "japanese_kun": "と(く) (to(ku))",
          "mandarin": "shì",
          "cantonese": "sik1"
        },
        "stroke_order": {
          "description": "좌측의 金 부분을 먼저 쓰고, 우측의 睪 부분을 씁니다.",
          "directions": []
        },
        "related_characters": [
          "解", "說", "讀", "譯"
        ],
        "variants": [],
        "level_info": {
          "jlpt": "N1",
          "hsk": "6급",
          "korean_standard": "전문가"
        }
      }
    },
    {
      "id": "HJ-02-0002-5A1B",
      "character": "娶",
      "unicode": "5A1B",
      "meaning": "아내 맞을 취",
      "pronunciation": "취",
      "stroke_count": 11,
      "radical": "女",
      "grade": 2,
      "order": 2,
      "tags": [
        "radical:女",
        "strokes:11",
        "category:society",
        "level:expert"
      ],
      "extended_data": {
        "detailed_meaning": "아내를 맞이하다, 장가들다의 의미를 가진 한자",
        "etymology": "여자(女)를 취하다(取)는 의미에서 유래하여 '아내를 맞이하다'의 뜻을 갖게 되었습니다.",
        "mnemonics": "여자(女)와 취할 취(取)를 결합하여 '여자를 취하다'는 의미로 기억할 수 있습니다.",
        "common_words": [
          {
            "word": "娶妻",
            "meaning": "취처",
            "pronunciation": "취처",
            "example_sentence": "그는 올해 娶妻할 예정입니다.",
            "usage": "결혼에 관해 표현할 때 사용"
          },
          {
            "word": "娶親",
            "meaning": "취친",
            "pronunciation": "취친",
            "example_sentence": "古代에는 娶親의 예식이 엄격했다.",
            "usage": "결혼 의식을 표현할 때 사용"
          }
        ],
        "example_sentences": [
          {
            "sentence": "擇日娶親",
            "meaning": "택일취친 - 좋은 날을 골라 혼인하다",
            "pronunciation": "택일취친",
            "difficulty": "advanced"
          }
        ],
        "cultural_notes": "동아시아 전통 문화에서 혼인은 매우 중요한 의례였으며, '娶'는 남자가 여자를 아내로 맞이하는 행위를 의미합니다.",
        "pronunciation_guide": {
          "korean": "취 (chwi)",
          "japanese_on": "しゅ (shu)",
          "japanese_kun": "めと(る) (meto(ru))",
          "mandarin": "qǔ",
          "cantonese": "ceoi2"
        },
        "stroke_order": {
          "description": "먼저 女를 쓰고, 그 위에 取를 씁니다.",
          "directions": []
        },
        "related_characters": [
          "嫁", "婚", "姻", "媾"
        ],
        "variants": [],
        "level_info": {
          "jlpt": "N1",
          "hsk": "6급",
          "korean_standard": "전문가"
        }
      }
    },
    {
      "id": "HJ-02-0003-56B7",
      "character": "嚮",
      "unicode": "56B7",
      "meaning": "향할 향",
      "pronunciation": "향",
      "stroke_count": 20,
      "radical": "口",
      "grade": 2,
      "order": 3,
      "tags": [
        "radical:口",
        "strokes:20",
        "category:movement",
        "level:expert"
      ],
      "extended_data": {
        "detailed_meaning": "향하다, 방향을 잡다, 인도하다의 의미를 가진 한자",
        "etymology": "입(口)과 향할 향(鄉)의 결합으로, 소리내어 방향을 알려주는 의미에서 '향하다', '인도하다'의 뜻을 갖게 되었습니다.",
        "mnemonics": "입(口)으로 향할 곳(鄉)을 알려주는 모습으로 기억할 수 있습니다.",
        "common_words": [
          {
            "word": "嚮導",
            "meaning": "향도",
            "pronunciation": "향도",
            "example_sentence": "그는 우리의 嚮導가 되었다.",
            "usage": "안내자를 표현할 때 사용"
          },
          {
            "word": "嚮往",
            "meaning": "향왕",
            "pronunciation": "향왕",
            "example_sentence": "자유를 嚮往하다.",
            "usage": "바라고 동경할 때 사용"
          }
        ],
        "example_sentences": [
          {
            "sentence": "嚮往已久",
            "meaning": "향왕이구 - 오래전부터 동경해 오다",
            "pronunciation": "향왕이구",
            "difficulty": "advanced"
          }
        ],
        "cultural_notes": "한문에서 '嚮'는 방향과 지향성을 나타내는 중요한 글자로, 특히 고전 문학에서 정신적 지향을 표현할 때 자주 사용됩니다.",
        "pronunciation_guide": {
          "korean": "향 (hyang)",
          "japanese_on": "きょう (kyou)",
          "japanese_kun": "さき(に) (saki(ni))",
          "mandarin": "xiàng",
          "cantonese": "hoeng3"
        },
        "stroke_order": {
          "description": "먼저 口를 쓰고, 그 안에 鄉을 씁니다.",
          "directions": []
        },
        "related_characters": [
          "向", "響", "鄉", "饗"
        ],
        "variants": ["向"],
        "level_info": {
          "jlpt": "N1",
          "hsk": "6급",
          "korean_standard": "전문가"
        }
      }
    },
    {
      "id": "HJ-02-0004-7C9F",
      "character": "粹",
      "unicode": "7C9F",
      "meaning": "순수할 수",
      "pronunciation": "수",
      "stroke_count": 14,
      "radical": "米",
      "grade": 2,
      "order": 4,
      "tags": [
        "radical:米",
        "strokes:14",
        "category:quality",
        "level:expert"
      ],
      "extended_data": {
        "detailed_meaning": "순수하다, 정수, 알맹이의 의미를 가진 한자",
        "etymology": "쌀(米)을 빻아 순수한 것(卒)만 남긴다는 의미에서 '순수하다'의 뜻을 갖게 되었습니다.",
        "mnemonics": "쌀(米)을 정제하여 순수한 상태(卒)로 만든다는 의미로 기억할 수 있습니다.",
        "common_words": [
          {
            "word": "純粹",
            "meaning": "순수",
            "pronunciation": "순수",
            "example_sentence": "純粹한 금은 변색되지 않는다.",
            "usage": "순수함을 강조할 때 사용"
          },
          {
            "word": "粹美",
            "meaning": "수미",
            "pronunciation": "수미",
            "example_sentence": "그의 작품은 粹美를 추구한다.",
            "usage": "아름다움의 정수를 표현할 때 사용"
          }
        ],
        "example_sentences": [
          {
            "sentence": "集其大成",
            "meaning": "대성을 이루다 - 탁월함의 정수를 모으다",
            "pronunciation": "집기대성",
            "difficulty": "advanced"
          }
        ],
        "cultural_notes": "동아시아 철학에서 '粹'는 자연의 본질적 순수함을 추구하는 도교적 개념과 연결되며, 예술에서는 불필요한 것을 제거하고 본질만 남긴 상태를 의미합니다.",
        "pronunciation_guide": {
          "korean": "수 (su)",
          "japanese_on": "すい (sui)",
          "japanese_kun": "きよ(い) (kiyo(i))",
          "mandarin": "cuì",
          "cantonese": "seoi6"
        },
        "stroke_order": {
          "description": "먼저 좌측의 米를 쓰고, 우측의 卒을 씁니다.",
          "directions": []
        },
        "related_characters": [
          "純", "精", "潔", "淨"
        ],
        "variants": [],
        "level_info": {
          "jlpt": "N1",
          "hsk": "6급",
          "korean_standard": "전문가"
        }
      }
    },
    {
      "id": "HJ-02-0005-7BC0",
      "character": "篤",
      "unicode": "7BC0",
      "meaning": "도탑을 독",
      "pronunciation": "독",
      "stroke_count": 15,
      "radical": "竹",
      "grade": 2,
      "order": 5,
      "tags": [
        "radical:竹",
        "strokes:15",
        "category:virtue",
        "level:expert"
      ],
      "extended_data": {
        "detailed_meaning": "도탑다, 두텁다, 정성스럽다의 의미를 가진 한자",
        "etymology": "대나무(竹)와 실한(馬)의 결합으로, 대나무처럼 곧고 견고한 덕성을 의미하게 되었습니다.",
        "mnemonics": "대나무(竹)처럼 견고하고 말(馬)처럼 강한 정성을 뜻한다고 기억할 수 있습니다.",
        "common_words": [
          {
            "word": "篤志",
            "meaning": "독지",
            "pronunciation": "독지",
            "example_sentence": "그는 篤志家로 많은 기부를 했다.",
            "usage": "깊은 뜻을 표현할 때 사용"
          },
          {
            "word": "篤實",
            "meaning": "독실",
            "pronunciation": "독실",
            "example_sentence": "篤實한 신앙심을 가지고 있다.",
            "usage": "믿음이 깊을 때 사용"
          }
        ],
        "example_sentences": [
          {
            "sentence": "篤信好學",
            "meaning": "독신호학 - 믿음이 깊고 배움을 좋아함",
            "pronunciation": "독신호학",
            "difficulty": "advanced"
          }
        ],
        "cultural_notes": "유교 문화에서 '篤'은 중요한 덕목 중 하나로, 정성과 성실함을 강조하는 개념입니다. 특히 '篤行'(독행)은 성인(聖人)의 중요한 덕목으로 여겨졌습니다.",
        "pronunciation_guide": {
          "korean": "독 (dok)",
          "japanese_on": "とく (toku)",
          "japanese_kun": "あつ(い) (atsu(i))",
          "mandarin": "dǔ",
          "cantonese": "duk6"
        },
        "stroke_order": {
          "description": "상단의 竹을 먼저 쓰고, 하단의 馬를 씁니다.",
          "directions": []
        },
        "related_characters": [
          "厚", "誠", "信", "實"
        ],
        "variants": [],
        "level_info": {
          "jlpt": "N1",
          "hsk": "6급",
          "korean_standard": "전문가"
        }
      }
    }
  ]
};

// 파일 저장
try {
  fs.writeFileSync(outputFilePath, JSON.stringify(grade2Data, null, 2), 'utf8');
  console.log(`Grade 2 data saved to ${outputFilePath} (${grade2Data.characters.length} characters)`);
} catch (error) {
  console.error('Error saving grade 2 data:', error.message);
} 