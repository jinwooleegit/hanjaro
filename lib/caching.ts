/**
 * 한자로 애플리케이션의 캐싱 시스템
 * 
 * 이 파일은 한자 데이터 로딩 시 성능을 향상시키기 위한 캐싱 메커니즘을 구현합니다.
 * - 메모리 캐시: 자주 접근하는 데이터를 메모리에 저장
 * - 로컬 스토리지 캐시: 브라우저 로컬 스토리지를 활용한 지속적 캐싱
 * - 데이터 프리페칭: 사용자가 필요할 것으로 예상되는 데이터 미리 로드
 */

import { useState, useEffect } from 'react';

// 메모리 캐시 (서버 및 클라이언트 공유)
const MEMORY_CACHE = new Map<string, {
  data: any;
  timestamp: number;
  expiry: number; // 만료 시간 (밀리초)
}>();

// 캐시 설정
const CACHE_CONFIG = {
  CHARACTER_EXPIRY: 24 * 60 * 60 * 1000, // 24시간
  GRADE_EXPIRY: 12 * 60 * 60 * 1000,     // 12시간
  CATEGORY_EXPIRY: 6 * 60 * 60 * 1000,   // 6시간
  MEMORY_LIMIT: 200,                    // 메모리 캐시 최대 항목 수
  LS_PREFIX: 'hanjaro_cache_',          // 로컬 스토리지 프리픽스
};

/**
 * 메모리 캐시 관리 함수
 */
export const memoryCache = {
  /**
   * 캐시에서 데이터 가져오기
   * @param key 캐시 키
   * @returns 캐시된 데이터 또는 undefined
   */
  get: (key: string): any | undefined => {
    const cached = MEMORY_CACHE.get(key);
    if (!cached) return undefined;
    
    // 만료 시간 확인
    if (Date.now() > cached.timestamp + cached.expiry) {
      MEMORY_CACHE.delete(key);
      return undefined;
    }
    
    return cached.data;
  },
  
  /**
   * 데이터를 캐시에 저장
   * @param key 캐시 키
   * @param data 저장할 데이터
   * @param expiry 만료 시간 (밀리초)
   */
  set: (key: string, data: any, expiry: number): void => {
    // 캐시 크기 제한 관리
    if (MEMORY_CACHE.size >= CACHE_CONFIG.MEMORY_LIMIT) {
      // 가장 오래된 항목 제거
      const oldestKey = Array.from(MEMORY_CACHE.entries())
        .sort((a, b) => a[1].timestamp - b[1].timestamp)[0][0];
      MEMORY_CACHE.delete(oldestKey);
    }
    
    MEMORY_CACHE.set(key, {
      data,
      timestamp: Date.now(),
      expiry
    });
  },
  
  /**
   * 캐시 항목 삭제
   * @param key 캐시 키
   */
  remove: (key: string): void => {
    MEMORY_CACHE.delete(key);
  },
  
  /**
   * 전체 캐시 초기화
   */
  clear: (): void => {
    MEMORY_CACHE.clear();
  }
};

/**
 * 로컬 스토리지 캐시 관리 함수 (클라이언트 전용)
 */
