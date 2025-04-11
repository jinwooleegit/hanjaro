import { NextRequest, NextResponse } from 'next/server';
import * as fs from 'fs';
import * as path from 'path';

interface HanjaGradeData {
  metadata: {
    version: string;
    last_updated: string;
    total_characters: number;
    data_source: string;
    grade: number;
  };
  characters: any[];
}

// 캐시 객체
const gradeDataCache: Record<number, HanjaGradeData> = {};

/**
 * 한자 급수 데이터 파일 경로 구하기
 */
function getGradeFilePath(grade: number): string {
  return path.join(process.cwd(), 'data', 'new-structure', 'characters', 'by-grade', `grade_${grade}.json`);
}

/**
 * 특정 급수의 한자 데이터 불러오기
 */
async function loadGradeData(grade: number): Promise<HanjaGradeData | null> {
  // 캐시에 있으면 캐시된 데이터 반환
  if (gradeDataCache[grade]) {
    return gradeDataCache[grade];
  }

  try {
    const filePath = getGradeFilePath(grade);
    const fileData = await fs.promises.readFile(filePath, 'utf8');
    const gradeData: HanjaGradeData = JSON.parse(fileData);
    
    // 캐시에 저장
    gradeDataCache[grade] = gradeData;
    
    return gradeData;
  } catch (error) {
    console.error(`Failed to load grade ${grade} data:`, error);
    return null;
  }
}

/**
 * 모든 한자 ID 가져오기
 */
async function getAllHanjaIds(): Promise<string[]> {
  const allIds: string[] = [];
  
  // 모든 급수 데이터 순회
  for (let grade = 15; grade >= 1; grade--) {
    const gradeData = await loadGradeData(grade);
    if (gradeData && gradeData.characters) {
      const gradeIds = gradeData.characters.map(char => char.id);
      allIds.push(...gradeIds);
    }
  }
  
  return allIds;
}

export async function GET(request: NextRequest) {
  try {
    const ids = await getAllHanjaIds();
    
    return NextResponse.json({
      success: true,
      ids: ids,
      count: ids.length
    });
  } catch (error) {
    console.error('API 에러:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
} 