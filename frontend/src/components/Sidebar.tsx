import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { communitiesAPI } from '../services/api';
import type { Community } from '../types';
import { 
  Home,
  TrendingUp,
  Clock,
  Star,
  BookOpen, 
  MessageSquare, 
  Mic, 
  Headphones, 
  PenTool, 
  Eye, 
  Award, 
  GraduationCap,
  Hash,
  ChevronDown,
  ChevronUp,
  Plus,
  Users
} from 'lucide-react';

const mainLinks = [
  { name: 'Home', icon: Home, path: '/' },
  { name: 'Popular', icon: TrendingUp, path: '/hot' },
  { name: 'New', icon: Clock, path: '/new' },
  { name: 'Top', icon: Star, path: '/top' },
];

const categories = [
  { name: 'Grammar', icon: BookOpen, path: '/category/grammar' },
  { name: 'Vocabulary', icon: Hash, path: '/category/vocabulary' },
  { name: 'Speaking', icon: Mic, path: '/category/speaking' },
  { name: 'Listening', icon: Headphones, path: '/category/listening' },
  { name: 'Writing', icon: PenTool, path: '/category/writing' },
  { name: 'Reading', icon: Eye, path: '/category/reading' },
  { name: 'IELTS', icon: Award, path: '/category/ielts' },
  { name: 'TOEFL', icon: GraduationCap, path: '/category/toefl' },
  { name: 'General', icon: MessageSquare, path: '/category/general' },
];

