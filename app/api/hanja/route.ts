import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

interface HanjaExample {
  word: string;
  meaning: string;
  pronunciation: string;
}

interface HanjaCharacter {
  character: string;
  meaning: string;
  pronunciation: string;
  stroke_count: number;
  radical: string;
  examples: HanjaExample[];
  level: number;
  order: number;
}

interface UsageExample {
  sentence: string;
  meaning: string;
  explanation: string;
}

interface HanjaLevel {
  name: string;
  description: string;
  characters: HanjaCharacter[];
  usage_examples?: UsageExample[];
}

interface HanjaDatabase {
  basic: {
    name: string;
    description: string;
    total_characters: number;
    levels: Record<string, HanjaLevel>;
  };
  advanced?: {
    name: string;
    description: string;
    total_characters: number;
    levels: Record<string, HanjaLevel>;
  };
}

// 데이터베이스 캐시
let databaseCache: HanjaDatabase | null = null;

// 데이터베이스 로드 함수
const loadDatabase = (): HanjaDatabase => {
  if (databaseCache) return databaseCache;
  
  try {
    // 고정된 JSON 파일 사용
    const filePath = path.join(process.cwd(), 'data', 'hanja_database_fixed.json');
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const parsedData = JSON.parse(fileContent);
    
    // 새로운 구조 (hanja_database가 존재) 확인 및 처리
    if (parsedData.hanja_database) {
      const basicData = parsedData.hanja_database.basic;
      
      // 배열 구조를 객체 구조로 변환
      if (Array.isArray(basicData.levels)) {
        const levelsObj: Record<string, HanjaLevel> = {};
        
        basicData.levels.forEach((level: any, index: number) => {
          // 레벨 이름에서 숫자 추출 ('7급계 (중학교 1학년 수준)' -> 7)
          const levelMatch = level.name.match(/(\d+)급계/);
          const levelNum = levelMatch ? levelMatch[1] : (index + 1).toString();
          
          levelsObj[`level${levelNum}`] = {
            name: level.name,
            description: level.description,
            characters: level.characters || [],
            usage_examples: level.usage_examples
          };
        });
        
        basicData.levels = levelsObj;
      }
      
      databaseCache = {
        basic: basicData,
        advanced: parsedData.hanja_database.advanced
      };
    } else {
      // 기존 구조는 그대로 사용
      databaseCache = parsedData as HanjaDatabase;
    }
    
    console.log(`데이터베이스 로드 완료: ${Object.keys(databaseCache.basic.levels).length} 레벨 발견`);
    
    // 각 레벨 한자 수 출력
    Object.entries(databaseCache.basic.levels).forEach(([key, value]) => {
      console.log(`${key}: ${value.characters?.length || 0}개 한자`);
    });
    
    if (databaseCache.advanced) {
      Object.entries(databaseCache.advanced.levels).forEach(([key, value]) => {
        console.log(`advanced ${key}: ${value.characters?.length || 0}개 한자`);
      });
    }
    
    return databaseCache;
  } catch (error) {
    console.error('Failed to load Hanja database:', error);
    // 오류 발생 시 빈 데이터베이스 반환
    return {
      basic: {
        name: "한자 데이터베이스",
        description: "기본 한자 데이터",
        total_characters: 0,
        levels: {}
      }
    };
  }
};

// 레벨별 캐릭터 필터링
const getCharactersByLevel = (db: HanjaDatabase, level: number): HanjaCharacter[] => {
  const levelKey = `level${level}`;
  let characters: HanjaCharacter[] = [];
  
  // 기본 레벨에서 검색
  if (db.basic && db.basic.levels) {
    if (db.basic.levels[levelKey]) {
      characters = [...characters, ...db.basic.levels[levelKey].characters];
    }
  }
  
  // 고급 레벨에서 검색 (존재하는 경우)
  if (db.advanced && db.advanced.levels && db.advanced.levels[levelKey]) {
    characters = [...characters, ...db.advanced.levels[levelKey].characters];
  }
  
  return characters;
};

// 페이지네이션 적용
const applyPagination = (items: any[], page: number, itemsPerPage: number) => {
  const startIndex = (page - 1) * itemsPerPage;
  return items.slice(startIndex, startIndex + itemsPerPage);
};

