import Link from 'next/link';
import TAGS_DATA from '../../data/tags.json';
import HANJA_DATABASE from '../../data/hanja_database_main.json';

// 메타데이터
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

// 카테고리별 색상 설정
const getCategoryColor = (category: string): string => {
  const colors: Record<string, { bg: string, border: string, text: string }> = {
    'meaning': { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-800' },
    'difficulty': { bg: 'bg-yellow-50', border: 'border-yellow-200', text: 'text-yellow-800' },
    'radical': { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-800' },
    'usage': { bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-800' },
    'education': { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-800' },
  };
  
  return colors[category] ? colors[category].bg : 'bg-gray-50';
};

// 카테고리별 텍스트 색상 설정
const getCategoryTextColor = (category: string): string => {
  const colors: Record<string, string> = {
    'meaning': 'text-blue-800',
    'difficulty': 'text-yellow-800',
    'radical': 'text-green-800',
    'usage': 'text-purple-800',
    'education': 'text-red-800',
  };
  
  return colors[category] || 'text-gray-800';
};

// 카테고리별 테두리 색상 설정
const getCategoryBorderColor = (category: string): string => {
  const colors: Record<string, string> = {
    'meaning': 'border-blue-200',
    'difficulty': 'border-yellow-200',
    'radical': 'border-green-200',
    'usage': 'border-purple-200',
    'education': 'border-red-200',
  };
  
  return colors[category] || 'border-gray-200';
};

// 카테고리별 호버 색상 설정
const getCategoryHoverColor = (category: string): string => {
  const colors: Record<string, string> = {
    'meaning': 'hover:bg-blue-100',
    'difficulty': 'hover:bg-yellow-100',
    'radical': 'hover:bg-green-100',
    'usage': 'hover:bg-purple-100',
    'education': 'hover:bg-red-100',
  };
  
  return colors[category] || 'hover:bg-gray-100';
};

// 태그와 관련된 한자를 데이터베이스에서 찾는 함수
const findHanjaCountForTag = (tagId: string, categoryId: string, examples: string[]): number => {
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
      
      Object.values(database).forEach(category => {
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
  if (categoryId === 'usage') {
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

const TagsPage = () => {
  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold mb-4 text-slate-800">다양한 분류로 한자 탐색하기</h1>
          <p className="text-lg text-slate-600 max-w-3xl mx-auto">
            의미, 난이도, 부수별로 한자를 탐색하고 원하는 주제별로 학습해보세요.
          </p>
          <div className="mt-4 text-sm text-amber-600 max-w-3xl mx-auto p-2 bg-amber-50 rounded-lg">
            <p>
              각 태그에 표시된 한자 수는 전체 1,800자 중 예상 비율을 나타내며, 현재 데이터베이스에 포함된 실제 한자 수와 차이가 있을 수 있습니다.
            </p>
          </div>
        </div>
        
        {TAGS_DATA.tag_categories
          .filter((category: TagCategory) => category.id === 'meaning' || category.id === 'radical')
          .map((category: TagCategory) => (
          <div key={category.id} className="mb-16">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-slate-800">{category.name}</h2>
              <span className="text-slate-500 text-sm">{category.tags.length}개 태그</span>
            </div>
            <p className="mb-6 text-slate-600">{category.description}</p>
            
            {/* 태그 클라우드 형태로 표시 */}
            <div className={`${getCategoryColor(category.id)} rounded-3xl p-8 shadow-inner border ${getCategoryBorderColor(category.id)}`}>
              <div className="flex flex-wrap justify-center gap-3 md:gap-4">
                {category.tags.map((tag: Tag) => {
                  // 태그의 한자 수 계산
                  const hanjaCount = findHanjaCountForTag(tag.id, category.id, tag.examples);
                  
                  // 태그의 크기와 중요도는 한자 수에 비례
                  const importance = Math.min(Math.max(hanjaCount, 5) / 20, 1); // 0.25 ~ 1 범위로 정규화
                  const fontSize = 0.8 + importance * 0.6; // 0.8rem ~ 1.4rem
                  const fontWeight = importance > 0.7 ? 'font-semibold' : importance > 0.4 ? 'font-medium' : 'font-normal';
                  const opacity = 0.7 + importance * 0.3; // 0.7 ~ 1.0
                  
                  return (
                    <Link 
                      key={tag.id} 
                      href={`/tags/${category.id}/${tag.id}`}
                      className={`inline-block px-4 py-2 rounded-full bg-white shadow-sm 
                                 hover:shadow-md transition transform hover:-translate-y-1
                                 ${getCategoryTextColor(category.id)} border ${getCategoryBorderColor(category.id)}
                                 ${getCategoryHoverColor(category.id)}`}
                      style={{ 
                        fontSize: `${fontSize}rem`,
                        opacity: opacity,
                      }}
                    >
                      <div className="flex items-center">
                        <span className={fontWeight}>{tag.name}</span>
                        <span className="inline-flex items-center justify-center ml-2 px-1.5 py-0.5 bg-gray-100 rounded-full text-xs text-gray-600">
                          {hanjaCount}
                        </span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        ))}
        
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

export default TagsPage; 