import { getHanjaLevel, getCharactersForLevel } from '@/utils/hanjaUtils';
import HanjaList from '../../../components/HanjaList';
import Link from 'next/link';

type LevelPageProps = {
  params: {
    path: string;
  };
};

export default function LevelPage({ params }: LevelPageProps) {
  // path는 'category-level' 형식 (예: 'basic-level1')
  const [categoryId, levelId] = params.path.split('-');
  const level = getHanjaLevel(categoryId, levelId);
  const characters = getCharactersForLevel(categoryId, levelId);

  if (!level) {
    return (
      <div className="container mx-auto p-4">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl font-bold mb-6 text-center">존재하지 않는 레벨</h1>
          <div className="bg-white rounded-xl shadow-md p-6 text-center">
            <p className="mb-4">요청하신 레벨을 찾을 수 없습니다.</p>
            <Link href="/learn" className="inline-block px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition">
              학습 메인으로 돌아가기
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="max-w-5xl mx-auto">
        <div className="mb-4">
          <Link href="/learn" className="text-blue-500 hover:underline">
            &larr; 학습 메인으로 돌아가기
          </Link>
        </div>

        <h1 className="text-3xl font-bold mb-2 text-center">{level.name}</h1>
        <p className="text-gray-600 text-center mb-6">{level.description}</p>

        <HanjaList 
          characters={characters} 
          categoryId={categoryId} 
          levelId={levelId} 
        />
      </div>
    </div>
  );
} 