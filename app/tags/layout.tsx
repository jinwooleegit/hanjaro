import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '한자 태그 목록 - 한자로',
  description: '다양한 분류로 한자를 탐색하고 학습해보세요.',
};

export default function TagsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
} 