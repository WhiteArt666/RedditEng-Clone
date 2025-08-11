import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { communitiesAPI, postsAPI } from '../services/api';
import PostCard from '../components/PostCard';
import type { Community, Post } from '../types';
import { Users, MessageSquare, Settings, UserPlus, UserMinus, Calendar, Share2 } from 'lucide-react';

const CommunityDetailPage: React.FC = () => {
  const { name } = useParams<{ name: string }>();
  const { user } = useAuth();
  
  const [community, setCommunity] = useState<Community | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [postsLoading, setPostsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isJoined, setIsJoined] = useState(false);
  const [joining, setJoining] = useState(false);
  const [sortBy, setSortBy] = useState<'hot' | 'new' | 'top'>('hot');

  const fetchCommunity = useCallback(async () => {
    try {
      setLoading(true);
      const response = await communitiesAPI.getCommunity(name!);
      setCommunity(response.data.data!);
    } catch {
      setError('Community not found');
    } finally {
      setLoading(false);
    }
  }, [name]);

  const fetchPosts = useCallback(async () => {
    try {
      setPostsLoading(true);
      const response = await postsAPI.getPosts({
        community: name,
        sortBy,
        limit: 20
      });
      setPosts(response.data.data!.posts);
    } catch (err) {
      console.error('Error fetching posts:', err);
    } finally {
      setPostsLoading(false);
    }
  }, [name, sortBy]);

  useEffect(() => {
    if (name) {
      fetchCommunity();
      fetchPosts();
    }
  }, [name, fetchCommunity, fetchPosts]);

  useEffect(() => {
    if (community && user) {
      setIsJoined(community.members?.includes(user.id) || false);
    }
  }, [community, user]);

  const handleJoinToggle = async () => {
    if (!user || !community) return;

    try {
      setJoining(true);
      
      if (isJoined) {
        await communitiesAPI.leaveCommunity(community.name);
        setIsJoined(false);
        setCommunity(prev => prev ? { ...prev, memberCount: prev.memberCount - 1 } : null);
      } else {
        await communitiesAPI.joinCommunity(community.name);
        setIsJoined(true);
        setCommunity(prev => prev ? { ...prev, memberCount: prev.memberCount + 1 } : null);
      }
    } catch (error) {
      console.error('Error toggling membership:', error);
    } finally {
      setJoining(false);
    }
  };

  const handlePostVote = (postId: string, newScore: number) => {
    setPosts(prev =>
      prev.map(post =>
        post._id === postId ? { ...post, score: newScore } : post
      )
    );
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-32 bg-gray-300 rounded-lg mb-6"></div>
          <div className="h-8 bg-gray-300 rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-gray-300 rounded w-2/3 mb-8"></div>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-300 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || !community) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Community Not Found</h1>
          <p className="text-gray-600 mb-6">{error || 'The community you\'re looking for doesn\'t exist.'}</p>
          <Link
            to="/communities"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
          >
            Browse Communities
          </Link>
        </div>
      </div>
    );
  }

  const isModerator = user && community.moderators.some(mod => mod._id === user.id);
  const isCreator = user && community.creator._id === user.id;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Community Header */}
      <div className="bg-white rounded-lg shadow mb-6">
        {/* Banner */}
        {community.banner ? (
          <div className="h-32 md:h-48 bg-gradient-to-r from-blue-400 to-purple-500 rounded-t-lg relative">
            <img
              src={community.banner}
              alt=""
              className="w-full h-full object-cover rounded-t-lg"
            />
          </div>
        ) : (
          <div className="h-32 md:h-48 bg-gradient-to-r from-blue-400 to-purple-500 rounded-t-lg"></div>
        )}

        <div className="p-6">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-6">
            <div className="flex items-start space-x-4 mb-4 md:mb-0">
              {/* Community Avatar */}
              <div className="relative -mt-12 md:-mt-16">
                {community.avatar ? (
                  <img
                    src={community.avatar}
                    alt={community.displayName}
                    className="w-20 h-20 md:w-24 md:h-24 rounded-full border-4 border-white object-cover"
                  />
                ) : (
                  <div className="w-20 h-20 md:w-24 md:h-24 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full border-4 border-white flex items-center justify-center">
                    <span className="text-white font-bold text-2xl md:text-3xl">
                      {community.displayName.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
              </div>

              <div className="pt-2">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">
                  {community.displayName}
                </h1>
                <p className="text-gray-600 mb-2">r/{community.name}</p>
                <p className="text-gray-700 mb-4">{community.description}</p>

                {/* Stats */}
                <div className="flex items-center space-x-6 text-sm text-gray-500">
                  <div className="flex items-center space-x-1">
                    <Users size={16} />
                    <span>{community.memberCount.toLocaleString()} members</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <MessageSquare size={16} />
                    <span>{community.postCount} posts</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Calendar size={16} />
                    <span>Created {new Date(community.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col space-y-2 min-w-[140px]">
              {user && (
                <button
                  onClick={handleJoinToggle}
                  disabled={joining}
                  className={`px-6 py-2 rounded-full font-medium transition-colors ${
                    isJoined
                      ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  } disabled:opacity-50`}
                >
                  {joining ? '...' : isJoined ? (
                    <span className="flex items-center space-x-1">
                      <UserMinus size={16} />
                      <span>Leave</span>
                    </span>
                  ) : (
                    <span className="flex items-center space-x-1">
                      <UserPlus size={16} />
                      <span>Join</span>
                    </span>
                  )}
                </button>
              )}

              {(isModerator || isCreator) && (
                <Link
                  to={`/community/${community.name}/settings`}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-full hover:bg-gray-50 text-center"
                >
                  <Settings size={16} className="inline mr-1" />
                  Settings
                </Link>
              )}

              <button className="px-6 py-2 border border-gray-300 text-gray-700 rounded-full hover:bg-gray-50">
                <Share2 size={16} className="inline mr-1" />
                Share
              </button>
            </div>
          </div>

          {/* Category and Tags */}
          <div className="flex flex-wrap items-center gap-2">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium 
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
            
            {community.tags.map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Posts */}
        <div className="lg:col-span-3">
          {/* Post Actions */}
          {isJoined && (
            <div className="bg-white rounded-lg shadow p-4 mb-6">
              <Link
                to={`/create-post?community=${community.name}`}
                className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-center block"
              >
                Create Post in r/{community.name}
              </Link>
            </div>
          )}

          {/* Sort Options */}
          <div className="bg-white rounded-lg shadow p-4 mb-6">
            <div className="flex space-x-4">
              {(['hot', 'new', 'top'] as const).map((sort) => (
                <button
                  key={sort}
                  onClick={() => setSortBy(sort)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    sortBy === sort
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {sort.charAt(0).toUpperCase() + sort.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Posts List */}
          {postsLoading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg shadow p-6 animate-pulse">
                  <div className="h-4 bg-gray-300 rounded w-3/4 mb-4"></div>
                  <div className="h-20 bg-gray-300 rounded mb-4"></div>
                  <div className="flex space-x-4">
                    <div className="h-3 bg-gray-300 rounded w-16"></div>
                    <div className="h-3 bg-gray-300 rounded w-16"></div>
                    <div className="h-3 bg-gray-300 rounded w-16"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : posts.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <MessageSquare size={48} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No posts yet</h3>
              <p className="text-gray-500 mb-4">Be the first to share something in this community!</p>
              {isJoined && (
                <Link
                  to={`/create-post?community=${community.name}`}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
                >
                  Create First Post
                </Link>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {posts.map((post) => (
                <PostCard
                  key={post._id}
                  post={post}
                  onVote={handlePostVote}
                />
              ))}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          {/* Community Info */}
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h3 className="font-semibold text-gray-900 mb-4">About Community</h3>
            
            <div className="space-y-3 text-sm">
              <div>
                <span className="font-medium">Created by:</span>
                <Link
                  to={`/user/${community.creator.username}`}
                  className="ml-1 text-blue-600 hover:underline"
                >
                  u/{community.creator.username}
                </Link>
              </div>
              
              <div>
                <span className="font-medium">Category:</span>
                <span className="ml-1">{community.category}</span>
              </div>
              
              <div>
                <span className="font-medium">Created:</span>
                <span className="ml-1">{new Date(community.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          {/* Rules */}
          {community.rules.length > 0 && (
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <h3 className="font-semibold text-gray-900 mb-4">Community Rules</h3>
              <ol className="space-y-2 text-sm">
                {community.rules.map((rule, index) => (
                  <li key={index} className="flex">
                    <span className="font-medium mr-2">{index + 1}.</span>
                    <span className="text-gray-700">{rule}</span>
                  </li>
                ))}
              </ol>
            </div>
          )}

          {/* Moderators */}
          {community.moderators.length > 0 && (
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Moderators</h3>
              <div className="space-y-2">
                {community.moderators.slice(0, 5).map((moderator) => (
                  <Link
                    key={moderator._id}
                    to={`/user/${moderator.username}`}
                    className="flex items-center space-x-2 text-sm hover:bg-gray-50 p-2 rounded"
                  >
                    {moderator.avatar ? (
                      <img
                        src={moderator.avatar}
                        alt=""
                        className="w-6 h-6 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-6 h-6 bg-gray-300 rounded-full"></div>
                    )}
                    <span>u/{moderator.username}</span>
                  </Link>
                ))}
                {community.moderators.length > 5 && (
                  <p className="text-xs text-gray-500">
                    +{community.moderators.length - 5} more
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CommunityDetailPage;
