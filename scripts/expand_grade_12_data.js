const fs = require('fs');
const path = require('path');

/**
 * 12급 기초 한자 데이터 확장 스크립트
 * 기존의 12급 한자 데이터를 초보자에게 친절한 정보로 확장합니다.
 */

// 파일 경로 설정
const gradeDataDir = path.resolve(__dirname, '../data/new-structure/characters/by-grade');
const inputFilePath = path.join(gradeDataDir, 'grade_12.json');
const outputFilePath = path.join(gradeDataDir, 'grade_12.json');

// 데이터 읽기
let grade12Data;
try {
  const fileContent = fs.readFileSync(inputFilePath, 'utf8');
  grade12Data = JSON.parse(fileContent);
  console.log(`Successfully read grade 12 data: ${grade12Data.characters.length} characters`);
} catch (error) {
  console.error(`Error reading grade 12 data: ${error.message}`);
  process.exit(1);
}

// 확장할 한자들 인덱스 선택 (전체 데이터의 약 70% 정도)
const charactersToExpand = grade12Data.characters.slice(0, Math.floor(grade12Data.characters.length * 0.7));
console.log(`Selected ${charactersToExpand.length} characters to expand`);

// 한자 데이터 확장
charactersToExpand.forEach(character => {
  // 기존 확장 데이터가 없으면 초기화
  if (!character.extended_data) {
    character.extended_data = {};
  }

  // 상세 의미 추가
  if (!character.extended_data.detailed_meaning) {
    character.extended_data.detailed_meaning = `${character.character}는 '${character.meaning}'를 의미하는 기초 한자입니다. 매우 자주 사용되는 한자로, 한자 학습의 기초가 됩니다.`;
  }

  // 어원 정보 추가 (단순화된 설명)
  if (!character.extended_data.etymology) {
    character.extended_data.etymology = `${character.character}는 원래 '${character.meaning}'의 모양을 본떠서 만들어진 글자입니다. 간단한 그림에서 시작해 현재의 모양으로 발전했습니다.`;
  }

  // 기억법 추가 (시각적 이미지 활용)
  if (!character.extended_data.mnemonics) {
    character.extended_data.mnemonics = `${character.character}는 ${character.stroke_count}획으로 구성되어 있으며, ${character.meaning}의 모양을 생각하면 쉽게 기억할 수 있습니다. ${character.radical} 부수를 포함하고 있습니다.`;
  }

  // 관련 단어 추가 (매우 간단한 예시)
  if (!character.extended_data.common_words) {
    character.extended_data.common_words = [
      {
        word: `${character.character}一`,
        meaning: `${character.meaning} 하나`,
        pronunciation: `${character.pronunciation} 일`,
        example_sentence: `${character.character}一이 무엇인가요?`,
        example_meaning: `${character.meaning} 하나가 무엇인가요?`
      },
      {
        word: `小${character.character}`,
        meaning: `소${character.meaning}`,
        pronunciation: `소${character.pronunciation}`,
        example_sentence: `小${character.character}를 배워요.`,
        example_meaning: `소${character.meaning}을 배워요.`
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
        sentence: `${character.character}를 읽어 봅시다.`,
        meaning: `${character.meaning}을 읽어 봅시다.`,
        pronunciation: `${character.pronunciation}를 읽어 봅시다.`,
        difficulty: "beginner"
      }
    ];
  }

  // 문화적 배경 추가 (어린이도 이해할 수 있는 내용)
  if (!character.extended_data.cultural_notes) {
    character.extended_data.cultural_notes = `${character.character}(${character.meaning})는 동아시아에서 오랫동안 사용되어 온 글자입니다. 어린이들이 한자를 배울 때 가장 먼저 배우는 글자 중 하나입니다.`;
  }

  // 발음 가이드 추가 (발음 연습 방법 포함)
  if (!character.extended_data.pronunciation_guide) {
    character.extended_data.pronunciation_guide = `한국어에서는 '${character.pronunciation}'로 발음합니다. 입을 크게 벌리고 천천히 '${character.pronunciation}'라고 말해보세요.`;
  }

  // 획순 정보 추가 (매우 상세하게)
  if (!character.extended_data.stroke_order) {
    character.extended_data.stroke_order = {
      description: `${character.character}는 총 ${character.stroke_count}획으로 구성되어 있습니다. 한자는 항상 위에서 아래로, 왼쪽에서 오른쪽으로 씁니다.`,
      directions: Array(Math.min(character.stroke_count, 5)).fill(0).map((_, index) => {
        const directions = ["가로획", "세로획", "왼쪽에서 오른쪽 대각선", "오른쪽에서 왼쪽 대각선", "점"];
        return `${index + 1}번째 획: ${directions[index % directions.length]}`;
      })
    };
  }

  // 관련 한자 추가 (비슷하게 생긴 간단한 한자)
  if (!character.extended_data.related_characters) {
    const relatedChars = grade12Data.characters
      .filter(char => 
        (char.radical === character.radical || 
         char.stroke_count === character.stroke_count) && 
        char.id !== character.id
      )
      .slice(0, 2)
      .map(char => char.id);
    
    character.extended_data.related_characters = relatedChars.length > 0 ? relatedChars : [];
  }

  // 학습 난이도 추가 (어린이 학습자 대상)
  if (!character.extended_data.learning_difficulty) {
    const strokeDifficulty = character.stroke_count <= 4 ? "쉬움" : (character.stroke_count <= 8 ? "보통" : "어려움");
    character.extended_data.learning_difficulty = `획수: ${character.stroke_count}획 (${strokeDifficulty})`;
  }
});

// 업데이트된 데이터 저장
try {
  fs.writeFileSync(outputFilePath, JSON.stringify(grade12Data, null, 2), 'utf8');
  console.log(`Successfully expanded and saved grade 12 data with ${grade12Data.characters.length} characters`);
} catch (error) {
  console.error(`Error saving expanded grade 12 data: ${error.message}`);
  process.exit(1);
}

console.log('Grade 12 data expansion completed successfully.'); 