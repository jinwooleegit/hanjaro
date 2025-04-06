import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Hanja } from '@/data/types';

interface HanjaCardProps {
  hanja: Hanja;
  showDetails?: boolean;
  onClick?: () => void;
}

const HanjaCard: React.FC<HanjaCardProps> = ({ 
  hanja, 
  showDetails = true, 
  onClick 
}) => {
  return (
    <motion.div
      className="hanja-card"
      whileHover={{ y: -5 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
    >
      <div className="flex flex-col items-center">
        <span className="text-5xl mb-2 font-bold">{hanja.character}</span>
        <h3 className="text-lg font-bold mb-1">{hanja.meaning}</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          {hanja.pronunciation} | {hanja.strokes}획
        </p>
        
        {showDetails && (
          <>
            <div className="w-full border-t border-gray-200 dark:border-gray-700 my-2"></div>
            
            <div className="w-full mt-2">
              <h4 className="text-sm font-bold mb-1">예문</h4>
              <ul className="text-xs text-gray-600 dark:text-gray-400">
                {hanja.examples.slice(0, 2).map((example, index) => (
                  <li key={index} className="mb-1">{example}</li>
                ))}
              </ul>
            </div>
            
            {hanja.relatedHanja && hanja.relatedHanja.length > 0 && (
              <div className="w-full mt-4">
                <h4 className="text-sm font-bold mb-1">연관 한자</h4>
                <div className="flex flex-wrap gap-1">
                  {hanja.relatedHanja.slice(0, 3).map((related, index) => (
                    <span 
                      key={index}
                      className="inline-block bg-gray-100 dark:bg-gray-700 rounded px-2 py-1 text-xs"
                    >
                      {related.character} ({related.meaning})
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            <Link 
              href={`/learn/hanja/${hanja.character}`}
              className="mt-4 text-sm text-primary hover:underline self-end"
            >
              자세히 보기
            </Link>
          </>
        )}
      </div>
    </motion.div>
  );
};

export default HanjaCard; 