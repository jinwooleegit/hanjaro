'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { LearningStatus } from '../../types/learning';

interface ReviewItem {
  character: string;
  meaning: string;
  dueDate: string;
  level: number;
  status: LearningStatus;
  masteryLevel: number;
}

export default function ReviewPage() {
  const [reviewItems, setReviewItems] = useState<ReviewItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState('all'); // 'all', 'today', 'upcoming'

  useEffect(() => {
    const fetchReviewItems = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // API에서 복습 아이템 가져오기
        const response = await fetch('/api/learning/reviews');
        
        if (!response.ok) {
          throw new Error('복습 데이터를 가져오는 데 실패했습니다.');
        }
        
        const data = await response.json();
        
        if (!data.success) {
          throw new Error(data.message || '서버 오류가 발생했습니다.');
        }
        
        setReviewItems(data.reviewItems || []);
      } catch (err: any) {
        console.error('복습 데이터 로딩 중 오류:', err);
        setError(err.message || '데이터를 불러올 수 없습니다.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchReviewItems();
  }, []);
  
  // 필터링된 아이템 가져오기
  const getFilteredItems = () => {
    if (filter === 'all') {
      return reviewItems;
    }
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    if (filter === 'today') {
      return reviewItems.filter(item => {
        const dueDate = new Date(item.dueDate);
        return dueDate < tomorrow;
      });
    } else if (filter === 'upcoming') {
      return reviewItems.filter(item => {
        const dueDate = new Date(item.dueDate);
        return dueDate >= tomorrow;
      });
    }
    
    return reviewItems;
  };
  
  // 날짜 포맷팅
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      if (date < today) {
        return '지남';
      } else if (date < tomorrow) {
        return '오늘';
      } else {
        const options: Intl.DateTimeFormatOptions = { 
          month: 'short', 
          day: 'numeric' 
        };
        return date.toLocaleDateString('ko-KR', options);
      }
    } catch (err) {
      return '날짜 오류';
    }
  };
  
  // 마스터리 레벨에 따른 색상 클래스
  const getMasteryColorClass = (level: number) => {
    if (level >= 80) return 'bg-green-500';
    if (level >= 60) return 'bg-blue-500';
    if (level >= 40) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const filteredItems = getFilteredItems();

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="mb-4">
          <Link href="/dashboard" className="text-blue-500 hover:underline">
            ← 대시보드로 돌아가기
          </Link>
        </div>
        
        <h1 className="text-3xl font-bold mb-6 text-center">복습 항목</h1>
        
        {/* 필터 버튼 */}
        <div className="flex justify-center mb-8">
          <div className="flex rounded-md bg-gray-100 p-1">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 text-sm rounded-md ${
                filter === 'all' 
                  ? 'bg-white shadow-sm text-blue-600' 
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              전체
            </button>
            <button
              onClick={() => setFilter('today')}
              className={`px-4 py-2 text-sm rounded-md ${
                filter === 'today' 
                  ? 'bg-white shadow-sm text-blue-600' 
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              오늘 복습
            </button>
            <button
              onClick={() => setFilter('upcoming')}
              className={`px-4 py-2 text-sm rounded-md ${
                filter === 'upcoming' 
                  ? 'bg-white shadow-sm text-blue-600' 
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              예정된 복습
            </button>
          </div>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 p-4 rounded-lg text-red-600 text-center">
            {error}
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="bg-white p-8 rounded-lg shadow-md text-center">
            <p className="text-xl text-gray-600 mb-4">현재 {filter === 'all' ? '복습 항목이 없습니다' : filter === 'today' ? '오늘 복습할 항목이 없습니다' : '예정된 복습 항목이 없습니다'}</p>
            <Link href="/learn">
              <button className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition">
                학습 계속하기
              </button>
            </Link>
          </div>
        ) : (
          <>
            <div className="bg-white p-6 rounded-lg shadow-md mb-8">
              <p className="text-gray-600 mb-4">
                복습은 학습 내용을 장기 기억으로 전환하는 데 도움이 됩니다. 아래 항목들을 순서대로 복습하세요.
              </p>
              <p className="text-sm text-gray-500">
                총 <span className="font-semibold">{filteredItems.length}개</span>의 복습 항목이 있습니다.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredItems.map((item, index) => (
                <Link 
                  href={`/learn/hanja/${item.character}`} 
                  key={index}
                  className="block bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition"
                >
                  <div className="flex items-center">
                    <div className="text-4xl mr-4">{item.character}</div>
                    <div className="flex-1">
                      <div className="font-medium">{item.meaning}</div>
                      <div className="text-sm text-gray-500">
                        레벨 {item.level}
                      </div>
                      <div className="mt-2 w-full bg-gray-200 rounded-full h-1.5">
                        <div
                          className={`h-1.5 rounded-full ${getMasteryColorClass(item.masteryLevel)}`}
                          style={{ width: `${item.masteryLevel}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>{item.masteryLevel}% 숙련</span>
                        <span>복습일: {formatDate(item.dueDate)}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            
            <div className="mt-8 text-center">
              <Link href="/dashboard">
                <button className="px-6 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition mr-4">
                  대시보드로 돌아가기
                </button>
              </Link>
              <Link href="/quiz">
                <button className="px-6 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 transition">
                  퀴즈로 복습하기
                </button>
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
} 