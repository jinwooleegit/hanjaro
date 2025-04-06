import React from 'react';
import { HanjaCharacter } from '../utils/types';
import Link from 'next/link';

interface HanjaCardProps {
  hanja: HanjaCharacter;
  showDetails?: boolean;
}

const HanjaCard: React.FC<HanjaCardProps> = ({ hanja, showDetails = true }) => {
  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200 bg-white">
      <div className="p-4">
        <div className="flex justify-between items-start">
          <div className="text-center">
            <div className="text-5xl font-bold mb-2">{hanja.character}</div>
            <div className="text-gray-600 text-sm">{hanja.pronunciation}</div>
          </div>
          <div className="text-right">
            <div className="text-xs text-gray-500 mb-1">획수: {hanja.stroke_count}</div>
            <div className="text-xs text-gray-500">부수: {hanja.radical}</div>
          </div>
        </div>
        
        <div className="mt-3">
          <div className="text-sm font-medium text-gray-800">{hanja.meaning}</div>
        </div>
        
        {showDetails && (
          <>
            <div className="mt-3 border-t pt-2">
              <h4 className="text-xs font-medium text-gray-500 mb-1">예시</h4>
              {hanja.examples && hanja.examples.length > 0 ? (
                <ul className="text-sm">
                  {hanja.examples.slice(0, 2).map((example, index) => (
                    <li key={index} className="mb-1">
                      <span className="font-medium">{example.word}</span>
                      <span className="text-gray-600 text-xs ml-1">
                        {example.meaning} ({example.pronunciation})
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-500">예시 없음</p>
              )}
            </div>
            
            {hanja.tags && hanja.tags.length > 0 && (
              <div className="mt-2">
                <div className="flex flex-wrap gap-1">
                  {hanja.tags.slice(0, 3).map((tag, index) => (
                    <span 
                      key={index}
                      className="inline-block px-2 py-0.5 bg-blue-50 text-blue-600 text-xs rounded-full"
                    >
                      {tag.split(':')[1]}
                    </span>
                  ))}
                  {hanja.tags.length > 3 && (
                    <span className="inline-block px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full">
                      +{hanja.tags.length - 3}
                    </span>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </div>
      
      <div className="bg-gray-50 px-4 py-2 border-t border-gray-100">
        <Link 
          href={`/learn/hanja/${hanja.character}`}
          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
        >
          자세히 보기
        </Link>
      </div>
    </div>
  );
};

export default HanjaCard; 