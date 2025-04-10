import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// ID 검증 함수
function isValidHanjaId(id: string): boolean {
  // 형식: HJ-XX-XXXX-XXXX (예: HJ-15-0001-4E00)
  const pattern = /^HJ-\d{2}-\d{4}-[0-9A-F]{4,5}$/;
  return pattern.test(id);
}

// 한자 데이터 가져오기
async function getHanjaData(id: string) {
  try {
    // 기본 파일 경로
    const filePath = path.join(process.cwd(), 'data', 'new-structure', 'characters', `${id}.json`);
    
    // 파일 존재 확인
    if (!fs.existsSync(filePath)) {
      return null;
    }
    
    // 파일 읽기
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(fileContent);
  } catch (error) {
    console.error(`한자 데이터 파일 읽기 오류 (${id}):`, error);
    return null;
  }
}

// 레거시 시스템에서 한자 데이터 검색 (호환성)
async function findHanjaInLegacySystem(id: string) {
  // ID 형식에서 한자 추출 (예: HJ-15-0001-4E00 → 一)
  const unicodeHex = id.split('-')[3];
  const character = String.fromCodePoint(parseInt(unicodeHex, 16));
  
  try {
    // 레거시 데이터베이스 읽기
    const legacyDbPath = path.join(process.cwd(), 'data', 'hanja_database.json');
    const fileContent = fs.readFileSync(legacyDbPath, 'utf-8');
    const database = JSON.parse(fileContent);
    
    // 모든 레벨에서 해당 한자 검색
    for (const category of ['basic', 'advanced', 'university']) {
      const categoryData = database[category];
      if (!categoryData || !categoryData.levels) continue;
      
      for (const levelKey in categoryData.levels) {
        const level = categoryData.levels[levelKey];
        if (!level || !level.characters) continue;
        
        const foundChar = level.characters.find(
          (char: any) => char.character === character
        );
        
        if (foundChar) {
          // 새로운 형식으로 변환
          return {
            id,
            character,
            unicode: unicodeHex,
            grade: id.split('-')[1], // 급수 정보
            category: category === 'basic' ? 'beginner' : category,
            order_in_grade: foundChar.order || 0,
            meaning: foundChar.meaning,
            pronunciation: foundChar.pronunciation,
            stroke_count: foundChar.stroke_count,
            radical: foundChar.radical,
            examples: foundChar.examples,
            metadata: {
              version: '1.0.0',
              last_updated: new Date().toISOString(),
              source: 'Legacy Database',
              validated: true
            }
          };
        }
      }
    }
    
    return null;
  } catch (error) {
    console.error(`레거시 데이터베이스 검색 오류 (${character}):`, error);
    return null;
  }
}

// GET 요청 처리
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  
  // ID 유효성 검사
  if (!id || !isValidHanjaId(id)) {
    return NextResponse.json(
      { error: '유효하지 않은 한자 ID 형식입니다.' },
      { status: 400 }
    );
  }
  
  // 새 데이터 구조에서 한자 데이터 가져오기
  let hanjaData = await getHanjaData(id);
  
  // 새 구조에 없으면 레거시 시스템에서 검색
  if (!hanjaData) {
    hanjaData = await findHanjaInLegacySystem(id);
    
    // 레거시 시스템에서 찾은 경우 새 형식 파일 생성 (캐싱)
    if (hanjaData) {
      try {
        const dirPath = path.join(process.cwd(), 'data', 'new-structure', 'characters');
        
        // 디렉토리 존재 확인 및 생성
        if (!fs.existsSync(dirPath)) {
          fs.mkdirSync(dirPath, { recursive: true });
        }
        
        // 파일 저장
        const filePath = path.join(dirPath, `${id}.json`);
        fs.writeFileSync(filePath, JSON.stringify(hanjaData, null, 2), 'utf-8');
      } catch (error) {
        console.error(`한자 데이터 파일 생성 오류 (${id}):`, error);
      }
    }
  }
  
  // 데이터가 없으면 404 응답
  if (!hanjaData) {
    return NextResponse.json(
      { error: '요청한 한자를 찾을 수 없습니다.' },
      { status: 404 }
    );
  }
  
  // CORS 헤더 설정
  return NextResponse.json(hanjaData, {
    headers: {
      'Cache-Control': 'public, max-age=3600', // 1시간 캐싱
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    }
  });
} 