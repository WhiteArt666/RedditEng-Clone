import { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import type { SortType } from '../components/home';

interface UseHomePageStateOptions {
  defaultSort?: SortType;
}

export const useHomePageState = ({ defaultSort = 'hot' }: UseHomePageStateOptions = {}) => {
  const { category, difficulty } = useParams();
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('q');

  // Capitalize category and difficulty from URL params to match backend
  const capitalizeFirst = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);
  
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState(category ? capitalizeFirst(category) : '');
  const [selectedDifficulty, setSelectedDifficulty] = useState(difficulty ? capitalizeFirst(difficulty) : '');
  const [selectedSort, setSelectedSort] = useState<SortType>(defaultSort);

  useEffect(() => {
    setCurrentPage(1);
    setSelectedCategory(category ? capitalizeFirst(category) : '');
    setSelectedDifficulty(difficulty ? capitalizeFirst(difficulty) : '');
  }, [category, difficulty, selectedSort, searchQuery]);

  return {
    // URL params
    searchQuery,
    
    // State
    currentPage,
    selectedCategory,
    selectedDifficulty,
    selectedSort,
    
    // Setters
    setCurrentPage,
    setSelectedCategory,
    setSelectedDifficulty,
    setSelectedSort,
  };
};
