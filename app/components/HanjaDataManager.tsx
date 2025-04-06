import { useState, useEffect, useCallback } from 'react';

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
    levels: Record<string, HanjaLevel>;
  };
}

// 메타데이터 타입
interface LevelMetadata {
  key: string;
  name: string;
  description: string;
  character_count: number;
}

interface DatabaseMetadata {
  basic: {
    name: string;
    description: string;
    total_characters: number;
    levels: LevelMetadata[];
  };
  advanced?: {
    name: string;
    description: string;
    levels: LevelMetadata[];
  };
}

// 페이지네이션을 위한 타입
interface PaginationOptions {
  page: number;
  itemsPerPage: number;
}

// 로딩 상태
type LoadingState = 'idle' | 'loading' | 'error' | 'success';

// 청크 로딩 상태
interface ChunkLoadingState {
  [key: number]: LoadingState;
}

const useHanjaData = () => {
  // 메타데이터 상태
  const [metadata, setMetadata] = useState<DatabaseMetadata | null>(null);
  
  // 부분 데이터베이스 상태
  const [partialDatabase, setPartialDatabase] = useState<Partial<HanjaDatabase>>({});
  
  // 전체 로딩 상태
  const [loadingState, setLoadingState] = useState<LoadingState>('idle');
  
  // 청크별 로딩 상태
  const [chunkLoadingState, setChunkLoadingState] = useState<ChunkLoadingState>({});
  
  // 오류 상태
  const [error, setError] = useState<Error | null>(null);
  
  // 한자 데이터를 캐싱하기 위한 상태
  const [characterCache, setCharacterCache] = useState<Map<string, HanjaCharacter>>(new Map());
  
  // 검색어와 필터링 상태
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [levelFilter, setLevelFilter] = useState<number | null>(null);
  
  // 메타데이터 로드
  useEffect(() => {
    // 이미 메타데이터가 있으면 다시 로드하지 않음
    if (metadata !== null) return;
    
    const fetchMetadata = async () => {
      try {
        setLoadingState('loading');
        
        const response = await fetch('/api/hanja');
        if (!response.ok) {
          throw new Error('Failed to fetch Hanja metadata');
        }
        
        const data = await response.json();
        setMetadata(data);
        setLoadingState('success');
      } catch (err) {
        setLoadingState('error');
        setError(err instanceof Error ? err : new Error('Unknown error'));
      }
    };
    
    fetchMetadata();
  }, [metadata]);
  
  // 청크 로드 함수
  const loadChunk = useCallback(async (chunkId: number) => {
    // 이미 로드된 청크거나 로딩 중인 경우 스킵
    if (chunkLoadingState[chunkId] === 'success' || chunkLoadingState[chunkId] === 'loading') {
      return;
    }
    
    try {
      // 로딩 상태 업데이트
      setChunkLoadingState(prev => ({
        ...prev,
        [chunkId]: 'loading'
      }));
      
      const response = await fetch(`/api/hanja?chunk=${chunkId}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch chunk ${chunkId}`);
      }
      
      const chunkData = await response.json();
      
      // 데이터베이스 업데이트
      setPartialDatabase(prev => {
        const newData = { ...prev };
        
        // 기본 데이터 병합
        if (chunkData.basic) {
          if (!newData.basic) {
            newData.basic = chunkData.basic;
          } else {
            newData.basic = {
              ...newData.basic,
              ...chunkData.basic,
              levels: {
                ...newData.basic.levels,
                ...chunkData.basic.levels
              }
            };
          }
        }
        
        // 고급 데이터 병합
        if (chunkData.advanced) {
          if (!newData.advanced) {
            newData.advanced = chunkData.advanced;
          } else {
            newData.advanced = {
              ...newData.advanced,
              ...chunkData.advanced,
              levels: {
                ...newData.advanced.levels,
                ...chunkData.advanced.levels
              }
            };
          }
        }
        
        return newData;
      });
      
      // 캐릭터 캐시 업데이트
      updateCharacterCache(chunkData);
      
      // 로딩 상태 업데이트
      setChunkLoadingState(prev => ({
        ...prev,
        [chunkId]: 'success'
      }));
    } catch (err) {
      setChunkLoadingState(prev => ({
        ...prev,
        [chunkId]: 'error'
      }));
      setError(err instanceof Error ? err : new Error(`Error loading chunk ${chunkId}`));
    }
  }, [chunkLoadingState]);
  
  // 캐릭터 캐시 업데이트 함수
  const updateCharacterCache = useCallback((data: Partial<HanjaDatabase>) => {
    setCharacterCache(prev => {
      const newCache = new Map(prev);
      
      // 기본 레벨 캐싱
      if (data.basic && data.basic.levels) {
        Object.values(data.basic.levels).forEach(level => {
          level.characters.forEach(character => {
            newCache.set(character.character, character);
          });
        });
      }
      
      // 고급 레벨 캐싱 (존재하는 경우)
      if (data.advanced && data.advanced.levels) {
        Object.values(data.advanced.levels).forEach(level => {
          level.characters.forEach(character => {
            newCache.set(character.character, character);
          });
        });
      }
      
      return newCache;
    });
  }, []);
  
  // 레벨별 한자 로드
  const loadCharactersByLevel = useCallback(async (level: number) => {
    try {
      console.log(`Loading characters for level ${level}`);
      
      // 캐시된 데이터가 있으면 사용
      if (partialDatabase?.basic?.levels?.[`level${level}`]?.characters && partialDatabase?.basic?.levels?.[`level${level}`]?.characters.length > 0) {
        console.log(`Using cached data for level ${level}`);
        return partialDatabase?.basic?.levels?.[`level${level}`]?.characters || [];
      }
      
      // 요청 타임아웃 설정
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10초 타임아웃
      
      // API에서 레벨 데이터 가져오기
      console.log(`Fetching data from API for level ${level}`);
      const response = await fetch(`/api/hanja?level=${level}`, {
        signal: controller.signal,
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache'
        }
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        console.error(`API request failed with status ${response.status}`);
        return [];
      }
      
      const data = await response.json();
      console.log(`API data for level ${level}:`, data);
      
      // 데이터 유효성 검사
      if (!Array.isArray(data)) {
        console.error('API response is not an array:', data);
        return [];
      }
      
      if (data.length === 0) {
        console.warn(`No characters found for level ${level}`);
        return [];
      }
      
      // 데이터 저장 및 캐싱
      setPartialDatabase(prev => {
        const newData = { ...prev };
        
        if (!newData.basic) {
          newData.basic = {
            name: '기본 한자',
            description: '기본 한자 모음',
            total_characters: 0,
            levels: {}
          };
        }
        
        if (!newData.basic.levels) {
          newData.basic.levels = {};
        }
        
        newData.basic.levels[`level${level}`] = {
          name: `Level ${level}`,
          description: `Level ${level} 한자`,
          characters: data
        };
        
        return newData;
      });
      
      // 캐릭터 캐시 업데이트
      data.forEach((character: HanjaCharacter) => {
        if (character.character) {
          setCharacterCache(prev => {
            const newCache = new Map(prev);
            newCache.set(character.character, character);
            return newCache;
          });
        }
      });
      
      return data;
    } catch (error) {
      console.error(`Error loading characters for level ${level}:`, error);
      setError(error instanceof Error ? error : new Error(`Error loading level ${level}`));
      return [];
    }
  }, [partialDatabase, setError]);
  
  // 캐시에서 특정 레벨의 한자 가져오기
  const getCharactersByLevel = useCallback((level: number): HanjaCharacter[] => {
    const characters: HanjaCharacter[] = [];
    
    // 캐시에서 해당 레벨의 문자 필터링
    characterCache.forEach(character => {
      if (character.level === level) {
        characters.push(character);
      }
    });
    
    return characters.sort((a, b) => a.order - b.order);
  }, [characterCache]);
  
  // 검색 함수
  const searchCharacters = useCallback(async (term: string) => {
    try {
      console.log(`Searching for: "${term}" (Unicode: ${Array.from(term).map(c => c.charCodeAt(0).toString(16)).join(', ')})`);
      
      const response = await fetch(`/api/hanja?search=${encodeURIComponent(term)}`);
      
      if (!response.ok) {
        console.error(`Search API error: ${response.status} ${response.statusText}`);
        throw new Error('Failed to search characters');
      }
      
      const results = await response.json();
      console.log(`Search returned ${results.length} results`);
      
      if (results.length > 0) {
        console.log(`First result: ${results[0].character} (${results[0].meaning})`);
      }
      
      return results;
    } catch (err) {
      console.error('Search error:', err);
      setError(err instanceof Error ? err : new Error('Search failed'));
      return [];
    }
  }, []);
  
  // 특정 한자 정보 가져오기
  const getCharacterInfo = useCallback((char: string): HanjaCharacter | undefined => {
    return characterCache.get(char);
  }, [characterCache]);
  
  // 필요한 청크 로드하기
  const loadNecessaryChunks = useCallback(async () => {
    // 기본 청크 로드
    await loadChunk(1);
    
    // 필터링된 레벨이 있으면 해당 청크 로드
    if (levelFilter) {
      let chunkId = 0;
      if (levelFilter >= 1 && levelFilter <= 3) {
        chunkId = 1;
      } else if (levelFilter >= 4 && levelFilter <= 6) {
        chunkId = 2;
      } else if (levelFilter >= 9) {
        chunkId = 3;
      }
      
      if (chunkId > 0) {
        await loadChunk(chunkId);
      }
    }
  }, [loadChunk, levelFilter]);
  
  // 필요한 청크 로드
  useEffect(() => {
    if (metadata) {
      loadNecessaryChunks();
    }
  }, [metadata, loadNecessaryChunks]);
  
  return {
    metadata,
    partialDatabase,
    loadingState,
    chunkLoadingState,
    error,
    loadChunk,
    loadCharactersByLevel,
    getCharactersByLevel,
    searchCharacters,
    getCharacterInfo,
    searchTerm,
    setSearchTerm,
    levelFilter,
    setLevelFilter
  };
};

export default useHanjaData; 