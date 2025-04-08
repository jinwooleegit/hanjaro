'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';

// Chart.js 컴포넌트 등록
ChartJS.register(ArcElement, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// 필수 학습 한자 목록 (예시)
const essentialHanjaList = [
  { character: '人', mastery: 95 },
  { character: '水', mastery: 85 },
  { character: '火', mastery: 80 },
  { character: '山', mastery: 70 },
  { character: '木', mastery: 65 },
  { character: '日', mastery: 60 },
  { character: '月', mastery: 55 },
  { character: '金', mastery: 50 },
  { character: '土', mastery: 45 },
  { character: '天', mastery: 40 },
];

// 최근 학습 활동 (예시)
const recentActivities = [
  { date: '2025-03-30', activity: '필기 연습', character: '永', score: 85 },
  { date: '2025-03-29', activity: '의미 퀴즈', characters: ['人', '水', '火'], score: 90 },
  { date: '2025-03-28', activity: '필순 학습', character: '山', duration: '10분' },
  { date: '2025-03-27', activity: '한자 읽기', characters: ['木', '日', '月'], score: 75 },
  { date: '2025-03-26', activity: '필기 연습', character: '人', score: 80 },
];

const weeklyLearningTime = {
  labels: ['월', '화', '수', '목', '금', '토', '일'],
  datasets: [
    {
      label: '학습 시간 (분)',
      data: [15, 20, 30, 25, 35, 45, 20],
      backgroundColor: 'rgba(75, 192, 192, 0.6)',
      borderColor: 'rgba(75, 192, 192, 1)',
      borderWidth: 1,
    },
  ],
};

const masteryDistribution = {
  labels: ['초급', '중급', '고급', '미학습'],
  datasets: [
    {
      label: '한자 수',
      data: [25, 15, 5, 55],
      backgroundColor: [
        'rgba(54, 162, 235, 0.7)',
        'rgba(75, 192, 192, 0.7)',
        'rgba(153, 102, 255, 0.7)',
        'rgba(201, 203, 207, 0.7)',
      ],
      borderColor: [
        'rgba(54, 162, 235, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)',
        'rgba(201, 203, 207, 1)',
      ],
      borderWidth: 1,
    },
  ],
};

export default function Dashboard() {
  const [totalStudyTime, setTotalStudyTime] = useState(0);
  const [learnedHanja, setLearnedHanja] = useState(0);
  const [totalHanja, setTotalHanja] = useState(100);
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    // 실제로는 API나 로컬 스토리지에서 데이터를 가져오는 로직이 들어갈 수 있음
    setTotalStudyTime(210); // 예시: 총 210분 학습
    setLearnedHanja(45); // 예시: 45개 한자 학습
    setTotalHanja(100); // 예시: 총 100개 한자
    setStreak(7); // 예시: 7일 연속 학습
  }, []);

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col gap-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <h1 className="text-3xl font-bold">학습 대시보드</h1>
          
          <div className="flex gap-3 mt-4 md:mt-0">
            <Link href="/learn">
              <button className="px-4 py-2 bg-blue-500 text-white hover:bg-blue-600 rounded-md transition">
                학습하기
              </button>
            </Link>
            <Link href="/pdf-practice">
              <button className="px-4 py-2 bg-green-500 text-white hover:bg-green-600 rounded-md transition">
                복습지 다운로드
              </button>
            </Link>
            <Link href="/quiz">
              <button className="px-4 py-2 bg-purple-500 text-white hover:bg-purple-600 rounded-md transition">
                퀴즈 풀기
              </button>
            </Link>
          </div>
        </div>
        
        {/* 학습 요약 카드 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white shadow rounded-lg p-5">
            <div className="text-gray-500 text-sm">총 학습 시간</div>
            <div className="flex items-end gap-2">
              <div className="text-3xl font-bold">{totalStudyTime}</div>
              <div className="text-gray-500 mb-1">분</div>
            </div>
          </div>
          
          <div className="bg-white shadow rounded-lg p-5">
            <div className="text-gray-500 text-sm">학습한 한자</div>
            <div className="flex items-end gap-2">
              <div className="text-3xl font-bold">{learnedHanja}</div>
              <div className="text-gray-500 mb-1">/ {totalHanja} 자</div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
              <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${(learnedHanja / totalHanja) * 100}%` }}></div>
            </div>
          </div>
          
          <div className="bg-white shadow rounded-lg p-5">
            <div className="text-gray-500 text-sm">연속 학습일</div>
            <div className="flex items-end gap-2">
              <div className="text-3xl font-bold">{streak}</div>
              <div className="text-gray-500 mb-1">일</div>
            </div>
            <div className="flex gap-1 mt-2">
              {Array.from({ length: 7 }).map((_, i) => (
                <div key={i} className={`h-2 flex-1 rounded-full ${i < streak % 7 ? 'bg-yellow-400' : 'bg-gray-200'}`}></div>
              ))}
            </div>
          </div>
          
          <div className="bg-white shadow rounded-lg p-5">
            <div className="text-gray-500 text-sm">평균 정확도</div>
            <div className="flex items-end gap-2">
              <div className="text-3xl font-bold">82</div>
              <div className="text-gray-500 mb-1">점</div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
              <div className="bg-green-500 h-2.5 rounded-full" style={{ width: '82%' }}></div>
            </div>
          </div>
        </div>
        
        {/* 그래프 및 통계 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">주간 학습 시간</h2>
            <div className="h-64">
              <Bar 
                data={weeklyLearningTime} 
                options={{ 
                  maintainAspectRatio: false, 
                  plugins: { legend: { position: 'bottom' } } 
                }} 
              />
            </div>
          </div>
          
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">한자 숙련도 분포</h2>
            <div className="h-64 flex justify-center">
              <div className="w-64">
                <Pie 
                  data={masteryDistribution} 
                  options={{ 
                    maintainAspectRatio: false, 
                    plugins: { legend: { position: 'bottom' } } 
                  }} 
                />
              </div>
            </div>
          </div>
        </div>
        
        {/* 최근 학습 활동 */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">최근 학습 활동</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">날짜</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">활동</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">한자</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">결과</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentActivities.map((activity, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(activity.date).toLocaleDateString('ko-KR', { month: 'long', day: 'numeric' })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {activity.activity}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {activity.character || activity.characters?.join(', ')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {activity.score !== undefined ? `${activity.score}점` : activity.duration}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
        {/* 학습 추천 */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">필수 한자 숙련도</h2>
          <p className="text-gray-600 mb-4">
            가장 많이 사용되는 한자의 학습 진행 상황입니다. 숙련도가 낮은 한자부터 우선적으로 학습하는 것이 좋습니다.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
            {essentialHanjaList.map((hanja, index) => (
              <div key={index} className="border rounded-lg p-3 text-center">
                <div className="text-4xl mb-2">{hanja.character}</div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className={`h-2.5 rounded-full ${
                      hanja.mastery >= 80 ? 'bg-green-500' : 
                      hanja.mastery >= 60 ? 'bg-yellow-400' : 
                      'bg-red-400'
                    }`} 
                    style={{ width: `${hanja.mastery}%` }}
                  ></div>
                </div>
                <div className="text-xs text-gray-500 mt-1">{hanja.mastery}% 숙련</div>
              </div>
            ))}
          </div>
          <div className="mt-4 flex justify-center">
            <Link href="/learn">
              <button className="px-6 py-2 bg-blue-500 text-white hover:bg-blue-600 rounded-md transition">
                학습 계속하기
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 