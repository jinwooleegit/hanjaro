// 기본 한자 스트로크 데이터
// 인터넷 연결이나 API가 불안정할 때 사용하는 폴백 데이터
// 이 데이터는 서버 오류 없이 항상 기본적인 한자를 사용할 수 있도록 보장합니다.
// 필요한 한자를 추가하려면 HanziWriter 공식 데이터 저장소에서 데이터를 가져와 아래 형식으로 추가하면 됩니다.
// https://github.com/chanind/hanzi-writer-data

// 스트로크 데이터 인터페이스 정의
export interface StrokeData {
  character: string;
  strokes: string[];
  medians: number[][][];
  [key: string]: any;
}

// 스트로크 데이터 유효성 검사 함수
export function validateStrokeData(data: any, expectedChar?: string): boolean {
  if (!data) return false;
  
  try {
    // 기본 구조 검사
    const hasCharacter = typeof data.character === 'string' && data.character.length > 0;
    const hasStrokes = Array.isArray(data.strokes) && data.strokes.length > 0;
    const hasMedians = Array.isArray(data.medians) && data.medians.length === data.strokes.length;
    
    // 스트로크 데이터 형식 검사
    const validStrokes = hasStrokes && data.strokes.every((stroke: any) => typeof stroke === 'string');
    
    // 중간점 데이터 형식 검사
    const validMedians = hasMedians && data.medians.every((median: any) => 
      Array.isArray(median) && median.every((point: any) => 
        Array.isArray(point) && point.length === 2 && 
        typeof point[0] === 'number' && 
        typeof point[1] === 'number'
      )
    );
    
    // 특정 문자에 대한 검사 (선택적)
    const matchesExpected = !expectedChar || data.character === expectedChar;
    
    // 로그 출력 (디버그용)
    if (!validStrokes || !validMedians || !matchesExpected) {
      console.warn('스트로크 데이터 유효성 검사 실패:', {
        character: hasCharacter,
        expectedCharMatch: matchesExpected,
        strokes: validStrokes,
        medians: validMedians
      });
    }
    
    return hasCharacter && validStrokes && validMedians && matchesExpected;
  } catch (error) {
    console.error('스트로크 데이터 유효성 검사 오류:', error);
    return false;
  }
}

// 기본 스트로크 데이터 생성 함수
export function createBasicStrokeData(character: string): StrokeData {
  console.log(`기본 스트로크 데이터 생성: ${character}`);
  
  // 기본 X 표시 스트로크
  return {
    character: character,
    strokes: [
      "M 100 100 L 300 300",
      "M 300 100 L 100 300"
    ],
    medians: [
      [[100, 100], [300, 300]],
      [[300, 100], [100, 300]]
    ]
  };
}

