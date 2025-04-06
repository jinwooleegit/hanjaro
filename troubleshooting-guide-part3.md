# 한자로(Hanjaro) 웹 애플리케이션 문제 해결 가이드 (추가)

## 11. 실수로 인한 성능 저하

### 문제
URL 디코딩 로그가 반복적으로 출력되는 문제가 있습니다.

### 원인
같은 URL 디코딩 작업(`/learn/hanja/%E6%B0%B4 -> /learn/hanja/水`)이 60회 이상 연속으로 반복되는 것을 확인할 수 있습니다. 이는 디코딩 함수가 루프 내에서 불필요하게 호출되거나, 컴포넌트가 과도하게 리렌더링되고 있음을 의미합니다.

### 해결 방법
1. 불필요한 렌더링 방지
   ```jsx
   // 메모이제이션 사용
   import { useMemo, useCallback } from 'react';
   
   function HanjaComponent({ hanjaUrl }) {
     // 디코딩 결과 메모이제이션
     const decodedHanja = useMemo(() => {
       console.log('한자 디코딩 실행');
       return decodeURIComponent(hanjaUrl.split('/').pop());
     }, [hanjaUrl]);
     
     // 이벤트 핸들러 메모이제이션
     const handleClick = useCallback(() => {
       console.log(`선택된 한자: ${decodedHanja}`);
     }, [decodedHanja]);
     
     return (
       <div onClick={handleClick}>{decodedHanja}</div>
     );
   }
   ```

2. 디버깅 로그 최적화
   ```javascript
   // 개발 모드에서만 로그 출력
   if (process.env.NODE_ENV === 'development') {
     console.log(`디코딩: ${encodedUrl} -> ${decodedUrl}`);
   }
   ```

3. 로깅 레벨 조정
   ```javascript
   // next.config.js
   module.exports = {
     // 기타 설정...
     webpack: (config, { dev }) => {
       if (!dev) {
         // 프로덕션 모드에서 로그 레벨 조정
         config.optimization.minimizer.forEach((plugin) => {
           if (plugin.constructor.name === 'TerserPlugin') {
             plugin.options.terserOptions.compress.drop_console = true;
           }
         });
       }
       return config;
     },
   }
   ```

## 12. 데이터베이스 로드 반복

### 문제
"데이터베이스 로드 완료" 메시지가 여러 번 출력됩니다.

### 원인
데이터베이스를 로드하는 함수가 여러 컴포넌트에서 중복 호출되고 있습니다. 이로 인해 같은 데이터를 반복적으로 파싱하게 되어 메모리 사용량이 증가하고 앱의 응답성이 저하됩니다.

### 해결 방법
1. 데이터 로딩 중앙화
   ```javascript
   // utils/database.js
   let databaseCache = null;
   
   export async function loadDatabase() {
     if (databaseCache) {
       console.log('캐시된 데이터베이스 사용');
       return databaseCache;
     }
     
     console.log('데이터베이스 로드 시작');
     try {
       const data = await fetch('/api/hanja-database').then(r => r.json());
       console.log(`데이터베이스 로드 완료: ${Object.keys(data).length} 레벨 발견`);
       databaseCache = data;
       return data;
     } catch (error) {
       console.error('데이터베이스 로드 실패:', error);
       throw error;
     }
   }
   ```

2. Context API 사용
   ```jsx
   // contexts/DatabaseContext.js
   import { createContext, useContext, useState, useEffect } from 'react';
   import { loadDatabase } from '../utils/database';
   
   const DatabaseContext = createContext();
   
   export function DatabaseProvider({ children }) {
     const [database, setDatabase] = useState(null);
     const [loading, setLoading] = useState(true);
     const [error, setError] = useState(null);
     
     useEffect(() => {
       loadDatabase()
         .then(data => {
           setDatabase(data);
           setLoading(false);
         })
         .catch(err => {
           setError(err);
           setLoading(false);
         });
     }, []);
     
     return (
       <DatabaseContext.Provider value={{ database, loading, error }}>
         {children}
       </DatabaseContext.Provider>
     );
   }
   
   export function useDatabase() {
     return useContext(DatabaseContext);
   }
   ```

3. 앱 진입점에서 Provider 설정
   ```jsx
   // pages/_app.js
   import { DatabaseProvider } from '../contexts/DatabaseContext';
   
   function MyApp({ Component, pageProps }) {
     return (
       <DatabaseProvider>
         <Component {...pageProps} />
       </DatabaseProvider>
     );
   }
   
   export default MyApp;
   ```

