/**
 * 한자 급수 API 라우트
 * 
 * 엔드포인트: /api/hanja/grades
 * 메소드: GET
 * 쿼리 매개변수:
 * - category: 카테고리별 필터링 (예: ?category=beginner)
 * - grade: 특정 급수 데이터 요청 (예: ?grade=15)
 */

import fs from 'fs';
import path from 'path';

// 경로 설정
const DATA_ROOT = path.join(process.cwd(), 'data');
const NEW_STRUCTURE_ROOT = path.join(DATA_ROOT, 'new-structure');
const GRADES_DIR = path.join(NEW_STRUCTURE_ROOT, 'grades');
const CHARACTERS_DIR = path.join(NEW_STRUCTURE_ROOT, 'characters', 'by-grade');

// 캐시 설정 (30분)
const CACHE_MAX_AGE = 1800;

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // 쿼리 파라미터 추출
    const { category, grade } = req.query;

    // 캐싱 헤더 설정
    res.setHeader('Cache-Control', `public, max-age=${CACHE_MAX_AGE}`);

    // 특정 급수의 한자 데이터 요청인 경우
    if (grade) {
      const gradeNum = parseInt(grade);
      if (isNaN(gradeNum) || gradeNum < 1 || gradeNum > 15) {
        return res.status(400).json({ error: '유효하지 않은 급수입니다. 1-15 사이의 값을 입력하세요.' });
      }
      
      try {
        const gradeData = await getGradeData(gradeNum);
        return res.status(200).json(gradeData);
      } catch (error) {
        return res.status(404).json({ error: `${gradeNum}급 데이터를 찾을 수 없습니다.` });
      }
    }

    // 급수 목록 데이터 불러오기
    const gradesData = await getAllGrades(category);
    
    // 정렬 (급수 기준 오름차순)
    const sortedGrades = gradesData.sort((a, b) => a.grade - b.grade);

    // 응답 반환
    return res.status(200).json({
      success: true,
      total: sortedGrades.length,
      data: sortedGrades
    });
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ error: 'Internal server error', message: error.message });
  }
}

// 모든 급수 데이터 불러오기 (필터링 가능)
async function getAllGrades(category) {
  try {
    // 모든 급수 파일 목록
    const files = fs.readdirSync(GRADES_DIR)
      .filter(file => file.startsWith('grade_') && file.endsWith('.json'));
    
    // 급수 데이터 로드
    const gradesList = [];
    
    for (const file of files) {
      const filePath = path.join(GRADES_DIR, file);
      const gradeData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
      
      // 카테고리 필터링
      if (!category || gradeData.category === category) {
        // 필요 없는 큰 배열은 응답에서 제외 (character_ids)
        const { character_ids, ...gradeInfo } = gradeData;
        gradesList.push(gradeInfo);
      }
    }
    
    return gradesList;
  } catch (error) {
    throw new Error(`Failed to load grades data: ${error.message}`);
  }
}

// 특정 급수의 한자 데이터 가져오기
async function getGradeData(grade) {
  try {
    const filePath = path.join(CHARACTERS_DIR, `grade_${grade}.json`);
    
    if (!fs.existsSync(filePath)) {
      throw new Error(`Grade ${grade} data file not found`);
    }
    
    const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    return data;
  } catch (error) {
    throw new Error(`Failed to load grade ${grade} data: ${error.message}`);
  }
} 