// 특정 청크만 반환
const getChunk = (db: HanjaDatabase, chunkId: number) => {
  switch(chunkId) {
    case 1: // 기본 정보와 레벨 1-3
      return {
        basic: {
          name: db.basic.name,
          description: db.basic.description,
          total_characters: db.basic.total_characters,
          levels: {
            level1: db.basic.levels.level1,
            level2: db.basic.levels.level2,
            level3: db.basic.levels.level3
          }
        }
      };
    case 2: // 레벨 4-6
      return {
        basic: {
          name: db.basic.name,
          description: db.basic.description,
          total_characters: db.basic.total_characters,
          levels: {
            level4: db.basic.levels.level4,
            level5: db.basic.levels.level5,
            level6: db.basic.levels.level6
          }
        }
      };
    case 3: // 고급 레벨
      return {
        advanced: db.advanced
      };
    default:
      return db; // 전체 데이터
  }
};

// 검색 기능
const searchCharacters = (db: HanjaDatabase, term: string): HanjaCharacter[] => {
  if (!term.trim()) return [];
  
  const results: HanjaCharacter[] = [];
  const lowerTerm = term.toLowerCase();
  const searchCharCode = term.charCodeAt(0);
  
  console.log(`한자 검색: "${term}" (코드: ${searchCharCode.toString(16)})`);
  
  // 기본 제공 한자 - 데이터베이스에 없는 경우를 위한 폴백
  const basicHanjaMap: Record<string, HanjaCharacter> = {
    '過': {
      character: '過',
      meaning: '지날 과',
      pronunciation: '과',
      stroke_count: 12,
      radical: '辶',
      examples: [
        {
          word: '通過',
          meaning: '통과',
          pronunciation: '통과'
        },
        {
          word: '過去',
          meaning: '과거',
          pronunciation: '과거'
        }
      ],
      level: 5,
      order: 1
    }
  };
  
  // 먼저 기본 제공 한자에서 검색
  if (basicHanjaMap[term]) {
    console.log(`기본 제공 한자에서 찾음: ${term}`);
    results.push(basicHanjaMap[term]);
    return results;  // 정확히 일치하는 한자가 있으면 바로 반환
  }
  
  // 기본 레벨에서 검색
  if (db.basic && db.basic.levels) {
    Object.values(db.basic.levels).forEach(level => {
      level.characters.forEach(character => {
        const charCode = character.character.charCodeAt(0);
        const isExactMatch = character.character === term;
        const isCodeMatch = charCode === searchCharCode;
        const isTextMatch = 
          character.meaning.toLowerCase().includes(lowerTerm) ||
          character.pronunciation.toLowerCase().includes(lowerTerm);
        
        if (isExactMatch || isCodeMatch || isTextMatch) {
          if (isExactMatch || isCodeMatch) {
            console.log(`일치 발견: "${character.character}" (${charCode.toString(16)}) vs "${term}" (${searchCharCode.toString(16)})`);
            // 정확히 일치하는 항목은 결과 배열의 맨 앞에 추가
            results.unshift(character);
          } else {
            // 텍스트 일치 항목은 뒤에 추가
            results.push(character);
          }
        }
      });
    });
  }
  
  // 고급 레벨에서 검색 (존재하는 경우)
  if (db.advanced && db.advanced.levels) {
    Object.values(db.advanced.levels).forEach(level => {
      level.characters.forEach(character => {
        const charCode = character.character.charCodeAt(0);
        const isExactMatch = character.character === term;
        const isCodeMatch = charCode === searchCharCode;
        const isTextMatch = 
          character.meaning.toLowerCase().includes(lowerTerm) ||
          character.pronunciation.toLowerCase().includes(lowerTerm);
        
        if (isExactMatch || isCodeMatch || isTextMatch) {
          if (isExactMatch || isCodeMatch) {
            console.log(`일치 발견: "${character.character}" (${charCode.toString(16)}) vs "${term}" (${searchCharCode.toString(16)})`);
            // 정확히 일치하는 항목은 결과 배열의 맨 앞에 추가
            results.unshift(character);
          } else {
            // 텍스트 일치 항목은 뒤에 추가
            results.push(character);
          }
        }
      });
    });
  }
  
  console.log(`검색 결과: ${results.length}개 항목 찾음`);
  return results;
};

