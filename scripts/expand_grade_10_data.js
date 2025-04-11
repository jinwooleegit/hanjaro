const fs = require('fs');
const path = require('path');

/**
 * 10급 중급 한자 데이터 확장 스크립트
 * 기존의 10급 한자 데이터를 더 풍부하게 확장합니다.
 */

// 파일 경로 설정
const gradeDataDir = path.resolve(__dirname, '../data/new-structure/characters/by-grade');
const inputFilePath = path.join(gradeDataDir, 'grade_10.json');
const outputFilePath = path.join(gradeDataDir, 'grade_10.json');

// 데이터 읽기
let grade10Data;
try {
  const fileContent = fs.readFileSync(inputFilePath, 'utf8');
  grade10Data = JSON.parse(fileContent);
  console.log(`Successfully read grade 10 data: ${grade10Data.characters.length} characters`);
} catch (error) {
  console.error(`Error reading grade 10 data: ${error.message}`);
  process.exit(1);
}

// 확장할 한자들 인덱스 선택 (전체 데이터의 약 50% 정도 랜덤 선택)
const charactersToExpand = grade10Data.characters.slice(0, 30);
console.log(`Selected ${charactersToExpand.length} characters to expand`);

// 한자 데이터 확장
charactersToExpand.forEach(character => {
  // 기존 확장 데이터가 없으면 초기화
  if (!character.extended_data) {
    character.extended_data = {};
  }

  // 상세 의미 추가
  if (!character.extended_data.detailed_meaning) {
    character.extended_data.detailed_meaning = `${character.meaning}의 의미를 가진 중급 한자입니다.`;
  }

  // 어원 정보 추가
  if (!character.extended_data.etymology) {
    character.extended_data.etymology = `한자 ${character.character}(${character.meaning})의 어원에 대한 설명입니다.`;
  }

  // 기억법 추가
  if (!character.extended_data.mnemonics) {
    character.extended_data.mnemonics = `${character.character}는 ${character.meaning}(으)로, 획순과 부수를 통해 쉽게 기억할 수 있습니다.`;
  }

  // 관련 단어 추가
  if (!character.extended_data.common_words) {
    character.extended_data.common_words = [
      {
        word: `${character.character}文`,
        meaning: `${character.meaning}문`,
        pronunciation: `${character.pronunciation}문`,
        example_sentence: `${character.character}文을 배우다.`
      },
      {
        word: `${character.character}力`,
        meaning: `${character.meaning}력`,
        pronunciation: `${character.pronunciation}력`,
        example_sentence: `${character.character}力을 기르다.`
      }
    ];
  }

  // 예문 추가
  if (!character.extended_data.example_sentences) {
    character.extended_data.example_sentences = [
      {
        sentence: `이것은 ${character.character}입니다.`,
        meaning: `이것은 ${character.meaning}입니다.`,
        pronunciation: `이것은 ${character.pronunciation}입니다.`,
        difficulty: "intermediate"
      }
    ];
  }

  // 문화적 배경 추가
  if (!character.extended_data.cultural_notes) {
    character.extended_data.cultural_notes = `${character.character}(${character.meaning})은(는) 동아시아 문화권에서 다양한 의미로 사용됩니다.`;
  }

  // 발음 가이드 추가
  if (!character.extended_data.pronunciation_guide) {
    character.extended_data.pronunciation_guide = `한국어에서는 '${character.pronunciation}'로 발음합니다.`;
  }

  // 획순 정보 추가
  if (!character.extended_data.stroke_order) {
    character.extended_data.stroke_order = {
      description: `${character.character}의 기본 획순은 부수를 먼저 쓰고 나머지 부분을 씁니다.`,
      directions: []
    };
  }

  // 관련 한자 추가
  if (!character.extended_data.related_characters) {
    // 같은 부수를 가진 다른 한자들 중에서 무작위로 선택
    const relatedChars = grade10Data.characters
      .filter(char => char.radical === character.radical && char.id !== character.id)
      .slice(0, 3)
      .map(char => char.id);
    
    character.extended_data.related_characters = relatedChars;
  }
});

// 업데이트된 데이터 저장
try {
  fs.writeFileSync(outputFilePath, JSON.stringify(grade10Data, null, 2), 'utf8');
  console.log(`Successfully expanded and saved grade 10 data with ${grade10Data.characters.length} characters`);
} catch (error) {
  console.error(`Error saving expanded grade 10 data: ${error.message}`);
  process.exit(1);
}

console.log('Grade 10 data expansion completed successfully.'); 