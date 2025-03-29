# 한자로(韓字路) - 한자 학습 플랫폼

한자로(韓字路)는 개인화된 학습 경로, 인터랙티브 필순 애니메이션, 게임화 요소를 통해 효과적이고 재미있게 한자를 학습할 수 있는 웹 플랫폼입니다.

## 주요 기능

- **개인화된 학습 경로**: AI 기반으로 사용자의 학습 패턴과 강점/약점을 분석하여 최적화된 학습 경로 제공
- **인터랙티브 필순 학습**: SVG 기반의 필순 애니메이션과 직접 따라 그리는 연습 기능
- **게임화 학습 시스템**: 포인트, 배지, 랭킹 등 게임화 요소를 통한 학습 동기 부여
- **마이크로 러닝**: 5-10분 단위의 짧은 학습 세션으로 구성, 틈새 시간 활용 가능
- **다크 모드 지원**: 사용자 환경과 선호도에 맞는 인터페이스 제공

## 기술 스택

- **프론트엔드**: React.js, TypeScript, Next.js
- **애니메이션**: Framer Motion, SVG
- **스타일링**: Tailwind CSS
- **백엔드**: Node.js, Express (또는 Next.js API Routes)
- **데이터베이스**: MongoDB, PostgreSQL
- **인증**: NextAuth.js

## 개발 환경 설정

### 요구 사항

- Node.js 18.0.0 이상
- npm 또는 yarn

### 설치 및 실행

1. 저장소 클론

```bash
git clone https://github.com/yourusername/hanjaro.git
cd hanjaro
```

2. 의존성 패키지 설치

```bash
npm install
# 또는
yarn install
```

3. 개발 서버 실행

```bash
npm run dev
# 또는
yarn dev
```

4. 브라우저에서 http://localhost:3000 접속

## 프로젝트 구조

```
hanjaro/
├── public/            # 정적 파일
├── src/               # 소스 코드
│   ├── components/    # 재사용 가능한 컴포넌트
│   ├── context/       # React Context API
│   ├── data/          # 데이터 타입 및 샘플 데이터
│   ├── hooks/         # 커스텀 React Hooks
│   ├── pages/         # Next.js 페이지
│   ├── styles/        # 전역 스타일
│   └── utils/         # 유틸리티 함수
├── package.json       # 프로젝트 의존성 관리
├── tsconfig.json      # TypeScript 설정
└── README.md          # 프로젝트 문서
```

## 기여하기

1. 이슈 확인 또는 새 이슈 생성
2. Fork 후 feature 브랜치 생성 (`git checkout -b feature/amazing-feature`)
3. 변경사항 커밋 (`git commit -m 'Add some amazing feature'`)
4. 브랜치에 푸시 (`git push origin feature/amazing-feature`)
5. Pull Request 생성

## 라이센스

이 프로젝트는 MIT 라이센스를 따릅니다 - 자세한 내용은 [LICENSE](LICENSE) 파일을 참조하세요.

## 연락처

- 이메일: your.email@example.com
- 웹사이트: https://hanjaro.com

---

**한자로(韓字路)** - 당신만의 한자 학습 여정 