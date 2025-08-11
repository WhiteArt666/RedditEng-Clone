import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { postsAPI } from '../services/api';
import { useViewMode } from '../hooks/useViewMode';
import { useHomePageState } from '../hooks/useHomePageState';
import { SortBar, PostList, type SortType, type ViewMode } from '../components/home';
import { LoadingState, ErrorState, EmptyState, Pagination } from '../components/common';
import VideoFeed from '../components/VideoFeed';

interface HomePageProps {
  sortBy?: SortType;
}

const HomePage: React.FC<HomePageProps> = ({ sortBy = 'hot' }) => {
  // Custom hooks for state management
  const { viewMode, setViewMode, videoMode } = useViewMode();
  const {
    searchQuery,
    currentPage,
    selectedCategory,
    selectedDifficulty,
    selectedSort,
    setCurrentPage,
    setSelectedCategory,
    setSelectedDifficulty,
    setSelectedSort,
  } = useHomePageState({ defaultSort: sortBy });

  // Data fetching
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['posts', currentPage, selectedCategory, selectedDifficulty, selectedSort, searchQuery],
    queryFn: async () => {
      if (searchQuery) {
        return postsAPI.searchPosts({
          q: searchQuery,
          category: selectedCategory || undefined,
          page: currentPage,
          limit: 25
        });
      }
      
      return postsAPI.getPosts({
        page: currentPage,
        limit: 25,
        category: selectedCategory || undefined,
        difficulty: selectedDifficulty || undefined,
        sortBy: selectedSort
      });
    }
  });

  const posts = data?.data?.data?.posts || [];
  const pagination = data?.data?.data?.pagination;

  const handleVote = () => {
    refetch();
  };

  const handleSortChange = (sort: SortType) => {
    setSelectedSort(sort);
    setCurrentPage(1);
  };

  const handleViewModeChange = (mode: ViewMode) => {
    setViewMode(mode);
  };

  // Loading state
  if (isLoading) {
    return <LoadingState />;
  }

  // Error state
  if (error) {
    return (
      <ErrorState 
        message="Failed to load posts"
        onRetry={() => refetch()}
      />
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Sort Bar with Video Toggle */}
      <SortBar
        selectedSort={selectedSort}
        onSortChange={handleSortChange}
        viewMode={viewMode}
        onViewModeChange={handleViewModeChange}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        selectedDifficulty={selectedDifficulty}
        onDifficultyChange={setSelectedDifficulty}
      />

      {/* Content */}
      {viewMode === 'video' ? (
        <div className="h-screen overflow-hidden -mx-4">
          <VideoFeed posts={posts} onVote={handleVote} videoMode={videoMode} />
        </div>
      ) : (
        <>
          {/* Posts */}
          {posts.length > 0 ? (
            <PostList posts={posts} onVote={handleVote} />
          ) : (
            <EmptyState
              title="No posts found"
              description={
                searchQuery 
                  ? 'Try different search terms or clear filters'
                  : 'Be the first to create a post in this category!'
              }
            />
          )}

          {/* Pagination */}
          {pagination && (
            <Pagination
              currentPage={currentPage}
              totalPages={pagination.pages}
              onPageChange={setCurrentPage}
            />
          )}
        </>
      )}
    </div>
  );
};

export default HomePage;
