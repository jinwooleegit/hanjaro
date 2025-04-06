'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function StrokeDataManager() {
  const [isLoading, setIsLoading] = useState(true);
  const [levels, setLevels] = useState<any[]>([]);
  const [downloadStatus, setDownloadStatus] = useState<Record<string, string>>({});
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null);
  const [downloadProgress, setDownloadProgress] = useState({ total: 0, completed: 0, failed: 0 });

  // 한자 레벨 데이터 로드
  useEffect(() => {
    const fetchLevels = async () => {
      try {
        const response = await fetch('/api/hanja');
        if (!response.ok) throw new Error('Failed to fetch hanja levels');
        
        const data = await response.json();
        
        // 레벨 데이터 구성
        const basicLevels = Object.entries(data.basic.levels).map(([key, value]: [string, any]) => ({
          id: key,
          name: value.name,
          description: value.description,
          count: value.characters.length,
          type: 'basic'
        }));
        
        const advancedLevels = data.advanced 
          ? Object.entries(data.advanced.levels).map(([key, value]: [string, any]) => ({
              id: key,
              name: value.name,
              description: value.description,
              count: value.characters.length,
              type: 'advanced'
            }))
          : [];
        
        setLevels([...basicLevels, ...advancedLevels]);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching hanja levels:', error);
        setIsLoading(false);
      }
    };
    
    fetchLevels();
  }, []);

  // 레벨 선택 핸들러
  const handleLevelSelect = (levelId: string) => {
    setSelectedLevel(levelId);
  };

  // 선택한 레벨의 한자 데이터 가져오기
  const fetchLevelCharacters = async (levelId: string) => {
    try {
      const levelType = levels.find(level => level.id === levelId)?.type || 'basic';
      const response = await fetch(`/api/hanja?level=${levelId.replace('level', '')}&type=${levelType}`);
      if (!response.ok) throw new Error(`Failed to fetch characters for level ${levelId}`);
      
      const data = await response.json();
      return data.characters || [];
    } catch (error) {
      console.error(`Error fetching characters for level ${levelId}:`, error);
      return [];
    }
  };

  // 선택한 레벨의 필순 데이터 다운로드
  const downloadLevelStrokeData = async () => {
    if (!selectedLevel) return;
    
    try {
      // 선택한 레벨의 한자 데이터 가져오기
      const characters = await fetchLevelCharacters(selectedLevel);
      
      if (characters.length === 0) {
        alert('레벨에 한자가 없습니다.');
        return;
      }
      
      // 다운로드 상태 초기화
      setDownloadStatus({});
      setDownloadProgress({ total: characters.length, completed: 0, failed: 0 });
      
      // 각 한자에 대한 필순 데이터 다운로드 상태 확인
      for (let i = 0; i < characters.length; i++) {
        const char = characters[i].character;
        setDownloadStatus(prev => ({ ...prev, [char]: '확인 중...' }));
        
        try {
          // 서버에 필순 데이터가 있는지 확인
          const response = await fetch(`/api/hanja/strokes?char=${encodeURIComponent(char)}`, { method: 'HEAD' });
          
          if (response.ok) {
            setDownloadStatus(prev => ({ ...prev, [char]: '이미 다운로드됨' }));
            setDownloadProgress(prev => ({ ...prev, completed: prev.completed + 1 }));
          } else {
            // 없으면 다운로드 시도
            setDownloadStatus(prev => ({ ...prev, [char]: '다운로드 중...' }));
            
            // 실제 다운로드 요청 (서버 측에서 데이터 저장 필요)
            const downloadResponse = await fetch(`/api/hanja/download-stroke?char=${encodeURIComponent(char)}`);
            
            if (downloadResponse.ok) {
              setDownloadStatus(prev => ({ ...prev, [char]: '완료' }));
              setDownloadProgress(prev => ({ ...prev, completed: prev.completed + 1 }));
            } else {
              setDownloadStatus(prev => ({ ...prev, [char]: '실패' }));
              setDownloadProgress(prev => ({ ...prev, failed: prev.failed + 1 }));
            }
          }
        } catch (error) {
          console.error(`Error downloading stroke data for ${char}:`, error);
          setDownloadStatus(prev => ({ ...prev, [char]: '오류 발생' }));
          setDownloadProgress(prev => ({ ...prev, failed: prev.failed + 1 }));
        }
      }
    } catch (error) {
      console.error('Error downloading stroke data:', error);
      alert('필순 데이터 다운로드 중 오류가 발생했습니다.');
    }
  };

  // 모든 레벨의 필순 데이터 다운로드
  const downloadAllStrokeData = async () => {
    try {
      alert('서버에서 Node.js 스크립트 실행이 필요합니다. 관리자에게 문의하세요.');
      // 실제 구현에서는 서버 측 스크립트 실행 또는 안내 메시지 제공
    } catch (error) {
      console.error('Error downloading all stroke data:', error);
      alert('모든 필순 데이터 다운로드 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">필순 데이터 관리</h1>
      
      <div className="mb-8">
        <Link href="/dashboard" className="text-blue-500 hover:underline">
          ← 대시보드로 돌아가기
        </Link>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-3">필순 데이터 다운로드</h2>
        <p className="mb-3">
          한자 필순 데이터를 다운로드하여 로컬에 저장합니다. 로컬에 저장된 데이터는 인터넷 연결 없이도 사용할 수 있습니다.
        </p>
        <button 
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded mr-3"
          onClick={downloadAllStrokeData}
        >
          모든 한자 필순 데이터 다운로드
        </button>
        <span className="text-sm text-gray-600">
          (시간이 오래 걸릴 수 있습니다)
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="col-span-1 bg-white p-4 rounded shadow-md">
          <h3 className="text-lg font-semibold mb-3">레벨 선택</h3>
          
          {isLoading ? (
            <p>레벨 로딩 중...</p>
          ) : (
            <ul className="space-y-2">
              {levels.map(level => (
                <li key={level.id}>
                  <button
                    className={`w-full text-left px-3 py-2 rounded ${
                      selectedLevel === level.id
                        ? 'bg-blue-500 text-white'
                        : 'hover:bg-gray-100'
                    }`}
                    onClick={() => handleLevelSelect(level.id)}
                  >
                    {level.name} ({level.count}자)
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="col-span-2 bg-white p-4 rounded shadow-md">
          <h3 className="text-lg font-semibold mb-3">선택한 레벨의 필순 데이터</h3>
          
          {selectedLevel ? (
            <>
              <div className="mb-4">
                <button
                  className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
                  onClick={downloadLevelStrokeData}
                >
                  이 레벨의 필순 데이터 다운로드
                </button>
              </div>
              
              {Object.keys(downloadStatus).length > 0 && (
                <div className="mb-4">
                  <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
                    <div 
                      className="bg-blue-600 h-2.5 rounded-full" 
                      style={{ width: `${(downloadProgress.completed / downloadProgress.total) * 100}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-gray-600">
                    진행: {downloadProgress.completed}/{downloadProgress.total} (실패: {downloadProgress.failed})
                  </p>
                </div>
              )}
              
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 max-h-80 overflow-y-auto">
                {Object.entries(downloadStatus).map(([char, status]) => (
                  <div 
                    key={char} 
                    className={`border p-2 rounded text-center ${
                      status === '완료' || status === '이미 다운로드됨' 
                        ? 'border-green-500 bg-green-50' 
                        : status === '실패' || status === '오류 발생'
                        ? 'border-red-500 bg-red-50'
                        : 'border-gray-300'
                    }`}
                  >
                    <div className="text-2xl mb-1">{char}</div>
                    <div className="text-xs">
                      {status === '완료' || status === '이미 다운로드됨' ? (
                        <span className="text-green-600">{status}</span>
                      ) : status === '실패' || status === '오류 발생' ? (
                        <span className="text-red-600">{status}</span>
                      ) : (
                        <span className="text-blue-600">{status}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <p className="text-gray-500">왼쪽에서 레벨을 선택하세요.</p>
          )}
        </div>
      </div>
    </div>
  );
} 