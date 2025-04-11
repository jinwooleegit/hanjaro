# 한자 데이터베이스 구축 스크립트

이 디렉토리에는 한자 데이터베이스 구축을 위한 다양한 스크립트가 포함되어 있습니다. 이 스크립트들은 15급에서 1급까지의 한자 데이터를 체계적으로 관리하고 확장하는 데 사용됩니다.

## 개요

한자 데이터베이스는 다음과 같은 급수 체계로 구성됩니다:

- **초급 (15-11급)**: 약 500자의 기초 한자
- **중급 (10-6급)**: 약 700자의 중급 한자
- **고급 (5-3급)**: 약 1,600자의 고급 한자
- **전문가 (2-1급)**: 약 5,900자의 전문가 수준 한자

## 데이터 구조

데이터는 `/data/new-structure/characters/by-grade/` 디렉토리에 급수별로 저장됩니다. 각 파일(`grade_XX.json`)은 다음과 같은 구조를 가집니다:

```json
{
  "metadata": {
    "version": "1.0.0",
    "last_updated": "2025-04-11T06:44:56.690Z",
    "grade": 15,
    "total_characters": 55
  },
  "characters": [
    {
      "id": "HJ-15-0001-4E00",
      "character": "一",
      "unicode": "4E00",
      "meaning": "한 일",
      "pronunciation": "일",
      "stroke_count": 1,
      "radical": "一",
      "grade": 15,
      "order": 1,
      "tags": [],
      "extended_data": {
        ...
      }
    }
  ]
}
```

## 제공되는 스크립트

### 1. 통합 관리 스크립트

- `build_all_grades.js`: 모든 급수의 한자 데이터 구축을 관리하는 통합 스크립트

```bash
node scripts/build_all_grades.js
```

### 2. 급수별 구축 스크립트

- `build_intermediate_grades.js`: 중급 한자(10-6급) 데이터 구축
- `build_advanced_grades.js`: 고급 한자(5-3급) 데이터 구축
- `build_grade_9.js`: 9급 한자 데이터만 구축

```bash
# 중급 한자 구축
node scripts/build_intermediate_grades.js

# 고급 한자 구축
node scripts/build_advanced_grades.js

# 9급 한자만 구축
node scripts/build_grade_9.js
```

### 3. 통계 생성 스크립트

- `generate_grade_stats.js`: 전체 한자 데이터의 통계를 생성하고 분석

```bash
node scripts/generate_grade_stats.js
```

## 사용 방법

### 단계별 구축 과정

1. **초기 설정 및 분석**:
   ```bash
   node scripts/generate_grade_stats.js
   ```
   이 명령은 현재 데이터베이스 상태를 분석하고 통계를 생성합니다.

2. **중급 한자 데이터 구축**:
   ```bash
   node scripts/build_intermediate_grades.js
   ```
   이 명령은 중급 한자(10-6급) 데이터를 구축합니다.

3. **고급 한자 데이터 구축**:
   ```bash
   node scripts/build_advanced_grades.js
   ```
   이 명령은 고급 한자(5-3급) 데이터를 구축합니다.

4. **통합 실행**:
   ```bash
   node scripts/build_all_grades.js
   ```
   이 명령은 모든 단계를 자동으로 실행하고 결과를 요약합니다.

## 데이터 확장 및 유지보수

한자 데이터는 지속적으로 확장하고 개선할 수 있습니다:

1. 각 급수의 데이터 파일을 열고 한자의 상세 정보를 추가하거나 수정
2. 외부 데이터 소스에서 정보를 수집하여 데이터베이스 보강
3. 통계 스크립트를 실행하여 데이터 품질 모니터링

## 주의 사항

- 스크립트 실행 시 기존 데이터가 변경될 수 있으니 주요 작업 전에 백업을 권장합니다.
- 실행 환경의 Node.js 버전은 12 이상이어야 합니다.
- 대용량 데이터 처리 시 메모리 제한에 주의하세요.

## 문제 해결

스크립트 실행 중 오류가 발생할 경우:

1. 필요한 디렉토리가 존재하는지 확인
2. 파일 권한이 적절한지 확인
3. JSON 파일 형식이 올바른지 확인
4. Node.js 버전이 최신인지 확인

문제가 지속되면 개발팀에 문의하세요. 