export const fallbackStrokeData: Record<string, StrokeData> = {
  '大': {
    "character": "大",
    "strokes": [
      "M 276.61 148.02 C 276.61 148.02 267.65 302.71 267.65 302.71 C 267.65 302.71 228.18 355.94 228.18 355.94",
      "M 120.51 157.66 C 120.51 157.66 175.4 311.94 175.4 311.94 C 175.4 311.94 228.18 363.03 228.18 363.03",
      "M 181.54 54.25 C 181.54 54.25 397.08 269.91 397.08 269.91"
    ],
    "medians": [
      [
        [277, 148],
        [268, 303],
        [228, 356]
      ],
      [
        [121, 158],
        [175, 312],
        [228, 363]
      ],
      [
        [182, 54],
        [397, 270]
      ]
    ]
  },
  '日': {
    "character": "日",
    "strokes": [
      "M 114.08 140.65 C 114.08 140.65 114.08 370 114.08 370 C 114.08 370 386.79 370 386.79 370 C 386.79 370 386.79 140.65 386.79 140.65 C 386.79 140.65 114.08 140.65 114.08 140.65",
      "M 114.08 255.5 C 114.08 255.5 386.79 255.5 386.79 255.5",
      "M 253.93 140.65 C 253.93 140.65 253.93 370 253.93 370"
    ],
    "medians": [
      [
        [114, 141],
        [114, 370],
        [387, 370],
        [387, 141],
        [114, 141]
      ],
      [
        [114, 256],
        [387, 256]
      ],
      [
        [254, 141],
        [254, 370]
      ]
    ]
  },
  '一': {
    "character": "一",
    "strokes": [
      "M 126 254.5 C 126 254.5 383.75 254.5 383.75 254.5"
    ],
    "medians": [
      [
        [126, 255],
        [384, 255]
      ]
    ]
  },
  '人': {
    "character": "人",
    "strokes": [
      "M 231.58 136.58 C 231.58 136.58 122.33 349.12 122.33 349.12",
      "M 231.23 137.16 C 231.23 137.16 354.82 349.12 354.82 349.12"
    ],
    "medians": [
      [
        [232, 137],
        [122, 349]
      ],
      [
        [231, 137],
        [355, 349]
      ]
    ]
  },
  '水': {
    "character": "水",
    "strokes": [
      "M 180.42 98.83 C 180.42 98.83 237.67 208.08 237.67 208.08 C 237.67 208.08 244.17 274.25 244.17 274.25 C 244.17 274.25 239.83 347.17 239.83 347.17",
      "M 133.5 170.08 C 133.5 170.08 362.75 171.67 362.75 171.67",
      "M 134.75 259.42 C 134.75 259.42 172.83 297.5 172.83 297.5 C 172.83 297.5 198.92 347.17 198.92 347.17",
      "M 327.5 256.83 C 327.5 256.83 294.33 316.58 294.33 316.58 C 294.33 316.58 262.58 343.58 262.58 343.58"
    ],
    "medians": [
      [
        [180, 99],
        [238, 208],
        [244, 274],
        [240, 347]
      ],
      [
        [134, 170],
        [363, 172]
      ],
      [
        [135, 259],
        [173, 298],
        [199, 347]
      ],
      [
        [328, 257],
        [294, 317],
        [263, 344]
      ]
    ]
  },
  '二': {
    "character": "二",
    "strokes": [
      "M 129 190.5 C 129 190.5 386.75 190.5 386.75 190.5",
      "M 129 310.5 C 129 310.5 386.75 310.5 386.75 310.5"
    ],
    "medians": [
      [
        [129, 191],
        [387, 191]
      ],
      [
        [129, 311],
        [387, 311]
      ]
    ]
  },
  '三': {
    "character": "三",
    "strokes": [
      "M 129 159.5 C 129 159.5 386.75 159.5 386.75 159.5",
      "M 129 254.5 C 129 254.5 386.75 254.5 386.75 254.5",
      "M 129 350.5 C 129 350.5 386.75 350.5 386.75 350.5"
    ],
    "medians": [
      [
        [129, 160],
        [387, 160]
      ],
      [
        [129, 255],
        [387, 255]
      ],
      [
        [129, 351],
        [387, 351]
      ]
    ]
  },
  '中': {
    "character": "中",
    "strokes": [
      "M 253.93 130.36 C 253.93 130.36 253.93 380.94 253.93 380.94",
      "M 114.08 255.5 C 114.08 255.5 386.79 255.5 386.79 255.5",
      "M 114.08 130.36 C 114.08 130.36 114.08 380.94 114.08 380.94 C 114.08 380.94 386.79 380.94 386.79 380.94 C 386.79 380.94 386.79 130.36 386.79 130.36 C 386.79 130.36 114.08 130.36 114.08 130.36"
    ],
    "medians": [
      [
        [254, 130],
        [254, 381]
      ],
      [
        [114, 256],
        [387, 256]
      ],
      [
        [114, 130],
        [114, 381],
        [387, 381],
        [387, 130],
        [114, 130]
      ]
    ]
  },
  '月': {
    "character": "月",
    "strokes": [
      "M 253.93 130.36 C 253.93 130.36 253.93 380.94 253.93 380.94",
      "M 114.08 130.36 C 114.08 130.36 114.08 380.94 114.08 380.94 C 114.08 380.94 253.93 380.94 253.93 380.94",
      "M 114.08 130.36 C 114.08 130.36 253.93 130.36 253.93 130.36",
      "M 114.08 255.5 C 114.08 255.5 253.93 255.5 253.93 255.5"
    ],
    "medians": [
      [
        [254, 130],
        [254, 381]
      ],
      [
        [114, 130],
        [114, 381],
        [254, 381]
      ],
      [
        [114, 130],
        [254, 130]
      ],
      [
        [114, 256],
        [254, 256]
      ]
    ]
  },
  '木': {
    "character": "木",
    "strokes": [
      "M 253.93 130.36 C 253.93 130.36 253.93 380.94 253.93 380.94",
      "M 114.08 255.5 C 114.08 255.5 386.79 255.5 386.79 255.5",
      "M 145.93 130.36 C 145.93 130.36 253.93 255.5 253.93 255.5",
      "M 253.93 255.5 C 253.93 255.5 361.93 130.36 361.93 130.36"
    ],
    "medians": [
      [
        [254, 130],
        [254, 381]
      ],
      [
        [114, 256],
        [387, 256]
      ],
      [
        [146, 130],
        [254, 256]
      ],
      [
        [254, 256],
        [362, 130]
      ]
    ]
  }
};

