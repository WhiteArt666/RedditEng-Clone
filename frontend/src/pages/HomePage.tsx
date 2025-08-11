import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useParams, useSearchParams } from 'react-router-dom';
import { TrendingUp, Clock, Star, Filter, Video, Grid3X3 } from 'lucide-react';
import PostCard from '../components/PostCard';
import VideoFeed from '../components/VideoFeed';
import { postsAPI } from '../services/api';
import { useViewMode } from '../hooks/useViewMode';
import type { Post } from '../types';

interface HomePageProps {
  sortBy?: 'hot' | 'new' | 'top';
}

const HomePage: React.FC<HomePageProps> = ({ sortBy = 'hot' }) => {
  const { category, difficulty } = useParams();
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('q');
  
  // Use the custom hook for view mode management
  const { viewMode, setViewMode, videoMode, setVideoMode } = useViewMode();
  
  // Capitalize category and difficulty from URL params to match backend
  const capitalizeFirst = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);
  
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState(category ? capitalizeFirst(category) : '');
  const [selectedDifficulty, setSelectedDifficulty] = useState(difficulty ? capitalizeFirst(difficulty) : '');
  const [selectedSort, setSelectedSort] = useState(sortBy);

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

  useEffect(() => {
    setCurrentPage(1);
    setSelectedCategory(category ? capitalizeFirst(category) : '');
    setSelectedDifficulty(difficulty ? capitalizeFirst(difficulty) : '');
  }, [category, difficulty, selectedSort, searchQuery]);

  const handleVote = () => {
    // Optimistically update the UI
    refetch();
  };

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="bg-white border border-gray-300 rounded mb-2 p-4 animate-pulse">
            <div className="flex">
              <div className="w-10 bg-gray-200 rounded mr-3">
                <div className="h-16"></div>
              </div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-6 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto text-center py-12">
        <p className="text-red-600 mb-4">Failed to load posts</p>
        <button
          onClick={() => refetch()}
          className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Sort Bar with Video Toggle */}
      <div className="bg-white border border-gray-300 rounded mb-2 p-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setSelectedSort('hot')}
              className={`flex items-center space-x-2 px-3 py-2 rounded text-sm font-medium transition-colors ${
                selectedSort === 'hot'
                  ? 'bg-gray-200 text-gray-900'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <TrendingUp size={16} />
              <span>Hot</span>
            </button>
            
            <button
              onClick={() => setSelectedSort('new')}
              className={`flex items-center space-x-2 px-3 py-2 rounded text-sm font-medium transition-colors ${
                selectedSort === 'new'
                  ? 'bg-gray-200 text-gray-900'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Clock size={16} />
              <span>New</span>
            </button>
            
            <button
              onClick={() => setSelectedSort('top')}
              className={`flex items-center space-x-2 px-3 py-2 rounded text-sm font-medium transition-colors ${
                selectedSort === 'top'
                  ? 'bg-gray-200 text-gray-900'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Star size={16} />
              <span>Top</span>
            </button>
          </div>

          <div className="flex items-center space-x-2">
            {/* View Mode Toggle */}
            <div className="flex items-center space-x-1 bg-gray-100 rounded p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                title="Card View"
              >
                <Grid3X3 size={16} />
              </button>
              <button
                onClick={() => setViewMode('video')}
                className={`p-2 rounded transition-colors ${
                  viewMode === 'video'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                title="Video Feed"
              >
                <Video size={16} />
              </button>
            </div>

            {/* Filters - Only show in grid mode */}
            {viewMode === 'grid' && (
              <>
                <Filter size={16} className="text-gray-400" />
                
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="text-sm border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  <option value="">All Categories</option>
                  <option value="Grammar">Grammar</option>
                  <option value="Vocabulary">Vocabulary</option>
                  <option value="Speaking">Speaking</option>
                  <option value="Listening">Listening</option>
                  <option value="Writing">Writing</option>
                  <option value="Reading">Reading</option>
                  <option value="IELTS">IELTS</option>
                  <option value="TOEFL">TOEFL</option>
                  <option value="General">General</option>
                </select>

                <select
                  value={selectedDifficulty}
                  onChange={(e) => setSelectedDifficulty(e.target.value)}
                  className="text-sm border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  <option value="">All Levels</option>
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      {viewMode === 'video' ? (
        <div className="h-screen overflow-hidden -mx-4">
          <VideoFeed posts={posts} onVote={handleVote} videoMode={videoMode} />
        </div>
      ) : (
        <>
          {/* Posts */}
          <div>
            {posts.length > 0 ? (
              posts.map((post: Post) => (
                <PostCard key={post._id} post={post} onVote={handleVote} />
              ))
            ) : (
              <div className="bg-white border border-gray-300 rounded p-8 text-center">
                <p className="text-gray-500 text-lg mb-2">No posts found</p>
                <p className="text-gray-400">
                  {searchQuery 
                    ? 'Try different search terms or clear filters'
                    : 'Be the first to create a post in this category!'
                  }
                </p>
              </div>
            )}
          </div>

          {/* Pagination */}
          {pagination && pagination.pages > 1 && (
            <div className="flex items-center justify-center space-x-2 py-8">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
                className="px-3 py-2 border border-gray-300 rounded text-sm font-medium text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              
              <div className="flex items-center space-x-1">
                {Array.from({ length: Math.min(5, pagination.pages) }, (_, i) => {
                  const page = i + 1;
                  return (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-3 py-2 border text-sm font-medium rounded ${
                        page === currentPage
                          ? 'bg-orange-500 border-orange-500 text-white'
                          : 'border-gray-300 text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      {page}
                    </button>
                  );
                })}
              </div>
              
              <button
                disabled={currentPage === pagination.pages}
                onClick={() => setCurrentPage(currentPage + 1)}
                className="px-3 py-2 border border-gray-300 rounded text-sm font-medium text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default HomePage;
