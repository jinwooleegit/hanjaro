import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// 급수 정보 유효성 검사
function isValidGrade(grade: string): boolean {
  const gradeNum = parseInt(grade, 10);
  return !isNaN(gradeNum) && gradeNum >= 1 && gradeNum <= 15;
}

// 두 자리 숫자로 변환 (1 → '01')
function padGrade(grade: string): string {
  const gradeNum = parseInt(grade, 10);
  return gradeNum < 10 ? `0${gradeNum}` : grade;
}

// 급수별 한자 목록 가져오기
async function getGradeData(grade: string) {
  try {
    const paddedGrade = padGrade(grade);
    
    // 새 구조의 파일 경로
    const filePath = path.join(process.cwd(), 'data', 'new-structure', 'grades', `grade_${grade}.json`);
    
    // 파일 존재 확인
    if (fs.existsSync(filePath)) {
      const fileContent = fs.readFileSync(filePath, 'utf-8');
      return JSON.parse(fileContent);
    }
    
    // 새 구조에 없으면 레거시 데이터로부터 생성
    return await createGradeDataFromLegacy(grade, paddedGrade);
  } catch (error) {
    console.error(`급수 데이터 파일 읽기 오류 (${grade}):`, error);
    return null;
  }
}

// 레거시 데이터에서 급수별 데이터 생성
async function createGradeDataFromLegacy(grade: string, paddedGrade: string) {
  try {
    // 급수와 레벨 매핑
    const gradeToLevelMap: Record<string, { category: string, level: string }> = {
      '15': { category: 'basic', level: 'level1' },
      '14': { category: 'basic', level: 'level2' },
      '13': { category: 'basic', level: 'level3' },
      '12': { category: 'basic', level: 'level4' },
      '11': { category: 'basic', level: 'level5' },
      '10': { category: 'advanced', level: 'level1' },
      '9': { category: 'advanced', level: 'level2' },
      '8': { category: 'advanced', level: 'level3' },
      '7': { category: 'university', level: 'level1' },
      '6': { category: 'university', level: 'level2' },
      '5': { category: 'university', level: 'level3' },
      '4': { category: 'university', level: 'level4' },
      // 1-3급은 여기에 매핑 추가 필요
    };
    
    // 매핑 정보 가져오기
    const mapping = gradeToLevelMap[grade];
    if (!mapping) {
      return null;
    }
    
    // 레거시 데이터베이스 읽기
    const legacyDbPath = path.join(process.cwd(), 'data', 'hanja_database.json');
    const fileContent = fs.readFileSync(legacyDbPath, 'utf-8');
    const database = JSON.parse(fileContent);
    
    // 해당 레벨 데이터 가져오기
    const categoryData = database[mapping.category];
    if (!categoryData || !categoryData.levels) {
      return null;
    }
    
    const levelData = categoryData.levels[mapping.level];
    if (!levelData || !levelData.characters) {
      return null;
    }
    
    // 한자 ID 생성
    const characterIds = levelData.characters.map((char: any, index: number) => {
      // 한자의 유니코드 계산
      const unicode = char.character.codePointAt(0)?.toString(16).toUpperCase();
      // ID 생성 (HJ-급수-순번-유니코드)
      const id = `HJ-${paddedGrade}-${(index + 1).toString().padStart(4, '0')}-${unicode}`;
      return id;
    });
    
    // 새 형식의 급수 데이터 생성
    const gradeData = {
      grade: parseInt(grade, 10),
      name: `${grade}급`,
      description: levelData.description || `${grade}급 한자`,
      category: mapping.category === 'basic' ? 'beginner' : mapping.category,
      character_count: characterIds.length,
      character_ids: characterIds,
      metadata: {
        version: '1.0.0',
        last_updated: new Date().toISOString(),
        source: 'Legacy Database',
        validated: true
      }
    };
    
    // 파일 저장
    try {
      const dirPath = path.join(process.cwd(), 'data', 'new-structure', 'grades');
      
      // 디렉토리 확인 및 생성
      if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
      }
      
      // 파일 저장
      const filePath = path.join(dirPath, `grade_${grade}.json`);
      fs.writeFileSync(filePath, JSON.stringify(gradeData, null, 2), 'utf-8');
    } catch (error) {
      console.error(`급수 데이터 파일 생성 오류 (${grade}):`, error);
    }
    
    return gradeData;
  } catch (error) {
    console.error(`레거시 데이터 변환 오류 (${grade}):`, error);
    return null;
  }
}

// GET 요청 처리
export async function GET(
  request: NextRequest,
  { params }: { params: { grade: string } }
) {
  const { grade } = params;
  
  // 급수 유효성 검사
  if (!grade || !isValidGrade(grade)) {
    return NextResponse.json(
      { error: '유효하지 않은 급수입니다. 1-15 사이의 값이어야 합니다.' },
      { status: 400 }
    );
  }
  
  // 급수별 한자 목록 가져오기
  const gradeData = await getGradeData(grade);
  
  // 데이터가 없으면 404 응답
  if (!gradeData) {
    return NextResponse.json(
      { error: '요청한 급수의 한자 데이터를 찾을 수 없습니다.' },
      { status: 404 }
    );
  }
  
  // CORS 헤더 및 캐싱 설정
  return NextResponse.json(gradeData, {
    headers: {
      'Cache-Control': 'public, max-age=3600', // 1시간 캐싱
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    }
  });
} 