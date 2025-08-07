import axios from 'axios';
import type { AxiosResponse } from 'axios';
import type { 
  ApiResponse, 
  User, 
  Post, 
  Comment, 
  RegisterData, 
  LoginData, 
  CreatePostData, 
  CreateCommentData, 
  VoteData 
} from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (data: RegisterData): Promise<AxiosResponse<ApiResponse<User>>> =>
    api.post('/auth/register', data),
    
  login: (data: LoginData): Promise<AxiosResponse<ApiResponse<User>>> =>
    api.post('/auth/login', data),
    
  getProfile: (): Promise<AxiosResponse<ApiResponse<User>>> =>
    api.get('/auth/profile'),
    
  updateProfile: (data: Partial<User>): Promise<AxiosResponse<ApiResponse<User>>> =>
    api.put('/auth/profile', data),
};

// Posts API
export const postsAPI = {
  createPost: (data: CreatePostData): Promise<AxiosResponse<ApiResponse<Post>>> =>
    api.post('/posts', data),
    
  getPosts: (params?: {
    page?: number;
    limit?: number;
    category?: string;
    type?: string;
    difficulty?: string;
    sortBy?: 'hot' | 'new' | 'top';
  }): Promise<AxiosResponse<ApiResponse<{ posts: Post[]; pagination: { page: number; limit: number; total: number; pages: number } }>>> =>
    api.get('/posts', { params }),
    
  getPost: (id: string): Promise<AxiosResponse<ApiResponse<{ post: Post }>>> =>
    api.get(`/posts/${id}`),
    
  updatePost: (id: string, data: Partial<CreatePostData>): Promise<AxiosResponse<ApiResponse<Post>>> =>
    api.put(`/posts/${id}`, data),
    
  deletePost: (id: string): Promise<AxiosResponse<ApiResponse<null>>> =>
    api.delete(`/posts/${id}`),
    
  votePost: (id: string, data: VoteData): Promise<AxiosResponse<ApiResponse<{ score: number; userVote: string }>>> =>
    api.post(`/posts/${id}/vote`, data),
    
  searchPosts: (params: {
    q: string;
    category?: string;
    type?: string;
    page?: number;
    limit?: number;
  }): Promise<AxiosResponse<ApiResponse<{ posts: Post[]; pagination: { page: number; limit: number; total: number; pages: number } }>>> =>
    api.get('/posts/search', { params }),
};

// Comments API
export const commentsAPI = {
  createComment: (data: CreateCommentData): Promise<AxiosResponse<ApiResponse<Comment>>> =>
    api.post('/comments', data),
    
  getComments: (postId: string, params?: {
    page?: number;
    limit?: number;
    sortBy?: 'top' | 'new' | 'old';
  }): Promise<AxiosResponse<ApiResponse<{ comments: Comment[]; pagination: { page: number; limit: number; total: number; pages: number } }>>> =>
    api.get(`/comments/post/${postId}`, { params }),
    
  updateComment: (id: string, data: { content: string }): Promise<AxiosResponse<ApiResponse<Comment>>> =>
    api.put(`/comments/${id}`, data),
    
  deleteComment: (id: string): Promise<AxiosResponse<ApiResponse<null>>> =>
    api.delete(`/comments/${id}`),
    
  voteComment: (id: string, data: VoteData): Promise<AxiosResponse<ApiResponse<{ score: number; userVote: string }>>> =>
    api.post(`/comments/${id}/vote`, data),
};

export default api;
