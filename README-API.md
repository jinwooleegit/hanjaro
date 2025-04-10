# 한자 데이터 API 문서

이 문서는 한자 데이터를 활용하기 위한 API 엔드포인트와 사용법을 설명합니다.

## 기본 정보

- 기본 URL: `/api/hanja`
- 응답 형식: JSON
- HTTP 메소드: GET

## 엔드포인트 목록

### 1. 한자 목록 조회

**엔드포인트**: `/api/hanja`

**설명**: 한자 데이터 목록을 조회합니다. 필터링, 정렬, 페이지네이션이 가능합니다.

**쿼리 매개변수**:
- `grade`: 급수별 필터링 (예: `?grade=1`)
- `category`: 카테고리별 필터링 (예: `?category=beginner`)
- `limit`: 결과 제한 (예: `?limit=10`, 기본값: 20)
- `page`: 페이지네이션 (예: `?page=1`, 기본값: 1)
- `sort`: 정렬 기준 (옵션: `grade`, `stroke_count`, `frequency`, `unicode`, 기본값: `grade`)

**응답 예시**:
```json
{
  "success": true,
  "total": 100,
  "page": 1,
  "pageSize": 20,
  "totalPages": 5,
  "data": [
    {
      "id": "HJ-15-0001-4E00",
      "character": "一",
      "unicode": "4E00",
      "grade": 15,
      "category": "beginner",
      "order_in_grade": 1,
      "meaning": "한 일",
      "pronunciation": "일",
      "stroke_count": 1,
      ...
    },
    // 더 많은 한자 데이터
  ]
}
```

### 2. 특정 한자 조회

**엔드포인트**: `/api/hanja/[id]`

**설명**: 특정 한자의 상세 정보를 조회합니다. ID 또는 한자를 직접 사용할 수 있습니다.

**매개변수**:
- `id`: 한자 ID (예: `HJ-15-0001-4E00`) 또는 한자 문자 (예: `一`)

**응답 예시**:
```json
{
  "success": true,
  "data": {
    "id": "HJ-15-0001-4E00",
    "character": "一",
    "unicode": "4E00",
    "grade": 15,
    "category": "beginner",
    "order_in_grade": 1,
    "meaning": "한 일",
    "pronunciation": "일",
    "stroke_count": 1,
    "radical": "一",
    "radical_meaning": "하나",
    "radical_pronunciation": "일",
    "mnemonics": "하나를 의미하는 가장 기본적인 가로획입니다.",
    "examples": [
      {
        "word": "一日",
        "meaning": "하루",
        "pronunciation": "일일"
      },
      // 더 많은 예시
    ],
    "compounds": [...],
    "similar_characters": [...],
    "stroke_order": [...],
    "metadata": {...}
  }
}
```

### 3. 급수 정보 조회

**엔드포인트**: `/api/hanja/grades`

**설명**: 모든 한자 급수 정보를 조회합니다.

**쿼리 매개변수**:
- `category`: 카테고리별 필터링 (예: `?category=beginner`)

**응답 예시**:
```json
{
  "success": true,
  "total": 15,
  "data": [
    {
      "grade": 15,
      "name": "15급",
      "description": "초등학교 1학년 수준의 기초 한자",
      "category": "beginner",
      "character_count": 30,
      "metadata": {...}
    },
    // 더 많은 급수 데이터
  ]
}
```

### 4. 한자 검색

**엔드포인트**: `/api/hanja/search`

**설명**: 한자, 의미, 발음으로 한자를 검색합니다.

**쿼리 매개변수**:
- `q`: 검색어 (필수)
- `type`: 검색 유형 (`character`, `meaning`, `pronunciation`, `all`, 기본값: `all`)
- `limit`: 결과 제한 (예: `?limit=10`, 기본값: 20)
- `page`: 페이지네이션 (예: `?page=1`, 기본값: 1)

**응답 예시**:
```json
{
  "success": true,
  "query": "하늘",
  "type": "meaning",
  "total": 5,
  "page": 1,
  "pageSize": 20,
  "totalPages": 1,
  "data": [
    {
      "id": "HJ-12-0023-5929",
      "character": "天",
      "meaning": "하늘 천",
      "pronunciation": "천",
      ...
    },
    // 더 많은 검색 결과
  ]
}
```

### 5. 데이터베이스 통계

**엔드포인트**: `/api/hanja/stats`

**설명**: 한자 데이터베이스의 통계 정보를 제공합니다.

**응답 예시**:
```json
{
  "success": true,
  "data": {
    "total_characters": 5000,
    "by_grade": {
      "1": 3500,
      "2": 2400,
      ...
    },
    "by_category": {
      "beginner": 200,
      "intermediate": 700,
      "advanced": 1600,
      "expert": 3500
    },
    "by_stroke_count": {
      "1": 10,
      "2": 23,
      ...
    },
    "completion_rates": {
      "radical_meaning": {
        "count": 4500,
        "total": 5000,
        "percentage": 90
      },
      ...
    },
    "grade_categories": {
      "beginner": {
        "count": 5,
        "grades": [11, 12, 13, 14, 15]
      },
      ...
    },
    "last_updated": "2023-08-15T12:34:56Z"
  }
}
```

## 오류 응답

오류가 발생할 경우 다음과 같은 형식의 응답이 반환됩니다:

```json
{
  "error": "Error message",
  "message": "Detailed error information"
}
```

## 상태 코드

- 200: 성공
- 400: 잘못된 요청 (매개변수 누락 등)
- 404: 리소스를 찾을 수 없음
- 405: 허용되지 않는 메소드
- 500: 서버 오류

## 예제 사용법

### curl 예제

```bash
# 모든 한자 조회
curl http://localhost:3000/api/hanja

# 특정 급수의 한자 조회
curl http://localhost:3000/api/hanja?grade=15

# 특정 한자 상세 정보 조회
curl http://localhost:3000/api/hanja/HJ-15-0001-4E00
curl http://localhost:3000/api/hanja/一

# 한자 검색
curl http://localhost:3000/api/hanja/search?q=하늘&type=meaning

# 통계 정보 조회
curl http://localhost:3000/api/hanja/stats
```

### JavaScript 예제

```javascript
// 한자 목록 가져오기
async function getHanjaList() {
  const response = await fetch('/api/hanja?limit=10&page=1');
  const data = await response.json();
  return data;
}

// 한자 검색하기
async function searchHanja(query) {
  const response = await fetch(`/api/hanja/search?q=${encodeURIComponent(query)}`);
  const data = await response.json();
  return data;
}
``` 