4. 컴포넌트에서 데이터 사용
   ```jsx
   import { useDatabase } from '../contexts/DatabaseContext';
   
   function HanjaList() {
     const { database, loading, error } = useDatabase();
     
     if (loading) return <div>로딩 중...</div>;
     if (error) return <div>오류: {error.message}</div>;
     
     // 데이터 사용
     return (
       <div>
         {database.level1.characters.map(hanja => (
           <div key={hanja.char}>{hanja.char} - {hanja.meaning}</div>
         ))}
       </div>
     );
   }
   ```

## 13. 서버 재시작 이슈

### 문제
"Found a change in next.config.js. Restarting the server" 메시지가 표시되는 경우가 많습니다.

### 원인
`next.config.js` 파일이 변경될 때마다 서버가 자동으로 재시작됩니다. 이는 Next.js의 정상적인 동작이지만, 빈번한 설정 변경은 개발 경험에 부정적인 영향을 미칠 수 있습니다.

### 해결 방법
1. 설정 파일 변경 최소화
   - 개발 중에는 설정 파일을 자주 변경하지 않도록 합니다.
   - 여러 변경 사항을 한 번에 적용합니다.

2. 개발 서버 시작 옵션 최적화
   ```bash
   # 빠른 재시작을 위한 옵션
   npx next dev --turbo
   ```

3. 설정 테스트를 위한 분리된 설정 파일 사용
   ```javascript
   // next.config.test.js (테스트용 설정)
   const baseConfig = require('./next.config.base.js');
   
   module.exports = {
     ...baseConfig,
     // 테스트용 설정 추가
   };
   ```

4. 설정 파일 안정화 후 개발
   - 설정 파일을 최종적으로 안정화한 후에 실제 개발 작업 진행
   - 설정 변경이 필요한 경우 별도 브랜치에서 처리

## 14. TypeScript 설정 자동 변경

### 문제
"We detected TypeScript in your project and reconfigured your tsconfig.json file" 메시지가 표시됩니다.

### 원인
Next.js는 TypeScript 프로젝트를 감지하면 `tsconfig.json` 파일을 자동으로 수정합니다. 특히 `.next-custom/types/**/*.ts`가 `include` 필드에 추가됩니다.

### 해결 방법
1. 설정 충돌 방지
   ```json
   // tsconfig.json
   {
     "compilerOptions": {
       "target": "es5",
       "lib": ["dom", "dom.iterable", "esnext"],
       "strict": true,
       // 기타 설정...
     },
     "include": [
       "next-env.d.ts",
       "**/*.ts",
       "**/*.tsx",
       ".next-custom/types/**/*.ts"
     ],
     "exclude": ["node_modules"]
   }
   ```

2. 타입 체크 엄격화
   ```json
   // tsconfig.json
   {
     "compilerOptions": {
       "strict": true,
       "noImplicitAny": true,
       "strictNullChecks": true,
       "strictFunctionTypes": true,
       "strictBindCallApply": true,
       "strictPropertyInitialization": true,
       "noImplicitThis": true,
       "alwaysStrict": true,
       // 기타 설정...
     }
   }
   ```

3. Next.js 타입 정의 확인
   ```bash
   # 타입 정의 설치
   npm install --save-dev @types/react @types/node
   ```

## 15. Fast Refresh 이슈

### 문제
"Fast Refresh had to perform a full reload" 경고가 나타납니다.

### 원인
Next.js의 Fast Refresh 기능이 코드 변경을 증분적으로 적용할 수 없어 전체 페이지를 새로 고쳐야 할 때 발생합니다.

### 해결 방법
1. 컴포넌트 구조 최적화
   ```jsx
   // 좋은 예: 함수 컴포넌트 내부에 로직 유지
   function MyComponent() {
     const [state, setState] = useState(0);
     
     // 이벤트 핸들러를 컴포넌트 내부에 정의
     const handleClick = () => setState(state + 1);
     
     return <button onClick={handleClick}>Click me ({state})</button>;
   }
   ```

2. 적절한 키 사용
   ```jsx
   // 배열 렌더링 시 고유 키 사용
   {items.map(item => (
     <ListItem key={item.id} data={item} />
   ))}
   ```

3. Fast Refresh와 호환되는 패턴 사용
   - 함수 컴포넌트 내부에서 상태 정의
   - 클래스 컴포넌트를 사용할 경우 컴포넌트 이름 유지
   - 최상위 컴포넌트 export 유지

4. 필요한 경우 수동 리로드 추가
   ```jsx
   // 특정 조건에서 페이지 수동 리로드
   useEffect(() => {
     if (requiresFullReload) {
       window.location.reload();
     }
   }, [requiresFullReload]);
   ``` 