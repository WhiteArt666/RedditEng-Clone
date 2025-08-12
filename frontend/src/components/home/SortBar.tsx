import React, { useState } from 'react';
import { TrendingUp, Clock, Star, Filter, Video, Grid3X3, ChevronDown, X } from 'lucide-react';
import { Button } from '../ui';

export type SortType = 'hot' | 'new' | 'top';
export type ViewMode = 'grid' | 'video';

interface SortBarProps {
  selectedSort: SortType;
  onSortChange: (sort: SortType) => void;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  selectedDifficulty: string;
  onDifficultyChange: (difficulty: string) => void;
}

const categories = [
  { value: '', label: 'All Categories' },
  { value: 'Grammar', label: 'Grammar' },
  { value: 'Vocabulary', label: 'Vocabulary' },
  { value: 'Speaking', label: 'Speaking' },
  { value: 'Listening', label: 'Listening' },
  { value: 'Writing', label: 'Writing' },
  { value: 'Reading', label: 'Reading' },
  { value: 'IELTS', label: 'IELTS' },
  { value: 'TOEFL', label: 'TOEFL' },
  { value: 'General', label: 'General' },
];

const difficulties = [
  { value: '', label: 'All Levels' },
  { value: 'Easy', label: 'Easy' },
  { value: 'Medium', label: 'Medium' },
  { value: 'Hard', label: 'Hard' },
];

const SortBar: React.FC<SortBarProps> = ({
  selectedSort,
  onSortChange,
  viewMode,
  onViewModeChange,
  selectedCategory,
  onCategoryChange,
  selectedDifficulty,
  onDifficultyChange,
}) => {
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const sortButtons = [
    { key: 'hot' as SortType, icon: TrendingUp, label: 'Hot' },
    { key: 'new' as SortType, icon: Clock, label: 'New' },
    { key: 'top' as SortType, icon: Star, label: 'Top' },
  ];

  const getCurrentCategoryLabel = () => {
    const category = categories.find(cat => cat.value === selectedCategory);
    return category ? category.label : 'All Categories';
  };

  const getCurrentDifficultyLabel = () => {
    const difficulty = difficulties.find(diff => diff.value === selectedDifficulty);
    return difficulty ? difficulty.label : 'All Levels';
  };

  return (
    <>
      <div className="bg-white border border-gray-300 rounded mb-2 p-2">
        {/* Desktop Layout */}
        <div className="hidden lg:flex items-center justify-between">
          {/* Sort Buttons */}
          <div className="flex items-center space-x-2">
            {sortButtons.map(({ key, icon: Icon, label }) => (
              <Button
                key={key}
                variant={selectedSort === key ? "secondary" : "ghost"}
                size="sm"
                onClick={() => onSortChange(key)}
                className="flex items-center space-x-2"
              >
                <Icon size={16} />
                <span>{label}</span>
              </Button>
            ))}
          </div>

          <div className="flex items-center space-x-2">
            {/* View Mode Toggle */}
            <div className="flex items-center space-x-1 bg-gray-100 rounded p-1">
              <Button
                variant={viewMode === 'grid' ? "secondary" : "ghost"}
                size="sm"
                onClick={() => onViewModeChange('grid')}
                className="p-2"
                title="Card View"
              >
                <Grid3X3 size={16} />
              </Button>
              <Button
                variant={viewMode === 'video' ? "secondary" : "ghost"}
                size="sm"
                onClick={() => onViewModeChange('video')}
                className="p-2"
                title="Video Feed"
              >
                <Video size={16} />
              </Button>
            </div>

            {/* Filters - Only show in grid mode */}
            {viewMode === 'grid' && (
              <>
                <Filter size={16} className="text-gray-400" />
                
                <select
                  value={selectedCategory}
                  onChange={(e) => onCategoryChange(e.target.value)}
                  className="text-sm border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  {categories.map(({ value, label }) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>

                <select
                  value={selectedDifficulty}
                  onChange={(e) => onDifficultyChange(e.target.value)}
                  className="text-sm border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  {difficulties.map(({ value, label }) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
              </>
            )}
          </div>
        </div>

        {/* Mobile Layout */}
        <div className="lg:hidden">
          {/* Top Row - Sort buttons and View mode */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-1">
              {sortButtons.map(({ key, icon: Icon, label }) => (
                <Button
                  key={key}
                  variant={selectedSort === key ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => onSortChange(key)}
                  className="flex items-center space-x-1 px-2 py-1"
                >
                  <Icon size={14} />
                  <span className="text-xs">{label}</span>
                </Button>
              ))}
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center space-x-1 bg-gray-100 rounded p-1">
              <Button
                variant={viewMode === 'grid' ? "secondary" : "ghost"}
                size="sm"
                onClick={() => onViewModeChange('grid')}
                className="p-1.5"
                title="Card View"
              >
                <Grid3X3 size={14} />
              </Button>
              <Button
                variant={viewMode === 'video' ? "secondary" : "ghost"}
                size="sm"
                onClick={() => onViewModeChange('video')}
                className="p-1.5"
                title="Video Feed"
              >
                <Video size={14} />
              </Button>
            </div>
          </div>

          {/* Bottom Row - Filters (only in grid mode) */}
          {viewMode === 'grid' && (
            <div className="flex items-center space-x-2">
              <Filter size={14} className="text-gray-400" />
              
              {/* Mobile Filter Button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowMobileFilters(true)}
                className="flex-1 flex items-center justify-between text-left px-2 py-1 border border-gray-300 rounded"
              >
                <span className="text-xs truncate">
                  {getCurrentCategoryLabel()} • {getCurrentDifficultyLabel()}
                </span>
                <ChevronDown size={14} />
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Filters Modal */}
      {showMobileFilters && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 lg:hidden">
          <div className="fixed bottom-0 left-0 right-0 bg-white rounded-t-lg">
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium">Filters</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowMobileFilters(false)}
                  className="p-1"
                >
                  <X size={20} />
                </Button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Category</label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => onCategoryChange(e.target.value)}
                    className="w-full text-sm border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  >
                    {categories.map(({ value, label }) => (
                      <option key={value} value={value}>{label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Difficulty Level</label>
                  <select
                    value={selectedDifficulty}
                    onChange={(e) => onDifficultyChange(e.target.value)}
                    className="w-full text-sm border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  >
                    {difficulties.map(({ value, label }) => (
                      <option key={value} value={value}>{label}</option>
                    ))}
                  </select>
                </div>

                <div className="pt-4">
                  <Button
                    onClick={() => setShowMobileFilters(false)}
                    className="w-full"
                  >
                    Apply Filters
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SortBar;
