import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './context/AuthContext';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import RightSidebar from './components/RightSidebar';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import HomePage from './pages/HomePage';
import PostDetailPage from './pages/PostDetailPage';
import CreatePostPage from './pages/CreatePostPage';
import ProfilePage from './pages/ProfilePage';
import CommunitiesPage from './pages/CommunitiesPage';
import CreateCommunityPage from './pages/CreateCommunityPage';
import CommunityDetailPage from './pages/CommunityDetailPage';
import CloudinaryUploadDemo from './components/CloudinaryUploadDemo';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <div className="min-h-screen bg-gray-100">
            <Header />
            <div className="max-w-7xl mx-auto px-4 pt-4">
              <Routes>
                {/* Auth routes without sidebar */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                
                {/* Main routes with sidebar layout */}
                <Route path="/*" element={
                  <div className="flex gap-4">
                    {/* Left Sidebar */}
                    <Sidebar />
                    
                    {/* Main Content */}
                    <main className="flex-1 min-w-0 max-w-full">
                      <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/hot" element={<HomePage sortBy="hot" />} />
                        <Route path="/new" element={<HomePage sortBy="new" />} />
                        <Route path="/top" element={<HomePage sortBy="top" />} />
                        <Route path="/post/:id" element={<PostDetailPage />} />
                        <Route path="/category/:category" element={<HomePage />} />
                        <Route path="/difficulty/:difficulty" element={<HomePage />} />
                        <Route path="/search" element={<HomePage />} />
                        
                        {/* Community routes */}
                        <Route path="/communities" element={<CommunitiesPage />} />
                        <Route path="/community/:name" element={<CommunityDetailPage />} />
                        
                        {/* Test Cloudinary Upload */}
                        <Route path="/test-upload" element={<CloudinaryUploadDemo />} />
                        
                        {/* Protected routes */}
                        <Route path="/create" element={
                          <ProtectedRoute>
                            <CreatePostPage />
                          </ProtectedRoute>
                        } />
                        <Route path="/create-post" element={
                          <ProtectedRoute>
                            <CreatePostPage />
                          </ProtectedRoute>
                        } />
                        <Route path="/create-community" element={
                          <ProtectedRoute>
                            <CreateCommunityPage />
                          </ProtectedRoute>
                        } />
                        <Route path="/profile" element={
                          <ProtectedRoute>
                            <ProfilePage />
                          </ProtectedRoute>
                        } />
                      </Routes>
                    </main>
                    
                    {/* Right Sidebar */}
                    <RightSidebar />
                  </div>
                } />
              </Routes>
            </div>
          </div>
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
