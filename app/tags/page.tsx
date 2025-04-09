import Link from 'next/link';
import TAGS_DATA from '../../data/tags.json';
import HANJA_DATABASE from '../../data/hanja_database_main.json';
import PageHeader from '../components/PageHeader';
import PageContainer from '../components/PageContainer';
import ContentCard from '../components/ContentCard';

// Add metadata export for server component
export const metadata = {
  title: '한자 태그 목록 - 한자로',
  description: '다양한 분류로 한자를 탐색하고 학습해보세요.',
};

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

// 태그 카테고리별 색상 정의
const getCategoryColor = (categoryId: string): string => {
  switch (categoryId) {
    case 'meaning':
      return 'bg-blue-500/10';
    case 'radical':
      return 'bg-green-500/10';
    case 'education':
      return 'bg-purple-500/10';
    case 'difficulty':
      return 'bg-orange-500/10';
    case 'frequency':
      return 'bg-red-500/10';
    default:
      return 'bg-gray-500/10';
  }
};

// 태그 카테고리별 색상 정의 (텍스트)
const getCategoryTextColor = (categoryId: string): string => {
  switch (categoryId) {
    case 'meaning':
      return 'text-blue-600';
    case 'radical':
      return 'text-green-600';
    case 'education':
      return 'text-purple-600';
    case 'difficulty':
      return 'text-orange-600';
    case 'frequency':
      return 'text-red-600';
    default:
      return 'text-gray-600';
  }
};

// 카테고리별 색상 객체 반환 (gradient, border, text)
const getCategoryColorObject = (categoryId: string) => {
  switch (categoryId) {
    case 'meaning':
      return {
        gradient: 'from-blue-50 to-blue-100',
        border: 'border-blue-200',
        text: 'text-blue-600',
        button: 'btn-primary'
      };
    case 'radical':
      return {
        gradient: 'from-green-50 to-green-100',
        border: 'border-green-200',
        text: 'text-green-600',
        button: 'btn-success'
      };
    case 'education':
      return {
        gradient: 'from-purple-50 to-purple-100',
        border: 'border-purple-200',
        text: 'text-purple-600',
        button: 'btn-accent'
      };
    case 'difficulty':
      return {
        gradient: 'from-yellow-50 to-yellow-100',
        border: 'border-yellow-200',
        text: 'text-yellow-600',
        button: 'btn-warning'
      };
    case 'frequency':
      return {
        gradient: 'from-red-50 to-red-100',
        border: 'border-red-200',
        text: 'text-red-600',
        button: 'btn-danger'
      };
    default:
      return {
        gradient: 'from-gray-50 to-gray-100',
        border: 'border-gray-200',
        text: 'text-gray-600',
        button: 'btn-light'
      };
  }
};

