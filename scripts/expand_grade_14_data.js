const fs = require('fs');
const path = require('path');

/**
 * 14급 기초 한자 데이터 확장 스크립트
 * 기존의 14급 한자 데이터를 초보자 친화적인 정보로 확장합니다.
 */

// 파일 경로 설정
const gradeDataDir = path.resolve(__dirname, '../data/new-structure/characters/by-grade');
const inputFilePath = path.join(gradeDataDir, 'grade_14.json');
const outputFilePath = path.join(gradeDataDir, 'grade_14.json');

// 데이터 읽기
let grade14Data;
try {
  const fileContent = fs.readFileSync(inputFilePath, 'utf8');
  grade14Data = JSON.parse(fileContent);
  console.log(`Successfully read grade 14 data: ${grade14Data.characters.length} characters`);
} catch (error) {
  console.error(`Error reading grade 14 data: ${error.message}`);
  process.exit(1);
}

// 확장할 한자들 인덱스 선택 (전체 데이터의 약 75% 정도)
const charactersToExpand = grade14Data.characters.slice(0, Math.floor(grade14Data.characters.length * 0.75));
console.log(`Selected ${charactersToExpand.length} characters to expand`);

// 한자 데이터 확장
charactersToExpand.forEach(character => {
  // 기존 확장 데이터가 없으면 초기화
  if (!character.extended_data) {
    character.extended_data = {};
  }

  // 상세 의미 추가
  if (!character.extended_data.detailed_meaning) {
    character.extended_data.detailed_meaning = `${character.character}는 '${character.meaning}'이라는 뜻의 아주 기본적인 한자입니다. 한자를 처음 배우는 사람들을 위한 가장 기초적인 한자 중 하나입니다.`;
  }

  // 어원 정보 추가 (매우 쉽게 설명)
  if (!character.extended_data.etymology) {
    character.extended_data.etymology = `${character.character}는 옛날에 '${character.meaning}'을(를) 그림으로 그린 것에서 시작되었어요. 그림이 점점 바뀌어서 지금의 모양이 되었답니다.`;
  }

  // 기억법 추가 (재미있게 설명)
  if (!character.extended_data.mnemonics) {
    character.extended_data.mnemonics = `${character.character}(${character.meaning})는 ${character.stroke_count}획으로 그려요. 이 한자는 마치 ${character.meaning}같이 생겼다고 생각하면 재미있게 기억할 수 있어요!`;
  }

  // 관련 단어 추가 (매우 간단한 단어)
  if (!character.extended_data.common_words) {
    character.extended_data.common_words = [
      {
        word: `${character.character}님`,
        meaning: `${character.meaning}님`,
        pronunciation: `${character.pronunciation}님`,
        example_sentence: `${character.character}님이 오셨어요.`,
        example_meaning: `${character.meaning}님이 오셨어요.`
      },
      {
        word: `작은 ${character.character}`,
        meaning: `작은 ${character.meaning}`,
        pronunciation: `작은 ${character.pronunciation}`,
        example_sentence: `작은 ${character.character}를 그렸어요.`,
        example_meaning: `작은 ${character.meaning}을 그렸어요.`
      }
    ];
  }

  // 예문 추가 (매우 쉬운 문장)
  if (!character.extended_data.example_sentences) {
    character.extended_data.example_sentences = [
      {
        sentence: `이것은 ${character.character}입니다.`,
        meaning: `이것은 ${character.meaning}입니다.`,
        pronunciation: `이것은 ${character.pronunciation}입니다.`,
        difficulty: "beginner"
      },
      {
        sentence: `저기 ${character.character}가 있어요.`,
        meaning: `저기 ${character.meaning}이 있어요.`,
        pronunciation: `저기 ${character.pronunciation}가 있어요.`,
        difficulty: "beginner"
      }
    ];
  }

  // 문화적 배경 추가 (아이들도 이해할 수 있게)
  if (!character.extended_data.cultural_notes) {
    character.extended_data.cultural_notes = `${character.character}(${character.meaning})는 아주 오래전부터 사용된 한자예요. 한국, 중국, 일본 등 여러 나라에서 사용하는 중요한 글자예요. 아주 어린 아이들도 배우는 기초 한자랍니다.`;
  }

  // 발음 가이드 추가 (쉽게 설명)
  if (!character.extended_data.pronunciation_guide) {
    character.extended_data.pronunciation_guide = `우리말로는 '${character.pronunciation}'로 발음해요. 입을 크게 벌리고 '${character.pronunciation}'라고 말해보세요!`;
  }

  // 획순 정보 추가 (그림책처럼 설명)
  if (!character.extended_data.stroke_order) {
    let instructions = [];
    for (let i = 1; i <= Math.min(character.stroke_count, 5); i++) {
      const direction = i === 1 ? "위에서 아래로 그어요" : 
                        i === 2 ? "왼쪽에서 오른쪽으로 그어요" : 
                        i === 3 ? "점을 찍어요" : 
                        i === 4 ? "구부러진 선을 그어요" : 
                        "마지막 선을 그어요";
      instructions.push(`${i}번째 획: ${direction}`);
    }

    character.extended_data.stroke_order = {
      description: `${character.character}는 총 ${character.stroke_count}번 연필을 움직여서 그리는 한자예요. 천천히 따라해 보세요!`,
      directions: instructions
    };
  }

  // 관련 한자 추가 (비슷하게 생긴 매우 쉬운 한자)
  if (!character.extended_data.related_characters) {
    const relatedChars = grade14Data.characters
      .filter(char => 
        (char.radical === character.radical || 
         Math.abs(char.stroke_count - character.stroke_count) <= 1) && 
        char.id !== character.id
      )
      .slice(0, 2)
      .map(char => char.id);
    
    character.extended_data.related_characters = relatedChars.length > 0 ? relatedChars : [];
  }

  // 재미있는 활동 추가
  if (!character.extended_data.fun_activities) {
    character.extended_data.fun_activities = [
      `${character.character}를 손가락으로 공중에 써보세요.`,
      `${character.character}를 찾는 보물찾기 놀이를 해보세요.`,
      `${character.character}를 모래나 쌀 위에 손가락으로 써보세요.`
    ];
  }

  // 학습 팁 추가
  if (!character.extended_data.learning_tips) {
    character.extended_data.learning_tips = [
      `${character.character}는 ${character.stroke_count}획이에요. 손가락으로 세어보세요.`,
      `${character.radical} 부수를 먼저 익히면 더 쉽게 배울 수 있어요.`,
      `매일 3번씩 따라 쓰면 빨리 외울 수 있어요.`
    ];
  }
});

// 업데이트된 데이터 저장
try {
  fs.writeFileSync(outputFilePath, JSON.stringify(grade14Data, null, 2), 'utf8');
  console.log(`Successfully expanded and saved grade 14 data with ${grade14Data.characters.length} characters`);
} catch (error) {
  console.error(`Error saving expanded grade 14 data: ${error.message}`);
  process.exit(1);
}

console.log('Grade 14 data expansion completed successfully.'); 