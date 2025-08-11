import mongoose, { Document, Schema } from 'mongoose';

export interface ICommunityMessage extends Document {
  community: mongoose.Types.ObjectId;
  sender: mongoose.Types.ObjectId;
  content: string;
  type: 'text' | 'image' | 'audio';
  attachments?: {
    type: 'image' | 'audio';
    url: string;
    publicId: string;
  }[];
  isEdited: boolean;
  editedAt?: Date;
  reactions: {
    user: mongoose.Types.ObjectId;
    emoji: string;
  }[];
  replyTo?: mongoose.Types.ObjectId;
  isDeleted: boolean;
  deletedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const CommunityMessageSchema = new Schema<ICommunityMessage>({
  community: {
    type: Schema.Types.ObjectId,
    ref: 'Community',
    required: true
  },
  sender: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    required: true,
    maxlength: 2000,
    trim: true
  },
  type: {
    type: String,
    enum: ['text', 'image', 'audio'],
    default: 'text'
  },
  attachments: [{
    type: {
      type: String,
      enum: ['image', 'audio'],
      required: true
    },
    url: {
      type: String,
      required: true
    },
    publicId: {
      type: String,
      required: true
    }
  }],
  isEdited: {
    type: Boolean,
    default: false
  },
  editedAt: {
    type: Date
  },
  reactions: [{
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    emoji: {
      type: String,
      required: true
    }
  }],
  replyTo: {
    type: Schema.Types.ObjectId,
    ref: 'CommunityMessage'
  },
  isDeleted: {
    type: Boolean,
    default: false
  },
  deletedAt: {
    type: Date
  }
}, {
  timestamps: true
});

// Indexes for better performance
CommunityMessageSchema.index({ community: 1, createdAt: -1 });
CommunityMessageSchema.index({ sender: 1 });
CommunityMessageSchema.index({ replyTo: 1 });

export default mongoose.model<ICommunityMessage>('CommunityMessage', CommunityMessageSchema);
