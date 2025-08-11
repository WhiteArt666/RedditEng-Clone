import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import CommunityCard from '../components/CommunityCard';
import { communitiesAPI } from '../services/api';
import type { Community } from '../types';

const CommunitiesPage: React.FC = () => {
  const [communities, setCommunities] = useState<Community[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortBy, setSortBy] = useState<'memberCount' | 'postCount' | 'createdAt'>('memberCount');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const categories = [
    'General',
    'Grammar',
    'Vocabulary',
    'Speaking',
    'Listening',
    'Writing',
    'Reading',
    'IELTS',
    'TOEFL'
  ];

  useEffect(() => {
    const fetchCommunitiesEffect = async () => {
      try {
        setLoading(true);
        
        const response = await communitiesAPI.getCommunities({
          page: 1,
          limit: 12,
          category: selectedCategory || undefined,
          search: searchTerm || undefined,
          sortBy,
          order: 'desc'
        });

        const newCommunities = response.data.data || [];
        setCommunities(newCommunities);
        setPage(2);
        setHasMore(newCommunities.length === 12);
      } catch (err) {
        setError('Failed to fetch communities');
        console.error('Error fetching communities:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCommunitiesEffect();
  }, [searchTerm, selectedCategory, sortBy]);

  const fetchCommunities = async (reset = false) => {
    try {
      setLoading(true);
      const currentPage = reset ? 1 : page;
      
      const response = await communitiesAPI.getCommunities({
        page: currentPage,
        limit: 12,
        category: selectedCategory || undefined,
        search: searchTerm || undefined,
        sortBy,
        order: 'desc'
      });

      const newCommunities = response.data.data || [];
      
      if (reset) {
        setCommunities(newCommunities);
        setPage(2);
      } else {
        setCommunities(prev => [...prev, ...newCommunities]);
        setPage(prev => prev + 1);
      }
      
      setHasMore(newCommunities.length === 12);
    } catch (err) {
      setError('Failed to fetch communities');
      console.error('Error fetching communities:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadMore = () => {
    if (!loading && hasMore) {
      fetchCommunities(false);
    }
  };

  const handleJoinStatusChange = (communityId: string, joined: boolean) => {
    setCommunities(prev =>
      prev.map(community =>
        community._id === communityId
          ? {
              ...community,
              memberCount: community.memberCount + (joined ? 1 : -1)
            }
          : community
      )
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Communities</h1>
          <p className="text-gray-600 mt-2">
            Discover and join English learning communities
          </p>
        </div>
        
        <Link
          to="/create-community"
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          Create Community
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div>
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
              Search Communities
            </label>
            <input
              type="text"
              id="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name or description..."
              className="w-full rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          {/* Category Filter */}
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <select
              id="category"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          {/* Sort By */}
          <div>
            <label htmlFor="sortBy" className="block text-sm font-medium text-gray-700 mb-2">
              Sort By
            </label>
            <select
              id="sortBy"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'memberCount' | 'postCount' | 'createdAt')}
              className="w-full rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="memberCount">Most Members</option>
              <option value="postCount">Most Posts</option>
              <option value="createdAt">Newest</option>
            </select>
          </div>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-8">
          <p className="text-red-600">{error}</p>
          <button
            onClick={() => fetchCommunities(true)}
            className="mt-2 text-red-600 hover:text-red-800 underline"
          >
            Try again
          </button>
        </div>
      )}

      {/* Communities Grid */}
      {communities.length === 0 && !loading ? (
        <div className="text-center py-12">
          <div className="max-w-md mx-auto">
            <div className="text-gray-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No communities found</h3>
            <p className="text-gray-500 mb-4">
              {searchTerm || selectedCategory
                ? 'Try adjusting your search criteria'
                : 'Be the first to create a community!'
              }
            </p>
            <Link
              to="/create-community"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              Create Community
            </Link>
          </div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {communities.map((community) => (
              <CommunityCard
                key={community._id}
                community={community}
                onJoinStatusChange={handleJoinStatusChange}
              />
            ))}
          </div>

          {/* Load More */}
          {hasMore && (
            <div className="text-center mt-8">
              <button
                onClick={loadMore}
                disabled={loading}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? 'Loading...' : 'Load More'}
              </button>
            </div>
          )}
        </>
      )}

      {/* Loading State */}
      {loading && communities.length === 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg shadow p-6 animate-pulse">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-300 rounded w-1/2"></div>
                </div>
              </div>
              <div className="space-y-2 mb-4">
                <div className="h-3 bg-gray-300 rounded"></div>
                <div className="h-3 bg-gray-300 rounded w-5/6"></div>
              </div>
              <div className="flex justify-between">
                <div className="h-3 bg-gray-300 rounded w-1/4"></div>
                <div className="h-3 bg-gray-300 rounded w-1/4"></div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CommunitiesPage;
