# 급수별 한자 데이터 시스템

## 개요

한자 데이터를 급수별로 분리하여 관리하는 시스템을 구현하였습니다. 이는 대용량 데이터 처리 시 발생하는 성능 문제를 해결하고, 사용자에게 더 빠른 응답 시간을 제공하기 위함입니다.

## 구조

### 디렉토리 구조

```
data/
└── new-structure/
    └── characters/
        ├── hanja_extended.json      # 전체 한자 데이터
        ├── hanja_characters.json    # 기본 한자 정보
        └── by-grade/                # 급수별 데이터
            ├── grade_15.json        # 15급 한자
            ├── grade_14.json        # 14급 한자
            ├── grade_13.json        # 13급 한자
            ├── ...
            └── split_by_grade.js    # 데이터 분리 스크립트
```

### 파일 구조

각 급수별 데이터 파일(`grade_XX.json`)는 다음과 같은 형식을 가집니다:

```json
{
  "metadata": {
    "version": "1.0.0",
    "last_updated": "2023-10-25T12:34:56Z",
    "total_characters": 20,
    "data_source": "국립국어원 한자 자료 확장",
    "grade": 15
  },
  "characters": [
    {
      "id": "HJ-15-0001-4E00",
      "character": "一",
      "unicode": "U+4E00",
      "meaning": "한 일",
      "pronunciation": "일",
      "stroke_count": 1,
      "radical": "一",
      "grade": 15,
      "order": 1,
      "tags": ["basic", "number", "beginner"],
      "extended_data": {
        // 상세 데이터...
      }
    },
    // 더 많은 한자 데이터...
  ]
}
```

## 주요 기능

### 1. 데이터 분리 스크립트

- `split_by_grade.js`: 대용량 한자 데이터를 급수별로 분리하는 Node.js 스크립트
- 실행 방법: `node split_by_grade.js`

### 2. 유틸리티 함수

- `utils/gradeBasedHanjaUtils.ts`: 급수별 데이터를 로드하고 관리하는 유틸리티 함수 모음
- `utils/hanjaPageUtils.ts`: 상세 페이지에서 사용하는 래퍼 함수들

### 3. API 엔드포인트

- `app/api/hanja/grade/route.ts`: 급수별 데이터에 접근하는 API
- 지원 쿼리 파라미터:
  - `grade`: 특정 급수의 모든 한자 조회 (예: `/api/hanja/grade?grade=15`)
  - `character`: 특정 한자 조회 (예: `/api/hanja/grade?character=一`)
  - `id`: ID로 한자 조회 (예: `/api/hanja/grade?id=HJ-15-0001-4E00`)

## 이점

### 1. 성능 향상

- **로딩 속도 개선**: 필요한 급수의 데이터만 로드하여 초기 로딩 시간 단축
- **메모리 사용량 감소**: 전체 데이터를 한 번에 메모리에 올리지 않음
- **응답 시간 단축**: 캐싱 메커니즘을 통해 자주 접근하는 데이터 빠르게 제공

### 2. 개발 및 관리 용이성

- **병렬 개발**: 여러 개발자가 서로 다른 급수의 데이터를 동시에 작업 가능
- **데이터 업데이트 간소화**: 특정 급수의 데이터만 업데이트 가능
- **버전 관리 용이**: 각 급수별 파일이 독립적으로 버전 관리됨

### 3. 사용자 경험 개선

- **점진적 로딩**: 필요한 데이터만 순차적으로 로드하여 UX 개선
- **오프라인 지원 가능성**: 더 작은 데이터 세트로 인해 오프라인 캐싱 용이
- **반응성 향상**: 전체 앱의 반응성 개선

## 사용 방법

### 클라이언트에서 데이터 로드하기

```typescript
import { 
  initializeHanjaSystem, 
  getExtendedHanjaById,
  getRelatedCharactersInfo 
} from '@/utils/hanjaPageUtils';

// 시스템 초기화 (자주 사용하는 급수를 미리 로드)
await initializeHanjaSystem();

// ID로 한자 정보 가져오기
const hanja = await getExtendedHanjaById('HJ-15-0001-4E00');

// 관련 한자 정보 가져오기
const relatedHanja = await getRelatedCharactersInfo('HJ-15-0001-4E00');
```

### API 사용하기

```javascript
// 특정 급수의 한자 가져오기
const response = await fetch('/api/hanja/grade?grade=15');
const data = await response.json();

// 특정 한자 가져오기
const response = await fetch('/api/hanja/grade?character=一');
const hanjaData = await response.json();
```

## 주의사항

1. 데이터 변경 시 분리 스크립트를 다시 실행해야 합니다.
2. 급수별 파일은 항상 최신 상태를 유지해야 합니다.
3. 개발 환경과 프로덕션 환경에서 모두 테스트가 필요합니다. 