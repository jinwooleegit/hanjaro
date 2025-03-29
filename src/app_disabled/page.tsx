import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="flex flex-col items-center justify-center max-w-3xl text-center">
        <h1 className="text-4xl font-bold mb-6">
          한자 학습의 <br />
          <span className="text-primary">새로운 길</span>을 <br />
          발견하세요
        </h1>
        <p className="text-lg mb-8 text-gray-600 dark:text-gray-300">
          개인화된 학습 경로, 인터랙티브 필순 학습, 게임화 요소로 <br />
          효과적이고 재미있게 한자를 마스터하세요.
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <Link href="/learn" className="btn-primary">
            무료로 시작하기
          </Link>
          <Link href="/about" className="btn-secondary">
            자세히 알아보기
          </Link>
        </div>
      </div>
    </main>
  );
} 