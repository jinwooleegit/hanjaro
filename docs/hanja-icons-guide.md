# 한자 아이콘 컴포넌트 사용 가이드

이 문서에서는 `HanjaIcon` 컴포넌트를 사용하여 한자 아이콘을 표시하는 방법을 설명합니다.

## 설치 및 준비

1. 한자 아이콘 생성 스크립트 실행:
   ```bash
   npm run generate-icons
   ```

2. 컴포넌트 가져오기:
   ```tsx
   import HanjaIcon from '@/components/HanjaIcon';
   ```

## 기본 사용법

```tsx
// 기본 크기(50px)로 표시
<HanjaIcon hanja="水" />

// 크기 지정
<HanjaIcon hanja="火" size={80} />

// CSS 클래스 추가
<HanjaIcon hanja="木" className="my-custom-class" />
```

## 한자 아이콘 대체 동작

`HanjaIcon` 컴포넌트는 다음과 같은 처리를 합니다:

1. 요청된 한자의 SVG 파일이 있으면 해당 파일을 표시합니다.
2. SVG 파일이 없으면 기본 아이콘과 함께 텍스트로 한자를 표시합니다.

## 커스텀 아이콘 추가

### 수동으로 SVG 파일 생성

`public/images/hanja/` 디렉토리에 SVG 파일을 직접 추가할 수 있습니다. 파일 이름은 한자 문자와 일치해야 합니다 (예: `水.svg`).

### 아이콘 자동 생성 스크립트

`scripts/generate-hanja-icons.js` 파일을 수정하여 더 많은 한자 아이콘을 추가할 수 있습니다:

```js
// 한자 목록에 새 항목 추가
const defaultHanjaList = [
  // 기존 항목...
  { hanja: '龍', meaning: '용 룡', color: '#e6f7ff', textColor: '#1890ff', borderColor: '#4dabf7' },
];
```

그 후 스크립트를 다시 실행하여 새 아이콘을 생성합니다:

```bash
npm run generate-icons
```

## API 안내

### HanjaIcon 컴포넌트

| 속성 | 타입 | 기본값 | 설명 |
|------|------|--------|------|
| hanja | string | (필수) | 표시할 한자 문자 |
| size | number | 50 | 아이콘 크기(픽셀) |
| className | string | '' | 추가 CSS 클래스 |

### 유틸리티 함수

`utils/iconUtils.ts` 파일에는 다음과 같은 유틸리티 함수가 포함되어 있습니다:

- `getHanjaSvgPath(hanja: string)`: 한자 SVG 파일의 경로를 반환합니다.
- `hasHanjaSvg(hanja: string)`: 해당 한자의 SVG 파일이 존재하는지 확인합니다.
- `generateHanjaSvgString(hanja: string, options)`: 한자 문자를 포함한 SVG 문자열을 생성합니다.
- `createHanjaSvgFile(hanja: string, description: string)`: 파일 시스템에 한자 SVG 파일을 생성합니다.

## 예제 페이지

`/hanja-icons` 페이지에서 다양한 한자 아이콘 사용 예제를 확인할 수 있습니다. 