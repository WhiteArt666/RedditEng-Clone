import mongoose, { Document, Schema } from 'mongoose';

export interface IPost extends Document {
  title: string;
  content: string;
  type: 'text' | 'flashcard' | 'grammar' | 'vocabulary' | 'pronunciation' | 'question';
  category: 'Grammar' | 'Vocabulary' | 'Speaking' | 'Listening' | 'Writing' | 'Reading' | 'IELTS' | 'TOEFL' | 'General' | 'ShortVideo';
  author: mongoose.Types.ObjectId;
  upvotes: mongoose.Types.ObjectId[];
  downvotes: mongoose.Types.ObjectId[];
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
  createdAt: Date;
  updatedAt: Date;
}

const PostSchema = new Schema<IPost>({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 300
  },
  content: {
    type: String,
    required: true,
    maxlength: 10000
  },
  type: {
    type: String,
    enum: ['text', 'flashcard', 'grammar', 'vocabulary', 'pronunciation', 'question'],
    default: 'text'
  },
  category: {
    type: String,
    enum: ['Grammar', 'Vocabulary', 'Speaking', 'Listening', 'Writing', 'Reading', 'IELTS', 'TOEFL', 'General', 'ShortVideo'],
    required: true
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  upvotes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  downvotes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  score: {
    type: Number,
    default: 0
  },
  commentCount: {
    type: Number,
    default: 0
  },
  tags: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
    default: 'Medium'
  },
  isAiGenerated: {
    type: Boolean,
    default: false
  },
  aiSuggestions: {
    grammarCheck: String,
    betterPhrase: String,
    pronunciation: String
  },
  attachments: [{
    type: {
      type: String,
      enum: ['image', 'audio']
    },
    url: String,
    publicId: String
  }]
}, {
  timestamps: true
});

// Index for better search performance
PostSchema.index({ category: 1, createdAt: -1 });
PostSchema.index({ author: 1, createdAt: -1 });
PostSchema.index({ score: -1, createdAt: -1 });
PostSchema.index({ tags: 1 });

// Calculate score based on votes
PostSchema.pre('save', function(next) {
  this.score = this.upvotes.length - this.downvotes.length;
  next();
});

export default mongoose.model<IPost>('Post', PostSchema);