// 한자 ID로 검색하는 함수
const getHanjaById = (db: HanjaDatabase, id: string): HanjaCharacter | null => {
  if (!id.trim()) return null;
  
  // 확장 데이터베이스 검색 시도
  try {
    const extendedFilePath = path.join(process.cwd(), 'data', 'new-structure', 'characters', 'hanja_extended.json');
    if (fs.existsSync(extendedFilePath)) {
      const extendedData = JSON.parse(fs.readFileSync(extendedFilePath, 'utf8'));
      if (extendedData && extendedData.characters) {
        const character = extendedData.characters.find((char: any) => char.id === id);
    if (character) {
          return {
            ...character,
            level: character.grade || 1,  // grade 필드를 level로 매핑
            examples: character.extended_data?.common_words || []  // common_words를 examples로 매핑
          };
        }
      }
    }
  } catch (error) {
    console.error(`확장 데이터베이스 검색 오류:`, error);
  }
  
  // 레벨별 한자 검색
  for (const levelKey in db.basic.levels) {
    const level = db.basic.levels[levelKey];
    for (const character of level.characters) {
      if (character.character === id) {
        return character;
      }
    }
  }
  
  if (db.advanced) {
    for (const levelKey in db.advanced.levels) {
      const level = db.advanced.levels[levelKey];
      for (const character of level.characters) {
        if (character.character === id) {
          return character;
        }
      }
    }
  }
  
  return null;
};

// 개별 한자 가져오기
export async function GET(request: NextRequest) {
  try {
    const db = loadDatabase();
    const { searchParams } = new URL(request.url);
    
    // ID 파라미터 확인 (직접적인 한자 검색)
    const id = searchParams.get('id');
    if (id) {
      const character = getHanjaById(db, id);
      if (character) {
        return NextResponse.json(character);
      } else {
        return NextResponse.json({ error: '요청한 한자를 찾을 수 없습니다.' }, { status: 404 });
      }
    }

    // 기존 검색 로직 (레벨, 검색어, 페이지네이션 등)
    const level = searchParams.get('level');
    const keyword = searchParams.get('search');
    const page = parseInt(searchParams.get('page') || '1');
    const itemsPerPage = parseInt(searchParams.get('limit') || '50');
    const chunk = parseInt(searchParams.get('chunk') || '0');
    
    // 검색 조건에 따라 결과 분기
    if (keyword) {
      const results = searchCharacters(db, keyword);
      const paginatedResults = applyPagination(results, page, itemsPerPage);
      
      return NextResponse.json({
        characters: paginatedResults,
        total: results.length,
        page,
        totalPages: Math.ceil(results.length / itemsPerPage)
      });
    } else if (level) {
      const levelNum = parseInt(level);
      const characters = getCharactersByLevel(db, levelNum);
      const paginatedCharacters = applyPagination(characters, page, itemsPerPage);
      
      return NextResponse.json({
        characters: paginatedCharacters,
        total: characters.length,
        level: levelNum,
        page,
        totalPages: Math.ceil(characters.length / itemsPerPage)
      });
    } else if (chunk > 0) {
      // 특정 청크만 반환
      return NextResponse.json(getChunk(db, chunk));
    } else {
      // 모든 데이터 반환 (레벨별로 페이지네이션 적용)
      const characters = [];
      let totalChars = 0;
      
      // 기본 한자만 반환 (레벨별)
      const levels: Record<string, any> = {};
      
      for (const levelKey in db.basic.levels) {
        const levelData = db.basic.levels[levelKey];
        const levelChars = levelData.characters || [];
        totalChars += levelChars.length;
        
        // 레벨별 데이터 추가
        levels[levelKey] = {
          name: levelData.name,
          description: levelData.description,
          total: levelChars.length,
          characters: applyPagination(levelChars, page, itemsPerPage)
        };
      }
      
      return NextResponse.json({
        levels,
        total: totalChars,
        page,
        totalPages: Math.ceil(totalChars / itemsPerPage)
      });
    }
  } catch (error) {
    console.error('API 요청 처리 중 오류 발생:', error);
    return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 });
  }
} 