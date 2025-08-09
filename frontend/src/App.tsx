import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './context/AuthContext';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import HomePage from './pages/HomePage';
import PostDetailPage from './pages/PostDetailPage';
import CreatePostPage from './pages/CreatePostPage';
import ProfilePage from './pages/ProfilePage';
import CloudinaryUploadDemo from './components/CloudinaryUploadDemo';

// Pages (will create these next)


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
          <div className="min-h-screen bg-gray-50">
            <Header />
            <div className="flex max-w-7xl mx-auto">
              <Routes>
                {/* Auth routes without sidebar */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                
                {/* Main routes with sidebar */}
                <Route path="/*" element={
                  <>
                    <Sidebar />
                    <main className="flex-1 p-6">
                      <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/hot" element={<HomePage sortBy="hot" />} />
                        <Route path="/new" element={<HomePage sortBy="new" />} />
                        <Route path="/top" element={<HomePage sortBy="top" />} />
                        <Route path="/post/:id" element={<PostDetailPage />} />
                        <Route path="/category/:category" element={<HomePage />} />
                        <Route path="/difficulty/:difficulty" element={<HomePage />} />
                        <Route path="/search" element={<HomePage />} />
                        
                        {/* Test Cloudinary Upload */}
                        <Route path="/test-upload" element={<CloudinaryUploadDemo />} />
                        
                        {/* Protected routes */}
                        <Route path="/create" element={
                          <ProtectedRoute>
                            <CreatePostPage />
                          </ProtectedRoute>
                        } />
                        <Route path="/profile" element={
                          <ProtectedRoute>
                            <ProfilePage />
                          </ProtectedRoute>
                        } />
                      </Routes>
                    </main>
                  </>
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
