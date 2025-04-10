/**
 * 한자 API 라우트
 * 
 * 엔드포인트: /api/hanja
 * 메소드: GET
 * 쿼리 매개변수:
 * - grade: 급수별 필터링 (예: ?grade=1)
 * - category: 카테고리별 필터링 (예: ?category=beginner)
 * - limit: 결과 제한 (예: ?limit=10)
 * - page: 페이지네이션 (예: ?page=1)
 */

import fs from 'fs';
import path from 'path';

// 경로 설정
const DATA_ROOT = path.join(process.cwd(), 'data');
const NEW_STRUCTURE_ROOT = path.join(DATA_ROOT, 'new-structure');
const CHARACTERS_DIR = path.join(NEW_STRUCTURE_ROOT, 'characters');
const GRADES_DIR = path.join(NEW_STRUCTURE_ROOT, 'grades');

// 캐시 설정 (5분)
const CACHE_MAX_AGE = 300;

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // 쿼리 파라미터 추출
    const {
      grade,
      category,
      limit = 20,
      page = 1,
      sort = 'grade'
    } = req.query;

    // 캐싱 헤더 설정
    res.setHeader('Cache-Control', `public, max-age=${CACHE_MAX_AGE}`);

    // 데이터 불러오기
    let hanjaData;
    
    if (grade) {
      // 특정 급수의 한자 데이터 불러오기
      hanjaData = await getHanjaByGrade(parseInt(grade));
    } else {
      // 전체 또는 필터링된 한자 데이터 불러오기
      hanjaData = await getAllHanja(category);
    }

    // 정렬
    hanjaData = sortHanjaData(hanjaData, sort);

    // 페이지네이션 적용
    const totalCount = hanjaData.length;
    const pageSize = parseInt(limit);
    const currentPage = parseInt(page);
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedData = hanjaData.slice(startIndex, endIndex);

    // 응답 반환
    return res.status(200).json({
      success: true,
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

// 특정 급수의 한자 데이터 불러오기
async function getHanjaByGrade(grade) {
  try {
    // 급수 파일 경로
    const gradeFilePath = path.join(GRADES_DIR, `grade_${grade}.json`);
    
    // 파일이 존재하는지 확인
    if (!fs.existsSync(gradeFilePath)) {
      throw new Error(`Grade ${grade} data not found`);
    }
    
    // 급수 데이터 읽기
    const gradeData = JSON.parse(fs.readFileSync(gradeFilePath, 'utf-8'));
    const characterIds = gradeData.character_ids || [];
    
    // 각 한자 데이터 불러오기
    const hanjaList = [];
    
    for (const id of characterIds) {
      const characterFilePath = path.join(CHARACTERS_DIR, `${id}.json`);
      
      if (fs.existsSync(characterFilePath)) {
        const characterData = JSON.parse(fs.readFileSync(characterFilePath, 'utf-8'));
        hanjaList.push(characterData);
      }
    }
    
    return hanjaList;
  } catch (error) {
    throw new Error(`Failed to load grade ${grade} data: ${error.message}`);
  }
}

// 모든 한자 데이터 불러오기 (필터링 가능)
async function getAllHanja(category) {
  try {
    // 모든 한자 파일 목록
    const files = fs.readdirSync(CHARACTERS_DIR)
      .filter(file => file.endsWith('.json'));
    
    // 한자 데이터 로드
    const hanjaList = [];
    
    for (const file of files) {
      const filePath = path.join(CHARACTERS_DIR, file);
      const characterData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
      
      // 카테고리 필터링
      if (!category || characterData.category === category) {
        hanjaList.push(characterData);
      }
    }
    
    return hanjaList;
  } catch (error) {
    throw new Error(`Failed to load all hanja data: ${error.message}`);
  }
}

// 한자 데이터 정렬
function sortHanjaData(data, sortBy) {
  if (!data || !Array.isArray(data)) return [];
  
  switch (sortBy) {
    case 'grade':
      // 급수별 정렬 (오름차순)
      return [...data].sort((a, b) => a.grade - b.grade);
    
    case 'stroke_count':
      // 획수별 정렬 (오름차순)
      return [...data].sort((a, b) => a.stroke_count - b.stroke_count);
    
    case 'frequency':
      // 빈도별 정렬 (내림차순)
      return [...data].sort((a, b) => (b.frequency || 0) - (a.frequency || 0));
    
    case 'unicode':
      // 유니코드별 정렬
      return [...data].sort((a, b) => a.unicode.localeCompare(b.unicode));
    
    default:
      return data;
  }
} 