// 폴백 데이터를 사용하여 한자 스트로크 데이터 가져오기
export function getLocalStrokeData(character: string): StrokeData | null {
  // 주어진 한자에 대한 폴백 데이터가 있는 경우 반환
  if (fallbackStrokeData[character]) {
    const data = fallbackStrokeData[character];
    
    // 유효성 검사 추가
    if (validateStrokeData(data, character)) {
      console.log(`유효한 로컬 폴백 데이터 사용: ${character}`);
      return data;
    } else {
      console.warn(`로컬 폴백 데이터 유효성 검사 실패: ${character}`);
    }
  }
  
  // 기본 한자 '大'에 대한 데이터가 있으면 대체 데이터로 사용
  if (character !== '大' && fallbackStrokeData['大'] && validateStrokeData(fallbackStrokeData['大'])) {
    console.log(`기본 대체 데이터 '大' 사용 (${character} 대신)`);
    
    // '大' 데이터의 복사본을 수정하여 요청된 문자 적용
    const fallbackData = JSON.parse(JSON.stringify(fallbackStrokeData['大']));
    fallbackData.character = character;
    fallbackData.isPlaceholder = true;
    
    return fallbackData;
  }
  
  // 마지막 수단: 기본 스트로크 데이터 생성
  console.warn(`로컬 폴백 데이터 없음: ${character}, 기본 데이터 생성`);
  return createBasicStrokeData(character);
}

// 한자 스트로크 데이터 로드 함수 (API, CDN 및 로컬 폴백 데이터 모두 시도)
export async function loadStrokeData(character: string): Promise<StrokeData> {
  try {
    // 1. 로컬 폴백 데이터 확인
    const localData = getLocalStrokeData(character);
    if (localData && validateStrokeData(localData, character)) {
      console.log(`로컬 폴백 데이터에서 한자 스트로크 로드: ${character}`);
      return localData;
    }

    // 2. API 엔드포인트 시도
    try {
      console.log(`API에서 한자 스트로크 데이터 요청: ${character}`);
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000); // 3초 타임아웃
      
      const apiResponse = await fetch(`/api/hanja/strokes?character=${encodeURIComponent(character)}`, {
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (apiResponse.ok) {
        const data = await apiResponse.json();
        console.log(`API에서 한자 스트로크 데이터 로드 성공: ${character}`);
        
        // 유효성 검사 추가
        if (validateStrokeData(data, character)) {
          return data;
        } else {
          console.warn(`API 응답의 스트로크 데이터 유효성 검사 실패: ${character}`);
        }
      }
    } catch (apiError) {
      console.warn(`API에서 한자 스트로크 데이터 로드 실패: ${character}`, apiError);
    }

    // 3. CDN 시도
    try {
      console.log(`CDN에서 한자 스트로크 데이터 요청: ${character}`);
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000); // 3초 타임아웃
      
      const cdnResponse = await fetch(`https://cdn.jsdelivr.net/npm/hanzi-writer-data@latest/${encodeURIComponent(character)}.json`, {
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (cdnResponse.ok) {
        const data = await cdnResponse.json();
        console.log(`CDN에서 한자 스트로크 데이터 로드 성공: ${character}`);
        
        // 유효성 검사 추가
        if (validateStrokeData(data, character)) {
          return data;
        } else {
          console.warn(`CDN 응답의 스트로크 데이터 유효성 검사 실패: ${character}`);
        }
      }
    } catch (cdnError) {
      console.warn(`CDN에서 한자 스트로크 데이터 로드 실패: ${character}`, cdnError);
    }

    // 4. GitHub 백업 시도
    try {
      console.log(`GitHub에서 한자 스트로크 데이터 요청: ${character}`);
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000); // 3초 타임아웃
      
      const githubResponse = await fetch(`https://raw.githubusercontent.com/chanind/hanzi-writer-data/master/${encodeURIComponent(character)}.json`, {
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (githubResponse.ok) {
        const data = await githubResponse.json();
        console.log(`GitHub에서 한자 스트로크 데이터 로드 성공: ${character}`);
        
        // 유효성 검사 추가
        if (validateStrokeData(data, character)) {
          return data;
        } else {
          console.warn(`GitHub 응답의 스트로크 데이터 유효성 검사 실패: ${character}`);
        }
      }
    } catch (githubError) {
      console.warn(`GitHub에서 한자 스트로크 데이터 로드 실패: ${character}`, githubError);
    }

    // 모든 방법 실패 시 기본 스트로크 데이터 생성하여 반환
    console.error(`모든 소스에서 한자 스트로크 데이터 로드 실패: ${character}, 기본 데이터 생성`);
    return createBasicStrokeData(character);
  } catch (error) {
    console.error(`한자 스트로크 데이터 로드 중 오류: ${character}`, error);
    // 오류 발생 시에도 기본 스트로크 데이터 생성하여 반환
    return createBasicStrokeData(character);
  }
} 