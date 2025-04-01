'use client';

import Link from 'next/link';
import { HanjaCharacter } from '@/utils/hanjaUtils';

type HanjaListProps = {
  characters: HanjaCharacter[];
  categoryId: string;
  levelId: string;
};

export default function HanjaList({ characters, categoryId, levelId }: HanjaListProps) {
  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h2 className="text-2xl font-semibold mb-4">한자 목록</h2>
      
      {characters.length === 0 ? (
        <p className="text-gray-500 text-center py-8">
          이 레벨에는 아직 한자가 없습니다.
        </p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {characters.map((character) => (
            <Link
              key={character.character}
              href={`/learn/hanja/${character.character}?category=${categoryId}&level=${levelId}`}
              className="bg-gray-50 hover:bg-gray-100 p-4 rounded-lg text-center transition border border-gray-200 hover:border-primary flex flex-col items-center"
            >
              <div className="text-4xl font-bold mb-2">{character.character}</div>
              <div className="text-sm text-gray-700">{character.meaning}</div>
              <div className="text-xs text-gray-500 mt-1">{character.pronunciation}</div>
              <div className="text-xs text-gray-400 mt-1">획수: {character.stroke_count}</div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
} 