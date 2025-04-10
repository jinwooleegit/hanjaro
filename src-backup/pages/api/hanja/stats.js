/**
 * 한자 데이터베이스 통계 API 라우트
 * 
 * 엔드포인트: /api/hanja/stats
 * 메소드: GET
 */

import fs from 'fs';
import path from 'path';

// 경로 설정
const DATA_ROOT = path.join(process.cwd(), 'data');
const NEW_STRUCTURE_ROOT = path.join(DATA_ROOT, 'new-structure');
const CHARACTERS_DIR = path.join(NEW_STRUCTURE_ROOT, 'characters');
const GRADES_DIR = path.join(NEW_STRUCTURE_ROOT, 'grades');
const METADATA_DIR = path.join(NEW_STRUCTURE_ROOT, 'metadata');

// 캐시 설정 (1시간)
const CACHE_MAX_AGE = 3600;

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // 캐싱 헤더 설정
    res.setHeader('Cache-Control', `public, max-age=${CACHE_MAX_AGE}`);

    // 최신 통계 생성
    const stats = await generateDatabaseStats();

    // 응답 반환
    return res.status(200).json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ error: 'Internal server error', message: error.message });
  }
}

// 데이터베이스 통계 생성
async function generateDatabaseStats() {
  try {
    // 기존 통계 파일이 있는지 확인
    const statsFilePath = path.join(METADATA_DIR, 'database_stats.json');
    
    // 통계 파일이 있고 최근에 생성된 경우 그대로 사용
    if (fs.existsSync(statsFilePath)) {
      const statsData = JSON.parse(fs.readFileSync(statsFilePath, 'utf-8'));
      const statsTimestamp = new Date(statsData.timestamp);
      const currentTime = new Date();
      
      // 통계가 24시간 이내에 생성된 경우 캐시된 통계 사용
      if ((currentTime - statsTimestamp) < 24 * 60 * 60 * 1000) {
        return statsData.stats;
      }
    }
    
    // 새 통계 생성
    return await calculateDatabaseStats();
  } catch (error) {
    throw new Error(`Failed to generate stats: ${error.message}`);
  }
}

// 데이터베이스 통계 계산
async function calculateDatabaseStats() {
  // 기본 통계 객체
  const stats = {
    total_characters: 0,
    by_grade: {},
    by_category: {},
    by_stroke_count: {},
    completion_rates: {},
    last_updated: new Date().toISOString()
  };
  
  // 모든 한자 파일 읽기
  const files = fs.readdirSync(CHARACTERS_DIR)
    .filter(file => file.endsWith('.json'));
  
  // 기본 카운터 초기화
  stats.total_characters = files.length;
  
  // 통계를 위한 필드 정의
  const optionalFields = [
    'radical_meaning', 'radical_pronunciation', 'mnemonics', 
    'examples', 'compounds', 'similar_characters', 'stroke_order'
  ];
  
  // 각 필드의 완성도 추적
  for (const field of optionalFields) {
    stats.completion_rates[field] = { count: 0, total: 0, percentage: 0 };
  }
  
  // 모든 한자 파일 처리
  for (const file of files) {
    const filePath = path.join(CHARACTERS_DIR, file);
    const characterData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    
    // 급수별 통계
    const grade = characterData.grade.toString();
    if (!stats.by_grade[grade]) {
      stats.by_grade[grade] = 0;
    }
    stats.by_grade[grade]++;
    
    // 카테고리별 통계
    const category = characterData.category;
    if (!stats.by_category[category]) {
      stats.by_category[category] = 0;
    }
    stats.by_category[category]++;
    
    // 획수별 통계
    const strokeCount = characterData.stroke_count.toString();
    if (!stats.by_stroke_count[strokeCount]) {
      stats.by_stroke_count[strokeCount] = 0;
    }
    stats.by_stroke_count[strokeCount]++;
    
    // 필드 완성도 통계
    for (const field of optionalFields) {
      stats.completion_rates[field].total++;
      
      // 배열 필드는 길이 확인, 그 외는 존재 여부 확인
      if (Array.isArray(characterData[field])) {
        if (characterData[field].length > 0) {
          stats.completion_rates[field].count++;
        }
      } else if (characterData[field]) {
        stats.completion_rates[field].count++;
      }
    }
  }
  
  // 완성도 백분율 계산
  for (const field in stats.completion_rates) {
    const rate = stats.completion_rates[field];
    stats.completion_rates[field].percentage = Math.round((rate.count / rate.total) * 100);
  }
  
  // 급수 데이터 기반 통계 추가
  const gradeFiles = fs.readdirSync(GRADES_DIR)
    .filter(file => file.startsWith('grade_') && file.endsWith('.json'));
  
  // 급수 범주 통계
  stats.grade_categories = {};
  
  for (const file of gradeFiles) {
    const filePath = path.join(GRADES_DIR, file);
    const gradeData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    
    if (!stats.grade_categories[gradeData.category]) {
      stats.grade_categories[gradeData.category] = {
        count: 0,
        grades: []
      };
    }
    
    stats.grade_categories[gradeData.category].count++;
    stats.grade_categories[gradeData.category].grades.push(gradeData.grade);
  }
  
  // 통계 파일 저장
  const statsFilePath = path.join(METADATA_DIR, 'database_stats.json');
  fs.writeFileSync(statsFilePath, JSON.stringify({
    timestamp: new Date().toISOString(),
    stats
  }, null, 2), 'utf-8');
  
  return stats;
} 