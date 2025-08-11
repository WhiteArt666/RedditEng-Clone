import mongoose, { Document, Schema } from 'mongoose';

export interface ICommunity extends Document {
  name: string;
  displayName: string;
  description: string;
  avatar?: string;
  banner?: string;
  category: 'Grammar' | 'Vocabulary' | 'Speaking' | 'Listening' | 'Writing' | 'Reading' | 'IELTS' | 'TOEFL' | 'General';
  creator: mongoose.Types.ObjectId;
  moderators: mongoose.Types.ObjectId[];
  members: mongoose.Types.ObjectId[];
  memberCount: number;
  postCount: number;
  isPrivate: boolean;
  rules: string[];
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

const CommunitySchema = new Schema<ICommunity>({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    minlength: 3,
    maxlength: 25,
    match: /^[a-z0-9_]+$/
  },
  displayName: {
    type: String,
    required: true,
    trim: true,
    minlength: 3,
    maxlength: 50
  },
  description: {
    type: String,
    required: true,
    maxlength: 500
  },
  avatar: {
    type: String,
    default: ''
  },
  banner: {
    type: String,
    default: ''
  },
  category: {
    type: String,
    enum: ['Grammar', 'Vocabulary', 'Speaking', 'Listening', 'Writing', 'Reading', 'IELTS', 'TOEFL', 'General'],
    required: true
  },
  creator: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  moderators: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  members: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  memberCount: {
    type: Number,
    default: 0
  },
  postCount: {
    type: Number,
    default: 0
  },
  isPrivate: {
    type: Boolean,
    default: false
  },
  rules: [{
    type: String,
    maxlength: 200
  }],
  tags: [{
    type: String,
    trim: true,
    lowercase: true
  }]
}, {
  timestamps: true
});

// Indexes for better performance
CommunitySchema.index({ name: 1 });
CommunitySchema.index({ category: 1 });
CommunitySchema.index({ memberCount: -1 });
CommunitySchema.index({ postCount: -1 });
CommunitySchema.index({ createdAt: -1 });

// Update member count when members array changes
CommunitySchema.pre('save', function(next) {
  this.memberCount = this.members.length;
  next();
});

export default mongoose.model<ICommunity>('Community', CommunitySchema);
