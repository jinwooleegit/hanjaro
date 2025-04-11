const fs = require('fs');
const path = require('path');

/**
 * 13급 기초 한자 데이터 확장 스크립트
 * 기존의 13급 한자 데이터를 초보자 친화적인 정보로 확장합니다.
 */

// 파일 경로 설정
const gradeDataDir = path.resolve(__dirname, '../data/new-structure/characters/by-grade');
const inputFilePath = path.join(gradeDataDir, 'grade_13.json');
const outputFilePath = path.join(gradeDataDir, 'grade_13.json');

// 데이터 읽기
let grade13Data;
try {
  const fileContent = fs.readFileSync(inputFilePath, 'utf8');
  grade13Data = JSON.parse(fileContent);
  console.log(`Successfully read grade 13 data: ${grade13Data.characters.length} characters`);
} catch (error) {
  console.error(`Error reading grade 13 data: ${error.message}`);
  process.exit(1);
}

// 확장할 한자들 인덱스 선택 (전체 데이터의 약 70% 정도)
const charactersToExpand = grade13Data.characters.slice(0, Math.floor(grade13Data.characters.length * 0.7));
console.log(`Selected ${charactersToExpand.length} characters to expand`);

// 한자 데이터 확장
charactersToExpand.forEach(character => {
  // 기존 확장 데이터가 없으면 초기화
  if (!character.extended_data) {
    character.extended_data = {};
  }

  // 상세 의미 추가
  if (!character.extended_data.detailed_meaning) {
    character.extended_data.detailed_meaning = `${character.character}는 '${character.meaning}'이라는 뜻을 가진 아주 기초적인 한자입니다. 13급은 한자를 처음 배우는 분들을 위한 매우 기본적인 한자로 구성되어 있습니다.`;
  }

  // 어원 정보 추가 (그림으로 설명)
  if (!character.extended_data.etymology) {
    character.extended_data.etymology = `${character.character}는 원래 '${character.meaning}'의 모양을 간단하게 그린 그림에서 시작되었어요. 옛날 사람들이 그린 그림이 점점 바뀌어서 지금의 모양이 되었어요.`;
  }

  // 기억법 추가 (재미있는 이야기 형식)
  if (!character.extended_data.mnemonics) {
    character.extended_data.mnemonics = `${character.character}(${character.meaning})는 ${character.stroke_count}획으로 그려요. 마치 ${character.meaning}을(를) 그리는 것처럼 생각하면 재미있게 기억할 수 있어요!`;
  }

  // 관련 단어 추가 (매우 간단한 단어)
  if (!character.extended_data.common_words) {
    character.extended_data.common_words = [
      {
        word: `${character.character}가`,
        meaning: `${character.meaning}가`,
        pronunciation: `${character.pronunciation}가`,
        example_sentence: `${character.character}가 보여요.`,
        example_meaning: `${character.meaning}가 보여요.`
      },
      {
        word: `${character.character}야`,
        meaning: `${character.meaning}야`,
        pronunciation: `${character.pronunciation}야`,
        example_sentence: `이건 ${character.character}야.`,
        example_meaning: `이건 ${character.meaning}야.`
      }
    ];
  }

  // 예문 추가 (아주 간단한 문장)
  if (!character.extended_data.example_sentences) {
    character.extended_data.example_sentences = [
      {
        sentence: `${character.character}는 한자예요.`,
        meaning: `${character.meaning}는 한자예요.`,
        pronunciation: `${character.pronunciation}는 한자예요.`,
        difficulty: "beginner"
      },
      {
        sentence: `${character.character}를 써보세요.`,
        meaning: `${character.meaning}을 써보세요.`,
        pronunciation: `${character.pronunciation}를 써보세요.`,
        difficulty: "beginner"
      }
    ];
  }

  // 문화적 배경 추가 (초등학생도 이해할 수 있게)
  if (!character.extended_data.cultural_notes) {
    character.extended_data.cultural_notes = `${character.character}(${character.meaning})는 아주 오래 전부터 사용된 한자예요. 한국, 중국, 일본에서 모두 사용하는 글자랍니다. 아이들도 쉽게 배울 수 있는 중요한 한자예요.`;
  }

  // 발음 가이드 추가 (발음 연습)
  if (!character.extended_data.pronunciation_guide) {
    character.extended_data.pronunciation_guide = `우리말로는 '${character.pronunciation}'라고 소리 내요. '${character.pronunciation}'라고 크게 따라 말해보세요!`;
  }

  // 획순 정보 추가 (아주 쉽게 설명)
  if (!character.extended_data.stroke_order) {
    let instructions = [];
    for (let i = 1; i <= Math.min(character.stroke_count, 5); i++) {
      const direction = i === 1 ? "첫 번째 줄을 그어요" : 
                        i === 2 ? "두 번째 줄을 그어요" : 
                        i === 3 ? "세 번째 줄을 그어요" : 
                        i === 4 ? "네 번째 줄을 그어요" : 
                        "마지막 줄을 그어요";
      instructions.push(`${i}번째 획: ${direction}`);
    }

    character.extended_data.stroke_order = {
      description: `${character.character}는 ${character.stroke_count}번 연필을 움직여서 쓰는 한자예요. 천천히 따라 써보세요!`,
      directions: instructions
    };
  }

  // 관련 한자 추가 (매우 쉬운 한자들)
  if (!character.extended_data.related_characters) {
    const relatedChars = grade13Data.characters
      .filter(char => 
        (char.radical === character.radical || 
         char.stroke_count === character.stroke_count) && 
        char.id !== character.id
      )
      .slice(0, 2)
      .map(char => char.id);
    
    character.extended_data.related_characters = relatedChars.length > 0 ? relatedChars : [];
  }

  // 재미있는 활동 추가
  if (!character.extended_data.fun_activities) {
    character.extended_data.fun_activities = [
      `${character.character}를 색연필로 예쁘게 색칠해보세요.`,
      `${character.character}를 따라 그리는 놀이를 해보세요.`,
      `${character.character}가 들어간 단어를 찾아보세요.`
    ];
  }
});

// 업데이트된 데이터 저장
try {
  fs.writeFileSync(outputFilePath, JSON.stringify(grade13Data, null, 2), 'utf8');
  console.log(`Successfully expanded and saved grade 13 data with ${grade13Data.characters.length} characters`);
} catch (error) {
  console.error(`Error saving expanded grade 13 data: ${error.message}`);
  process.exit(1);
}

console.log('Grade 13 data expansion completed successfully.'); 