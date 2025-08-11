import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { communitiesAPI } from '../services/api';
import type { Community } from '../types';

const RightSidebar: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [popularCommunities, setPopularCommunities] = useState<Community[]>([]);
  const [growingCommunities, setGrowingCommunities] = useState<Community[]>([]);
  const [userCommunities, setUserCommunities] = useState<Community[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchPopularCommunities();
    fetchGrowingCommunities();
    if (user) {
      fetchUserCommunities();
    }
  }, [user]);

  const fetchUserCommunities = async () => {
    try {
      const response = await communitiesAPI.getUserCommunities();
      setUserCommunities(response.data.data || []);
    } catch (error) {
      console.error('Error fetching user communities:', error);
    }
  };

  const fetchPopularCommunities = async () => {
    try {
      const response = await communitiesAPI.getCommunities({ 
        page: 1, 
        limit: 3, 
        sortBy: 'memberCount' 
      });
      setPopularCommunities(response.data.data || []);
    } catch (error) {
      console.error('Error fetching popular communities:', error);
    }
  };

  const fetchGrowingCommunities = async () => {
    try {
      const response = await communitiesAPI.getCommunities({ 
        page: 1, 
        limit: 2, 
        sortBy: 'createdAt'
      });
      setGrowingCommunities(response.data.data || []);
    } catch (error) {
      console.error('Error fetching growing communities:', error);
    }
  };

  const handleJoinCommunity = async (communityId: string, communityName: string) => {
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      setLoading(true);
      await communitiesAPI.joinCommunity(communityId);
      // Redirect to community page after joining
      navigate(`/community/${communityName}`);
    } catch (error) {
      console.error('Error joining community:', error);
    } finally {
      setLoading(false);
    }
  };

  const isUserMember = (communityId: string) => {
    return userCommunities.some(uc => uc._id === communityId);
  };

  return (
    <aside className="hidden lg:block w-80 bg-white border border-gray-300 rounded h-fit sticky top-14">
      {/* Popular Communities */}
      <div className="p-4 border-b border-gray-300">
        <h3 className="text-sm font-bold text-gray-900 mb-3">Popular Communities</h3>
        <div className="space-y-2">
          {popularCommunities.map((community) => (
            <div key={community._id} className="flex items-center justify-between">
              <Link
                to={`/community/${community.name}`}
                className="flex items-center space-x-2 flex-1 hover:bg-gray-50 p-1 rounded"
              >
                <div className="w-6 h-6 flex-shrink-0">
                  {community.avatar ? (
                    <img 
                      src={community.avatar} 
                      alt=""
                      className="w-6 h-6 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-bold">
                        {community.displayName.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-sm font-medium text-gray-900 truncate block">
                    r/{community.name}
                  </span>
                  <span className="text-xs text-gray-500">
                    {community.memberCount.toLocaleString()} members
                  </span>
                </div>
              </Link>
              {user && !isUserMember(community._id) && (
                <button
                  onClick={() => handleJoinCommunity(community._id, community.name)}
                  disabled={loading}
                  className="text-xs bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 disabled:opacity-50"
                >
                  Join
                </button>
              )}
            </div>
          ))}
          
          {popularCommunities.length === 0 && (
            <p className="text-xs text-gray-500 py-2">No communities yet</p>
          )}
        </div>
      </div>

      {/* Today's Top Growing Communities */}
      <div className="p-4 border-b border-gray-300">
        <h3 className="text-sm font-bold text-gray-900 mb-3">Today's Top Growing Communities</h3>
        <div className="space-y-2">
          {growingCommunities.map((community, index) => (
            <div key={community._id} className="flex items-center justify-between">
              <Link
                to={`/community/${community.name}`}
                className="flex items-center space-x-2 flex-1 hover:bg-gray-50 p-1 rounded"
              >
                <span className="text-xs text-gray-500 w-4">{index + 1}</span>
                <div className="w-5 h-5 flex-shrink-0">
                  {community.avatar ? (
                    <img 
                      src={community.avatar} 
                      alt=""
                      className="w-5 h-5 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-bold">
                        {community.displayName.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-sm text-gray-900 truncate block">
                    r/{community.name}
                  </span>
                  <span className="text-xs text-gray-500">
                    {community.memberCount.toLocaleString()} members
                  </span>
                </div>
              </Link>
              {user && !isUserMember(community._id) && (
                <button
                  onClick={() => handleJoinCommunity(community._id, community.name)}
                  disabled={loading}
                  className="text-xs bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 disabled:opacity-50"
                >
                  Join
                </button>
              )}
            </div>
          ))}
          
          {growingCommunities.length === 0 && (
            <p className="text-xs text-gray-500 py-2">No new communities yet</p>
          )}
        </div>
      </div>

      {/* Premium */}
      <div className="p-4">
        <div className="bg-gradient-to-r from-orange-400 to-red-500 rounded p-4 text-white">
          <h3 className="font-bold mb-2">Reddit Premium</h3>
          <p className="text-sm mb-3">The best Reddit experience, with monthly Coins</p>
          <button className="bg-white text-orange-500 px-4 py-1.5 rounded text-sm font-medium hover:bg-gray-100">
            Try Now
          </button>
        </div>
      </div>
    </aside>
  );
};

export default RightSidebar;
