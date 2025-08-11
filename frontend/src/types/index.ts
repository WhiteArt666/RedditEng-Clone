export interface User {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  bio?: string;
  englishLevel: 'Beginner' | 'Intermediate' | 'Advanced' | 'Native';
  karma: number;
  isVerified: boolean;
  joinedAt: string;
}

export interface Community {
  _id: string;
  name: string;
  displayName: string;
  description: string;
  avatar?: string;
  banner?: string;
  category: 'Grammar' | 'Vocabulary' | 'Speaking' | 'Listening' | 'Writing' | 'Reading' | 'IELTS' | 'TOEFL' | 'General';
  creator: {
    _id: string;
    username: string;
    avatar?: string;
    englishLevel: string;
    karma: number;
    isVerified?: boolean;
  };
  moderators: {
    _id: string;
    username: string;
    avatar?: string;
    englishLevel: string;
    karma: number;
    isVerified?: boolean;
  }[];
  members?: string[]; // Array of user IDs
  memberCount: number;
  postCount: number;
  isPrivate: boolean;
  rules: string[];
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CommunityMessage {
  _id: string;
  community: {
    _id: string;
    name: string;
    displayName: string;
    avatar?: string;
  };
  sender: {
    _id: string;
    username: string;
    avatar?: string;
    englishLevel: string;
    karma: number;
    isVerified?: boolean;
  };
  content: string;
  type: 'text' | 'image' | 'audio';
  attachments?: {
    type: 'image' | 'audio';
    url: string;
    publicId: string;
  }[];
  isEdited: boolean;
  editedAt?: string;
  reactions: {
    user: string;
    emoji: string;
  }[];
  replyTo?: {
    _id: string;
    content: string;
    sender: string;
    createdAt: string;
  };
  isDeleted: boolean;
  deletedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Post {
  _id: string;
  title: string;
  content: string;
  type: 'text' | 'flashcard' | 'grammar' | 'vocabulary' | 'pronunciation' | 'question';
  category: 'Grammar' | 'Vocabulary' | 'Speaking' | 'Listening' | 'Writing' | 'Reading' | 'IELTS' | 'TOEFL' | 'General' | 'ShortVideo';
  author: {
    _id: string;
    username: string;
    avatar?: string;
    englishLevel: string;
    karma: number;
    isVerified?: boolean;
  };
  community?: {
    _id: string;
    name: string;
    displayName: string;
    avatar?: string;
  };
  upvotes: string[];
  downvotes: string[];
  score: number;
  commentCount: number;
  tags: string[];
  difficulty: 'Easy' | 'Medium' | 'Hard';
  isAiGenerated: boolean;
  aiSuggestions?: {
    grammarCheck?: string;
    betterPhrase?: string;
    pronunciation?: string;
  };
  attachments?: {
    type: 'image' | 'audio';
    url: string;
    publicId: string;
  }[];
  createdAt: string;
  updatedAt: string;
}

export interface Comment {
  _id: string;
  content: string;
  author: {
    _id: string;
    username: string;
    avatar?: string;
    englishLevel: string;
    karma: number;
    isVerified?: boolean;
  };
  post: string;
  parent?: string;
  upvotes: string[];
  downvotes: string[];
  score: number;
  depth: number;
  isAiGenerated: boolean;
  aiSuggestions?: {
    grammarCheck?: string;
    betterPhrase?: string;
  };
  replies?: Comment[];
  createdAt: string;
  updatedAt: string;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => Promise<void>;
  isLoading: boolean;
  isAuthenticated: boolean;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  englishLevel?: 'Beginner' | 'Intermediate' | 'Advanced' | 'Native';
  bio?: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface CreatePostData {
  title: string;
  content: string;
  type?: 'text' | 'flashcard' | 'grammar' | 'vocabulary' | 'pronunciation' | 'question';
  category: 'Grammar' | 'Vocabulary' | 'Speaking' | 'Listening' | 'Writing' | 'Reading' | 'IELTS' | 'TOEFL' | 'General' | 'ShortVideo';
  tags?: string[];
  difficulty?: 'Easy' | 'Medium' | 'Hard';
  communityName?: string;
}

export interface CreateCommunityData {
  name: string;
  displayName: string;
  description: string;
  category: 'Grammar' | 'Vocabulary' | 'Speaking' | 'Listening' | 'Writing' | 'Reading' | 'IELTS' | 'TOEFL' | 'General';
  isPrivate?: boolean;
  rules?: string[];
  tags?: string[];
}

export interface CreateMessageData {
  content: string;
  type?: 'text' | 'image' | 'audio';
  attachments?: {
    type: 'image' | 'audio';
    url: string;
    publicId: string;
  }[];
  replyTo?: string;
}

export interface CreateCommentData {
  content: string;
  postId: string;
  parentId?: string;
}

export interface VoteData {
  voteType: 'up' | 'down' | 'none';
}

export interface ApiResponse<T> {
  message: string;
  data?: T;
  token?: string;
  user?: User;
  post?: Post;
  posts?: Post[];
  comment?: Comment;
  comments?: Comment[];
  community?: Community;
  communities?: Community[];
  messages?: CommunityMessage[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface ApiError {
  message: string;
  errors?: string[];
}
