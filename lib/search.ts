import { HanjaCharacter, getCharacters } from '@/lib/hanja';

/**
 * 입력된 검색어와 관련된 한자를 찾습니다.
 * 검색은 한자, 발음, 의미에 대해 수행됩니다.
 */
export async function searchHanja(query: string): Promise<HanjaCharacter[]> {
  // 검색어가 없으면 빈 배열 반환
  if (!query || query.trim() === '') {
    return [];
  }

  const normalizedQuery = query.trim().toLowerCase();
  const allCharacters = getCharacters();

  // 검색 로직
  return allCharacters.filter(char => {
    // 한자 자체 검색
    if (char.character.includes(normalizedQuery)) {
      return true;
    }

    // 한글 발음(음독) 검색
    if (char.kor_pronunciation.some(pronunciation => 
      pronunciation.toLowerCase().includes(normalizedQuery)
    )) {
      return true;
    }

    // 훈독 검색
    if (char.kor_meaning.some(meaning => 
      meaning.toLowerCase().includes(normalizedQuery)
    )) {
      return true;
    }

    // 의미 검색
    if (char.meaning.toLowerCase().includes(normalizedQuery)) {
      return true;
    }

    // 부수 검색
    if (char.radical && char.radical.toLowerCase().includes(normalizedQuery)) {
      return true;
    }

    // 급수 검색 (예: "8급")
    if (char.level && char.level.toLowerCase().includes(normalizedQuery)) {
      return true;
    }

    return false;
  });
} 