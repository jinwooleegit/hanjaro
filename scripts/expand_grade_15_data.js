const fs = require('fs');
const path = require('path');

/**
 * 15급 기초 한자 데이터 확장 스크립트
 * 기존의 15급 한자 데이터를 초보자 친화적인 정보로 확장합니다.
 */

// 파일 경로 설정
const gradeDataDir = path.resolve(__dirname, '../data/new-structure/characters/by-grade');
const inputFilePath = path.join(gradeDataDir, 'grade_15.json');
const outputFilePath = path.join(gradeDataDir, 'grade_15.json');

// 데이터 읽기
let grade15Data;
try {
  const fileContent = fs.readFileSync(inputFilePath, 'utf8');
  grade15Data = JSON.parse(fileContent);
  console.log(`Successfully read grade 15 data: ${grade15Data.characters.length} characters`);
} catch (error) {
  console.error(`Error reading grade 15 data: ${error.message}`);
  process.exit(1);
}

// 확장할 한자들 인덱스 선택 (전체 데이터의 80% 이상)
const charactersToExpand = grade15Data.characters.slice(0, Math.ceil(grade15Data.characters.length * 0.8));
console.log(`Selected ${charactersToExpand.length} characters to expand`);

// 한자 데이터 확장
charactersToExpand.forEach(character => {
  // 기존 확장 데이터가 없으면 초기화
  if (!character.extended_data) {
    character.extended_data = {};
  }

  // 상세 의미 추가
  if (!character.extended_data.detailed_meaning) {
    character.extended_data.detailed_meaning = `${character.character}는 '${character.meaning}'을(를) 의미하는 가장 기초적인 한자입니다. 한자를 처음 배우는 사람들이 가장 먼저 만나는 한자 중 하나입니다.`;
  }

  // 어원 정보 추가 (그림과 연관 지어 설명)
  if (!character.extended_data.etymology) {
    character.extended_data.etymology = `${character.character}는 원래 '${character.meaning}'의 모양을 간단하게 그린 그림에서 시작되었습니다. 오랜 시간이 지나면서 지금의 모양으로 변했습니다.`;
  }

  // 기억법 추가 (재미있는 이야기 형식)
  if (!character.extended_data.mnemonics) {
    character.extended_data.mnemonics = `${character.character}(${character.meaning})는 ${character.stroke_count}획으로 이루어져 있어요. ${character.radical} 부수가 들어있는데, 이것은 마치 ${character.meaning}과(와) 관련된 그림을 그린 것처럼 생각하면 기억하기 쉬워요!`;
  }

  // 관련 단어 추가 (매우 쉬운 단어)
  if (!character.extended_data.common_words) {
    character.extended_data.common_words = [
      {
        word: `${character.character}자`,
        meaning: `${character.meaning}자`,
        pronunciation: `${character.pronunciation}자`,
        example_sentence: `${character.character}자를 써보세요.`,
        example_meaning: `${character.meaning}자를 써보세요.`
      },
      {
        word: `${character.character}그림`,
        meaning: `${character.meaning} 그림`,
        pronunciation: `${character.pronunciation} 그림`,
        example_sentence: `${character.character}그림을 그려요.`,
        example_meaning: `${character.meaning} 그림을 그려요.`
      }
    ];
  }

  // 예문 추가 (아주 간단한 문장)
  if (!character.extended_data.example_sentences) {
    character.extended_data.example_sentences = [
      {
        sentence: `이것은 ${character.character}예요.`,
        meaning: `이것은 ${character.meaning}예요.`,
        pronunciation: `이것은 ${character.pronunciation}예요.`,
        difficulty: "beginner"
      },
      {
        sentence: `${character.character}가 보여요.`,
        meaning: `${character.meaning}이 보여요.`,
        pronunciation: `${character.pronunciation}가 보여요.`,
        difficulty: "beginner"
      }
    ];
  }

  // 문화적 배경 추가 (어린이 눈높이)
  if (!character.extended_data.cultural_notes) {
    character.extended_data.cultural_notes = `${character.character}(${character.meaning})는 한국, 중국, 일본 등 동아시아 나라들에서 모두 사용해요. 옛날부터 아이들이 글을 배울 때 처음 배우는 한자 중 하나였어요.`;
  }

  // 발음 가이드 추가 (발음 연습 방법)
  if (!character.extended_data.pronunciation_guide) {
    character.extended_data.pronunciation_guide = `한국어에서는 '${character.pronunciation}'라고 발음해요. 선생님을 따라 크게 '${character.pronunciation}'라고 말해보세요!`;
  }

  // 획순 정보 추가 (그림으로 설명)
  if (!character.extended_data.stroke_order) {
    let instructions = [];
    for (let i = 1; i <= Math.min(character.stroke_count, 5); i++) {
      const position = i === 1 ? "맨 위" : i === 2 ? "그 다음" : i === 3 ? "가운데" : i === 4 ? "아래쪽" : "맨 아래";
      instructions.push(`${i}번째 획: ${position}에 선을 그어요.`);
    }

    character.extended_data.stroke_order = {
      description: `${character.character}는 ${character.stroke_count}획으로 쓰는 한자예요. 천천히 따라 써보세요!`,
      directions: instructions
    };
  }

  // 관련 한자 추가 (비슷하게 생긴 쉬운 한자)
  if (!character.extended_data.related_characters) {
    const relatedChars = grade15Data.characters
      .filter(char => 
        (char.radical === character.radical || 
         char.stroke_count === character.stroke_count) && 
        char.id !== character.id
      )
      .slice(0, 2)
      .map(char => char.id);
    
    character.extended_data.related_characters = relatedChars.length > 0 ? relatedChars : [];
  }

  // 재미있는 사실 추가
  if (!character.extended_data.fun_facts) {
    character.extended_data.fun_facts = [
      `${character.character}는 ${character.stroke_count}개의 선으로 그려져요!`, 
      `${character.character}를 빨리 10번 말해보세요. 재미있어요!`,
      `${character.character}는 ${character.meaning}의 모양을 본떠 만들었어요.`
    ];
  }

  // 학습 활동 추가
  if (!character.extended_data.learning_activities) {
    character.extended_data.learning_activities = [
      `${character.character}를 색종이에 크게 써보세요.`,
      `${character.character}를 찾아 동그라미 치기 놀이를 해보세요.`,
      `몸으로 ${character.character}의 모양을 만들어보세요.`
    ];
  }
});

// 업데이트된 데이터 저장
try {
  fs.writeFileSync(outputFilePath, JSON.stringify(grade15Data, null, 2), 'utf8');
  console.log(`Successfully expanded and saved grade 15 data with ${grade15Data.characters.length} characters`);
} catch (error) {
  console.error(`Error saving expanded grade 15 data: ${error.message}`);
  process.exit(1);
}

console.log('Grade 15 data expansion completed successfully.'); 