import mongoose, { Document, Schema } from 'mongoose';

export interface IComment extends Document {
  content: string;
  author: mongoose.Types.ObjectId;
  post: mongoose.Types.ObjectId;
  parent?: mongoose.Types.ObjectId; // For nested comments
  upvotes: mongoose.Types.ObjectId[];
  downvotes: mongoose.Types.ObjectId[];
  score: number;
  depth: number;
  isAiGenerated: boolean;
  aiSuggestions?: {
    grammarCheck?: string;
    betterPhrase?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const CommentSchema = new Schema<IComment>({
  content: {
    type: String,
    required: true,
    trim: true,
    maxlength: 5000
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post',
    required: true
  },
  parent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment',
    default: null
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
  depth: {
    type: Number,
    default: 0,
    max: 5 // Limit nesting depth
  },
  isAiGenerated: {
    type: Boolean,
    default: false
  },
  aiSuggestions: {
    grammarCheck: String,
    betterPhrase: String
  }
}, {
  timestamps: true
});

// Index for better performance
CommentSchema.index({ post: 1, createdAt: -1 });
CommentSchema.index({ author: 1, createdAt: -1 });
CommentSchema.index({ parent: 1, createdAt: -1 });

// Calculate score based on votes
CommentSchema.pre('save', function(next) {
  this.score = this.upvotes.length - this.downvotes.length;
  next();
});

export default mongoose.model<IComment>('Comment', CommentSchema);
