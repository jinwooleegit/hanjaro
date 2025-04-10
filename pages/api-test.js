import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

export default function ApiTest() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('list');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [response, setResponse] = useState(null);
  
  // 검색 관련 상태
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState('all');
  
  // 목록 관련 상태
  const [currentGrade, setCurrentGrade] = useState('');
  const [currentCategory, setCurrentCategory] = useState('');
  const [currentSort, setCurrentSort] = useState('grade');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  
  // 상세 보기 관련 상태
  const [hanjaId, setHanjaId] = useState('');
  
  // API 호출 함수
  const fetchApi = async (endpoint, params = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      // 쿼리 파라미터 구성
      const queryParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value) queryParams.append(key, value);
      });
      
      // API 호출
      const url = `/api/hanja${endpoint}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const response = await fetch(url);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'API 요청 실패');
      }
      
      setResponse(data);
    } catch (err) {
      setError(err.message);
      setResponse(null);
    } finally {
      setLoading(false);
    }
  };
  
  // 탭에 따른 초기 데이터 로드
  useEffect(() => {
    if (activeTab === 'list') {
      fetchApi('', { 
        grade: currentGrade, 
        category: currentCategory, 
        sort: currentSort,
        page: currentPage,
        limit: pageSize
      });
    } else if (activeTab === 'search' && searchQuery) {
      fetchApi('/search', { q: searchQuery, type: searchType });
    } else if (activeTab === 'detail' && hanjaId) {
      fetchApi(`/${hanjaId}`);
    } else if (activeTab === 'grades') {
      fetchApi('/grades');
    } else if (activeTab === 'stats') {
      fetchApi('/stats');
    }
  }, [activeTab, currentGrade, currentCategory, currentSort, currentPage, pageSize]);
  
  // 검색 실행
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      fetchApi('/search', { q: searchQuery, type: searchType });
    }
  };
  
  // 상세 보기 실행
  const handleViewDetail = (e) => {
    e.preventDefault();
    if (hanjaId.trim()) {
      fetchApi(`/${hanjaId}`);
    }
  };
  
  // 결과를 포맷팅된 JSON으로 표시
  const renderResponse = () => {
    if (!response) return null;
    return (
      <pre className="bg-gray-100 p-4 rounded-md overflow-auto max-h-[600px]">
        {JSON.stringify(response, null, 2)}
      </pre>
    );
  };
  
  return (
    <div className="container mx-auto py-8 px-4">
      <Head>
        <title>한자 데이터 API 테스트</title>
        <meta name="description" content="한자 데이터 API를 테스트하는 페이지입니다." />
      </Head>
      
      <h1 className="text-3xl font-bold mb-6">한자 데이터 API 테스트</h1>
      
      {/* 탭 네비게이션 */}
      <div className="flex flex-wrap border-b mb-6">
        <button 
          className={`px-4 py-2 ${activeTab === 'list' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          onClick={() => setActiveTab('list')}
        >
          한자 목록
        </button>
        <button 
          className={`px-4 py-2 ${activeTab === 'search' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          onClick={() => setActiveTab('search')}
        >
          한자 검색
        </button>
        <button 
          className={`px-4 py-2 ${activeTab === 'detail' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          onClick={() => setActiveTab('detail')}
        >
          상세 정보
        </button>
        <button 
          className={`px-4 py-2 ${activeTab === 'grades' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          onClick={() => setActiveTab('grades')}
        >
          급수 정보
        </button>
        <button 
          className={`px-4 py-2 ${activeTab === 'stats' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          onClick={() => setActiveTab('stats')}
        >
          통계 정보
        </button>
      </div>
      
      {/* 한자 목록 폼 */}
      {activeTab === 'list' && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4">한자 목록 조회</h2>
          <div className="flex flex-wrap gap-4 mb-4">
            <div>
              <label className="block text-sm mb-1">급수</label>
              <select 
                className="border p-2 rounded" 
                value={currentGrade}
                onChange={(e) => setCurrentGrade(e.target.value)}
              >
                <option value="">전체</option>
                {Array.from({ length: 15 }, (_, i) => i + 1).map(grade => (
                  <option key={grade} value={grade}>{grade}급</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm mb-1">카테고리</label>
              <select 
                className="border p-2 rounded" 
                value={currentCategory}
                onChange={(e) => setCurrentCategory(e.target.value)}
              >
                <option value="">전체</option>
                <option value="beginner">초급 (beginner)</option>
                <option value="intermediate">중급 (intermediate)</option>
                <option value="advanced">고급 (advanced)</option>
                <option value="expert">전문가 (expert)</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm mb-1">정렬</label>
              <select 
                className="border p-2 rounded" 
                value={currentSort}
                onChange={(e) => setCurrentSort(e.target.value)}
              >
                <option value="grade">급수순</option>
                <option value="stroke_count">획수순</option>
                <option value="frequency">빈도순</option>
                <option value="unicode">유니코드순</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm mb-1">페이지</label>
              <input 
                type="number" 
                className="border p-2 rounded w-20" 
                value={currentPage}
                min="1"
                onChange={(e) => setCurrentPage(parseInt(e.target.value) || 1)}
              />
            </div>
            
            <div>
              <label className="block text-sm mb-1">페이지 크기</label>
              <select 
                className="border p-2 rounded" 
                value={pageSize}
                onChange={(e) => setPageSize(parseInt(e.target.value))}
              >
                <option value="10">10</option>
                <option value="20">20</option>
                <option value="50">50</option>
                <option value="100">100</option>
              </select>
            </div>
            
            <div className="flex items-end">
              <button 
                className="bg-blue-500 text-white px-4 py-2 rounded"
                onClick={() => fetchApi('', { 
                  grade: currentGrade, 
                  category: currentCategory, 
                  sort: currentSort,
                  page: currentPage,
                  limit: pageSize
                })}
              >
                조회
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* 한자 검색 폼 */}
      {activeTab === 'search' && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4">한자 검색</h2>
          <form onSubmit={handleSearch} className="flex flex-wrap gap-4">
            <div>
              <label className="block text-sm mb-1">검색어</label>
              <input 
                type="text" 
                className="border p-2 rounded w-64" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="한자, 의미, 발음 등 입력"
              />
            </div>
            
            <div>
              <label className="block text-sm mb-1">검색 유형</label>
              <select 
                className="border p-2 rounded" 
                value={searchType}
                onChange={(e) => setSearchType(e.target.value)}
              >
                <option value="all">전체</option>
                <option value="character">한자</option>
                <option value="meaning">의미</option>
                <option value="pronunciation">발음</option>
              </select>
            </div>
            
            <div className="flex items-end">
              <button 
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded"
                disabled={!searchQuery.trim()}
              >
                검색
              </button>
            </div>
          </form>
        </div>
      )}
      
      {/* 상세 정보 폼 */}
      {activeTab === 'detail' && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4">한자 상세 정보</h2>
          <form onSubmit={handleViewDetail} className="flex flex-wrap gap-4">
            <div>
              <label className="block text-sm mb-1">한자 ID 또는 문자</label>
              <input 
                type="text" 
                className="border p-2 rounded w-64" 
                value={hanjaId}
                onChange={(e) => setHanjaId(e.target.value)}
                placeholder="HJ-15-0001-4E00 또는 一"
              />
            </div>
            
            <div className="flex items-end">
              <button 
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded"
                disabled={!hanjaId.trim()}
              >
                조회
              </button>
            </div>
          </form>
        </div>
      )}
      
      {/* 급수 정보 */}
      {activeTab === 'grades' && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4">급수 정보 조회</h2>
          <div className="flex flex-wrap gap-4">
            <div>
              <label className="block text-sm mb-1">카테고리</label>
              <select 
                className="border p-2 rounded" 
                value={currentCategory}
                onChange={(e) => setCurrentCategory(e.target.value)}
              >
                <option value="">전체</option>
                <option value="beginner">초급 (beginner)</option>
                <option value="intermediate">중급 (intermediate)</option>
                <option value="advanced">고급 (advanced)</option>
                <option value="expert">전문가 (expert)</option>
              </select>
            </div>
            
            <div className="flex items-end">
              <button 
                className="bg-blue-500 text-white px-4 py-2 rounded"
                onClick={() => fetchApi('/grades', { category: currentCategory })}
              >
                조회
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* 통계 정보 */}
      {activeTab === 'stats' && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4">데이터베이스 통계 정보</h2>
          <button 
            className="bg-blue-500 text-white px-4 py-2 rounded"
            onClick={() => fetchApi('/stats')}
          >
            통계 조회
          </button>
        </div>
      )}
      
      {/* 로딩 인디케이터 */}
      {loading && (
        <div className="my-4 text-center">
          <p className="text-gray-600">데이터를 불러오는 중...</p>
        </div>
      )}
      
      {/* 에러 메시지 */}
      {error && (
        <div className="my-4 p-4 bg-red-100 text-red-700 rounded">
          <p className="font-bold">오류 발생:</p>
          <p>{error}</p>
        </div>
      )}
      
      {/* API 응답 결과 */}
      {response && (
        <div className="my-4">
          <h3 className="text-lg font-semibold mb-2">API 응답 결과:</h3>
          {renderResponse()}
        </div>
      )}
      
      {/* 문서 링크 */}
      <div className="mt-8 pt-4 border-t">
        <p>
          <a 
            href="/README-API.md" 
            target="_blank" 
            className="text-blue-500 hover:underline"
          >
            전체 API 문서 보기
          </a>
        </p>
      </div>
    </div>
  );
} 