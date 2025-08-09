export default interface ShortVideo {
    _id: string;
    title: string;
    description: string;
    videoUrl: string;
    thumbnailUrl?: string;
    duration: number; // in seconds 
    author: {
        _id: string;
        username: string;
        avatar?: string;
        englishLevel: string;
        skillLevel: 'beginner' | 'intermediate' | 'advanced';
    };
    category: 'grammar' | 'vocabulary' | 'speaking' | 'listening' | 'writing' | 'reading' | 'pronunciation' | 'general';
    difficulty: 'easy' | 'medium' | 'hard';
    tags: string[];
    likes: number;
    views: number;
    comments: number;
    isLiked?: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface CreateShortVideoData {
  title: string;
  description: string;
  category: ShortVideo['category'];
  difficulty: ShortVideo['difficulty'];
  tags: string[];
  videoFile: File;
  thumbnailFile?: File;
}

export interface ShortVideoComment {
  _id: string;
  content: string;
  author: {
    _id: string;
    username: string;
    avatar?: string;
  };
  likes: number;
  isLiked?: boolean;
  createdAt: string;
}