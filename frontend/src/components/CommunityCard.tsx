import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { communitiesAPI } from '../services/api';
import type { Community } from '../types';

interface CommunityCardProps {
  community: Community;
  onJoinStatusChange?: (communityId: string, joined: boolean) => void;
}

const CommunityCard: React.FC<CommunityCardProps> = ({ 
  community, 
  onJoinStatusChange 
}) => {
  const { user } = useAuth();
  const [isJoined, setIsJoined] = useState(
    user ? community.members?.includes(user.id) : false
  );
  const [memberCount, setMemberCount] = useState(community.memberCount);
  const [loading, setLoading] = useState(false);

  const handleJoinToggle = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation when clicking the button
    
    if (!user) return;

    try {
      setLoading(true);
      
      if (isJoined) {
        const response = await communitiesAPI.leaveCommunity(community.name);
        setIsJoined(false);
        setMemberCount(response.data.data!.memberCount);
        onJoinStatusChange?.(community._id, false);
      } else {
        const response = await communitiesAPI.joinCommunity(community.name);
        setIsJoined(true);
        setMemberCount(response.data.data!.memberCount);
        onJoinStatusChange?.(community._id, true);
      }
    } catch (error) {
      console.error('Error toggling community membership:', error);
      // You might want to show a toast notification here
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow hover:shadow-md transition-shadow">
      {/* Banner */}
      {community.banner && (
        <div className="h-24 bg-gradient-to-r from-blue-400 to-purple-500 rounded-t-lg relative">
          <img
            src={community.banner}
            alt=""
            className="w-full h-full object-cover rounded-t-lg"
          />
        </div>
      )}
      
      <div className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-3">
            {community.avatar ? (
              <img
                src={community.avatar}
                alt={community.displayName}
                className="w-12 h-12 rounded-full object-cover"
              />
            ) : (
              <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">
                  {community.displayName.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
            
            <div>
              <Link
                to={`/community/${community.name}`}
                className="block hover:text-blue-600"
              >
                <h3 className="font-semibold text-gray-900">
                  {community.displayName}
                </h3>
                <p className="text-sm text-gray-500">r/{community.name}</p>
              </Link>
            </div>
          </div>
          
          {user && (
            <button
              onClick={handleJoinToggle}
              disabled={loading}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                isJoined
                  ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              } disabled:opacity-50`}
            >
              {loading ? '...' : isJoined ? 'Joined' : 'Join'}
            </button>
          )}
        </div>

        {/* Description */}
        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
          {community.description}
        </p>

        {/* Tags */}
        {community.tags && community.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {community.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
              >
                {tag}
              </span>
            ))}
            {community.tags.length > 3 && (
              <span className="text-xs text-gray-500">
                +{community.tags.length - 3} more
              </span>
            )}
          </div>
        )}

        {/* Stats */}
        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center space-x-4">
            <span>{memberCount.toLocaleString()} members</span>
            <span>{community.postCount} posts</span>
          </div>
          
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

        {/* Created by */}
        <div className="mt-3 pt-3 border-t border-gray-100">
          <p className="text-xs text-gray-500">
            Created by{' '}
            <span className="font-medium">{community.creator.username}</span>
            {' '}• {new Date(community.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default CommunityCard;
