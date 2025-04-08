import React, { useEffect, useState } from 'react';
import { GetStaticProps } from 'next';
import { promises as fs } from 'fs';
import path from 'path';
import Head from 'next/head';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface UserGuideProps {
  content: string;
}

const UserGuide: React.FC<UserGuideProps> = ({ content }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <>
      <Head>
        <title>사용자 가이드 | 한자로</title>
        <meta name="description" content="한자로 앱 사용자 가이드북입니다. 한자로 앱의 모든 기능을 효과적으로 활용하는 방법을 안내합니다." />
      </Head>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <article className="prose prose-lg dark:prose-invert max-w-none">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {content}
          </ReactMarkdown>
        </article>
      </div>
    </>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  try {
    const guideDir = path.join(process.cwd(), 'docs');
    const filePath = path.join(guideDir, 'user-guide.md');
    const content = await fs.readFile(filePath, 'utf8');

    return {
      props: {
        content,
      },
      // 24시간마다 재생성
      revalidate: 86400,
    };
  } catch (error) {
    console.error('Failed to load user guide:', error);
    return {
      props: {
        content: '# 사용자 가이드를 불러오는 중 오류가 발생했습니다.\n\n잠시 후 다시 시도해주세요.',
      },
    };
  }
};

export default UserGuide; 