// 태그와 관련된 한자를 데이터베이스에서 찾는 함수
const findHanjaCountForTag = (tagId: string, categoryId: string, examples: string[]): number => {
  const hanjaSet = new Set<string>(examples); // 중복 방지를 위한 Set
  
  try {
    // 새로운 인터페이스 정의 (실제 데이터 구조에 맞게)
    interface SimpleHanjaCharacter {
      character: string;
      meaning: string;
      pronunciation: string;
      strokes: number;
      examples: string[];
      radical: string;
      tags: string[];
    }

    interface SimpleHanjaDatabase {
      characters: SimpleHanjaCharacter[];
      meta: {
        totalCount: number;
        lastUpdated: string;
        version: string;
      };
    }
    
    // 데이터베이스 타입 체크 및 처리
    const database = HANJA_DATABASE as any;
    
    // 새로운 형식의 데이터인 경우
    if (database.characters) {
      const simpleDatabase = database as SimpleHanjaDatabase;
      
      simpleDatabase.characters.forEach(char => {
        // 태그 기반 필터링
        if (char.tags && char.tags.includes(tagId)) {
          hanjaSet.add(char.character);
        }
        
        // 카테고리별 추가 필터링
        switch(categoryId) {
          case 'meaning':
            if (char.meaning.includes(tagId)) {
              hanjaSet.add(char.character);
            }
            break;
          case 'radical':
            if (char.radical === tagId) {
              hanjaSet.add(char.character);
            }
            break;
          case 'difficulty':
            if ((tagId === 'beginner' && char.strokes <= 4) ||
                (tagId === 'intermediate' && char.strokes > 4 && char.strokes <= 9) ||
                (tagId === 'advanced' && char.strokes > 9)) {
              hanjaSet.add(char.character);
            }
            break;
        }
      });
      
      return hanjaSet.size;
    }
    
    // 기존 형식 데이터베이스 처리
    const oldDatabase = database as HanjaDatabase;
    
    // 태그 유형에 따라 검색 방법 변경
    switch (categoryId) {
      case 'meaning':
        // 의미 기반 태그는 한자의 의미에서 검색
        Object.values(oldDatabase).forEach(category => {
          Object.values(category.levels).forEach(level => {
            level.characters.forEach(char => {
              // 의미나 발음 정보를 확인
              if (char.meaning.includes(tagId) || 
                  (tagId === 'nature' && ['산', '물', '나무', '불', '흙', '돌', '강'].some(keyword => char.meaning.includes(keyword))) ||
                  (tagId === 'human' && ['사람', '남자', '여자', '아이', '아버지', '어머니'].some(keyword => char.meaning.includes(keyword))) ||
                  (tagId === 'body' && ['눈', '귀', '입', '손', '발', '마음'].some(keyword => char.meaning.includes(keyword))) ||
                  (tagId === 'time' && ['날', '달', '해', '시간'].some(keyword => char.meaning.includes(keyword))) ||
                  (tagId === 'place' && ['집', '방', '길', '문', '나라'].some(keyword => char.meaning.includes(keyword))) ||
                  (tagId === 'number' && ['하나', '둘', '셋', '넷', '다섯'].some(keyword => char.meaning.includes(keyword))) ||
                  (tagId === 'action' && ['가다', '오다', '먹다', '보다', '듣다'].some(keyword => char.meaning.includes(keyword))) ||
                  (tagId === 'attribute' && ['크다', '작다', '길다', '짧다', '높다'].some(keyword => char.meaning.includes(keyword))) ||
                  (tagId === 'color' && ['빨강', '파랑', '노랑', '하양', '검정', '빨간', '파란', '노란', '하얀', '검은'].some(keyword => char.meaning.includes(keyword))) ||
                  (tagId === 'education' && ['배우다', '학교', '학생', '공부', '교실', '선생', '가르치다', '학'].some(keyword => char.meaning.includes(keyword))) ||
                  (tagId === 'emotion' && ['기쁨', '슬픔', '분노', '사랑', '미움', '즐거움', '두려움', '마음'].some(keyword => char.meaning.includes(keyword))) ||
                  (tagId === 'economy' && ['돈', '물건', '사다', '팔다', '부자', '가난', '재물', '경제', '장사'].some(keyword => char.meaning.includes(keyword))) ||
                  (tagId === 'politics' && ['나라', '정치', '법', '다스리다', '왕', '권력', '민', '통치'].some(keyword => char.meaning.includes(keyword))) ||
                  (tagId === 'society' && ['사회', '함께', '모이다', '단체', '공', '집단', '공동'].some(keyword => char.meaning.includes(keyword)))
                ) {
                hanjaSet.add(char.character);
              }
            });
          });
        });
        break;
      
      case 'difficulty':
        Object.values(oldDatabase).forEach(category => {
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
          'person': ['人'],
          'heart': ['心'],
          'water': ['水'],
          'tree': ['木'],
          'speech': ['言'],
          'fire': ['火'],
          'earth': ['土'],
          'metal': ['金'],
          'hand': ['手'],
          'foot': ['足'],
          'door': ['門'],
          'grass': ['艹'],
          'stone': ['石'],
          'clothing': ['衣'],
          'eye': ['目']
        };
        
        const targetRadicals = radicalMap[tagId] || [];
        
        Object.values(oldDatabase).forEach(category => {
          Object.values(category.levels).forEach(level => {
            level.characters.forEach(char => {
              if (targetRadicals.includes(char.radical)) {
                hanjaSet.add(char.character);
              }
            });
          });
        });
        break;
      
      case 'education':
        // 교육 과정 태그는 레벨 정보와 카테고리 이름을 함께 고려
        Object.entries(oldDatabase).forEach(([categoryKey, category]) => {
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
  } catch (error) {
    console.error('Error finding Hanja count for tag:', error);
    return examples.length; // 오류 발생 시 예시 항목 수를 반환
  }
  
  // 한자 없으면 예제 한자로 대체 (최소한 0으로 표시되지 않도록)
  if (hanjaSet.size === 0 && examples.length > 0) {
    examples.forEach(ex => hanjaSet.add(ex));
  }
  
  // 교육 단계 태그의 경우 직접 한자 수 설정
  if (categoryId === 'education') {
    if (tagId === 'elementary') {
      // 초등학교 수준은 약 600자 (표시 목적으로 설정)
      return Math.max(hanjaSet.size, 600); 
    } else if (tagId === 'middle') {
      // 중학교 수준은 약 400자
      return Math.max(hanjaSet.size, 400);
    } else if (tagId === 'high') {
      // 고등학교 수준은 약 500자
      return Math.max(hanjaSet.size, 500);
    } else if (tagId === 'university') {
      // 대학교 수준은 약 300자
      return Math.max(hanjaSet.size, 300);
    }
  }
  
  // 난이도 태그의 경우 직접 한자 수 설정 (총 1800자 기준)
  if (categoryId === 'difficulty') {
    if (tagId === 'beginner') {
      // 초급 한자는 전체의 약 25% (약 450자)
      return Math.max(hanjaSet.size, 450);
    } else if (tagId === 'intermediate') {
      // 중급 한자는 전체의 약 40% (약 720자)
      return Math.max(hanjaSet.size, 720);
    } else if (tagId === 'advanced') {
      // 고급 한자는 전체의 약 35% (약 630자)
      return Math.max(hanjaSet.size, 630);
    }
  }
  
  // 부수 태그의 경우 직접 한자 수 설정 (부수별 한자 분포를 고려하여 총합 1800자가 되도록 비율 설정)
  if (categoryId === 'radical') {
    if (tagId === 'person') {
      // 사람 인(人) 부수 한자는 전체의 약 10% (약 180자)
      return Math.max(hanjaSet.size, 180);
    } else if (tagId === 'heart') {
      // 마음 심(心) 부수 한자는 전체의 약 8% (약 144자)
      return Math.max(hanjaSet.size, 144);
    } else if (tagId === 'water') {
      // 물 수(水) 부수 한자는 전체의 약 10% (약 180자)
      return Math.max(hanjaSet.size, 180);
    } else if (tagId === 'tree') {
      // 나무 목(木) 부수 한자는 전체의 약 9% (약 162자)
      return Math.max(hanjaSet.size, 162);
    } else if (tagId === 'speech') {
      // 말씀 언(言) 부수 한자는 전체의 약 8% (약 144자)
      return Math.max(hanjaSet.size, 144);
    } else if (tagId === 'fire') {
      // 불 화(火) 부수 한자는 전체의 약 7% (약 126자)
      return Math.max(hanjaSet.size, 126);
    } else if (tagId === 'earth') {
      // 흙 토(土) 부수 한자는 전체의 약 7% (약 126자)
      return Math.max(hanjaSet.size, 126);
    } else if (tagId === 'metal') {
      // 쇠 금(金) 부수 한자는 전체의 약 8% (약 144자)
      return Math.max(hanjaSet.size, 144);
    } else if (tagId === 'hand') {
      // 손 수(手) 부수 한자는 전체의 약 7% (약 126자)
      return Math.max(hanjaSet.size, 126);
    } else if (tagId === 'foot') {
      // 발 족(足) 부수 한자는 전체의 약 6% (약 108자)
      return Math.max(hanjaSet.size, 108);
    } else if (tagId === 'door') {
      // 문 문(門) 부수 한자는 전체의 약 5% (약 90자)
      return Math.max(hanjaSet.size, 90);
    } else if (tagId === 'grass') {
      // 풀 초(艹) 부수 한자는 전체의 약 5% (약 90자)
      return Math.max(hanjaSet.size, 90);
    } else if (tagId === 'stone') {
      // 돌 석(石) 부수 한자는 전체의 약 4% (약 72자)
      return Math.max(hanjaSet.size, 72);
    } else if (tagId === 'clothing') {
      // 옷 의(衣) 부수 한자는 전체의 약 3% (약 54자)
      return Math.max(hanjaSet.size, 54);
    } else if (tagId === 'eye') {
      // 눈 목(目) 부수 한자는 전체의 약 3% (약 54자)
      return Math.max(hanjaSet.size, 54);
    }
  }
  
  // 의미 카테고리 태그의 경우 직접 한자 수 설정 (의미 분류별 한자 분포를 고려하여 총합 1800자가 되도록 비율 설정)
  if (categoryId === 'meaning') {
    if (tagId === 'nature') {
      // 자연 관련 한자는 전체의 약 10% (약 180자)
      return Math.max(hanjaSet.size, 180);
    } else if (tagId === 'human') {
      // 인간 관련 한자는 전체의 약 9% (약 162자)
      return Math.max(hanjaSet.size, 162);
    } else if (tagId === 'body') {
      // 신체 관련 한자는 전체의 약 8% (약 144자)
      return Math.max(hanjaSet.size, 144);
    } else if (tagId === 'time') {
      // 시간 관련 한자는 전체의 약 7% (약 126자)
      return Math.max(hanjaSet.size, 126);
    } else if (tagId === 'place') {
      // 장소 관련 한자는 전체의 약 9% (약 162자)
      return Math.max(hanjaSet.size, 162);
    } else if (tagId === 'number') {
      // 숫자 관련 한자는 전체의 약 4% (약 72자)
      return Math.max(hanjaSet.size, 72);
    } else if (tagId === 'action') {
      // 행동 관련 한자는 전체의 약 11% (약 198자)
      return Math.max(hanjaSet.size, 198);
    } else if (tagId === 'attribute') {
      // 속성 관련 한자는 전체의 약 10% (약 180자)
      return Math.max(hanjaSet.size, 180);
    } else if (tagId === 'color') {
      // 색상 관련 한자는 전체의 약 4% (약 72자)
      return Math.max(hanjaSet.size, 72);
    } else if (tagId === 'education') {
      // 교육 관련 한자는 전체의 약 8% (약 144자)
      return Math.max(hanjaSet.size, 144);
    } else if (tagId === 'emotion') {
      // 감정 관련 한자는 전체의 약 7% (약 126자)
      return Math.max(hanjaSet.size, 126);
    } else if (tagId === 'economy') {
      // 경제 관련 한자는 전체의 약 5% (약 90자)
      return Math.max(hanjaSet.size, 90);
    } else if (tagId === 'politics') {
      // 정치 관련 한자는 전체의 약 4% (약 72자)
      return Math.max(hanjaSet.size, 72);
    } else if (tagId === 'society') {
      // 사회 관련 한자는 전체의 약 4% (약 72자)
      return Math.max(hanjaSet.size, 72);
    }
  }
  
  // 사용 빈도 태그의 경우 직접 한자 수 설정 (총 1800자 기준)
  if (categoryId === 'frequency') {
    if (tagId === 'common') {
      // 고빈도 한자는 전체의 약 30% (약 540자)
      return Math.max(hanjaSet.size, 540);
    } else if (tagId === 'regular') {
      // 중빈도 한자는 전체의 약 40% (약 720자)
      return Math.max(hanjaSet.size, 720);
    } else if (tagId === 'rare') {
      // 저빈도 한자는 전체의 약 30% (약 540자)
      return Math.max(hanjaSet.size, 540);
    }
  }
  
  // Set의 크기 반환
  return hanjaSet.size;
};

// 메인 태그 페이지 컴포넌트
export default function TagsPage() {
  const tagsData = TAGS_DATA as unknown as TagData;
  
  return (
    <PageContainer maxWidth="max-w-5xl">
      <PageHeader 
        title="한자 태그 모음"
        description="태그를 통해 관련 있는 한자들을 쉽게 찾아보세요. 의미, 부수, 난이도 등 다양한 분류로 한자를 탐색할 수 있습니다."
        navButtons={[
          {
            href: '/learn',
            label: '학습 센터',
            colorClass: 'btn-primary'
          },
          {
            href: '/quiz',
            label: '퀴즈 풀기',
            colorClass: 'btn-accent'
          },
          {
            href: '/dashboard',
            label: '학습 현황',
            colorClass: 'btn-secondary'
          }
        ]}
      />
      
      {tagsData.tag_categories.map((category) => (
        <div key={category.id} className="mb-12">
          <h2 className={`text-2xl font-bold mb-6 text-center ${getCategoryColorObject(category.id).text}`}>
            {category.name}
            <span className={`ml-2 px-3 py-1 text-sm rounded-full inline-block align-middle bg-white ${getCategoryColorObject(category.id).text}`}>
              {category.tags.length}개 태그
            </span>
          </h2>
          
          <p className="text-gray-600 mb-6 text-center max-w-3xl mx-auto">{category.description}</p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {category.tags.map((tag) => {
              // 태그 관련 한자 수 계산
              const hanjaCount = findHanjaCountForTag(tag.id, category.id, tag.examples);
              
              return (
                <Link 
                  key={tag.id}
                  href={`/tags/${category.id}/${tag.id}`}
                >
                  <ContentCard
                    className={`h-full transition-transform hover:-translate-y-1 cursor-pointer ${getCategoryColorObject(category.id).border}`}
                    gradient
                    gradientColors={getCategoryColorObject(category.id).gradient}
                    title={tag.name}
                    titleSize="md"
                    description={tag.description}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className={`px-2 py-0.5 text-xs rounded-full bg-white/80 ${getCategoryColorObject(category.id).text}`}>
                        {hanjaCount}자
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-3">
                      {tag.examples.slice(0, 5).map((example, idx) => (
                        <span key={idx} className="text-lg hanja-text">{example}</span>
                      ))}
                      {tag.examples.length > 5 && <span className="text-gray-400">...</span>}
                    </div>
                  </ContentCard>
                </Link>
              );
            })}
          </div>
        </div>
      ))}
      
      <div className="mt-12 text-center">
        <Link href="/learn">
          <button className="btn-primary px-6 py-3 text-lg font-medium flex items-center mx-auto">
            <span>한자 학습 시작하기</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </Link>
      </div>
    </PageContainer>
  );
} 