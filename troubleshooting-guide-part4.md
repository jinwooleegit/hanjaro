# 한자로(Hanjaro) 웹 애플리케이션 문제 해결 가이드 (계속)

## 16. 서버 포트 충돌

### 문제
"Error: listen EADDRINUSE: address already in use" 오류가 발생합니다.

### 원인
시도하는 포트(3009)가 이미 다른 프로세스에 의해 사용 중일 때 발생합니다. 서버를 종료한 후에도 포트가 즉시 해제되지 않거나, 백그라운드에서 Node.js 프로세스가 계속 실행 중일 수 있습니다.

### 해결 방법
1. 모든 Node.js 프로세스 종료
   ```bash
   # Windows
   taskkill /f /im node.exe
   
   # Linux/Mac
   pkill -f node
   ```

2. 다른 포트 사용
   ```bash
   npx next dev -p 3010
   ```

3. 사용 중인 포트 확인 및 종료
   ```bash
   # Windows에서 포트 3009를 사용 중인 프로세스 찾기
   netstat -ano | findstr :3009
   
   # 해당 PID의 프로세스 종료
   taskkill /F /PID <PID>
   ```

4. 동적 포트 할당 스크립트
   ```javascript
   // scripts/find-port.js
   const net = require('net');
   
   function findAvailablePort(startPort, callback) {
     const server = net.createServer();
     
     server.once('error', (err) => {
       if (err.code === 'EADDRINUSE') {
         findAvailablePort(startPort + 1, callback);
       }
     });
     
     server.once('listening', () => {
       const port = server.address().port;
       server.close(() => {
         callback(port);
       });
     });
     
     server.listen(startPort);
   }
   
   findAvailablePort(3000, (port) => {
     console.log(`Available port: ${port}`);
     process.exit(0);
   });
   ```

## 17. Next.js 버전 업그레이드 후 문제

### 문제
Next.js 버전이 14.1.0에서 14.2.26으로 변경된 후 호환성 문제가 발생할 수 있습니다.

### 원인
마이너 버전 업그레이드는 대부분 하위 호환성을 유지하지만, 잠재적인 문제가 발생할 수 있습니다.

