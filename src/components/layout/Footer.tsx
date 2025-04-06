import React from 'react';
import Link from 'next/link';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 py-8">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h4 className="font-bold text-lg mb-4">한자로(韓字路)</h4>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              한자 학습의 새로운 길, 한자로와 함께 즐겁고 효과적인 한자 학습을 경험하세요.
            </p>
          </div>
          
          <div>
            <h4 className="font-bold text-lg mb-4">학습</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/learn" className="text-gray-600 dark:text-gray-400 hover:text-primary">
                  기초 한자
                </Link>
              </li>
              <li>
                <Link href="/practice/enhanced" className="text-gray-600 dark:text-gray-400 hover:text-primary">
                  필순 연습
                </Link>
              </li>
              <li>
                <Link href="/quiz" className="text-gray-600 dark:text-gray-400 hover:text-primary">
                  한자 퀴즈
                </Link>
              </li>
              <li>
                <Link href="/dictionary" className="text-gray-600 dark:text-gray-400 hover:text-primary">
                  한자 사전
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold text-lg mb-4">커뮤니티</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/community" className="text-gray-600 dark:text-gray-400 hover:text-primary">
                  학습 그룹
                </Link>
              </li>
              <li>
                <Link href="/forum" className="text-gray-600 dark:text-gray-400 hover:text-primary">
                  질문 게시판
                </Link>
              </li>
              <li>
                <Link href="/ranking" className="text-gray-600 dark:text-gray-400 hover:text-primary">
                  학습 랭킹
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold text-lg mb-4">정보</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-gray-600 dark:text-gray-400 hover:text-primary">
                  서비스 소개
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-gray-600 dark:text-gray-400 hover:text-primary">
                  개인정보처리방침
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-600 dark:text-gray-400 hover:text-primary">
                  이용약관
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-600 dark:text-gray-400 hover:text-primary">
                  문의하기
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 text-center text-sm text-gray-600 dark:text-gray-400">
          <p>&copy; {new Date().getFullYear()} 한자로(韓字路). All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 