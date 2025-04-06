import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// 캐시 메커니즘 추가 - 메모리 내 캐시로 반복 파일 I/O 피하기
const characterCache: Record<string, any> = {};

// 한자 데이터 인터페이스 정의
interface HanjaStrokeData {
  character: string;
  strokes: string[];
  medians: any[][];
  [key: string]: any;
}

/**
 * 한자 필순 데이터를 제공하는 API 엔드포인트
 * 
 * 이 API는 로컬에 저장된 한자 필순 데이터를 제공합니다.
 * 로컬에 데이터가 없는 경우 404 응답을 반환합니다.
 * 
 * @example
 * GET /api/hanja/strokes?char=水 또는 /api/hanja/strokes?character=水
 */
export async function GET(request: NextRequest) {
  try {
    // URL에서 한자 파라미터 추출 (char 또는 character 파라미터 지원)
    const url = new URL(request.url);
    let char = url.searchParams.get('char') || url.searchParams.get('character');

    // URL 디코딩
    if (char && /%[0-9A-F]{2}/.test(char)) {
      try {
        char = decodeURIComponent(char);
      } catch (e) {
        console.error('URL 디코딩 오류:', e);
      }
    }

    if (!char) {
      return NextResponse.json(
        { error: '한자 파라미터가 필요합니다 (char 또는 character 사용)' },
        { 
          status: 400,
          headers: {
            'Content-Type': 'application/json; charset=utf-8',
            'Access-Control-Allow-Origin': '*'
          }
        }
      );
    }

    console.log(`필순 데이터 요청 받음: ${char}`);
    
    const responseHeaders = {
      'Content-Type': 'application/json; charset=utf-8',
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'public, max-age=86400'
    };

    // 캐시 확인 - 캐시에 있으면 즉시 반환
    if (characterCache[char]) {
      console.log(`캐시에서 ${char} 데이터 반환`);
      return NextResponse.json(characterCache[char], {
        headers: responseHeaders
      });
    }

    // 가능한 모든 필순 데이터 디렉토리 경로 (여러 위치 시도)
    const possiblePaths = [
      path.join(process.cwd(), 'data', 'stroke_data'),
      path.join(process.cwd(), 'public', 'data', 'stroke_data'),
      path.join(process.cwd(), 'data', 'strokes'),
      path.join(process.cwd(), 'public', 'data', 'strokes')
    ];
    
    // 가능한 파일 경로들
    const possibleFiles = [];
    for (const dir of possiblePaths) {
      possibleFiles.push(path.join(dir, `${char}.json`));
    }

    // fallback 파일 경로들 - 통합 인덱스 파일 추가
    const fallbackPaths = [
      path.join(process.cwd(), 'data', 'hanja_stroke_index.json'),
      path.join(process.cwd(), 'data', 'hanja_strokes.json'),
      path.join(process.cwd(), 'hanja_strokes.json'),
      path.join(process.cwd(), 'data', 'stroke_index.json')
    ];

    // 모든 가능한 파일 경로를 확인
    let fileData: HanjaStrokeData | null = null;
    for (const filePath of possibleFiles) {
      if (fs.existsSync(filePath)) {
        console.log(`필순 파일 발견: ${filePath}`);
        try {
          const fileContent = fs.readFileSync(filePath, 'utf8');
          const data = JSON.parse(fileContent);
          fileData = data;
          // 캐시에 저장
          characterCache[char] = fileData;
          console.log(`개별 파일에서 ${char} 데이터 로드 성공`);
          break;
        } catch (parseError) {
          console.error(`${filePath} 파싱 오류:`, parseError);
        }
      }
    }

    // 개별 파일이 없으면 fallback 인덱스 파일 확인
    if (!fileData) {
      for (const fallbackPath of fallbackPaths) {
        if (fs.existsSync(fallbackPath)) {
          console.log(`대체 필순 파일 확인: ${fallbackPath}`);
          try {
            const fallbackContent = fs.readFileSync(fallbackPath, 'utf8');
            const fallbackData = JSON.parse(fallbackContent);
            
            // 1. 객체 형태로 저장된 경우 (키가 한자인 경우)
            if (fallbackData[char]) {
              console.log(`${fallbackPath}에서 ${char} 데이터 발견`);
              // 타입 주석 추가
              const charData: Record<string, any> = fallbackData[char];
              
              // 이미 HanziWriter 형식인 경우
              if (charData.character === char && Array.isArray(charData.strokes) && Array.isArray(charData.medians)) {
                fileData = charData as HanjaStrokeData;
                console.log(`${char} 표준 형식 데이터 발견`);
              }
              // strokes 배열만 있는 경우
              else if (charData.strokes && Array.isArray(charData.strokes)) {
                if (typeof charData.strokes[0] === 'string') {
                  fileData = {
                    character: char,
                    strokes: charData.strokes,
                    medians: charData.medians || charData.strokes.map(() => []),
                  };
                  console.log(`${char} strokes 배열 데이터 변환 완료`);
                }
                // SVG 경로만 있는 경우
                else if (charData.strokes[0].path) {
                  const svgStrokes = charData.strokes.map((stroke: any) => stroke.path);
                  fileData = {
                    character: char,
                    strokes: svgStrokes,
                    medians: svgStrokes.map((path: string) => path.split(' ').filter(p => p.indexOf(',') > 0).map(p => {
                      const [x, y] = p.split(',');
                      return [parseFloat(x), parseFloat(y)];
                    })),
                  };
                  console.log(`${char} SVG 경로 데이터 변환 완료`);
                }
              }
              
              if (fileData) {
                // 캐시에 저장
                fileData.character = char; // 캐릭터 값 정확히 설정
                characterCache[char] = fileData;
                console.log(`${fallbackPath}에서 ${char} 데이터 캐시 저장 완료`);
                break;
              }
            }
            
            // 2. 배열 형태로 저장된 경우
            if (Array.isArray(fallbackData)) {
              const charData = fallbackData.find((item: any) => 
                item.character === char || item.char === char
              );
              
              if (charData) {
                console.log(`${fallbackPath}에서 ${char} 데이터 발견 (배열)`);
                fileData = {
                  character: char,
                  strokes: charData.strokes || [],
                  medians: charData.medians || [],
                };
                // 캐시에 저장
                characterCache[char] = fileData;
                console.log(`배열 형태 ${char} 데이터 캐시 저장 완료`);
                break;
              }
            }
          } catch (parseError) {
            console.error(`${fallbackPath} 파싱 오류:`, parseError);
          }
        }
      }
    }

    // 데이터를 찾지 못한 경우
    if (!fileData) {
      console.log(`${char} 한자의 필순 데이터를 찾을 수 없습니다, 기본 패턴 생성`);
      
      // 기본 패턴 생성 로직 추가
      const fallbackData = generateBasicPattern(char);
      
      // character 속성 중복 문제 해결
      const responseData: HanjaStrokeData = {
        character: char,
        strokes: fallbackData.strokes,
        medians: fallbackData.medians,
        isPlaceholder: true
      };
      
      // 생성된 데이터 캐싱
      characterCache[char] = responseData;
      
      return NextResponse.json(responseData, {
        headers: responseHeaders
      });
    }

    // 데이터 정합성 한번 더 확인
    if (fileData.character !== char) {
      fileData.character = char;
    }

    if (!Array.isArray(fileData.strokes) || fileData.strokes.length === 0) {
      console.warn(`${char} 데이터의 strokes 배열이 없거나 비어있습니다. 기본 데이터 생성`);
      const basicData = generateBasicPattern(char);
      fileData.strokes = basicData.strokes;
      fileData.medians = basicData.medians;
      fileData.isPlaceholder = true;
    }
    
    if (!Array.isArray(fileData.medians) || fileData.medians.length === 0 || fileData.medians.length !== fileData.strokes.length) {
      console.warn(`${char} 데이터의 medians 배열이 없거나 strokes와 길이가 다릅니다. 기본 데이터 생성`);
      // 길이 맞추기
      fileData.medians = fileData.strokes.map((stroke: string, index: number) => {
        if (fileData.medians && index < fileData.medians.length) {
          return fileData.medians[index];
        }
        // 간단한 미디안 생성
        const parts = stroke.replace(/[ML]/g, '').trim().split(' ');
        const coords = parts.map(part => {
          const [x, y] = part.split(',').map(Number);
          return [x, y];
        }).filter(coord => coord.length === 2 && !isNaN(coord[0]) && !isNaN(coord[1]));
        
        return coords.length > 0 ? coords : [[50, 50]];
      });
    }

    return NextResponse.json(fileData, {
      headers: responseHeaders
    });
  } catch (error: any) {
    console.error('필순 데이터 가져오기 오류:', error);
    
    const errorResponse = { 
      error: '필순 데이터를 가져오는 중 오류가 발생했습니다', 
      details: error.message,
      // 대체 데이터 제공 (X 표시)
      character: '?',
      strokes: ['M 0 0 L 100 100 M 100 0 L 0 100'],
      medians: [[[0, 0], [100, 100]], [[100, 0], [0, 100]]],
      isPlaceholder: true
    };
    
    return NextResponse.json(errorResponse, { 
      status: 500,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }
}

/**
 * 한자의 필순 데이터 존재 여부를 확인하는 API 엔드포인트
 * 
 * @example
 * HEAD /api/hanja/strokes?char=水 또는 /api/hanja/strokes?character=水
 */
export async function HEAD(request: NextRequest) {
  try {
    // URL에서 한자 파라미터 추출
    const url = new URL(request.url);
    const char = url.searchParams.get('char') || url.searchParams.get('character');

    if (!char) {
      return new NextResponse(null, { status: 400 });
    }
    
    // 캐시 확인 - 캐시에 있으면 즉시 반환
    if (characterCache[char]) {
      return new NextResponse(null, { status: 200 });
    }

    // 가능한 모든 필순 데이터 경로 확인
    const possiblePaths = [
      path.join(process.cwd(), 'data', 'stroke_data', `${char}.json`),
      path.join(process.cwd(), 'public', 'data', 'stroke_data', `${char}.json`),
      path.join(process.cwd(), 'data', 'strokes', `${char}.json`),
      path.join(process.cwd(), 'public', 'data', 'strokes', `${char}.json`)
    ];

    // 파일이 존재하는지 확인
    for (const filePath of possiblePaths) {
      if (fs.existsSync(filePath)) {
        return new NextResponse(null, { status: 200 });
      }
    }

    // fallback 파일에서 검색
    const fallbackPaths = [
      path.join(process.cwd(), 'data', 'hanja_stroke_index.json'),
      path.join(process.cwd(), 'data', 'hanja_strokes.json'),
      path.join(process.cwd(), 'hanja_strokes.json')
    ];

    for (const fallbackPath of fallbackPaths) {
      if (fs.existsSync(fallbackPath)) {
        try {
          const fallbackData = JSON.parse(fs.readFileSync(fallbackPath, 'utf8'));
          if (fallbackData[char]) {
            return new NextResponse(null, { status: 200 });
          }
        } catch (e) {
          console.error(`${fallbackPath} 파싱 오류:`, e);
        }
      }
    }
    
    // 기본 패턴 생성 가능하므로 200 반환
    return new NextResponse(null, { status: 200 });
  } catch (error) {
    console.error('필순 데이터 확인 오류:', error);
    return new NextResponse(null, { status: 500 });
  }
}

/**
 * 기본 한자 패턴 생성 함수
 * 데이터가 없는 한자에 대해 기본적인 패턴을 생성합니다.
 */
function generateBasicPattern(char: string): HanjaStrokeData {
  console.log(`${char} 한자에 대한 기본 패턴 생성`);
  
  // 기본 패턴 (X 표시)
  const basicPattern: HanjaStrokeData = {
    character: char,
    strokes: ['M 20 20 L 80 80', 'M 80 20 L 20 80'],
    medians: [[[20, 20], [80, 80]], [[80, 20], [20, 80]]]
  };
  
  // 추가 정보 (유니코드 코드 포인트)
  const codePoint = char.charCodeAt(0);
  
  // 한자 복잡도에 따라 획 추가 (추정)
  const estimatedStrokes = Math.min(16, Math.max(4, Math.floor(codePoint % 7) + 3));
  
  if (estimatedStrokes > 4) {
    // 가로 선 추가
    basicPattern.strokes.push('M 20 50 L 80 50');
    basicPattern.medians.push([[20, 50], [80, 50]]);
  }
  
  if (estimatedStrokes > 5) {
    // 세로 선 추가
    basicPattern.strokes.push('M 50 20 L 50 80');
    basicPattern.medians.push([[50, 20], [50, 80]]);
  }
  
  console.log(`${char} 기본 패턴 생성 완료: ${basicPattern.strokes.length}획`);
  return basicPattern;
} 