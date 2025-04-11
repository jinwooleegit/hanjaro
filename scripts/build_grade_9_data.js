const fs = require('fs');
const path = require('path');

// 중급 한자의 시작인 9급 데이터 구축
// 9급은 주로 초등 고학년~중학교 수준에서 배우는 한자로 구성

// 파일 경로 설정
const outputDir = path.resolve(__dirname, '../data/new-structure/characters/by-grade');
const outputFilePath = path.join(outputDir, 'grade_9.json');

// 9급 한자 데이터 (예시 데이터 - 실제 구현 시 이 부분을 확장해야 함)
const grade9Data = {
  "metadata": {
    "version": "1.0.0",
    "last_updated": new Date().toISOString(),
    "grade": 9,
    "total_characters": 60 // 예시로 60자 설정
  },
  "characters": [
    {
      "id": "HJ-09-0001-5165",
      "character": "兵",
      "unicode": "5165",
      "meaning": "병사 병",
      "pronunciation": "병",
      "stroke_count": 7,
      "radical": "八",
      "grade": 9,
      "order": 1,
      "tags": [
        "radical:八",
        "strokes:7",
        "category:society"
      ],
      "extended_data": {
        "detailed_meaning": "군인, 병사, 무기를 의미하는 한자",
        "etymology": "갑골문에서는 두 사람이 서로 맞서 싸우는 모양을 본뜬 글자로, '군인'이나 '병사'의 의미를 가지게 되었습니다.",
        "mnemonics": "칼을 든 사람의 모양을 연상시켜 '군인'이나 '병사'를 의미합니다.",
        "common_words": [
          {
            "word": "兵士",
            "meaning": "병사",
            "pronunciation": "병사",
            "example_sentence": "兵士들이 훈련을 받고 있다.",
            "usage": "군인을 지칭할 때 사용"
          },
          {
            "word": "軍兵",
            "meaning": "군병",
            "pronunciation": "군병",
            "example_sentence": "軍兵들이 전투 태세를 갖추었다.",
            "usage": "군사를 지칭할 때 사용"
          },
          {
            "word": "兵法",
            "meaning": "병법",
            "pronunciation": "병법",
            "example_sentence": "孫子의 兵法을 연구하다.",
            "usage": "전쟁 전략을 표현할 때 사용"
          }
        ],
        "example_sentences": [
          {
            "sentence": "兵戈相見",
            "meaning": "병과상견 - 전쟁으로 맞서다",
            "pronunciation": "병과상견",
            "difficulty": "intermediate"
          },
          {
            "sentence": "以攻為守",
            "meaning": "공격이 최선의 방어라는 뜻",
            "pronunciation": "이공위수",
            "difficulty": "intermediate"
          }
        ],
        "cultural_notes": "한국, 중국, 일본 등 동아시아 문화권에서 兵(병)은 단순히 군인만을 의미하지 않고, 전쟁 기술과 전략, 무기 등 군사와 관련된 전반적인 개념을 포함합니다. 孫子兵法과 같은 고전 병서에서 중요하게 다루어졌습니다.",
        "pronunciation_guide": {
          "korean": "병 (byeong)",
          "japanese_on": "へい (hei), ひょう (hyou)",
          "japanese_kun": "つわもの (tsuwamono)",
          "mandarin": "bīng",
          "cantonese": "bing1"
        },
        "stroke_order": {
          "description": "먼저 八 부분을 그리고, 그 위에 ㅡ와 丨을 추가합니다.",
          "directions": [
            "M 30 40 L 50 20",
            "M 50 20 L 70 40",
            "M 30 60 L 70 60",
            "M 50 20 L 50 90",
            "M 30 75 L 70 75",
            "M 30 75 L 30 90",
            "M 70 75 L 70 90"
          ]
        },
        "related_characters": [
          "軍", "戰", "士", "戈"
        ],
        "variants": [],
        "level_info": {
          "jlpt": "N3",
          "hsk": "4급",
          "korean_standard": "중급"
        }
      }
    },
    {
      "id": "HJ-09-0002-5B78",
      "character": "學",
      "unicode": "5B78",
      "meaning": "배울 학",
      "pronunciation": "학",
      "stroke_count": 16,
      "radical": "子",
      "grade": 9,
      "order": 2,
      "tags": [
        "radical:子",
        "strokes:16",
        "category:education"
      ],
      "extended_data": {
        "detailed_meaning": "배움, 공부, 학문, 학교를 의미하는 한자",
        "etymology": "갑골문에서는 손으로 책을 들고 있는 아이의 모습을 본뜬 글자로, '배움'의 의미를 가지게 되었습니다.",
        "mnemonics": "아이(子)가 지붕(宀) 아래에서 손(爫)으로 무엇인가를 쌓아올리는(冖) 모습으로, '배움'을 의미합니다.",
        "common_words": [
          {
            "word": "學校",
            "meaning": "학교",
            "pronunciation": "학교",
            "example_sentence": "學校에 가다.",
            "usage": "교육 기관을 지칭할 때 사용"
          },
          {
            "word": "學生",
            "meaning": "학생",
            "pronunciation": "학생",
            "example_sentence": "그는 優秀한 學生이다.",
            "usage": "배움을 받는 사람을 지칭할 때 사용"
          },
          {
            "word": "科學",
            "meaning": "과학",
            "pronunciation": "과학",
            "example_sentence": "科學의 발전은 인류의 삶을 바꾸었다.",
            "usage": "체계적인 학문을 표현할 때 사용"
          }
        ],
        "example_sentences": [
          {
            "sentence": "學而不思則罔",
            "meaning": "학이불사즉망 - 배우기만 하고 생각하지 않으면 얻는 것이 없다",
            "pronunciation": "학이불사즉망",
            "difficulty": "intermediate"
          },
          {
            "sentence": "學如登山",
            "meaning": "학여등산 - 학문은 산에 오르는 것과 같다",
            "pronunciation": "학여등산",
            "difficulty": "intermediate"
          }
        ],
        "cultural_notes": "동아시아 문화권에서 學(학)은 단순한 지식 습득을 넘어 인격 형성과 도덕적 수양을 포함하는 포괄적인 개념입니다. 유교 문화에서는 배움을 통한 자기 계발과 사회 공헌이 강조되었습니다.",
        "pronunciation_guide": {
          "korean": "학 (hak)",
          "japanese_on": "がく (gaku)",
          "japanese_kun": "まなぶ (manabu)",
          "mandarin": "xué",
          "cantonese": "hok6"
        },
        "stroke_order": {
          "description": "먼저 宀 부분을 그리고, 그 아래에 子와 爫 부분을 추가합니다.",
          "directions": []
        },
        "related_characters": [
          "教", "習", "校", "修"
        ],
        "variants": ["学"],
        "level_info": {
          "jlpt": "N4",
          "hsk": "3급",
          "korean_standard": "중급"
        }
      }
    }
    // 실제 구현 시 더 많은 한자 데이터 추가 필요
  ]
};

// 파일 저장
try {
  fs.writeFileSync(outputFilePath, JSON.stringify(grade9Data, null, 2), 'utf8');
  console.log(`Grade 9 data saved to ${outputFilePath} (${grade9Data.characters.length} characters)`);
} catch (error) {
  console.error('Error saving grade 9 data:', error.message);
} 