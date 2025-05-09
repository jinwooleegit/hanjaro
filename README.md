# 한자 획순 학습 프로그램 (Hanja Stroke Order Learning Program)

이 프로그램은 Python의 Turtle 그래픽을 사용하여 한자의 획순을 시각적으로 학습하도록 도와주는 프로그램입니다.

## 데모 및 웹 애플리케이션

실제 작동하는 웹 애플리케이션은 다음 링크에서 확인하실 수 있습니다:
- **웹 애플리케이션**: [https://hanjaro.vercel.app](https://hanjaro.vercel.app)
- **GitHub 저장소**: [https://github.com/jinwooleegit/hanjaro](https://github.com/jinwooleegit/hanjaro)

웹 애플리케이션에서는 다음과 같은 기능을 제공합니다:
- 레벨별 한자 학습 및 연습
- 한자 획순 애니메이션 시연
- 필기 연습 및 평가
- 한자 퀴즈

## 특징

- **한자 획순 시각화**: 각 한자의 획순을 순차적으로 보여줌
- **연습 모드**: 같은 한자를 반복해서 획순 연습 가능
- **퀴즈 모드**: 한자의 총 획수를 맞추는 퀴즈 제공
- **다크 모드**: 어두운 배경에서 사용 가능한 화면 모드 지원
- **명령줄 또는 대화형 인터페이스**: 사용자 선호에 따라 선택 가능

## 시스템 요구사항

- Python 3.6 이상
- Turtle 모듈 (Python 기본 제공)
- PIL/Pillow 라이브러리 (SVG 버전용)
- Tkinter (SVG 버전용)

## 설치 방법

```bash
pip install Pillow  # SVG 버전 사용 시 필요
```

## 사용 방법

### 기본 사용법

```bash
python main.py 永  # '永' 한자의 획순을 표시
```

### SVG 경로 기반 향상된 버전 (새로 추가됨)

자연스러운 붓글씨 효과를 위해 SVG 경로와 베지어 곡선을 활용한 향상된 버전이 추가되었습니다:

```bash
python svg_hanja_drawer.py 永  # SVG 경로 기반으로 '永' 한자의 획순을 표시
```

### 기존 향상된 기능들

```bash
python enhanced_hanja_drawer.py 永  # 향상된 기능으로 '永' 한자의 획순을 표시
python enhanced_hanja_drawer.py  # 대화형 모드로 실행 (한자 선택 가능)
python enhanced_hanja_drawer.py 水 --practice --count 5  # '水' 한자를 5회 반복 연습
python enhanced_hanja_drawer.py --quiz --count 10  # 10문제의 한자 획수 퀴즈
python enhanced_hanja_drawer.py 火 --dark  # 다크 모드에서 '火' 한자 표시
```

## 명령줄 옵션

- `character`: 표시할 한자 (예: 永, 雨, 火, 水, 山)
- `--practice`: 연습 모드 활성화
- `--count`: 연습 또는 퀴즈 반복 횟수
- `--quiz`: 퀴즈 모드 활성화
- `--dark`: 다크 모드 활성화

## SVG 기반 버전의 개선 사항 (NEW)

SVG 경로와 베지어 곡선을 활용한 새 버전에서는 다음과 같은 개선 사항이 있습니다:

1. **자연스러운 붓글씨 효과**: 직선 대신 베지어 곡선을 사용하여 더 자연스러운 필체 표현
2. **획 압력 변화**: 획의 시작과 끝에서 두께가 변하도록 하여 실제 붓글씨와 유사한 효과 구현
3. **부드러운 획 연결**: 곡선을 사용하여 한자의 획이 자연스럽게 연결되도록 개선
4. **높은 정확도**: 실제 서예의 획 형태에 더 가깝게 표현

## 예시

```bash
python svg_hanja_drawer.py 永  # '永(영원할 영)' 한자 표시
python svg_hanja_drawer.py 水  # '水(물 수)' 한자 표시
python svg_hanja_drawer.py --nodelay  # 애니메이션 없이 즉시 표시
```

## 한자 데이터 확장

`hanja_strokes.json` 파일을 편집하여 더 많은 한자를 추가할 수 있습니다:

```json
{
  "新한자": {
    "meaning": "한자의 뜻",
    "strokes": [
      {
        "path": "M x1 y1 C x2 y2 x3 y3 x4 y4",
        "desc": "획 설명",
        "strokeLinecap": "round",
        "strokeWidth": "2.5"
      },
      // 추가 획 정보...
    ],
    "stroke_count": 획수
  }
}
```

## 참고

'永(영원할 영)' 한자는 한자 서예에서 기본이 되는 8개의 기본 획을 모두 포함하고 있어, 붓글씨 연습의 기초로 자주 사용됩니다. 
이 프로그램은 다양한 한자의 획순을 시각적으로 학습하는 데 도움을 주며, 앞으로 더 많은 한자 데이터를 추가할 예정입니다.

## 라이센스

이 프로젝트는 크리에이티브 커먼즈 저작자표시-비영리 4.0 국제 라이선스(CC BY-NC 4.0)에 따라 배포됩니다. 이 라이선스는 다음과 같은 조건을 포함합니다:

- **저작자표시(BY)**: 원본 저작물의 크레딧을 적절하게 표시해야 합니다.
- **비영리(NC)**: 이 프로젝트는 상업적 목적으로 사용할 수 없습니다.

자세한 라이선스 정보는 [LICENSE](./LICENSE) 파일을 참조하세요.

## 성능 최적화 및 데이터 관리

프로젝트의 성능을 최적화하기 위해 한자 데이터를 급수별로 분리했습니다. 자세한 내용은 [급수별 한자 데이터 시스템](./README-GRADED-DATA.md) 문서를 참조하세요.

### 주요 기능

- 급수별로 분리된 한자 데이터 로딩
- 효율적인 캐싱 메커니즘
- 필요한 데이터만 로드하여 메모리 사용량 감소
- API 기반의 데이터 접근 방식

### 데이터 구조

```
data/
└── new-structure/
    └── characters/
        ├── hanja_extended.json     # 전체 한자 데이터
        ├── hanja_characters.json   # 기본 한자 정보
        └── by-grade/               # 급수별 데이터
            ├── grade_15.json       # 15급 한자
            ├── grade_14.json       # 14급 한자
            └── ...
```

### 개발 가이드

1. **데이터 접근하기**

```typescript
// 특정 한자 ID로 데이터 가져오기
import { getExtendedHanjaById } from '@/utils/hanjaPageUtils';
const hanjaData = await getExtendedHanjaById('HJ-15-0001-4E00');

// 특정 급수의 모든 한자 가져오기
import { getHanjaByGrade } from '@/utils/gradeBasedHanjaUtils';
const allGrade15Hanja = await getHanjaByGrade(15);
```

2. **API 사용하기**

```typescript
// 특정 한자 가져오기
const response = await fetch('/api/hanja/grade?character=一');
const hanjaData = await response.json();

// 특정 급수의 모든 한자 가져오기
const response = await fetch('/api/hanja/grade?grade=15');
const data = await response.json();
```

### 중요 사항

1. 한자 데이터를 추가하거나 수정할 때는 `data/new-structure/characters/by-grade/split_by_grade.js` 스크립트를 실행하여 급수별 파일을 업데이트해야 합니다.

2. Next.js 프로젝트에서 dynamic routes를 사용할 때 같은 경로에서 다양한 slug 이름을 사용하면 안 됩니다. 모든 경로에서 일관된 slug 이름을 사용하세요.

   예시: `/app/hanja/[id]`와 `/app/learn/hanja/[character]`는 다른 경로에 있어 괜찮지만, 같은 경로 내에서 `[id]`와 `[character]`를 혼용하면 안 됩니다.
