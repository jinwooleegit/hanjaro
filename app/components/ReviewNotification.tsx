'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { LearningStatus } from '../../types/learning';
import { getHanjaIdByCharacter } from '@/utils/hanjaPageUtils';

interface ReviewNotificationProps {
  onClose?: () => void;
}

interface ReviewItem {
  id?: string;
  character: string;
  meaning: string;
  dueDate: string;
  level: number;
  status: LearningStatus;
  masteryLevel: number;
}

export default function ReviewNotification({ onClose }: ReviewNotificationProps) {
  const [reviewItems, setReviewItems] = useState<ReviewItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [itemIds, setItemIds] = useState<Record<string, string | null>>({});

  // 복습이 필요한 항목 가져오기
  useEffect(() => {
    // localStorage에서 확인해 이미 닫혔는지 확인
    const isDismissedToday = localStorage.getItem('reviewNotificationDismissed');
    const dismissedDate = isDismissedToday ? new Date(isDismissedToday) : null;
    const today = new Date();
    
    // 오늘 이미 닫았으면 표시하지 않음
    if (dismissedDate && 
        dismissedDate.getDate() === today.getDate() && 
        dismissedDate.getMonth() === today.getMonth() && 
        dismissedDate.getFullYear() === today.getFullYear()) {
      setDismissed(true);
      return;
    }

    const fetchReviewItems = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // API에서 데이터 가져오기
        const response = await fetch('/api/learning/reviews');
        
        if (!response.ok) {
          throw new Error('Failed to fetch review data');
        }
        
        const data = await response.json();
        
        if (!data.success) {
          throw new Error(data.message || 'An error occurred');
        }
        
        // 복습 항목 설정
        setReviewItems(data.reviewItems || []);
        
        // 복습 항목이 있으면 알림 표시
        if (data.reviewItems && data.reviewItems.length > 0) {
          setIsVisible(true);
        }
      } catch (err: any) {
        console.error('Error fetching review notifications:', err);
        setError(err.message || 'Failed to load review notifications');
      } finally {
        setLoading(false);
      }
    };
    
    if (!dismissed) {
      fetchReviewItems();
    }
    
    // 2시간마다 복습 알림 데이터 업데이트
    const intervalId = setInterval(() => {
      if (!dismissed) {
        fetchReviewItems();
      }
    }, 2 * 60 * 60 * 1000);
    
    return () => clearInterval(intervalId);
  }, [dismissed]);

  // 각 항목의 ID를 가져옵니다.
  useEffect(() => {
    async function fetchItemIds() {
      const newItemIds: Record<string, string | null> = {};
      
      for (const item of reviewItems) {
        if (item.id) {
          // 이미 ID가 있으면 그대로 사용
          newItemIds[item.character] = item.id;
        } else {
          // ID가 없으면 문자로 ID 가져오기 시도
          try {
            const id = await getHanjaIdByCharacter(item.character);
            newItemIds[item.character] = id;
          } catch (error) {
            console.error(`Error getting ID for character ${item.character}:`, error);
            newItemIds[item.character] = null;
          }
        }
      }
      
      setItemIds(newItemIds);
    }
    
    if (reviewItems.length > 0) {
      fetchItemIds();
    }
  }, [reviewItems]);

  // 알림 닫기
  const handleClose = () => {
    setIsVisible(false);
    setDismissed(true);
    
    // localStorage에 오늘 날짜 저장하여 오늘 다시 표시되지 않도록 함
    localStorage.setItem('reviewNotificationDismissed', new Date().toISOString());
    
    if (onClose) onClose();
  };
  
  // 나중에 알림 버튼 핸들러
  const handleRemindLater = () => {
    setIsVisible(false);
    
    // 2시간 후에 다시 표시
    setTimeout(() => {
      if (reviewItems.length > 0) {
        setIsVisible(true);
      }
    }, 2 * 60 * 60 * 1000); // 2시간
    
    if (onClose) onClose();
  };

  // 오늘 날짜 얻기
  const today = new Date().toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  // 아무것도 표시할 것이 없으면 null 반환
  if (!isVisible || dismissed || reviewItems.length === 0) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 w-96 bg-white rounded-lg shadow-lg border border-blue-100 overflow-hidden transition-all">
      <div className="bg-blue-500 text-white px-4 py-3 flex justify-between items-center">
        <h3 className="font-semibold">복습 알림</h3>
        <button 
          onClick={handleClose}
          className="text-white hover:text-blue-100 focus:outline-none"
          aria-label="닫기"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      <div className="p-4">
        {loading ? (
          <div className="flex justify-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="text-red-500 py-4 text-center">
            {error}
          </div>
        ) : (
          <>
            <div className="mb-3">
              <p className="text-sm text-gray-600">
                {today} 기준으로 <span className="font-semibold text-blue-600">{reviewItems.length}개</span>의 복습이 필요합니다.
              </p>
            </div>
            
            <div className="max-h-60 overflow-y-auto mb-3">
              <ul className="space-y-2">
                {reviewItems.map((item, index) => {
                  // 각 항목의 ID 가져오기 (없으면 문자 사용)
                  const itemId = itemIds[item.character] || item.id || item.character;
                  
                  return (
                    <li key={index} className="border rounded p-2 hover:bg-gray-50">
                      <Link 
                        href={`/hanja/${itemId}`} 
                        className="flex items-center"
                      >
                        <span className="text-2xl mr-3">{item.character}</span>
                        <div className="flex-1">
                          <div className="text-sm font-medium">{item.meaning}</div>
                          <div className="text-xs text-gray-500">레벨 {item.level}</div>
                        </div>
                        <div className="w-12 text-right">
                          <div 
                            className="inline-block w-8 h-1 rounded-full" 
                            style={{
                              backgroundColor: 
                                item.masteryLevel >= 80 ? '#10B981' : 
                                item.masteryLevel >= 60 ? '#3B82F6' : 
                                item.masteryLevel >= 40 ? '#F59E0B' : 
                                '#EF4444'
                            }}
                          ></div>
                        </div>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
            
            <div className="flex justify-between">
              <Link href="/review" className="text-sm text-blue-500 hover:underline">
                모든 복습 보기
              </Link>
              <button 
                onClick={handleRemindLater}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                나중에 알림
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
} 