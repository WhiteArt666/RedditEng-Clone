import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Search, Plus, User, LogOut, Home, TrendingUp, Clock, Menu, X, ChevronDown, Bell, MessageSquare } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Header: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMobileMenuOpen(false);
    setIsUserMenuOpen(false);
  };

  const isActive = (path: string) => location.pathname === path;

  const handleSearch = (query: string) => {
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query)}`);
      setIsSearchOpen(false);
    }
  };

  return (
    <header className="bg-white border-b border-gray-300 sticky top-0 z-50">
      <div className="max-w-full px-4 lg:px-6 xl:max-w-7xl xl:mx-auto">
        <div className="flex items-center justify-between h-12">
          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded text-gray-600 hover:text-gray-900 hover:bg-gray-100"
          >
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">r</span>
            </div>
            <span className="text-xl font-bold text-gray-900 hidden sm:block">
              reddit
            </span>
          </Link>

          {/* Search Bar - Desktop */}
          <div className="hidden sm:flex flex-1 max-w-lg mx-4">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search Reddit"
                className="w-full pl-10 pr-4 py-2 text-sm bg-gray-100 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent focus:bg-white"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    const query = (e.target as HTMLInputElement).value;
                    handleSearch(query);
                  }
                }}
              />
            </div>
          </div>

          {/* Search Button - Mobile */}
          <button
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            className="sm:hidden p-2 rounded text-gray-600 hover:text-gray-900 hover:bg-gray-100"
          >
            <Search size={20} />
          </button>

          {/* User Actions */}
          <div className="flex items-center space-x-2">
            {isAuthenticated ? (
              <>
                {/* Notifications */}
                <button className="hidden lg:flex p-2 rounded text-gray-600 hover:text-gray-900 hover:bg-gray-100">
                  <Bell size={20} />
                </button>

                {/* Messages */}
                <button className="hidden lg:flex p-2 rounded text-gray-600 hover:text-gray-900 hover:bg-gray-100">
                  <MessageSquare size={20} />
                </button>

                {/* Create Post */}
                <Link
                  to="/create"
                  className="flex items-center space-x-1 bg-orange-500 text-white px-3 py-1.5 rounded text-sm font-medium hover:bg-orange-600 transition-colors"
                >
                  <Plus size={16} />
                  <span className="hidden sm:inline">Create</span>
                </Link>
                
                {/* User Menu */}
                <div className="relative">
                  <button 
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center space-x-2 p-1 rounded hover:bg-gray-100 transition-colors"
                  >
                    <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-medium">
                        {user?.username.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <ChevronDown size={16} className="text-gray-400 hidden lg:block" />
                  </button>
                  
                  {/* Dropdown Menu */}
                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded border border-gray-300 shadow-lg py-1">
                      <div className="px-4 py-2 border-b border-gray-200">
                        <p className="text-sm font-medium text-gray-900">u/{user?.username}</p>
                        <p className="text-xs text-gray-500">{user?.karma || 0} karma</p>
                      </div>
                      
                      <Link
                        to="/profile"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <User size={16} />
                        <span>Profile</span>
                      </Link>
                      
                      <button
                        onClick={handleLogout}
                        className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <LogOut size={16} />
                        <span>Log Out</span>
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="text-sm font-medium text-gray-700 hover:text-gray-900 px-3 py-1.5 rounded hover:bg-gray-100"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="bg-orange-500 text-white px-3 py-1.5 rounded text-sm font-medium hover:bg-orange-600 transition-colors"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Search Bar */}
        {isSearchOpen && (
          <div className="sm:hidden pb-3 border-t border-gray-200 mt-3 pt-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search Reddit"
                className="w-full pl-10 pr-4 py-2 text-sm bg-gray-100 border border-gray-300 rounded focus:ring-2 focus:ring-orange-500 focus:border-transparent focus:bg-white"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    const query = (e.target as HTMLInputElement).value;
                    handleSearch(query);
                  }
                }}
                autoFocus
              />
            </div>
          </div>
        )}

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 mt-3 pt-3 pb-3">
            <nav className="space-y-2">
              <Link 
                to="/" 
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center space-x-3 px-3 py-2 rounded text-sm font-medium transition-colors ${
                  isActive('/') 
                    ? 'bg-orange-100 text-orange-700' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <Home size={18} />
                <span>Home</span>
              </Link>
              
              <Link 
                to="/hot" 
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center space-x-3 px-3 py-2 rounded text-sm font-medium transition-colors ${
                  isActive('/hot') 
                    ? 'bg-orange-100 text-orange-700' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <TrendingUp size={18} />
                <span>Popular</span>
              </Link>
              
              <Link 
                to="/new" 
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center space-x-3 px-3 py-2 rounded text-sm font-medium transition-colors ${
                  isActive('/new') 
                    ? 'bg-orange-100 text-orange-700' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <Clock size={18} />
                <span>New</span>
              </Link>

              {isAuthenticated && (
                <>
                  <div className="border-t border-gray-200 my-2 pt-2">
                    <Link
                      to="/profile"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center space-x-3 px-3 py-2 rounded text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                    >
                      <User size={18} />
                      <span>Profile</span>
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center space-x-3 w-full px-3 py-2 rounded text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                    >
                      <LogOut size={18} />
                      <span>Log Out</span>
                    </button>
                  </div>
                </>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