export const localStorageCache = {
  /**
   * 로컬 스토리지에서 데이터 가져오기
   * @param key 캐시 키
   * @returns 캐시된 데이터 또는 undefined
   */
  get: (key: string): any | undefined => {
    if (typeof window === 'undefined') return undefined;
    
    try {
      const cacheKey = `${CACHE_CONFIG.LS_PREFIX}${key}`;
      const cachedJson = localStorage.getItem(cacheKey);
      
      if (!cachedJson) return undefined;
      
      const cached = JSON.parse(cachedJson);
      
      // 만료 시간 확인
      if (Date.now() > cached.timestamp + cached.expiry) {
        localStorage.removeItem(cacheKey);
        return undefined;
      }
      
      return cached.data;
    } catch (error) {
      console.error('로컬 스토리지 캐시 읽기 오류:', error);
      return undefined;
    }
  },
  
  /**
   * 데이터를 로컬 스토리지에 저장
   * @param key 캐시 키
   * @param data 저장할 데이터
   * @param expiry 만료 시간 (밀리초)
   */
  set: (key: string, data: any, expiry: number): void => {
    if (typeof window === 'undefined') return;
    
    try {
      const cacheKey = `${CACHE_CONFIG.LS_PREFIX}${key}`;
      const cacheData = {
        data,
        timestamp: Date.now(),
        expiry
      };
      
      localStorage.setItem(cacheKey, JSON.stringify(cacheData));
    } catch (error) {
      console.error('로컬 스토리지 캐시 쓰기 오류:', error);
    }
  },
  
  /**
   * 로컬 스토리지 캐시 항목 삭제
   * @param key 캐시 키
   */
  remove: (key: string): void => {
    if (typeof window === 'undefined') return;
    
    try {
      const cacheKey = `${CACHE_CONFIG.LS_PREFIX}${key}`;
      localStorage.removeItem(cacheKey);
    } catch (error) {
      console.error('로컬 스토리지 캐시 삭제 오류:', error);
    }
  },
  
  /**
   * 모든 로컬 스토리지 캐시 초기화
   */
  clear: (): void => {
    if (typeof window === 'undefined') return;
    
    try {
      Object.keys(localStorage)
        .filter(key => key.startsWith(CACHE_CONFIG.LS_PREFIX))
        .forEach(key => localStorage.removeItem(key));
    } catch (error) {
      console.error('로컬 스토리지 캐시 초기화 오류:', error);
    }
  }
};

/**
 * 통합 캐싱 시스템
 * 메모리 캐시와 로컬 스토리지 캐시를 함께 사용
 */
export const hanjaCache = {
  /**
   * 데이터 가져오기 (먼저 메모리 캐시 확인 후 로컬 스토리지 확인)
   * @param key 캐시 키
   * @returns 캐시된 데이터 또는 undefined
   */
  get: (key: string): any | undefined => {
    // 1. 메모리 캐시 확인
    const memoryData = memoryCache.get(key);
    if (memoryData !== undefined) {
      return memoryData;
    }
    
    // 2. 로컬 스토리지 확인
    const storageData = localStorageCache.get(key);
    if (storageData !== undefined) {
      // 메모리 캐시에도 저장
      memoryCache.set(key, storageData, CACHE_CONFIG.CHARACTER_EXPIRY);
      return storageData;
    }
    
    return undefined;
  },
  
  /**
   * 데이터 저장 (메모리와 로컬 스토리지 모두에 저장)
   * @param key 캐시 키
   * @param data 저장할 데이터
   * @param type 데이터 유형 ('character', 'grade', 'category')
   */
  set: (key: string, data: any, type: 'character' | 'grade' | 'category' = 'character'): void => {
    // 데이터 유형에 따른 만료 시간 설정
    let expiry: number;
    switch (type) {
      case 'character':
        expiry = CACHE_CONFIG.CHARACTER_EXPIRY;
        break;
      case 'grade':
        expiry = CACHE_CONFIG.GRADE_EXPIRY;
        break;
      case 'category':
        expiry = CACHE_CONFIG.CATEGORY_EXPIRY;
        break;
      default:
        expiry = CACHE_CONFIG.CHARACTER_EXPIRY;
    }
    
    // 메모리와 로컬 스토리지에 저장
    memoryCache.set(key, data, expiry);
    localStorageCache.set(key, data, expiry);
  },
  
  /**
   * 캐시 항목 삭제
   * @param key 캐시 키
   */
  remove: (key: string): void => {
    memoryCache.remove(key);
    localStorageCache.remove(key);
  },
  
  /**
   * 전체 캐시 초기화
   */
  clear: (): void => {
    memoryCache.clear();
    localStorageCache.clear();
  }
};

