import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  BookOpen, 
  MessageSquare, 
  Mic, 
  Headphones, 
  PenTool, 
  Eye, 
  Award, 
  GraduationCap,
  Hash,
} from 'lucide-react';

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
  // { name: 'ShortVideo', icon: PlayCircle, path: '/category/ShortVideo' },
];

const difficulties = [
  { name: 'Easy', color: 'text-green-600', path: '/difficulty/easy' },
  { name: 'Medium', color: 'text-yellow-600', path: '/difficulty/medium' },
  { name: 'Hard', color: 'text-red-600', path: '/difficulty/hard' },
];

const Sidebar: React.FC = () => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <aside className="w-64 bg-white border-r border-gray-200 h-screen sticky top-16 overflow-y-auto">
      <div className="p-6">
        {/* Categories */}
        <div className="mb-8">
          <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-4">
            Categories
          </h3>
          <nav className="space-y-2">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <Link
                  key={category.name}
                  to={category.path}
                  className={`flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive(category.path)
                      ? 'bg-primary-100 text-primary-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <Icon size={18} />
                  <span>{category.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Difficulty Levels */}
        <div className="mb-8">
          <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-4">
            Difficulty
          </h3>
          <nav className="space-y-2">
            {difficulties.map((difficulty) => (
              <Link
                key={difficulty.name}
                to={difficulty.path}
                className={`flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive(difficulty.path)
                    ? 'bg-gray-100 text-gray-900'
                    : `${difficulty.color} hover:bg-gray-100`
                }`}
              >
                <div className={`w-3 h-3 rounded-full ${
                  difficulty.name === 'Easy' 
                    ? 'bg-green-500' 
                    : difficulty.name === 'Medium' 
                    ? 'bg-yellow-500' 
                    : 'bg-red-500'
                }`}></div>
                <span>{difficulty.name}</span>
              </Link>
            ))}
          </nav>
        </div>

        {/* Quick Stats */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">
            Community Stats
          </h3>
          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex justify-between">
              <span>Members:</span>
              <span className="font-medium">12.5k</span>
            </div>
            <div className="flex justify-between">
              <span>Online:</span>
              <span className="font-medium text-green-600">847</span>
            </div>
            <div className="flex justify-between">
              <span>Posts Today:</span>
              <span className="font-medium">156</span>
            </div>
          </div>
        </div>

        {/* Learning Tips */}
        <div className="mt-6 bg-primary-50 rounded-lg p-4">
          <h3 className="text-sm font-semibold text-primary-900 mb-2">
            💡 Learning Tip
          </h3>
          <p className="text-sm text-primary-700">
            Practice speaking English for at least 15 minutes daily to improve fluency!
          </p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
