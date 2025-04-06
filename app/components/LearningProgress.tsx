'use client';

import { useState, useEffect } from 'react';
import { LearningStatus } from '../../types/learning';

interface LearningProgressProps {
  character?: string;
  showDetail?: boolean;
}

interface CharacterRecord {
  character: string;
  status: LearningStatus;
  masteryLevel: number;
  correctCount: number;
  incorrectCount: number;
  lastStudied: string;
  nextReviewDue?: string;
}

interface LearningSummary {
  totalCharacters: number;
  charactersCompleted: number;
  charactersInProgress: number;
  charactersNeedsReview: number;
  averageMastery: number;
}

/**
 * 학습 진행 상황을 표시하는 컴포넌트
 */
export default function LearningProgress({ character, showDetail = false }: LearningProgressProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [record, setRecord] = useState<CharacterRecord | null>(null);
  const [summary, setSummary] = useState<LearningSummary | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // API 경로 설정 (특정 한자 또는 전체 요약)
        const apiUrl = character 
          ? `/api/learning/progress?character=${encodeURIComponent(character)}`
          : '/api/learning/progress';
          
        const response = await fetch(apiUrl);
        
        if (!response.ok) {
          throw new Error('Failed to fetch learning progress');
        }
        
        const data = await response.json();
        
        if (!data.success) {
          throw new Error(data.message || 'An error occurred');
        }
        
        // 응답 데이터 처리
        if (character) {
          setRecord(data.record);
        } else {
          setSummary(data.summary);
        }
      } catch (err: any) {
        console.error('Error fetching learning progress:', err);
        setError(err.message || 'Failed to load learning progress');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [character]);

  // 학습 상태에 따른 색상 클래스
  const getStatusColorClass = (status: LearningStatus) => {
    switch (status) {
      case LearningStatus.COMPLETED:
        return 'text-green-600';
      case LearningStatus.REVIEWING:
        return 'text-blue-600';
      case LearningStatus.IN_PROGRESS:
        return 'text-yellow-600';
      case LearningStatus.NEEDS_REVIEW:
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  // 학습 상태를 한글로 변환
  const getStatusText = (status: LearningStatus) => {
    switch (status) {
      case LearningStatus.COMPLETED:
        return '완료';
      case LearningStatus.REVIEWING:
        return '복습 중';
      case LearningStatus.IN_PROGRESS:
        return '학습 중';
      case LearningStatus.NEEDS_REVIEW:
        return '복습 필요';
      case LearningStatus.NOT_STARTED:
        return '학습 전';
      default:
        return '알 수 없음';
    }
  };

  // 숙련도에 따른 색상 클래스
  const getMasteryColorClass = (level: number) => {
    if (level >= 90) return 'bg-green-500';
    if (level >= 70) return 'bg-blue-500';
    if (level >= 40) return 'bg-yellow-500';
    if (level > 0) return 'bg-orange-500';
    return 'bg-gray-300';
  };

  // 날짜 형식 변환
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (err) {
      return '날짜 없음';
    }
  };

  // 로딩 상태 표시
  if (isLoading) {
    return (
      <div className="p-4 rounded-md bg-gray-50 animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2.5"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      </div>
    );
  }

  // 오류 표시
  if (error) {
    return (
      <div className="p-4 rounded-md bg-red-50 text-red-600">
        <p>오류: {error}</p>
      </div>
    );
  }

  // 특정 한자의 상세 진행 상황 표시
  if (character && record) {
    return (
      <div className="p-4 rounded-md border">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold">학습 진행 상황</h3>
          <span className={`px-2 py-1 rounded text-sm ${getStatusColorClass(record.status)} bg-opacity-20`}>
            {getStatusText(record.status)}
          </span>
        </div>
        
        <div className="mb-3">
          <p className="text-sm text-gray-600 mb-1">숙련도</p>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className={`h-2.5 rounded-full ${getMasteryColorClass(record.masteryLevel)}`}
              style={{ width: `${record.masteryLevel}%` }}
            ></div>
          </div>
          <p className="text-right text-xs text-gray-500 mt-1">{record.masteryLevel}%</p>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mb-3">
          <div>
            <p className="text-sm text-gray-600 mb-1">정답 횟수</p>
            <p className="font-semibold">{record.correctCount}회</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">오답 횟수</p>
            <p className="font-semibold">{record.incorrectCount}회</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 gap-2">
          <div>
            <p className="text-sm text-gray-600 mb-1">마지막 학습</p>
            <p className="text-sm">{formatDate(record.lastStudied)}</p>
          </div>
          
          {record.nextReviewDue && (
            <div>
              <p className="text-sm text-gray-600 mb-1">다음 복습 예정</p>
              <p className="text-sm">{formatDate(record.nextReviewDue)}</p>
            </div>
          )}
        </div>
        
        {showDetail && record.status !== LearningStatus.NOT_STARTED && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <button className="text-blue-500 text-sm hover:underline">
              학습 기록 자세히 보기
            </button>
          </div>
        )}
      </div>
    );
  }
  
  // 전체 학습 요약 표시
  if (summary) {
    return (
      <div className="p-4 rounded-md border">
        <h3 className="text-lg font-semibold mb-3">학습 진행 상황</h3>
        
        <div className="mb-4">
          <p className="text-sm text-gray-600 mb-1">전체 진행률</p>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className="h-2.5 rounded-full bg-blue-500"
              style={{ width: `${(summary.charactersCompleted / Math.max(summary.totalCharacters, 1)) * 100}%` }}
            ></div>
          </div>
          <p className="text-right text-xs text-gray-500 mt-1">
            {summary.charactersCompleted}/{summary.totalCharacters} 완료
          </p>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mb-3">
          <div>
            <p className="text-sm text-gray-600 mb-1">학습 중</p>
            <p className="font-semibold">{summary.charactersInProgress}자</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">복습 필요</p>
            <p className="font-semibold text-red-600">{summary.charactersNeedsReview}자</p>
          </div>
        </div>
        
        <div className="mb-3">
          <p className="text-sm text-gray-600 mb-1">평균 숙련도</p>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className={`h-2.5 rounded-full ${getMasteryColorClass(summary.averageMastery)}`}
              style={{ width: `${summary.averageMastery}%` }}
            ></div>
          </div>
          <p className="text-right text-xs text-gray-500 mt-1">{summary.averageMastery.toFixed(1)}%</p>
        </div>
        
        {showDetail && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <button className="text-blue-500 text-sm hover:underline">
              학습 통계 자세히 보기
            </button>
          </div>
        )}
      </div>
    );
  }
  
  // 데이터가 없는 경우
  return (
    <div className="p-4 rounded-md bg-gray-50">
      <p className="text-gray-500">학습 데이터가 없습니다.</p>
    </div>
  );
} 