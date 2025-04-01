# 한자 필순 구현 문서

## 개요

이 문서는 한자 학습 웹 애플리케이션에 필순 애니메이션 기능을 구현한 과정을 설명합니다. 한자의 올바른 필순을 시각적으로 보여주는 기능을 통해 사용자가 한자를 효과적으로 학습할 수 있도록 했습니다.

## 구현 과정

### 1. 초기 구현 시도 및 문제점

처음에는 직접 구현을 시도했으나 다음과 같은 문제점이 있었습니다:

1. **데이터 구조의 제한**: 단순한 좌표 기반 구조(`{x1, y1, x2, y2}`)로는 획의 자연스러운 곡선을 표현하기 어려웠습니다.
2. **벡터 기반 애니메이션 부족**: 한자의 복잡한 획을 표현하기 위한 벡터 기반 애니메이션 처리가 부족했습니다.
3. **정확한 획순 데이터 부재**: 복잡한 한자의 정확한 획순 정보를 찾기 어려웠습니다.

### 2. HanziWriter 라이브러리 채택

위 문제를 해결하기 위해 HanziWriter 라이브러리를 도입했습니다:

- [HanziWriter](https://github.com/chanind/hanzi-writer)는 중국어 한자의 필순을 SVG로 애니메이션화하는 JavaScript 라이브러리입니다.
- CDN을 통해 한자 데이터를 직접 로드하여 수천 개의 한자를 지원합니다.
- 필순 애니메이션, 획 굵기 변화, 색상 설정 등 다양한 기능을 제공합니다.

```bash
npm install hanzi-writer --save
```

### 3. 타입 정의 생성

TypeScript 프로젝트에서 HanziWriter를 사용하기 위해 타입 정의 파일을 생성했습니다:

```typescript
// types/hanzi-writer.d.ts
declare module 'hanzi-writer' {
  export interface HanziWriterOptions {
    width?: number;
    height?: number;
    padding?: number;
    strokeAnimationSpeed?: number;
    delayBetweenStrokes?: number;
    strokeColor?: string;
    radicalColor?: string;
    highlightColor?: string;
    outlineColor?: string;
    drawingColor?: string;
    showOutline?: boolean;
    showCharacter?: boolean;
    showHintAfterMisses?: number;
    charDataLoader?: (char: string, onComplete: (data: any) => void) => void;
    onLoadCharDataSuccess?: (data: any) => void;
    onLoadCharDataError?: (error: any) => void;
    renderer?: string;
  }

  export interface HanziWriter {
    animateCharacter: () => void;
    animateStroke: (strokeNum: number) => void;
    loopCharacterAnimation: () => void;
    pauseAnimation: () => void;
    resumeAnimation: () => void;
    cancelAnimation: () => void;
    setCharacter: (character: string) => void;
    getCharacter: () => string;
  }

  export function create(
    element: HTMLElement | string,
    character: string,
    options?: HanziWriterOptions
  ): HanziWriter;

  export default create;
}
```

### 4. React 컴포넌트 구현

HanziWriter를 활용하는 React 컴포넌트를 구현했습니다:

```tsx
// app/components/HanziWriterComponent.tsx
'use client';

import { useRef, useEffect } from 'react';
import Script from 'next/script';

// 전역 Window 인터페이스 확장
declare global {
  interface Window {
    HanziWriter: any;
  }
}

interface HanziProps {
  character: string;
  width?: number;
  height?: number;
  delayBetweenStrokes?: number;
  strokeAnimationSpeed?: number;
  showOutline?: boolean;
  showCharacter?: boolean;
  highlightColor?: string;
  outlineColor?: string;
}

export default function HanziWriterComponent({
  character,
  width = 250,
  height = 250,
  delayBetweenStrokes = 500,
  strokeAnimationSpeed = 1,
  showOutline = true,
  showCharacter = false,
  highlightColor = '#ff0000',
  outlineColor = '#cccccc'
}: HanziProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const writerRef = useRef<any>(null);
  const scriptLoadedRef = useRef<boolean>(false);

  // HanziWriter 초기화 함수
  const initializeWriter = () => {
    if (!containerRef.current || !window.HanziWriter) return;
    
    // 컨테이너를 비웁니다
    containerRef.current.innerHTML = '';

    // 설정 객체
    const options = {
      width,
      height,
      padding: 5,
      delayBetweenStrokes,
      strokeAnimationSpeed,
      showOutline,
      showCharacter,
      highlightColor,
      outlineColor,
      strokeColor: '#333333',
      charDataLoader: function(char: string, onComplete: (data: any) => void) {
        fetch(`https://cdn.jsdelivr.net/npm/hanzi-writer-data@latest/${char}.json`)
          .then(res => res.json())
          .then(data => onComplete(data))
          .catch(err => {
            console.error('한자 데이터 로드 오류:', err);
            onComplete(null);
          });
      }
    };

    try {
      // HanziWriter 인스턴스 생성
      writerRef.current = window.HanziWriter.create(containerRef.current, character, options);
      
      // 애니메이션 자동 시작
      writerRef.current.animateCharacter();
    } catch (error) {
      console.error('HanziWriter 초기화 오류:', error);
    }
  };

  // 스크립트 로드 완료 핸들러
  const handleScriptLoad = () => {
    scriptLoadedRef.current = true;
    initializeWriter();
  };

  // 컴포넌트 마운트/업데이트 시 실행
  useEffect(() => {
    // 이미 스크립트가 로드되었다면 바로 초기화
    if (scriptLoadedRef.current && window.HanziWriter) {
      initializeWriter();
    }

    return () => {
      // 컴포넌트 언마운트 시 정리 작업
      writerRef.current = null;
    };
  }, [character, width, height, delayBetweenStrokes, strokeAnimationSpeed, showOutline, showCharacter, highlightColor, outlineColor]);

  return (
    <>
      <Script 
        src="https://cdn.jsdelivr.net/npm/hanzi-writer@3.5/dist/hanzi-writer.min.js"
        onLoad={handleScriptLoad}
        strategy="afterInteractive"
      />
      <div ref={containerRef} className="hanzi-writer-container" style={{ margin: '0 auto', width: `${width}px`, height: `${height}px` }} />
    </>
  );
}
```

### 5. 학습 페이지 구현

HanziWriter 컴포넌트를 사용하여 한자 필순 학습 페이지를 구현했습니다:

```tsx
// app/learn/page.tsx
'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

