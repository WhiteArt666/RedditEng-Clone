import React from 'react';
import { TrendingUp, Clock, Star, Filter, Video, Grid3X3 } from 'lucide-react';
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
  const sortButtons = [
    { key: 'hot' as SortType, icon: TrendingUp, label: 'Hot' },
    { key: 'new' as SortType, icon: Clock, label: 'New' },
    { key: 'top' as SortType, icon: Star, label: 'Top' },
  ];

  return (
    <div className="bg-white border border-gray-300 rounded mb-2 p-2">
      <div className="flex items-center justify-between">
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
    </div>
  );
};

export default SortBar;
