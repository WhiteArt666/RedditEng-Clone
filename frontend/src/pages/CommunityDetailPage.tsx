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
  const [activeTab, setActiveTab] = useState<'posts' | 'rules' | 'about'>('posts');

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
      <div className="w-full max-w-none">
        <div className="animate-pulse">
          <div className="h-24 sm:h-32 lg:h-48 bg-gray-300 rounded-lg mb-4 sm:mb-6"></div>
          <div className="h-6 sm:h-8 bg-gray-300 rounded w-1/2 sm:w-1/3 mb-3 sm:mb-4"></div>
          <div className="h-3 sm:h-4 bg-gray-300 rounded w-2/3 mb-6 sm:mb-8"></div>
          <div className="space-y-3 sm:space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-20 sm:h-24 bg-gray-300 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || !community) {
    return (
      <div className="w-full max-w-none">
        <div className="text-center">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">Community Not Found</h1>
          <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">{error || 'The community you\'re looking for doesn\'t exist.'}</p>
          <Link
            to="/communities"
            className="bg-blue-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg hover:bg-blue-700 text-sm sm:text-base"
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
    <div className="w-full max-w-none">
      {/* Community Header */}
      <div className="bg-white rounded-lg shadow mb-4 sm:mb-6">
        {/* Banner */}
        {community.banner ? (
          <div className="h-24 sm:h-32 md:h-48 bg-gradient-to-r from-blue-400 to-purple-500 rounded-t-lg relative">
            <img
              src={community.banner}
              alt=""
              className="w-full h-full object-cover rounded-t-lg"
            />
          </div>
        ) : (
          <div className="h-24 sm:h-32 md:h-48 bg-gradient-to-r from-blue-400 to-purple-500 rounded-t-lg"></div>
        )}

        <div className="p-3 sm:p-4 lg:p-6">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-4 sm:mb-6">
            <div className="flex flex-col sm:flex-row sm:items-start sm:space-x-4 mb-4 lg:mb-0">
              {/* Community Avatar */}
              <div className="relative -mt-8 sm:-mt-12 lg:-mt-16 self-center sm:self-start">
                {community.avatar ? (
                  <img
                    src={community.avatar}
                    alt={community.displayName}
                    className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 rounded-full border-4 border-white object-cover"
                  />
                ) : (
                  <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full border-4 border-white flex items-center justify-center">
                    <span className="text-white font-bold text-lg sm:text-xl lg:text-3xl">
                      {community.displayName.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
              </div>

              <div className="pt-2 text-center sm:text-left flex-1 min-w-0">
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-1 truncate">
                  {community.displayName}
                </h1>
                <p className="text-gray-600 mb-2 text-sm sm:text-base truncate">r/{community.name}</p>
                <p className="text-gray-700 mb-3 sm:mb-4 text-sm sm:text-base line-clamp-3 break-words">{community.description}</p>

                {/* Stats */}
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 sm:gap-4 text-xs sm:text-sm text-gray-500">
                  <div className="flex items-center space-x-1">
                    <Users size={14} className="sm:w-4 sm:h-4 flex-shrink-0" />
                    <span className="whitespace-nowrap">{community.memberCount.toLocaleString()} members</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <MessageSquare size={14} className="sm:w-4 sm:h-4 flex-shrink-0" />
                    <span className="whitespace-nowrap">{community.postCount} posts</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Calendar size={14} className="sm:w-4 sm:h-4 flex-shrink-0" />
                    <span className="hidden sm:inline whitespace-nowrap">Created {new Date(community.createdAt).toLocaleDateString()}</span>
                    <span className="sm:hidden">{new Date(community.createdAt).getFullYear()}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-row sm:flex-col lg:flex-col space-x-2 sm:space-x-0 sm:space-y-2 lg:space-y-2 w-full sm:w-auto lg:min-w-[140px] lg:max-w-[140px]">
              {user && (
                <button
                  onClick={handleJoinToggle}
                  disabled={joining}
                  className={`flex-1 sm:flex-none px-3 sm:px-4 lg:px-6 py-2 rounded-full font-medium transition-colors text-sm ${
                    isJoined
                      ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  } disabled:opacity-50`}
                >
                  {joining ? '...' : isJoined ? (
                    <span className="flex items-center justify-center space-x-1">
                      <UserMinus size={14} className="flex-shrink-0" />
                      <span>Leave</span>
                    </span>
                  ) : (
                    <span className="flex items-center justify-center space-x-1">
                      <UserPlus size={14} className="flex-shrink-0" />
                      <span>Join</span>
                    </span>
                  )}
                </button>
              )}

              {(isModerator || isCreator) && (
                <Link
                  to={`/community/${community.name}/settings`}
                  className="flex-1 sm:flex-none px-3 sm:px-4 lg:px-6 py-2 border border-gray-300 text-gray-700 rounded-full hover:bg-gray-50 text-center text-sm"
                >
                  <Settings size={14} className="inline mr-1 flex-shrink-0" />
                  <span className="hidden sm:inline">Settings</span>
                  <span className="sm:hidden">Edit</span>
                </Link>
              )}

              <button className="flex-1 sm:flex-none px-3 sm:px-4 lg:px-6 py-2 border border-gray-300 text-gray-700 rounded-full hover:bg-gray-50 text-sm">
                <Share2 size={14} className="inline mr-1 flex-shrink-0" />
                <span>Share</span>
              </button>
            </div>
          </div>

          {/* Category and Tags */}
          <div className="flex flex-wrap items-center gap-2 justify-center sm:justify-start">
            <span className={`inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium 
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
            
            {community.tags.slice(0, 2).map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 max-w-[100px] truncate"
              >
                {tag}
              </span>
            ))}
            {community.tags.length > 2 && (
              <span className="text-xs text-gray-500">+{community.tags.length - 2}</span>
            )}
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="grid grid-cols-1 gap-4 sm:gap-6">
        {/* Posts */}
        <div className="w-full min-w-0">
          {/* Tab Navigation */}
          <div className="bg-white rounded-lg shadow p-3 sm:p-4 mb-4 sm:mb-6">
            <div className="flex space-x-1 border-b border-gray-200">
              {[
                { key: 'posts', label: 'Posts' },
                { key: 'rules', label: 'Rules' },
                { key: 'about', label: 'About' }
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as 'posts' | 'rules' | 'about')}
                  className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 ${
                    activeTab === tab.key
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          {activeTab === 'posts' && (
            <>
              {/* Post Actions */}
              {isJoined && (
                <div className="bg-white rounded-lg shadow p-3 sm:p-4 mb-4 sm:mb-6">
                  <Link
                    to={`/create-post?community=${community.name}`}
                    className="w-full bg-blue-600 text-white px-4 py-2.5 sm:py-3 rounded-lg hover:bg-blue-700 text-center block text-sm sm:text-base font-medium"
                  >
                    <span className="hidden sm:inline">Create Post in r/{community.name}</span>
                    <span className="sm:hidden">Create Post</span>
                  </Link>
                </div>
              )}

              {/* Sort Options */}
              <div className="bg-white rounded-lg shadow p-3 sm:p-4 mb-4 sm:mb-6">
                <div className="flex space-x-2 sm:space-x-4 overflow-x-auto">
                  {(['hot', 'new', 'top'] as const).map((sort) => (
                    <button
                      key={sort}
                      onClick={() => setSortBy(sort)}
                      className={`px-3 sm:px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap text-sm sm:text-base ${
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
                <div className="space-y-3 sm:space-y-4">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="bg-white rounded-lg shadow p-3 sm:p-6 animate-pulse">
                      <div className="h-3 sm:h-4 bg-gray-300 rounded w-3/4 mb-3 sm:mb-4"></div>
                      <div className="h-16 sm:h-20 bg-gray-300 rounded mb-3 sm:mb-4"></div>
                      <div className="flex space-x-3 sm:space-x-4">
                        <div className="h-2 sm:h-3 bg-gray-300 rounded w-12 sm:w-16"></div>
                        <div className="h-2 sm:h-3 bg-gray-300 rounded w-12 sm:w-16"></div>
                        <div className="h-2 sm:h-3 bg-gray-300 rounded w-12 sm:w-16"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : posts.length === 0 ? (
                <div className="bg-white rounded-lg shadow p-6 sm:p-8 text-center">
                  <MessageSquare size={32} className="sm:w-12 sm:h-12 mx-auto text-gray-400 mb-3 sm:mb-4" />
                  <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">No posts yet</h3>
                  <p className="text-sm sm:text-base text-gray-500 mb-4">Be the first to share something in this community!</p>
                  {isJoined && (
                    <Link
                      to={`/create-post?community=${community.name}`}
                      className="bg-blue-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg hover:bg-blue-700 text-sm sm:text-base"
                    >
                      Create First Post
                    </Link>
                  )}
                </div>
              ) : (
                <div className="space-y-3 sm:space-y-4">
                  {posts.map((post) => (
                    <PostCard
                      key={post._id}
                      post={post}
                      onVote={handlePostVote}
                    />
                  ))}
                </div>
              )}
            </>
          )}

          {/* Rules Tab */}
          {activeTab === 'rules' && (
            <div className="bg-white rounded-lg shadow p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6">
                r/{community.name} Rules
              </h2>
              
              {community.rules.length > 0 ? (
                <div className="space-y-4 sm:space-y-6">
                  {community.rules.map((rule, index) => (
                    <div key={index} className="border-b border-gray-200 pb-4 last:border-b-0 last:pb-0">
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0 w-6 h-6 sm:w-8 sm:h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-blue-600 font-bold text-sm sm:text-base">
                            {index + 1}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm sm:text-base font-medium text-gray-900 mb-2">
                            Rule {index + 1}
                          </h3>
                          <p className="text-sm sm:text-base text-gray-700 break-words">
                            {rule}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 sm:py-12">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <MessageSquare className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" />
                  </div>
                  <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">
                    No rules yet
                  </h3>
                  <p className="text-sm sm:text-base text-gray-500 mb-4">
                    This community hasn't set up any rules yet.
                  </p>
                  {(isModerator || isCreator) && (
                    <Link
                      to={`/community/${community.name}/settings`}
                      className="bg-blue-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg hover:bg-blue-700 text-sm sm:text-base"
                    >
                      Add Rules
                    </Link>
                  )}
                </div>
              )}
            </div>
          )}

          {/* About Tab */}
          {activeTab === 'about' && (
            <div className="space-y-4 sm:space-y-6">
              {/* Community Info */}
              <div className="bg-white rounded-lg shadow p-4 sm:p-6">
                <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6">
                  About r/{community.name}
                </h2>
                
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 mb-2">Description</h3>
                    <p className="text-sm sm:text-base text-gray-700 break-words">
                      {community.description || 'No description available.'}
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-sm font-medium text-gray-900 mb-2">Created</h3>
                      <p className="text-sm text-gray-600">
                        {new Date(community.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium text-gray-900 mb-2">Category</h3>
                      <span className={`inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium 
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
                    
                    <div>
                      <h3 className="text-sm font-medium text-gray-900 mb-2">Creator</h3>
                      <Link
                        to={`/user/${community.creator.username}`}
                        className="text-sm text-blue-600 hover:underline"
                      >
                        u/{community.creator.username}
                      </Link>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium text-gray-900 mb-2">Privacy</h3>
                      <span className="text-sm text-gray-600">
                        Public
                      </span>
                    </div>
                  </div>
                  
                  {community.tags.length > 0 && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-900 mb-2">Tags</h3>
                      <div className="flex flex-wrap gap-2">
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
                  )}
                </div>
              </div>

              {/* Moderators */}
              {community.moderators.length > 0 && (
                <div className="bg-white rounded-lg shadow p-4 sm:p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Moderators</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {community.moderators.map((moderator) => (
                      <Link
                        key={moderator._id}
                        to={`/user/${moderator.username}`}
                        className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors"
                      >
                        {moderator.avatar ? (
                          <img
                            src={moderator.avatar}
                            alt=""
                            className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                          />
                        ) : (
                          <div className="w-8 h-8 bg-gray-300 rounded-full flex-shrink-0"></div>
                        )}
                        <div className="min-w-0">
                          <span className="text-sm font-medium text-gray-900 truncate block">
                            u/{moderator.username}
                          </span>
                          <span className="text-xs text-gray-500">Moderator</span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Mobile Sidebar - Hidden on desktop as it's in the main layout */}
        <div className="block lg:hidden">
          {/* Community Info */}
          <div className="bg-white rounded-lg shadow p-4 mb-4">
            <h3 className="font-semibold text-gray-900 mb-3 text-sm">About Community</h3>
            
            <div className="space-y-2 text-xs">
              <div>
                <span className="font-medium">Created by:</span>
                <Link
                  to={`/user/${community.creator.username}`}
                  className="ml-1 text-blue-600 hover:underline break-all"
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

          {/* Rules for Mobile */}
          {community.rules.length > 0 && (
            <div className="bg-white rounded-lg shadow p-4 mb-4">
              <h3 className="font-semibold text-gray-900 mb-3 text-sm">Community Rules</h3>
              <ol className="space-y-1.5 text-xs">
                {community.rules.slice(0, 3).map((rule, index) => (
                  <li key={index} className="flex">
                    <span className="font-medium mr-2 flex-shrink-0">{index + 1}.</span>
                    <span className="text-gray-700 break-words">{rule}</span>
                  </li>
                ))}
                {community.rules.length > 3 && (
                  <li className="text-gray-500 text-xs">+{community.rules.length - 3} more rules</li>
                )}
              </ol>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CommunityDetailPage;
