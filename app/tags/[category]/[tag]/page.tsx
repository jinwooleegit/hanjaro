'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import TAGS_DATA from '../../../../data/tags.json';
import HANJA_DATABASE from '../../../../data/hanja_database_main.json';

// 태그 데이터 타입 정의
interface Tag {
  id: string;
  name: string;
  description: string;
  examples: string[];
}

interface TagCategory {
  id: string;
  name: string;
  description: string;
  tags: Tag[];
}

interface TagData {
  tag_categories: TagCategory[];
}

// 한자 데이터베이스 타입 정의
interface HanjaExample {
  word: string;
  meaning: string;
  pronunciation: string;
}

interface HanjaCharacter {
  character: string;
  meaning: string;
  pronunciation: string;
  stroke_count: number;
  radical: string;
  examples: HanjaExample[];
  level: number;
  order: number;
}

interface HanjaLevel {
  name: string;
  description: string;
  characters: HanjaCharacter[];
}

interface HanjaCategory {
  name: string;
  description: string;
  total_characters: number;
  levels: {
    [key: string]: HanjaLevel;
  };
}

interface HanjaDatabase {
  [category: string]: HanjaCategory;
}

// 동적 메타데이터
export async function generateMetadata({ params }: { params: { category: string; tag: string } }) {
  const { category, tag } = params;
  
  // 해당 태그 정보 찾기
  const categoryData = TAGS_DATA.tag_categories.find((cat: TagCategory) => cat.id === category);
  const tagData = categoryData?.tags.find((t: Tag) => t.id === tag);
  
  if (!tagData) {
    return {
      title: '태그를 찾을 수 없습니다 - 한자로',
      description: '요청하신 태그를 찾을 수 없습니다.'
    };
  }
  
  return {
    title: `${tagData.name} 한자 - 한자로`,
    description: tagData.description
  };
}

