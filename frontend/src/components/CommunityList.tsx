import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { communitiesAPI } from '../services/api';
import type { Community } from '../types';

interface CommunityListProps {
  limit?: number;
  showHeader?: boolean;
  category?: string;
}

const CommunityList: React.FC<CommunityListProps> = ({ 
  limit = 10, 
  showHeader = true,
  category 
}) => {
  const [communities, setCommunities] = useState<Community[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCommunities = async () => {
      try {
        setLoading(true);
        const response = await communitiesAPI.getCommunities({
          limit,
          category,
          sortBy: 'memberCount',
          order: 'desc'
        });
        setCommunities(response.data.data || []);
      } catch (err) {
        setError('Failed to fetch communities');
        console.error('Error fetching communities:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCommunities();
  }, [category, limit]);

  if (loading) {
    return (
      <div className="animate-pulse">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="flex items-center space-x-3 p-3 border-b">
            <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
            <div className="flex-1">
              <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-300 rounded w-1/2"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow">
      {showHeader && (
        <div className="px-4 py-3 border-b">
          <h3 className="text-lg font-semibold text-gray-900">Communities</h3>
        </div>
      )}
      
      {communities.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">No communities found</p>
        </div>
      ) : (
        <div className="divide-y divide-gray-200">
          {communities.map((community) => (
            <Link
              key={community._id}
              to={`/community/${community.name}`}
              className="flex items-center p-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex-shrink-0">
                {community.avatar ? (
                  <img
                    src={community.avatar}
                    alt={community.displayName}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold text-lg">
                      {community.displayName.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
              </div>
              
              <div className="ml-3 flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  r/{community.name}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {community.displayName}
                </p>
                <div className="flex items-center space-x-4 mt-1">
                  <span className="text-xs text-gray-400">
                    {community.memberCount.toLocaleString()} members
                  </span>
                  <span className="text-xs text-gray-400">
                    {community.postCount} posts
                  </span>
                </div>
              </div>
              
              <div className="flex-shrink-0">
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium 
                  ${community.category === 'Grammar' ? 'bg-blue-100 text-blue-800' : 
                    community.category === 'Vocabulary' ? 'bg-green-100 text-green-800' :
                    community.category === 'Speaking' ? 'bg-purple-100 text-purple-800' :
                    community.category === 'Listening' ? 'bg-yellow-100 text-yellow-800' :
                    community.category === 'Writing' ? 'bg-red-100 text-red-800' :
                    community.category === 'Reading' ? 'bg-indigo-100 text-indigo-800' :
                    community.category === 'IELTS' ? 'bg-pink-100 text-pink-800' :
                    community.category === 'TOEFL' ? 'bg-orange-100 text-orange-800' :
                    'bg-gray-100 text-gray-800'}`}>
                  {community.category}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
      
      {showHeader && communities.length > 0 && (
        <div className="px-4 py-3 border-t">
          <Link
            to="/communities"
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            View all communities →
          </Link>
        </div>
      )}
    </div>
  );
};

export default CommunityList;
