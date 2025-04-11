# API 개선 및 클라이언트 최적화 문서

## 1. 개요

Next.js 애플리케이션의 API 라우트 중복 해결 및 클라이언트 사이드 코드에서 `fs` 모듈 사용 제거를 통한 최적화를 진행했습니다. 또한 한자 데이터베이스 구축 계획에 따라 새로운 스크립트를 추가하여 데이터 확장 방안을 구현했습니다.

## 2. 변경사항

### 2.1 중복 API 라우트 해결

기존에는 Pages Router와 App Router에서 중복된 API 라우트가 존재했습니다:

1. Pages Router: `/pages/api/hanja/[id].js`
2. App Router: `/app/api/hanja/id/route.ts`

현재는 App Router 방식으로 통일하여 중복을 제거했습니다. 모든 API 요청은 `/app/api/...` 경로로 처리됩니다.

#### 새로 추가된 API 엔드포인트

- `/app/api/hanja/all-ids/route.ts`: 모든 한자 ID를 가져오는 API 엔드포인트

### 2.2 클라이언트 사이드 `fs` 모듈 사용 제거

클라이언트 컴포넌트에서 서버 전용 모듈인 `fs`를 사용하던 코드를 수정했습니다:

1. `/utils/idUtils.ts`: 클라이언트와 서버 코드 분리
   - 클라이언트에서 사용할 함수는 순수 함수로 변경
   - 서버 전용 함수에는 `'use server'` 지시문 추가
   - `fs` 사용 부분은 모두 서버 유틸리티로 이동

2. `/utils/iconUtils.ts`: 클라이언트와 서버 코드 분리
   - 클라이언트에서 사용하는 함수(`getHanjaSvgPath`, `generateHanjaSvgString`)는 순수 함수 유지
   - 서버 전용 함수(`hasHanjaSvg`, `createHanjaSvgFile`)는 `serverUtils` 객체로 이동

### 2.3 한자 데이터베이스 구축 스크립트 추가

한자 데이터베이스 확장 계획에 따라 다음 스크립트를 추가했습니다:

1. `/scripts/build-hanja-database.js`: 기존 데이터를 새로운 구조로 변환
   - 디렉토리 구조 생성
   - 급수별 데이터 파일 생성
   - 카테고리 데이터 파일 생성
   - 부수/획수 메타데이터 생성
   - 한자 관계 데이터 생성

2. `/scripts/collect-external-data.js`: 외부 데이터 수집 및 통합
   - Unihan 데이터베이스 연동
   - 국립국어원 한자 자료 연동
   - 기존 데이터와 통합

3. `package.json`에 스크립트 명령 추가:
   - `build-db`: 한자 데이터베이스 구축
   - `collect-data`: 외부 데이터 수집
   - `build-hanja-data`: 위 두 스크립트를 순차적으로 실행

## 3. 신규 데이터 구조

`/data/new-structure/` 디렉토리에 다음과 같은 구조로 데이터가 구축됩니다:

```
/data/
  /new-structure/
    /characters/              # 한자 데이터
      hanja_characters.json   # 전체 한자 데이터
      hanja_extended.json     # 확장 데이터
      /by-grade/              # 급수별 한자 세부 데이터
        grade_01.json         # 1급
        grade_02.json         # 2급
        ...
        grade_15.json         # 15급
    
    /grades/                  # 급수 메타데이터
      grade_01.json           # 1급 (3,500자)
      grade_02.json           # 2급 (2,400자)
      ...
      grade_15.json           # 15급 (30자)
    
    /categories/              # 카테고리 정의
      beginner.json           # 초급 (15~11급)
      intermediate.json       # 중급 (10~6급)
      advanced.json           # 고급 (5~3급)
      expert.json             # 전문가 (2~1급)
    
    /metadata/                # 부가 정보
      radicals.json           # 부수 정보
      strokes.json            # 획수별 정보
      pronunciations.json     # 발음 정보
    
    /relations/               # 관계 데이터
      hanja_relations.json    # 한자 간 관계 정보
```

## 4. 사용 방법

### 4.1 데이터 구축

```bash
# 기존 데이터를 새 구조로 변환
npm run build-db

# 외부 데이터 수집 및 통합
npm run collect-data

# 위 두 작업을 모두 수행
npm run build-hanja-data
```

### 4.2 클라이언트 코드에서 API 사용

```javascript
// 한자 ID로 데이터 가져오기
const response = await fetch(`/api/hanja/id?id=HJ-15-0001-4E00`);
const hanjaData = await response.json();

// 한자 문자로 데이터 가져오기 
const response = await fetch(`/api/hanja/id?character=一`);
const hanjaData = await response.json();

// 모든 한자 ID 가져오기
const response = await fetch(`/api/hanja/all-ids`);
const { ids } = await response.json();
```

### 4.3 서버 컴포넌트에서 사용

```typescript
// 서버 컴포넌트에서 사용 예시
import { serverUtils } from '@/utils/idUtils';

export default async function HanjaServerComponent() {
  const hanjaData = await serverUtils.initializeIdMappings();
  
  return (
    <div>
      <h1>한자 데이터</h1>
      <p>총 {hanjaData.length}개의 한자 데이터 로드 완료</p>
      {/* 데이터 렌더링 */}
    </div>
  );
}
```

## 5. 주의사항

1. **서버 전용 함수**: `'use server'` 지시문이 있는 함수는 서버 컴포넌트나 서버 액션에서만 호출 가능합니다.

2. **API 변경 사항**: Pages Router 방식의 API는 더 이상 사용하지 않으므로, 기존 코드에서 해당 엔드포인트를 사용하는 부분을 새 API 엔드포인트로 마이그레이션해야 합니다.

3. **데이터 구축**: 초기 설정 후에는 `npm run build-hanja-data` 명령을 실행하여 데이터베이스를 구축해야 합니다.

## 6. 향후 개선 사항

1. 외부 API 연동 완성: 실제 국립국어원, Unihan 데이터베이스 연동 구현
2. 데이터 검증 자동화: 데이터 일관성 및 유효성 검사 추가
3. 관계형 데이터 확장: 한자 간 관계 데이터 구축
4. 기존 API 엔드포인트의 점진적 마이그레이션 