// 태그 카테고리별 색상 매핑
const getCategoryStyles = (categoryId: string) => {
  const styles: Record<string, { bg: string, border: string, text: string }> = {
    'meaning': { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-800' },
    'difficulty': { bg: 'bg-yellow-50', border: 'border-yellow-200', text: 'text-yellow-800' },
    'radical': { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-800' },
    'usage': { bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-800' },
    'education': { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-800' },
  };
  
  return styles[categoryId] || styles['meaning'];
};

// 태그와 관련된 한자를 데이터베이스에서 찾는 함수
const findHanjaForTag = (tagId: string, categoryId: string, examples: string[]): string[] => {
  const hanjaSet = new Set<string>(examples); // 중복 방지를 위한 Set
  const database = HANJA_DATABASE as HanjaDatabase;
  
  // 태그 유형에 따라 검색 방법 변경
  switch (categoryId) {
    case 'meaning':
      // 의미 기반 태그는 한자의 의미에서 검색
      Object.values(database).forEach(category => {
        Object.values(category.levels).forEach(level => {
          level.characters.forEach(char => {
            // 의미나 발음 정보를 확인
            if (char.meaning.includes(tagId) || 
                (tagId === 'nature' && ['산', '물', '나무', '불', '흙', '돌', '강', '비', '날씨', '계절', '바다', '하늘', '자연', '지형', '풀', '꽃', '잎', '뿌리', '바람', '구름', '숲', '호수', '태양', '달', '별', '해', '땅', '기후', '환경', '생태', '초목', '습지', '사막', '황', '냇', '비', '우', '설', '운', '개', '우레'].some(keyword => char.meaning.includes(keyword))) ||
                (tagId === 'human' && ['사람', '남자', '여자', '아이', '아버지', '어머니', '가족', '친구', '인간', '인', '자', '신', '인류', '대중', '세대', '사회', '집단', '계층', '군중', '시민', '국민', '민족', '인종', '형제', '자매', '부모', '조상', '후손', '대', '손', '자식'].some(keyword => char.meaning.includes(keyword))) ||
                (tagId === 'body' && ['눈', '귀', '입', '손', '발', '마음', '머리', '얼굴', '팔', '다리', '몸', '심장', '피', '뼈', '간', '폐', '위', '장', '근육', '신경', '두뇌', '혈액', '척추', '관절', '피부', '머리카락', '목', '어깨', '허리', '배', '가슴', '이', '코', '혀', '체', '신', '육', '부', '지', '수', '족', '비', '이', '왜', '면', '구', '안', '목', '수', '두', '미', '골', '근', '발', '혈'].some(keyword => char.meaning.includes(keyword))) ||
                (tagId === 'time' && ['날', '달', '해', '시간', '년', '세월', '일', '주', '월', '시', '분', '초', '과거', '현재', '미래', '요일', '아침', '저녁', '밤', '낮', '금일', '내일', '어제', '금년', '내년', '작년', '금주', '전', '후', '종', '시', '일', '월', '년', '대', '세', '주', '분', '초', '야', '석', '오', '향', '대', '신', '구', '현', '시', '세', '순간', '영원', '영겁'].some(keyword => char.meaning.includes(keyword))) ||
                (tagId === 'place' && ['집', '방', '길', '문', '나라', '도시', '마을', '학교', '회사', '시장', '건물', '장소', '지역', '공간', '위치', '구역', '영역', '대륙', '국가', '도', '시', '군', '구', '촌', '면', '교외', '시외', '교통', '역', '항구', '공항', '기차역', '버스정류장', '광장', '공원', '사무실', '가게', '식당', '카페', '학원', '은행', '병원', '약국', '극장', '체육관', '대학', '초등학교', '중학교', '고등학교', '유치원', '어린이집', '정원', '주차장', '창고', '공장', '연구소', '센터', '지', '처', '소', '방', '실'].some(keyword => char.meaning.includes(keyword))) ||
                (tagId === 'number' && ['하나', '둘', '셋', '넷', '다섯', '여섯', '일곱', '여덟', '아홉', '열', '백', '천', '만', '수', '숫자', '일', '이', '삼', '사', '오', '육', '칠', '팔', '구', '십', '백', '천', '만', '억', '조', '경', '양', '음', '제로', '영', '수량', '횟수', '빈도', '정도', '단위', '퍼센트', '비율', '분수', '소수', '분자', '분모', '배수', '지수', '근', '승', '차', '점', '쌍', '홀수', '짝수'].some(keyword => char.meaning.includes(keyword))) ||
                (tagId === 'action' && ['가다', '오다', '먹다', '보다', '듣다', '말하다', '자다', '서다', '앉다', '뛰다', '일하다', '공부하다', '생각하다', '행동', '작업', '활동', '노동', '이동', '운동', '행위', '활약', '실행', '실시', '조작', '동작', '운용', '조종', '진행', '걷다', '달리다', '쓰다', '읽다', '마시다', '씻다', '만들다', '배우다', '가르치다', '돕다', '웃다', '울다', '노래하다', '춤추다', '놀다', '쉬다', '일어나다', '눕다', '마치다', '시작하다', '행', '동', '작', '활', '운', '진', '이', '작', '전', '지', '교', '종', '표', '학', '장', '하', '움직이다'].some(keyword => char.meaning.includes(keyword))) ||
                (tagId === 'attribute' && ['크다', '작다', '길다', '짧다', '높다', '낮다', '무겁다', '가볍다', '빠르다', '느리다', '강하다', '약하다', '좋다', '나쁘다', '속성', '특성', '특징', '성질', '본질', '성격', '품질', '자질', '특수성', '독특성', '질', '량', '밝다', '어둡다', '뜨겁다', '차갑다', '단단하다', '부드럽다', '날카롭다', '무디다', '거칠다', '매끄럽다', '깊다', '얕다', '굵다', '가늘다', '넓다', '좁다', '두껍다', '얇다', '둥글다', '모나다', '반짝이다', '투명하다', '불투명하다', '특', '성', '질', '대', '소', '장', '단', '고', '저', '강', '약', '경', '중'].some(keyword => char.meaning.includes(keyword))) ||
                (tagId === 'color' && ['빨강', '파랑', '노랑', '하양', '검정', '빨간', '파란', '노란', '하얀', '검은', '녹색', '보라', '주황', '갈색', '색', '색깔', '색상', '색조', '음영', '채도', '명도', '농도', '색감', '혼합색', '보색', '원색', '청색', '적색', '황색', '흑색', '백색', '녹색', '남색', '자색', '회색', '금색', '은색', '동색', '청', '홍', '황', '흑', '백', '녹', '적', '자', '회', '금', '은', '동', '색'].some(keyword => char.meaning.includes(keyword))) ||
                (tagId === 'education' && ['배우다', '학교', '학생', '공부', '교실', '선생', '가르치다', '학', '교육', '강의', '시험', '연구', '책', '읽다', '쓰다', '교사', '수업', '학습', '강습', '훈련', '지도', '교수', '지식', '정보', '자료', '교과서', '참고서', '문제집', '노트', '펜', '연필', '교과', '과목', '영어', '수학', '과학', '역사', '사회', '미술', '음악', '체육', '컴퓨터', '문학', '철학', '심리학', '의학', '법학', '공학', '졸업', '입학', '등록', '학위', '박사', '석사', '학사', '전공', '교', '학', '습', '육', '수', '강', '훈', '지', '도', '술', '연', '구', '교', '학'].some(keyword => char.meaning.includes(keyword))) ||
                (tagId === 'emotion' && ['기쁨', '슬픔', '분노', '사랑', '미움', '즐거움', '두려움', '마음', '감정', '행복', '슬프다', '화나다', '좋아하다', '싫어하다', '걱정', '희망', '절망', '우울', '흥분', '불안', '공포', '충격', '놀람', '감동', '감격', '혐오', '질투', '샘', '동정', '연민', '측은', '애정', '증오', '격노', '원망', '후회', '자랑', '존경', '경멸', '멸시', '수치', '부끄러움', '화', '공', '분', '노', '우', '애', '증', '질', '혐', '경', '슬', '희', '락', '환', '함', '급', '공', '두', '안'].some(keyword => char.meaning.includes(keyword))) ||
                (tagId === 'economy' && ['돈', '물건', '사다', '팔다', '부자', '가난', '재물', '경제', '장사', '거래', '은행', '시장', '가격', '값', '비용', '소비', '저축', '투자', '대출', '이자', '수입', '지출', '급여', '월급', '연봉', '자산', '부채', '부동산', '주식', '채권', '펀드', '화폐', '통화', '환율', '물가', '인플레이션', '세금', '예산', '회계', '무역', '수출', '수입', '유통', '판매', '광고', '마케팅', '기업', '법인', '자본', '이윤', '손실', '수익', '매출', '경', '제', '재', '무', '금', '융', '상', '무', '고', '품', '물', '소', '매', '료', '판', '시', '장', '통', '화'].some(keyword => char.meaning.includes(keyword))) ||
                (tagId === 'politics' && ['나라', '정치', '법', '다스리다', '왕', '권력', '민', '통치', '정부', '국가', '법률', '의회', '대통령', '투표', '선거', '민주주의', '공화국', '입법', '사법', '행정', '정책', '외교', '국방', '안보', '군사', '외교', '내정', '국제', '대외', '조약', '협정', '헌법', '헌정', '시민권', '인권', '자유', '평등', '공정', '정의', '부정', '부패', '개혁', '혁명', '체제', '국정', '정무', '정강', '정책', '정당', '여당', '야당', '의원', '국회', '국회의원', '장관', '총리', '보수', '진보', '헌', '법', '정', '치', '국', '통', '영', '행', '민', '주', '공', '의', '당', '원', '선', '군', '수', '임', '통', '제', '약', '정', '회'].some(keyword => char.meaning.includes(keyword))) ||
                (tagId === 'society' && ['사회', '함께', '모이다', '단체', '공', '집단', '공동', '협력', '조직', '회사', '모임', '단체', '국민', '시민', '사람들', '국가', '문화', '예술', '종교', '과학', '기술', '언론', '매체', '대중매체', '방송', '신문', '잡지', '인터넷', '소셜미디어', '복지', '빈곤', '소외', '계층', '계급', '계급구조', '차별', '편견', '고정관념', '세대', '청년', '중년', '노년', '다양성', '포용', '통합', '공생', '공존', '이익집단', '시민단체', '비영리', '자선', '봉사', '자원봉사', '협동조합', '공동체', '마을', '사', '회', '공', '동', '단', '체', '조', '직', '집', '합', '공', '생', '익', '존', '구', '성', '원', '참', '여', '무', '리', '민', '족', '가', '족'].some(keyword => char.meaning.includes(keyword)))
              ) {
              hanjaSet.add(char.character);
            }
          });
        });
      });
      break;
    
    case 'difficulty':
      Object.values(database).forEach(category => {
        Object.values(category.levels).forEach(level => {
          level.characters.forEach(char => {
            // 난이도에 따라 한자 분류 (획수 기준)
            if ((tagId === 'beginner' && char.stroke_count <= 4) ||
                (tagId === 'intermediate' && char.stroke_count > 4 && char.stroke_count <= 9) ||
                (tagId === 'advanced' && char.stroke_count > 9)) {
              hanjaSet.add(char.character);
            }
          });
        });
      });
      break;
    
    case 'radical':
      // 부수 기반 태그는 부수 정보에서 검색
      const radicalMap: Record<string, string[]> = {
        'person': ['人', '亻', '𠆢'],
        'heart': ['心', '忄', '㣺'],
        'water': ['水', '氵', '氺'],
        'tree': ['木', '朩'],
        'speech': ['言', '訁'],
        'fire': ['火', '灬'],
        'earth': ['土'],
        'metal': ['金', '釒'],
        'hand': ['手', '扌', '龵'],
        'foot': ['足', '⻊'],
        'door': ['門', '戶', '户'],
        'grass': ['艹', '艸', '卄'],
        'stone': ['石'],
        'clothing': ['衣', '衤'],
        'eye': ['目', '罒']
      };
      
      const targetRadicals = radicalMap[tagId] || [];
      
      Object.values(database).forEach(category => {
        Object.values(category.levels).forEach(level => {
          level.characters.forEach(char => {
            // 부수나 의미를 기반으로 검색
            if (targetRadicals.some(r => char.radical.includes(r)) || 
                (tagId === 'person' && ['사람', '인', '인간', '남', '여', '아이'].some(keyword => char.meaning.includes(keyword))) ||
                (tagId === 'heart' && ['마음', '심', '정', '생각', '감정'].some(keyword => char.meaning.includes(keyword))) ||
                (tagId === 'water' && ['물', '수', '강', '바다', '비', '습'].some(keyword => char.meaning.includes(keyword))) ||
                (tagId === 'tree' && ['나무', '목', '숲', '림', '초목', '식물'].some(keyword => char.meaning.includes(keyword))) ||
                (tagId === 'speech' && ['말', '언', '어', '설', '화', '담', '대화'].some(keyword => char.meaning.includes(keyword))) ||
                (tagId === 'fire' && ['불', '화', '연', '타다', '열'].some(keyword => char.meaning.includes(keyword))) ||
                (tagId === 'earth' && ['흙', '토', '지', '땅'].some(keyword => char.meaning.includes(keyword))) ||
                (tagId === 'metal' && ['쇠', '금', '철', '동', '은', '금속'].some(keyword => char.meaning.includes(keyword))) ||
                (tagId === 'hand' && ['손', '수', '팔', '잡다'].some(keyword => char.meaning.includes(keyword))) ||
                (tagId === 'foot' && ['발', '족', '다리', '걷다'].some(keyword => char.meaning.includes(keyword))) ||
                (tagId === 'door' && ['문', '호', '집', '가', '가옥', '들어가다'].some(keyword => char.meaning.includes(keyword))) ||
                (tagId === 'grass' && ['풀', '초', '식물', '잎', '꽃'].some(keyword => char.meaning.includes(keyword))) ||
                (tagId === 'stone' && ['돌', '석', '바위', '광석'].some(keyword => char.meaning.includes(keyword))) ||
                (tagId === 'clothing' && ['옷', '의', '복', '입다', '천', '실'].some(keyword => char.meaning.includes(keyword))) ||
                (tagId === 'eye' && ['눈', '목', '보다', '시력', '시각'].some(keyword => char.meaning.includes(keyword)))
            ) {
              hanjaSet.add(char.character);
            }
          });
        });
      });
      break;
    
    case 'education':
      // 교육 과정 태그는 레벨 정보와 카테고리 이름을 함께 고려
      Object.entries(database).forEach(([categoryKey, category]) => {
        // 교육 단계별 매핑
        if (tagId === 'elementary' && categoryKey === 'basic') {
          // 초등학교 단계에 해당하는 한자
          Object.entries(category.levels).forEach(([levelKey, level]) => {
            if (levelKey.startsWith('level') && parseInt(levelKey.replace('level', '')) <= 4) {
              level.characters.forEach(char => {
                hanjaSet.add(char.character);
              });
            }
          });
        } 
        else if (tagId === 'middle' && (categoryKey === 'basic' || categoryKey === 'middle')) {
          // 중학교 단계에 해당하는 한자
          Object.entries(category.levels).forEach(([levelKey, level]) => {
            if ((categoryKey === 'basic' && levelKey.startsWith('level') && parseInt(levelKey.replace('level', '')) >= 5 && parseInt(levelKey.replace('level', '')) <= 6) ||
                (categoryKey === 'middle' && level.name.includes('중학'))) {
              level.characters.forEach(char => {
                hanjaSet.add(char.character);
              });
            }
          });
        }
        else if (tagId === 'high' && (categoryKey === 'advanced')) {
          // 고등학교 단계에 해당하는 한자
          Object.entries(category.levels).forEach(([levelKey, level]) => {
            if (level.name.includes('고등') || level.description.includes('고등')) {
              level.characters.forEach(char => {
                hanjaSet.add(char.character);
              });
            }
          });
        }
        else if (tagId === 'university' && (categoryKey === 'university')) {
          // 대학교 단계에 해당하는 한자
          Object.values(category.levels).forEach(level => {
            level.characters.forEach(char => {
              hanjaSet.add(char.character);
            });
          });
        }
        
        // 추가: 모든 한자를 검색할 때는 딱지 속성도 고려
        if (tagId === 'elementary') {
          Object.values(category.levels).forEach(level => {
            level.characters.forEach(char => {
              if (char.level <= 4) {
                hanjaSet.add(char.character);
              }
            });
          });
        } 
        else if (tagId === 'middle') {
          Object.values(category.levels).forEach(level => {
            level.characters.forEach(char => {
              if (char.level >= 5 && char.level <= 6) {
                hanjaSet.add(char.character);
              }
            });
          });
        }
        else if (tagId === 'high') {
          Object.values(category.levels).forEach(level => {
            level.characters.forEach(char => {
              if (char.level >= 7 && char.level <= 8) {
                hanjaSet.add(char.character);
              }
            });
          });
        }
        else if (tagId === 'university') {
          Object.values(category.levels).forEach(level => {
            level.characters.forEach(char => {
              if (char.level >= 9) {
                hanjaSet.add(char.character);
              }
            });
          });
        }
      });
      break;
      
    default:
      // 기본적으로 태그 예제 한자만 반환
      break;
  }
  
  // Set을 배열로 변환하여 반환
  return Array.from(hanjaSet);
};

const TagPage = ({ params }: { params: { category: string; tag: string } }) => {
  const { category, tag } = params;
  const router = useRouter();
  
  // 링크 클릭 핸들러 추가
  const handleLinkClick = (href: string, e: React.MouseEvent) => {
    e.preventDefault();
    router.push(href);
  };
  
  // 해당 태그 정보 찾기
  const categoryData = TAGS_DATA.tag_categories.find((cat: TagCategory) => cat.id === category);
  const tagData = categoryData?.tags.find((t: Tag) => t.id === tag);
  
  // 태그를 찾을 수 없는 경우
  if (!tagData) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 px-4">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-slate-800 mb-4">태그를 찾을 수 없습니다</h1>
          <p className="text-lg text-slate-600 mb-8">요청하신 태그 정보를 찾을 수 없습니다.</p>
          <Link 
            href="/tags" 
            prefetch={true}
            onClick={(e) => handleLinkClick('/tags', e)}
            className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-full shadow-lg transition"
          >
            모든 태그 보기
          </Link>
        </div>
      </div>
    );
  }
  
  // 해당 카테고리 스타일 가져오기
  const styles = getCategoryStyles(category);
  
  // 태그와 관련된 한자 찾기
  const relatedHanjaList = findHanjaForTag(tag, category, tagData.examples);
  
  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <Link 
            href="/tags" 
            prefetch={true}
            onClick={(e) => handleLinkClick('/tags', e)}
            className="text-blue-600 hover:text-blue-800 inline-flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            모든 태그로 돌아가기
          </Link>
        </div>
        
        <div className="mb-12">
          <div className="flex items-center mb-2">
            <span className={`inline-block px-3 py-1 ${styles.bg} ${styles.text} rounded-full text-sm font-medium mr-2`}>
              {categoryData?.name}
            </span>
          </div>
          <h1 className="text-4xl font-bold mb-4 text-slate-800">{tagData.name} 한자</h1>
          <p className="text-lg text-slate-600 max-w-3xl">{tagData.description}</p>
        </div>
        
        {/* 한자 목록 섹션 */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-12">
          <h2 className="text-2xl font-bold mb-6 pb-2 border-b border-slate-200">
            {tagData.name} 관련 한자 <span className="text-sm font-normal text-slate-500">({relatedHanjaList.length}자)</span>
          </h2>
          
          <div className="mb-4 text-sm text-amber-600 p-2 bg-amber-50 rounded-lg">
            <p>
              현재 표시된 한자는 데이터베이스에서 실제로 찾은 한자만 표시합니다. 태그 페이지에 표시된 한자 수는 전체 1,800자 중 예상 비율이므로 차이가 있을 수 있습니다.
            </p>
          </div>
          
          {relatedHanjaList.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {relatedHanjaList.map((character, idx) => (
                <Link
                  key={idx}
                  href={`/learn/hanja/${encodeURIComponent(character)}`}
                  prefetch={true}
                  onClick={(e) => handleLinkClick(`/learn/hanja/${encodeURIComponent(character)}`, e)}
                  className="aspect-square flex flex-col items-center justify-center bg-white rounded-lg shadow-sm border border-gray-200 hover:border-blue-400 hover:shadow-md transition"
                >
                  <span className="text-4xl mb-2">{character}</span>
                  <span className="text-xs text-slate-500">자세히 보기</span>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-slate-500">
              <p>아직 데이터베이스에 {tagData.name} 관련 한자가 충분하지 않습니다.</p>
            </div>
          )}
        </div>
        
        {/* 다른 태그 탐색 섹션 */}
        {categoryData && categoryData.tags.length > 1 && (
          <div className="bg-white rounded-xl shadow-md p-6 mb-12">
            <h2 className="text-2xl font-bold mb-6 pb-2 border-b border-slate-200">
              다른 {categoryData.name} 태그 탐색하기
            </h2>
            
            <div className="flex flex-wrap gap-2 mt-4">
              {categoryData.tags.filter(t => t.id !== tag).map((otherTag) => {
                // 다른 태그의 한자 수 표시
                const otherTagHanjaCount = findHanjaForTag(otherTag.id, category, otherTag.examples).length;
                
                return (
                  <Link
                    key={otherTag.id}
                    href={`/tags/${category}/${otherTag.id}`}
                    prefetch={true}
                    onClick={(e) => handleLinkClick(`/tags/${category}/${otherTag.id}`, e)}
                    className={`inline-block px-4 py-2 ${styles.bg} ${styles.text} border ${styles.border} rounded-full hover:shadow-md transition`}
                  >
                    {otherTag.name} <span className="text-xs">({otherTagHanjaCount})</span>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
        
        <div className="text-center mt-12">
          <Link 
            href="/learn" 
            className="inline-block px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-full shadow-lg transition transform hover:scale-105"
          >
            한자 학습 시작하기
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TagPage;