const Sidebar: React.FC = () => {
  const location = useLocation();
  const { user } = useAuth();
  const [userCommunities, setUserCommunities] = useState<Community[]>([]);
  const [popularCommunities, setPopularCommunities] = useState<Community[]>([]);
  const [growingCommunities, setGrowingCommunities] = useState<Community[]>([]);
  const [showAllCommunities, setShowAllCommunities] = useState(false);
  const [loading, setLoading] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  useEffect(() => {
    fetchPopularCommunities();
    fetchGrowingCommunities();
    if (user) {
      fetchUserCommunities();
    }
  }, [user]);

  const fetchUserCommunities = async () => {
    try {
      setLoading(true);
      const response = await communitiesAPI.getUserCommunities();
      setUserCommunities(response.data.data || []);
    } catch (error) {
      console.error('Error fetching user communities:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPopularCommunities = async () => {
    try {
      const response = await communitiesAPI.getCommunities({ 
        page: 1, 
        limit: 5, 
        sortBy: 'memberCount' 
      });
      setPopularCommunities(response.data.data || []);
    } catch (error) {
      console.error('Error fetching popular communities:', error);
    }
  };

  const fetchGrowingCommunities = async () => {
    try {
      // Get communities created in the last 30 days, sorted by creation date
      const response = await communitiesAPI.getCommunities({ 
        page: 1, 
        limit: 5, 
        sortBy: 'createdAt'
      });
      setGrowingCommunities(response.data.data || []);
    } catch (error) {
      console.error('Error fetching growing communities:', error);
    }
  };

  return (
    <aside className="hidden md:block w-64 h-fit sticky top-14">
      {/* Main Navigation */}
      <div className="bg-white border border-gray-300 rounded mb-4">
        <div className="p-3">
          <nav className="space-y-1">
            {mainLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`flex items-center space-x-3 px-3 py-2 rounded text-sm font-medium transition-colors ${
                    isActive(link.path)
                      ? 'bg-gray-200 text-gray-900'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <Icon size={20} />
                  <span>{link.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Your Communities */}
      {user && (
        <div className="bg-white border border-gray-300 rounded mb-4">
          <div className="p-3 border-b border-gray-300">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wide">
                Your Communities
              </h3>
              <button 
                onClick={() => setShowAllCommunities(!showAllCommunities)}
                className="text-gray-400 hover:text-gray-600"
              >
                {showAllCommunities ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>
            </div>
          </div>
          
          <div className="p-3">
            <Link
              to="/create-community"
              className="flex items-center space-x-2 text-sm text-gray-600 hover:text-gray-900 mb-3"
            >
              <Plus size={16} />
              <span>Create Community</span>
            </Link>
            
            <Link
              to="/communities"
              className="flex items-center space-x-2 text-sm text-gray-600 hover:text-gray-900 mb-3"
            >
              <Users size={16} />
              <span>Browse Communities</span>
            </Link>
            
            {loading ? (
              <div className="space-y-2">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex items-center space-x-2">
                    <div className="w-5 h-5 bg-gray-300 rounded-full animate-pulse"></div>
                    <div className="h-3 bg-gray-300 rounded w-20 animate-pulse"></div>
                  </div>
                ))}
              </div>
            ) : (
              <nav className="space-y-1">
                {userCommunities.slice(0, showAllCommunities ? undefined : 5).map((community) => (
                  <Link
                    key={community._id}
                    to={`/community/${community.name}`}
                    className={`flex items-center space-x-3 px-2 py-1.5 rounded text-sm transition-colors ${
                      location.pathname === `/community/${community.name}`
                        ? 'bg-gray-200 text-gray-900'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                    }`}
                  >
                    <div className="w-5 h-5 flex-shrink-0">
                      {community.avatar ? (
                        <img 
                          src={community.avatar} 
                          alt=""
                          className="w-5 h-5 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs font-bold">
                            {community.displayName.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      )}
                    </div>
                    <span className="truncate">r/{community.name}</span>
                  </Link>
                ))}
                
                {userCommunities.length === 0 && (
                  <p className="text-xs text-gray-500 py-2">
                    Join communities to see them here
                  </p>
                )}
                
                {!showAllCommunities && userCommunities.length > 5 && (
                  <button 
                    onClick={() => setShowAllCommunities(true)}
                    className="text-xs text-gray-500 hover:text-gray-700 mt-2 w-full text-left"
                  >
                    See {userCommunities.length - 5} more
                  </button>
                )}
              </nav>
            )}
          </div>
        </div>
      )}

      {/* Popular Communities */}
      <div className="bg-white border border-gray-300 rounded mb-4">
        <div className="p-3 border-b border-gray-300">
          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wide">
            Popular Communities
          </h3>
        </div>
        
        <div className="p-3">
          <nav className="space-y-2">
            {popularCommunities.map((community, index) => (
              <div key={community._id} className="flex items-center justify-between">
                <Link
                  to={`/community/${community.name}`}
                  className="flex items-center space-x-3 p-2 rounded hover:bg-gray-50 transition-colors flex-1"
                >
                  <span className="text-sm font-medium text-gray-400 w-4">
                    {index + 1}
                  </span>
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
                    <p className="text-sm font-medium text-gray-900 truncate">
                      r/{community.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {community.memberCount.toLocaleString()} members
                    </p>
                  </div>
                </Link>
                {user && !userCommunities.some(uc => uc._id === community._id) && (
                  <button
                    onClick={async (e) => {
                      e.preventDefault();
                      try {
                        await communitiesAPI.joinCommunity(community._id);
                        // Redirect to community page after joining
                        window.location.href = `/community/${community.name}`;
                      } catch (error) {
                        console.error('Error joining community:', error);
                      }
                    }}
                    className="px-3 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600 transition-colors"
                  >
                    Join
                  </button>
                )}
              </div>
            ))}
            {popularCommunities.length === 0 && (
              <p className="text-xs text-gray-500 py-2">
                No communities yet
              </p>
            )}
          </nav>
        </div>
      </div>

      {/* Today's Top Growing Communities */}
      <div className="bg-white border border-gray-300 rounded mb-4">
        <div className="p-3 border-b border-gray-300">
          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wide">
            Today's Top Growing
          </h3>
        </div>
        
        <div className="p-3">
          <nav className="space-y-2">
            {growingCommunities.map((community, index) => (
              <div key={community._id} className="flex items-center justify-between">
                <Link
                  to={`/community/${community.name}`}
                  className="flex items-center space-x-3 p-2 rounded hover:bg-gray-50 transition-colors flex-1"
                >
                  <span className="text-sm font-medium text-green-500 w-4">
                    {index + 1}
                  </span>
                  <div className="w-6 h-6 flex-shrink-0">
                    {community.avatar ? (
                      <img 
                        src={community.avatar} 
                        alt=""
                        className="w-6 h-6 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs font-bold">
                          {community.displayName.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      r/{community.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {community.memberCount.toLocaleString()} members
                    </p>
                  </div>
                </Link>
                {user && !userCommunities.some(uc => uc._id === community._id) && (
                  <button
                    onClick={async (e) => {
                      e.preventDefault();
                      try {
                        await communitiesAPI.joinCommunity(community._id);
                        // Redirect to community page after joining
                        window.location.href = `/community/${community.name}`;
                      } catch (error) {
                        console.error('Error joining community:', error);
                      }
                    }}
                    className="px-3 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600 transition-colors"
                  >
                    Join
                  </button>
                )}
              </div>
            ))}
            {growingCommunities.length === 0 && (
              <p className="text-xs text-gray-500 py-2">
                No new communities yet
              </p>
            )}
          </nav>
        </div>
      </div>

      {/* All Categories */}
      <div className="bg-white border border-gray-300 rounded mb-4">
        <div className="p-3 border-b border-gray-300">
          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wide">
            All Categories
          </h3>
        </div>
        
        <div className="p-3">
          <nav className="space-y-1">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <Link
                  key={category.name}
                  to={category.path}
                  className={`flex items-center space-x-3 px-2 py-1.5 rounded text-sm transition-colors ${
                    isActive(category.path)
                      ? 'bg-gray-200 text-gray-900'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <Icon size={16} />
                  <span>{category.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* User Agreement */}
      <div className="text-xs text-gray-500 px-3 space-y-2">
        <div className="flex flex-wrap gap-2">
          <a href="#" className="hover:underline">User Agreement</a>
          <a href="#" className="hover:underline">Privacy Policy</a>
          <a href="#" className="hover:underline">Content Policy</a>
        </div>
        <div className="flex flex-wrap gap-2">
          <a href="#" className="hover:underline">Moderator Code of Conduct</a>
        </div>
        <p>Reddit Inc © 2024. All rights reserved.</p>
      </div>
    </aside>
  );
};

export default Sidebar;
