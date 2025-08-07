import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useParams, useSearchParams } from 'react-router-dom';
import { Filter } from 'lucide-react';
import PostCard from '../components/PostCard';
import { postsAPI } from '../services/api';
import type { Post } from '../types';

interface HomePageProps {
  sortBy?: 'hot' | 'new' | 'top';
}

const HomePage: React.FC<HomePageProps> = ({ sortBy = 'hot' }) => {
  const { category, difficulty } = useParams();
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('q');
  
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
          limit: 10
        });
      }
      
      return postsAPI.getPosts({
        page: currentPage,
        limit: 10,
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

  const categories = [
    'Grammar', 'Vocabulary', 'Speaking', 'Listening', 
    'Writing', 'Reading', 'IELTS', 'TOEFL', 'General'
  ];

  const difficulties = ['Easy', 'Medium', 'Hard'];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="loading-spinner w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 mb-4">Failed to load posts</p>
        <button
          onClick={() => refetch()}
          className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {searchQuery ? `Search results for "${searchQuery}"` :
             category ? `r/${category}` :
             difficulty ? `${difficulty} Level` :
             selectedSort === 'hot' ? 'Hot Posts' :
             selectedSort === 'new' ? 'New Posts' :
             'Top Posts'}
          </h1>
          <p className="text-gray-600 mt-1">
            {pagination?.total || 0} posts
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex items-center space-x-2">
            <Filter size={16} className="text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Filters:</span>
          </div>

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="text-sm border border-gray-300 rounded-md px-3 py-1 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="">All Categories</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>

          {/* Difficulty Filter */}
          <select
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value)}
            className="text-sm border border-gray-300 rounded-md px-3 py-1 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="">All Levels</option>
            {difficulties.map(diff => (
              <option key={diff} value={diff}>{diff}</option>
            ))}
          </select>

          {/* Sort Filter */}
          <select
            value={selectedSort}
            onChange={(e) => setSelectedSort(e.target.value as 'hot' | 'new' | 'top')}
            className="text-sm border border-gray-300 rounded-md px-3 py-1 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="hot">🔥 Hot</option>
            <option value="new">🆕 New</option>
            <option value="top">⭐ Top</option>
          </select>

          {/* Clear Filters */}
          {(selectedCategory || selectedDifficulty) && (
            <button
              onClick={() => {
                setSelectedCategory('');
                setSelectedDifficulty('');
              }}
              className="text-sm text-primary-600 hover:text-primary-800 font-medium"
            >
              Clear Filters
            </button>
          )}
        </div>
      </div>

      {/* Posts */}
      <div className="space-y-4">
        {posts.length > 0 ? (
          posts.map((post: Post) => (
            <PostCard key={post._id} post={post} onVote={handleVote} />
          ))
        ) : (
          <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
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
            className="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          
          {Array.from({ length: Math.min(5, pagination.pages) }, (_, i) => {
            const page = i + 1;
            return (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-2 border text-sm font-medium rounded-md ${
                  page === currentPage
                    ? 'bg-primary-600 border-primary-600 text-white'
                    : 'border-gray-300 text-gray-500 hover:text-gray-700'
                }`}
              >
                {page}
              </button>
            );
          })}
          
          <button
            disabled={currentPage === pagination.pages}
            onClick={() => setCurrentPage(currentPage + 1)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default HomePage;
