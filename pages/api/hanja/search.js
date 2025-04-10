/**
 * 한자 검색 API 라우트
 * 
 * 엔드포인트: /api/hanja/search
 * 메소드: GET
 * 쿼리 매개변수:
 * - q: 검색어 (한자, 의미, 발음)
 * - type: 검색 유형 (character, meaning, pronunciation, all)
 * - limit: 결과 제한 (예: ?limit=10)
 * - page: 페이지네이션 (예: ?page=1)
 */

import fs from 'fs';
import path from 'path';

// 경로 설정
const DATA_ROOT = path.join(process.cwd(), 'data');
const NEW_STRUCTURE_ROOT = path.join(DATA_ROOT, 'new-structure');
const CHARACTERS_DIR = path.join(NEW_STRUCTURE_ROOT, 'characters');

// 캐시 설정 (5분)
const CACHE_MAX_AGE = 300;

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // 쿼리 파라미터 추출
    const {
      q: query,
      type = 'all',
      limit = 20,
      page = 1
    } = req.query;
    
    if (!query || query.trim() === '') {
      return res.status(400).json({ error: 'Missing search query' });
    }

    // 캐싱 헤더 설정 (개인화된 검색 결과이므로 짧은 캐시)
    res.setHeader('Cache-Control', `private, max-age=${CACHE_MAX_AGE}`);

    // 검색 실행
    const searchResults = await searchHanja(query.trim(), type);

    // 페이지네이션 적용
    const totalCount = searchResults.length;
    const pageSize = parseInt(limit);
    const currentPage = parseInt(page);
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedData = searchResults.slice(startIndex, endIndex);

    // 응답 반환
    return res.status(200).json({
      success: true,
      query,
      type,
      total: totalCount,
      page: currentPage,
      pageSize,
      totalPages: Math.ceil(totalCount / pageSize),
      data: paginatedData
    });
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ error: 'Internal server error', message: error.message });
  }
}

// 한자 검색 함수
async function searchHanja(query, type) {
  try {
    // 모든 한자 파일 목록
    const files = fs.readdirSync(CHARACTERS_DIR)
      .filter(file => file.endsWith('.json'));
    
    // 검색 결과
    const results = [];
    const normalizedQuery = query.toLowerCase();
    
    // 각 파일 검색
    for (const file of files) {
      const filePath = path.join(CHARACTERS_DIR, file);
      const characterData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
      
      let match = false;
      
      // 검색 유형에 따른 필터링
      switch (type) {
        case 'character':
          match = characterData.character === query;
          break;
          
        case 'meaning':
          match = characterData.meaning.toLowerCase().includes(normalizedQuery);
          break;
          
        case 'pronunciation':
          match = characterData.pronunciation.toLowerCase().includes(normalizedQuery);
          break;
          
        case 'all':
        default:
          match = 
            characterData.character === query ||
            characterData.meaning.toLowerCase().includes(normalizedQuery) ||
            characterData.pronunciation.toLowerCase().includes(normalizedQuery);
          break;
      }
      
      if (match) {
        results.push(characterData);
      }
    }
    
    // 결과가 없을 경우 유사한 결과 찾기 (예: 발음 유사성)
    if (results.length === 0 && type !== 'character') {
      // 모든 한자 데이터에서 유사성 검색
      for (const file of files) {
        const filePath = path.join(CHARACTERS_DIR, file);
        const characterData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
        
        // 예문 검색
        const hasMatchingExample = characterData.examples && characterData.examples.some(ex => 
          ex.word.includes(query) || 
          ex.meaning.toLowerCase().includes(normalizedQuery) ||
          ex.pronunciation.toLowerCase().includes(normalizedQuery)
        );
        
        if (hasMatchingExample) {
          results.push(characterData);
        }
      }
    }
    
    // 등급별 정렬 (낮은 등급이 먼저)
    return results.sort((a, b) => a.grade - b.grade);
  } catch (error) {
    throw new Error(`Search failed: ${error.message}`);
  }
} 