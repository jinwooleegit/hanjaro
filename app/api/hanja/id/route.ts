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
 * 확장 데이터 파일에서 한자 정보 가져오기
 */
async function getExtendedHanjaData() {
  try {
    const filePath = path.join(process.cwd(), 'data', 'new-structure', 'characters', 'hanja_extended.json');
    const fileData = await fs.promises.readFile(filePath, 'utf8');
    const extendedData = JSON.parse(fileData);
    return extendedData;
  } catch (error) {
    console.error('확장 데이터 로드 오류:', error);
    return null;
  }
}

/**
 * ID로 한자 찾기
 */
async function findHanjaById(id: string) {
  // ID 형식이 "HJ-XX-XXXX-XXXX"인 경우, 급수 추출
  const match = id.match(/HJ-(\d+)-/);
  if (match) {
    const grade = parseInt(match[1], 10);
    const gradeData = await loadGradeData(grade);
    
    if (gradeData) {
      const character = gradeData.characters.find(char => char.id === id);
      if (character) {
        return character;
      }
    }
  }
  
  // 모든 급수 데이터를 순회하며 찾기
  for (let g = 15; g >= 1; g--) {
    const gradeData = await loadGradeData(g);
    if (gradeData) {
      const charData = gradeData.characters.find(char => char.id === id);
      if (charData) {
        return charData;
      }
    }
  }
  
  // 확장 데이터에서 확인
  const extendedData = await getExtendedHanjaData();
  if (extendedData && extendedData.characters) {
    const character = extendedData.characters.find((char: any) => char.id === id);
    if (character) {
      return character;
    }
  }
  
  return null;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: 'ID 파라미터가 필요합니다.' },
        { status: 400 }
      );
    }
    
    const hanjaData = await findHanjaById(id);
    
    if (!hanjaData) {
      // ID가 문자열인 경우 문자로 간주하고 처리
      if (id.length === 1 || id.startsWith('%')) {
        let character = id;
        try {
          // URL 인코딩된 경우 디코딩
          if (id.includes('%')) {
            character = decodeURIComponent(id);
          }
          
          // 모든 급수에서 문자로 검색
          for (let g = 15; g >= 1; g--) {
            const gradeData = await loadGradeData(g);
            if (gradeData) {
              const charData = gradeData.characters.find(char => char.character === character);
              if (charData) {
                return NextResponse.json(charData);
              }
            }
          }
          
          // 확장 데이터에서 확인
          const extendedData = await getExtendedHanjaData();
          if (extendedData && extendedData.characters) {
            const charData = extendedData.characters.find((char: any) => char.character === character);
            if (charData) {
              return NextResponse.json(charData);
            }
          }
          
          return NextResponse.json(
            { error: `'${character}' 문자에 대한 한자 데이터를 찾을 수 없습니다.` },
            { status: 404 }
          );
          
        } catch (e) {
          console.error('문자 디코딩 오류:', e);
        }
      }
      
      return NextResponse.json(
        { error: `ID '${id}'에 대한 한자 데이터를 찾을 수 없습니다.` },
        { status: 404 }
      );
    }
    
    return NextResponse.json(hanjaData);
  } catch (error) {
    console.error('API 에러:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
} 