// 클라이언트 사이드에서만 로드되도록 dynamic import 사용
const HanziWriterComponent = dynamic(() => import('../components/HanziWriterComponent'), {
  ssr: false,
});

const popularHanjaList = [
  { character: '人', meaning: '사람 인', korean: '사람' },
  { character: '永', meaning: '영원할 영', korean: '영원' },
  { character: '水', meaning: '물 수', korean: '물' },
  { character: '火', meaning: '불 화', korean: '불' },
  { character: '山', meaning: '산 산', korean: '산' },
  { character: '學', meaning: '배울 학', korean: '배움' },
  { character: '道', meaning: '길 도', korean: '길' }
];

export default function LearnPage() {
  const [selectedHanja, setSelectedHanja] = useState(popularHanjaList[0]);
  const [showOptions, setShowOptions] = useState(false);
  
  // 옵션 상태 관리
  const [strokeSpeed, setStrokeSpeed] = useState(1);
  const [showCharacter, setShowCharacter] = useState(false);
  const [highlightColor, setHighlightColor] = useState('#ff0000');
  const [outlineColor, setOutlineColor] = useState('#cccccc');

  const resetAnimation = () => {
    // 같은 한자를 강제로 다시 로드하는 효과
    const current = selectedHanja;
    setSelectedHanja({...current});
  };

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="flex flex-col gap-8">
        <h1 className="text-3xl font-bold text-center">한자 필순 학습</h1>
        
        <p className="text-lg text-center">
          한자의 올바른 획순을 애니메이션으로 배워보세요.
        </p>
        
        <div className="border rounded-md p-6 shadow-sm">
          <div className="mb-4">
            <h2 className="text-xl font-semibold text-center">
              {selectedHanja.character} ({selectedHanja.meaning})
            </h2>
          </div>
          <div className="flex flex-col items-center gap-6">
            <HanziWriterComponent 
              character={selectedHanja.character}
              width={250}
              height={250}
              delayBetweenStrokes={500}
              strokeAnimationSpeed={strokeSpeed}
              showCharacter={showCharacter}
              highlightColor={highlightColor}
              outlineColor={outlineColor}
            />
            
            <div className="text-center">
              <p>뜻: {selectedHanja.meaning}</p>
              <p>훈독: {selectedHanja.korean}</p>
              
              <div className="flex gap-2 mt-3 justify-center">
                <button 
                  onClick={() => setShowOptions(!showOptions)}
                  className="px-4 py-2 text-sm bg-gray-200 hover:bg-gray-300 rounded-md"
                >
                  {showOptions ? '옵션 숨기기' : '옵션 표시'}
                </button>
                
                <button 
                  onClick={resetAnimation}
                  className="px-4 py-2 text-sm bg-blue-500 text-white hover:bg-blue-600 rounded-md"
                >
                  애니메이션 재시작
                </button>
              </div>
            </div>
            
            {showOptions && (
              <div className="w-full max-w-md border rounded-md p-4 mt-2">
                <h3 className="font-semibold mb-3">표시 옵션</h3>
                
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-sm mb-1">획 속도 조절</label>
                    <input 
                      type="range" 
                      min="0.5" 
                      max="3" 
                      step="0.5" 
                      value={strokeSpeed}
                      onChange={(e) => setStrokeSpeed(parseFloat(e.target.value))}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>느리게</span>
                      <span>빠르게</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <input 
                      type="checkbox" 
                      id="showCharacter" 
                      checked={showCharacter}
                      onChange={() => setShowCharacter(!showCharacter)}
                      className="mr-2"
                    />
                    <label htmlFor="showCharacter">글자 미리보기 표시</label>
                  </div>
                  
                  <div>
                    <label className="block text-sm mb-1">강조 색상</label>
                    <input 
                      type="color" 
                      value={highlightColor}
                      onChange={(e) => setHighlightColor(e.target.value)}
                      className="w-full h-8"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm mb-1">윤곽선 색상</label>
                    <input 
                      type="color" 
                      value={outlineColor}
                      onChange={(e) => setOutlineColor(e.target.value)}
                      className="w-full h-8"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-7 gap-4">
          {popularHanjaList.map((hanja) => (
            <button 
              key={hanja.character}
              onClick={() => setSelectedHanja(hanja)}
              className={`p-4 rounded-md text-3xl h-20 
                ${selectedHanja.character === hanja.character 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-200 hover:bg-gray-300'}`}
            >
              {hanja.character}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
```

## 해결한 문제점들

### 1. 페이지 라우터 충돌 해결

Next.js 프로젝트에서 App Router(app 디렉토리)와 Pages Router(src/pages 디렉토리)가 동시에 같은 경로를 처리하려 했을 때 충돌이 발생했습니다.

```
Conflicting app and page file was found, please remove the conflicting files to continue:
  "src\pages\learn.tsx" - "app\learn\page.tsx"
```

Pages Router 방식의 파일(`src/pages/learn.tsx`)을 삭제하여 해결했습니다:

```bash
git rm src/pages/learn.tsx
```

### 2. 타입 정의 문제 해결

TypeScript에서 HanziWriter 라이브러리 사용 시 타입 정의가 없어 발생한 오류를 해결했습니다:

1. 프로젝트에 `types/hanzi-writer.d.ts` 파일을 생성하여 타입 정의를 추가
2. `tsconfig.json`에 타입 정의 경로 추가:

```json
"typeRoots": [
  "./node_modules/@types",
  "./types"
],
"include": [
  "next-env.d.ts",
  "**/*.ts",
  "**/*.tsx",
  ".next/types/**/*.ts",
  "types/**/*.d.ts"
],
```

### 3. 글로벌 객체 접근 문제

HanziWriter가 전역 객체에 노출되어 있어 TypeScript에서 접근 오류가 발생했습니다. 전역 Window 인터페이스를 확장하여 해결했습니다:

```typescript
declare global {
  interface Window {
    HanziWriter: any;
  }
}
```

### 4. 서버 사이드 렌더링 문제

SSR(서버 사이드 렌더링) 환경에서 HanziWriter 사용 시 문제가 발생했습니다. Next.js의 dynamic import를 사용하여 SSR을 비활성화했습니다:

```typescript
const HanziWriterComponent = dynamic(() => import('../components/HanziWriterComponent'), {
  ssr: false,
});
```

## 주요 기능

### 1. 한자 필순 애니메이션

- SVG 기반의 자연스러운 필순 애니메이션 제공
- 획의 방향과 순서를 시각적으로 표현
- 획 완성 시 강조 효과로 사용자 이해도 향상

### 2. 사용자 설정 옵션

- 애니메이션 속도 조절 (0.5x ~ 3x)
- 글자 미리보기 옵션 (전체 한자 표시 여부)
- 강조 색상 및 윤곽선 색상 커스터마이징
- 애니메이션 재시작 기능

### 3. 다양한 한자 지원

- 기본 한자 7개 제공 ('人', '永', '水', '火', '山', '學', '道')
- CDN을 통한 필순 데이터 로드로 수천 개의 한자 지원 가능
- 사용자가 선택한 한자로 즉시 전환 가능한 UI

## 향후 개선 사항

1. **사용자 필기 연습 기능**: 한자 필순을 보고 사용자가 직접 화면에 따라 쓰는 기능 추가
2. **정확도 평가 기능**: 사용자의 필기 입력이 올바른 필순과 비교하여 정확도를 평가하는 기능
3. **학습 진도 추적**: 사용자별로 학습한 한자와 정확도를 추적하는 기능
4. **더 많은 한자와 카테고리**: 레벨별, 주제별로 분류된 다양한 한자 추가
5. **퀴즈 모드**: 특정 한자의 필순을 맞추는 퀴즈 기능

## 결론

HanziWriter 라이브러리를 활용하여 한자 필순 학습 기능을 성공적으로 구현했습니다. 이를 통해 사용자는 한자의 올바른 필순을 시각적으로 학습할 수 있으며, 다양한 옵션을 통해 학습 경험을 개인화할 수 있습니다. 

향후 개선 사항을 구현한다면 더욱 완성도 높은 한자 학습 애플리케이션이 될 것으로 기대됩니다. 