/**
 * 한자 데이터 프리페칭을 위한 함수
 * @param ids 프리페치할 한자 ID 배열
 */
export const prefetchHanjaData = async (ids: string[]): Promise<void> => {
  // 이미 캐시된 항목은 제외
  const uncachedIds = ids.filter(id => hanjaCache.get(`character_${id}`) === undefined);
  
  if (uncachedIds.length === 0) return;
  
  try {
    // 병렬로 데이터 가져오기
    const fetchPromises = uncachedIds.map(id => 
      fetch(`/api/hanja/${id}`)
        .then(res => res.json())
        .then(data => {
          hanjaCache.set(`character_${id}`, data, 'character');
          return data;
        })
    );
    
    await Promise.all(fetchPromises);
  } catch (error) {
    console.error('한자 데이터 프리페칭 오류:', error);
  }
};

/**
 * 한자 데이터 로드를 위한 React 훅
 * @param id 한자 ID
 * @returns 로딩 상태, 한자 데이터, 오류
 */
export function useHanjaData(id: string) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  
  useEffect(() => {
    const fetchData = async () => {
      if (!id) {
        setLoading(false);
        return;
      }
      
      setLoading(true);
      setError(null);
      
      try {
        // 캐시에서 데이터 확인
        const cacheKey = `character_${id}`;
        const cachedData = hanjaCache.get(cacheKey);
        
        if (cachedData) {
          setData(cachedData);
          setLoading(false);
          return;
        }
        
        // 캐시에 없으면 API에서 가져오기
        const response = await fetch(`/api/hanja/${id}`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        
        // 캐시에 저장
        hanjaCache.set(cacheKey, result, 'character');
        
        setData(result);
      } catch (e) {
        setError(e as Error);
        console.error(`한자 데이터 로드 오류 (${id}):`, e);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [id]);
  
  return { loading, data, error };
}

/**
 * 급수별 한자 목록을 로드하는 React 훅
 * @param grade 한자 급수 (1-15)
 * @returns 로딩 상태, 한자 목록 데이터, 오류
 */
export function useGradeData(grade: number) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  
  useEffect(() => {
    const fetchData = async () => {
      if (!grade || grade < 1 || grade > 15) {
        setLoading(false);
        return;
      }
      
      setLoading(true);
      setError(null);
      
      try {
        // 캐시에서 데이터 확인
        const cacheKey = `grade_${grade}`;
        const cachedData = hanjaCache.get(cacheKey);
        
        if (cachedData) {
          setData(cachedData);
          setLoading(false);
          
          // 배경에서 캐시된 한자 데이터 프리페칭
          if (cachedData.character_ids && cachedData.character_ids.length > 0) {
            prefetchHanjaData(cachedData.character_ids.slice(0, 10)); // 처음 10개만 프리페치
          }
          
          return;
        }
        
        // 캐시에 없으면 API에서 가져오기
        const response = await fetch(`/api/grade/${grade}`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        
        // 캐시에 저장
        hanjaCache.set(cacheKey, result, 'grade');
        
        setData(result);
        
        // 배경에서 한자 데이터 프리페칭
        if (result.character_ids && result.character_ids.length > 0) {
          prefetchHanjaData(result.character_ids.slice(0, 10)); // 처음 10개만 프리페치
        }
      } catch (e) {
        setError(e as Error);
        console.error(`급수 데이터 로드 오류 (${grade}):`, e);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [grade]);
  
  return { loading, data, error };
}

/**
 * 캐시 초기화 (애플리케이션 버전 업데이트 또는 데이터 갱신 시)
 * @param version 새 버전 번호
 */
export const initializeCache = (version: string): void => {
  const currentVersion = localStorage.getItem('hanjaro_cache_version');
  
  // 버전이 변경되었으면 전체 캐시 초기화
  if (currentVersion !== version) {
    hanjaCache.clear();
    localStorage.setItem('hanjaro_cache_version', version);
  }
}; 