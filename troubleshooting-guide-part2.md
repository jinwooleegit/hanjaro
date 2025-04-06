# 한자로(Hanjaro) 웹 애플리케이션 문제 해결 가이드 (계속)

## 6. 이미지 설정 경고

### 문제
"The "images.domains" configuration is deprecated" 경고가 표시됩니다.

### 원인
Next.js의 이미지 최적화 기능 관련 설정이 변경되었습니다. `images.domains` 설정이 deprecated되었습니다.

### 해결 방법
`next.config.js`에서 `images.domains` 대신 `images.remotePatterns` 사용:

```javascript
module.exports = {
  // 기타 설정...
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '',
        pathname: '/**',
      },
    ],
  },
}
```

## 7. 필순 연습 구현 문제

### 문제
필순 연습 기능이 제대로 작동하지 않습니다.

### 원인
다음과 같은 여러 원인이 있을 수 있습니다:
1. 필순 데이터가 제대로 로드되지 않음
2. 한자 데이터베이스와 필순 정보 간의 연결 문제
3. Canvas 렌더링 관련 이슈
4. 필순 데이터의 형식이 애플리케이션에서 예상하는 형식과 다름

### 해결 방법
1. 필순 데이터 구조 확인 및 수정
   ```javascript
   // 예상되는 필순 데이터 구조
   const strokeData = {
     "水": [
       [115, 212, 118, 162, 125, 115, 135, 75, 150, 40],  // 첫 번째 획의 좌표
       [40, 188, 85, 188, 135, 188, 180, 188, 220, 188]   // 두 번째 획의 좌표
     ]
   };
   ```

2. Canvas 렌더링 코드 검토
   ```javascript
   // Canvas 초기화 및 크기 설정 확인
   const canvas = document.getElementById('strokeCanvas');
   const ctx = canvas.getContext('2d');
   canvas.width = 300;
   canvas.height = 300;
   
   // 필순 데이터가 있는지 확인
   if (!strokeData[hanja]) {
     console.error(`No stroke data for character: ${hanja}`);
     return;
   }
   
   // 필순 그리기 로직
   strokeData[hanja].forEach((stroke, index) => {
     // 그리기 로직...
   });
   ```

3. 필순 데이터 로드 과정 디버깅
   ```javascript
   console.log("필순 데이터 로드 시도:", hanja);
   
   fetch(`/api/strokes/${encodeURIComponent(hanja)}`)
     .then(response => {
       console.log("응답 상태:", response.status);
       return response.json();
     })
     .then(data => {
       console.log("받은 데이터:", data);
       // 처리 로직...
     })
     .catch(error => {
       console.error("필순 데이터 로드 오류:", error);
     });
   ```

4. 서버 API 엔드포인트 확인
   ```javascript
   // pages/api/strokes/[hanja].js
   export default function handler(req, res) {
     const { hanja } = req.query;
     console.log("요청된 한자:", hanja);
     
     try {
       const strokeData = getStrokeData(hanja);
       res.status(200).json(strokeData);
     } catch (error) {
       console.error("획 데이터 처리 오류:", error);
       res.status(500).json({ error: "획 데이터를 찾을 수 없습니다." });
     }
   }
   ```

## 8. 개발 서버 안정성 문제

### 문제
개발 서버가 자주 중단되거나 오류가 발생합니다.

### 원인
파일 시스템 접근 충돌, 메모리 사용량 문제, 캐시 관련 문제, Hot Module Replacement 충돌 등이 원인일 수 있습니다.

### 해결 방법
1. 파일 시스템 접근 충돌 최소화
   ```javascript
   // next.config.js
   module.exports = {
     distDir: '.next-custom', // 기본 .next 대신 사용
     // 기타 설정...
   }
   ```

2. 메모리 사용 최적화
   ```javascript
   // next.config.js
   module.exports = {
     onDemandEntries: {
       maxInactiveAge: 60 * 1000, // 60초
       pagesBufferLength: 5, // 메모리에 유지할 페이지 수 제한
     },
     // 기타 설정...
   }
   ```

3. 캐시 관련 문제 해결
   ```javascript
   // next.config.js
   module.exports = {
     webpack: (config, { dev }) => {
       if (dev) {
         config.cache = false; // 개발 시 웹팩 캐시 비활성화
       }
       return config;
     },
     // 기타 설정...
   }
   ```

4. 정기적인 서버 정리 스크립트
   ```json
   // package.json
   "scripts": {
     "clean": "rimraf .next-custom",
     "kill-node": "taskkill /f /im node.exe",
     "reset": "npm run kill-node && npm run clean",
     "dev": "npm run clean && next dev"
   }
   ```

## 9. URL 인코딩 및 한자 처리

### 문제
URL에 한자가 포함될 때 제대로 처리되는지 확인이 필요합니다.

### 원인
한자와 같은 Unicode 문자는 URL에서 인코딩되어야 합니다. 예를 들어, '水'는 '%E6%B0%B4'로 인코딩됩니다.

### 해결 방법
1. 클라이언트에서 URL 인코딩 적용
   ```javascript
   // 한자 문자를 URL로 변환할 때
   const hanjaUrl = `/learn/hanja/${encodeURIComponent('水')}`;
   ```

2. 서버에서 URL 디코딩 확인
   ```javascript
   // pages/learn/hanja/[hanja].js
   export default function HanjaPage({ hanja }) {
     console.log('디코딩된 한자:', hanja); // '水'
     // ...
   }

   export async function getServerSideProps(context) {
     const { hanja } = context.params;
     console.log('URL 파라미터:', hanja); // URL에서 이미 디코딩된 상태
     
     return {
       props: { hanja },
     };
   }
   ```

3. 링크 컴포넌트에서 처리
   ```jsx
   import Link from 'next/link';

   // Next.js Link 컴포넌트는 자동으로 인코딩 처리
   <Link href={`/learn/hanja/${hanja}`}>
     {hanja}
   </Link>
   ```

## 10. Next.js 버전 호환성 문제

### 문제
프로젝트에서 사용 중인 Next.js 버전(14.2.26)과 관련된 호환성 이슈가 있습니다.

### 원인
버전 업그레이드(14.1.0 → 14.2.26) 과정에서 설정 변경이나 API 변경에 따른 코드 수정이 필요할 수 있습니다.

### 해결 방법
1. 버전별 변경사항 확인
   - [Next.js 릴리스 노트](https://nextjs.org/blog) 참조
   - 주요 변경점과 deprecated API 확인

2. 설정 파일 업데이트
   ```javascript
   // next.config.js
   // images.domains → images.remotePatterns 변경
   module.exports = {
     images: {
       remotePatterns: [
         {
           protocol: 'http',
           hostname: 'localhost',
           pathname: '/**',
         },
       ],
     },
     // 기타 설정...
   }
   ```

3. 의존성 패키지 업데이트
   ```bash
   npm update
   ```

4. TypeScript 타입 정의 업데이트
   ```bash
   npm install @types/react@latest @types/react-dom@latest
   ```

5. 자동 마이그레이션 도구 실행 (제공되는 경우)
   ```bash
   npx @next/codemod@latest new-link
   ``` 