### 해결 방법
1. 마이그레이션 가이드 확인
   - [Next.js 공식 문서](https://nextjs.org/docs/app/building-your-application/upgrading) 참조
   - 버전별 변경 사항 파악

2. 설정 및 API 변경 사항 적용
   ```javascript
   // next.config.js
   module.exports = {
     // images.domains → images.remotePatterns 변경
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
   npm install react@latest react-dom@latest
   ```

4. TypeScript 타입 확인
   ```bash
   npx tsc --noEmit
   ```

5. 마이그레이션 관련 변경 사항을 별도 브랜치에서 처리
   ```bash
   git checkout -b upgrade-nextjs
   # 변경 사항 적용 후
   git commit -m "Upgrade Next.js to 14.2.26"
   ```

## 18. 페이지 로드 시간 최적화

### 문제
"GET / 200 in 11369ms" 와 같이 페이지 로드 시간이 너무 깁니다.

### 원인
데이터베이스 로딩 지연, 서버 사이드 렌더링 부하, 클라이언트 측 JavaScript 크기 등이 원인일 수 있습니다.

### 해결 방법
1. 데이터 구조 최적화
   ```javascript
   // 레벨별로 데이터 파일 분리
   // data/level1.json, data/level2.json, ...
   
   export async function getHanjaByLevel(level) {
     // 필요한 레벨의 데이터만 로드
     const data = await import(`../data/level${level}.json`);
     return data;
   }
   ```

2. 정적 생성(SSG) 활용
   ```javascript
   // pages/learn/level/[level].js
   export async function getStaticProps({ params }) {
     const { level } = params;
     const levelData = await getHanjaByLevel(level);
     
     return {
       props: {
         levelData,
       },
       // 1시간마다 재생성 (ISR)
       revalidate: 3600,
     };
   }
   
   export async function getStaticPaths() {
     return {
       paths: [
         { params: { level: '1' } },
         { params: { level: '2' } },
         // 주요 레벨만 사전 생성
       ],
       fallback: 'blocking', // 나머지는 최초 요청 시 생성
     };
   }
   ```

3. 코드 분할 최적화
   ```jsx
   // 페이지 컴포넌트에서 동적 임포트
   import dynamic from 'next/dynamic';
   
   const HanjaStrokeViewer = dynamic(
     () => import('../components/HanjaStrokeViewer'),
     { 
       loading: () => <p>획순 뷰어 로딩 중...</p>,
       ssr: false // 클라이언트 측에서만 로드
     }
   );
   ```

4. 이미지 최적화
   ```jsx
   import Image from 'next/image';
   
   function HanjaImage({ hanja }) {
     return (
       <div className="hanja-image-container">
         <Image
           src={`/images/hanja/${hanja}.svg`}
           alt={hanja}
           width={200}
           height={200}
           priority={false} // 뷰포트에 들어올 때만 로드
           loading="lazy"
         />
       </div>
     );
   }
   ```

5. 웹팩 번들 분석 및 최적화
   ```bash
   # 번들 분석 도구 설치
   npm install --save-dev @next/bundle-analyzer
   ```
   
   ```javascript
   // next.config.js
   const withBundleAnalyzer = require('@next/bundle-analyzer')({
     enabled: process.env.ANALYZE === 'true',
   });
   
   module.exports = withBundleAnalyzer({
     // 기존 설정...
   });
   ```
   
   ```bash
   # 번들 분석 실행
   ANALYZE=true npm run build
   ```

## 19. 중복 오류 로그 방지

### 문제
같은 오류 메시지가 여러 번 반복됩니다.

### 원인
오류 처리가 여러 컴포넌트나 함수에서 중복되거나, 재시도 로직이 적절히 구현되지 않아 발생합니다.

### 해결 방법
1. 오류 처리 미들웨어 구현
   ```javascript
   // utils/errorHandler.js
   const errorCache = new Set();
   
   export function logError(error, context = '') {
     const errorKey = `${error.message}-${context}`;
     
     // 동일한 오류 중복 방지
     if (errorCache.has(errorKey)) {
       return;
     }
     
     console.error(`[${context}] ${error.message}`);
     errorCache.add(errorKey);
     
     // 캐시 크기 제한
     if (errorCache.size > 100) {
       const firstItem = errorCache.values().next().value;
       errorCache.delete(firstItem);
     }
   }
   ```

2. Winston 로깅 라이브러리 사용
   ```bash
   npm install winston
   ```
   
   ```javascript
   // logger.js
   import winston from 'winston';
   
   const logger = winston.createLogger({
     level: 'info',
     format: winston.format.combine(
       winston.format.timestamp(),
       winston.format.json()
     ),
     defaultMeta: { service: 'hanjaro-app' },
     transports: [
       new winston.transports.File({ filename: 'error.log', level: 'error' }),
       new winston.transports.File({ filename: 'combined.log' }),
     ],
   });
   
   // 개발 환경에서는 콘솔에도 출력
   if (process.env.NODE_ENV !== 'production') {
     logger.add(new winston.transports.Console({
       format: winston.format.simple(),
     }));
   }
   
   export default logger;
   ```

3. Next.js 에러 핸들링 커스터마이즈
   ```javascript
   // pages/_error.js
   import ErrorPage from 'next/error';
   import { logError } from '../utils/errorHandler';
   
   function CustomErrorPage({ statusCode, hasGetInitialPropsRun, err }) {
     if (!hasGetInitialPropsRun && err) {
       logError(err, 'ErrorPage');
     }
     
     return <ErrorPage statusCode={statusCode} />;
   }
   
   CustomErrorPage.getInitialProps = async ({ res, err, asPath }) => {
     const errorInitialProps = await ErrorPage.getInitialProps({ res, err });
     
     errorInitialProps.hasGetInitialPropsRun = true;
     
     if (err) {
       logError(err, `ErrorPage - ${asPath}`);
     }
     
     return errorInitialProps;
   };
   
   export default CustomErrorPage;
   ```

4. 글로벌 에러 바운더리
   ```jsx
   // components/ErrorBoundary.js
   import { Component } from 'react';
   import { logError } from '../utils/errorHandler';
   
   class ErrorBoundary extends Component {
     constructor(props) {
       super(props);
       this.state = { hasError: false, error: null };
     }
     
     static getDerivedStateFromError(error) {
       return { hasError: true, error };
     }
     
     componentDidCatch(error, errorInfo) {
       logError(error, `ErrorBoundary - ${this.props.id || 'unknown'}`);
     }
     
     render() {
       if (this.state.hasError) {
         return this.props.fallback || <div>문제가 발생했습니다.</div>;
       }
       
       return this.props.children;
     }
   }
   
   export default ErrorBoundary;
   ```

## 20. 보안 취약점 관리

### 문제
npm 패키지 취약점으로 인한 보안 문제가 발생할 수 있습니다.

### 원인
오래된 패키지나 알려진 취약점이 있는 패키지를 사용하는 경우 보안 위험이 있습니다.

### 해결 방법
1. 정기적인 취약점 검사
   ```bash
   npm audit
   ```

2. 자동 취약점 수정
   ```bash
   npm audit fix
   
   # 주요 버전 업그레이드 포함 수정
   npm audit fix --force
   ```

3. Dependabot 설정
   ```yaml
   # .github/dependabot.yml
   version: 2
   updates:
     - package-ecosystem: "npm"
       directory: "/"
       schedule:
         interval: "weekly"
       open-pull-requests-limit: 10
   ```

4. 보안 강화 헤더 설정
   ```javascript
   // next.config.js
   module.exports = {
     async headers() {
       return [
         {
           source: '/(.*)',
           headers: [
             {
               key: 'X-Content-Type-Options',
               value: 'nosniff',
             },
             {
               key: 'X-Frame-Options',
               value: 'DENY',
             },
             {
               key: 'X-XSS-Protection',
               value: '1; mode=block',
             },
           ],
         },
       ];
     },
     // 기타 설정...
   };
   ```

5. Content Security Policy 설정
   ```javascript
   // pages/_document.js
   import Document, { Html, Head, Main, NextScript } from 'next/document';
   
   class MyDocument extends Document {
     render() {
       return (
         <Html>
           <Head>
             <meta
               httpEquiv="Content-Security-Policy"
               content="default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'"
             />
           </Head>
           <body>
             <Main />
             <NextScript />
           </body>
         </Html>
       );
     }
   }
   
   export default MyDocument;
   ``` 