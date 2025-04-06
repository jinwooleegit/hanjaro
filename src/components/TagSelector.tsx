import React, { useState, useEffect } from 'react';
import { getAllTagCategories, getTagsByCategoryId } from '../utils/tagUtils';
import { Tag, TagCategory } from '../utils/tagUtils';

interface TagSelectorProps {
  selectedTags: string[];
  onTagsChange: (selectedTags: string[]) => void;
}

const TagSelector: React.FC<TagSelectorProps> = ({ selectedTags, onTagsChange }) => {
  const [tagCategories, setTagCategories] = useState<TagCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [tagsInCategory, setTagsInCategory] = useState<Tag[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // 모든 태그 카테고리 로드
  useEffect(() => {
    const loadCategories = async () => {
      try {
        setLoading(true);
        const categories = await getAllTagCategories();
        setTagCategories(categories);
        
        // 첫 번째 카테고리를 기본 선택
        if (categories.length > 0) {
          setSelectedCategory(categories[0].id);
        }
        
        setError(null);
      } catch (err) {
        setError('태그 카테고리를 불러오는 중 오류가 발생했습니다.');
        console.error('Error loading tag categories:', err);
      } finally {
        setLoading(false);
      }
    };

    loadCategories();
  }, []);

  // 선택된 카테고리에 따라 태그 로드
  useEffect(() => {
    const loadTagsForCategory = async () => {
      if (!selectedCategory) return;
      
      try {
        setLoading(true);
        const tags = await getTagsByCategoryId(selectedCategory);
        setTagsInCategory(tags);
        setError(null);
      } catch (err) {
        setError('선택한 카테고리의 태그를 불러오는 중 오류가 발생했습니다.');
        console.error('Error loading tags for category:', err);
      } finally {
        setLoading(false);
      }
    };

    loadTagsForCategory();
  }, [selectedCategory]);

  // 카테고리 변경 핸들러
  const handleCategoryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategory(event.target.value);
  };

  // 태그 토글 핸들러
  const toggleTag = (tagId: string) => {
    const tagFullId = `${selectedCategory}:${tagId}`;
    
    if (selectedTags.includes(tagFullId)) {
      onTagsChange(selectedTags.filter(tag => tag !== tagFullId));
    } else {
      onTagsChange([...selectedTags, tagFullId]);
    }
  };

  // 태그 카테고리별 색상 지정
  const getCategoryColor = (categoryId: string): string => {
    const colorMap: Record<string, string> = {
      meaning: 'bg-blue-100 border-blue-300 text-blue-800',
      difficulty: 'bg-green-100 border-green-300 text-green-800',
      radical: 'bg-purple-100 border-purple-300 text-purple-800',
      usage: 'bg-orange-100 border-orange-300 text-orange-800',
      education: 'bg-red-100 border-red-300 text-red-800'
    };

    return colorMap[categoryId] || 'bg-gray-100 border-gray-300 text-gray-800';
  };

  if (loading && tagCategories.length === 0) {
    return <div className="flex justify-center items-center p-4">로딩 중...</div>;
  }

  if (error) {
    return <div className="text-red-500 p-4">{error}</div>;
  }

  return (
    <div className="w-full bg-white rounded-lg shadow p-4">
      <h2 className="text-lg font-semibold mb-4">태그 필터</h2>
      
      {/* 카테고리 선택 */}
      <div className="mb-4">
        <label htmlFor="category-select" className="block text-sm font-medium text-gray-700 mb-1">
          카테고리 선택
        </label>
        <select
          id="category-select"
          value={selectedCategory || ''}
          onChange={handleCategoryChange}
          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {tagCategories.map(category => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>
      
      {/* 태그 선택 */}
      <div className="mb-4">
        <h3 className="text-sm font-medium text-gray-700 mb-2">태그 선택</h3>
        <div className="flex flex-wrap gap-2">
          {tagsInCategory.map(tag => {
            const tagFullId = `${selectedCategory}:${tag.id}`;
            const isSelected = selectedTags.includes(tagFullId);
            
            return (
              <button
                key={tag.id}
                onClick={() => toggleTag(tag.id)}
                className={`
                  px-3 py-1 rounded-full text-sm border transition
                  ${isSelected ? 'ring-2 ring-blue-400' : ''}
                  ${getCategoryColor(selectedCategory || '')}
                `}
              >
                {tag.name} {isSelected && '✓'}
              </button>
            );
          })}
        </div>
      </div>
      
      {/* 선택된 태그 표시 */}
      {selectedTags.length > 0 && (
        <div className="mt-4">
          <h3 className="text-sm font-medium text-gray-700 mb-2">선택한 태그</h3>
          <div className="flex flex-wrap gap-2">
            {selectedTags.map(tagFullId => {
              const [categoryId, tagId] = tagFullId.split(':');
              const category = tagCategories.find(c => c.id === categoryId);
              const tag = category?.tags.find(t => t.id === tagId);
              
              if (!tag) return null;
              
              return (
                <div
                  key={tagFullId}
                  className={`
                    px-3 py-1 rounded-full text-sm border flex items-center
                    ${getCategoryColor(categoryId)}
                  `}
                >
                  <span>{tag.name}</span>
                  <button
                    onClick={() => toggleTag(tagId)}
                    className="ml-1 text-xs focus:outline-none"
                    aria-label="태그 제거"
                  >
                    ✕
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default TagSelector; 