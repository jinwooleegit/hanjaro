# 한자 데이터 파일 구조

## 개요
이 디렉토리는 모든 개별 한자에 대한 상세 정보를 포함하는 JSON 파일을 저장합니다. 각 파일은 단일 한자에 대한 모든 정보를 담고 있으며, 파일명은 고유 ID를 기반으로 합니다.

## 파일명 형식
파일명 형식은 다음과 같습니다: `HJ-{급수}-{순번}-{유니코드}.json`

- `HJ`: 한자로(Hanjaro) 프로젝트 식별자
- `{급수}`: 해당 한자의 급수 (01~15)
- `{순번}`: 해당 급수 내 순번 (0001부터 시작)
- `{유니코드}`: 한자의 유니코드 값 (대문자 16진수)

예: `HJ-15-0001-4E00.json` (一 한자 데이터)

## 데이터 구조
각 한자 데이터 파일은 다음과 같은 구조를 가집니다:

```json
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
  "radical": "一",
  "radical_meaning": "하나",
  "radical_pronunciation": "일",
  "mnemonics": "하나를 표현하는 가장 기본적인 가로획 하나입니다.",
  "examples": [
    {
      "word": "一日",
      "meaning": "하루",
      "pronunciation": "일일",
      "example_sentence": "一日 세 끼를 먹습니다.",
      "hanja_level": 15
    },
    {
      "word": "一年",
      "meaning": "일 년",
      "pronunciation": "일년",
      "example_sentence": "一年에 열두 달이 있습니다.",
      "hanja_level": 15
    }
  ],
  "compounds": [
    {
      "id": "HJ-15-0004-56DB",
      "character": "四",
      "relationship": "semantic"
    },
    {
      "id": "HJ-14-0023-5929",
      "character": "天",
      "relationship": "component"
    }
  ],
  "similar_characters": [
    {
      "id": "HJ-15-0002-4E8C",
      "character": "二",
      "similarity_type": "visual"
    }
  ],
  "stroke_order": [
    [{"x": 0, "y": 50}, {"x": 100, "y": 50}]
  ],
  "audio_url": "/audio/一.mp3",
  "image_url": "/images/一.svg",
  "metadata": {
    "version": "1.0.0",
    "last_updated": "2023-10-25T12:34:56Z",
    "source": "Hanjaro Original",
    "validated": true
  }
}
```

## 필드 설명

- `id`: 한자의 고유 식별자
- `character`: 한자 문자
- `unicode`: 유니코드 값 (16진수)
- `grade`: 한자 급수 (1-15)
- `category`: 카테고리 (beginner, intermediate, advanced, expert)
- `order_in_grade`: 해당 급수 내 순서
- `meaning`: 뜻
- `pronunciation`: 음독
- `stroke_count`: 획수
- `radical`: 부수
- `radical_meaning`: 부수의 의미
- `radical_pronunciation`: 부수의 발음
- `mnemonics`: 기억법
- `examples`: 예문 목록
- `compounds`: 복합어 목록
- `similar_characters`: 유사 한자 목록
- `stroke_order`: 획순 데이터
- `audio_url`: 발음 오디오 파일 경로
- `image_url`: 한자 이미지 파일 경로
- `metadata`: 메타데이터 정보

## 업데이트 지침
1. 모든 파일은 UTF-8 인코딩을 사용합니다.
2. JSON 형식을 엄격히 준수해야 합니다.
3. 데이터 업데이트 시 metadata.last_updated 필드를 갱신합니다.
4. 새로운 한자 추가 시 다른 한자와의 관계도 함께 업데이트합니다. 