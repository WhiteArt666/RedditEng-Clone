import React, { useState } from 'react';
import { ArrowUp, ArrowDown, Edit, Trash2, User } from 'lucide-react';
import type { Comment } from '../types';

interface CommentItemProps {
  comment: Comment;
  currentUserId?: string;
  onVote: (commentId: string, voteType: 'up' | 'down') => void;
  onEdit: (commentId: string, content: string) => Promise<void>;
  onDelete: (commentId: string) => void;
  formatDate: (date: string) => string;
}

const CommentItem: React.FC<CommentItemProps> = ({
  comment,
  currentUserId,
  onVote,
  onEdit,
  onDelete,
  formatDate
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);
  const [isUpdating, setIsUpdating] = useState(false);

  const isCommentAuthor = currentUserId && comment.author._id === currentUserId;

  const handleEditClick = () => {
    setIsEditing(true);
    setEditContent(comment.content);
  };

  const handleSaveEdit = async () => {
    if (!editContent.trim()) return;

    setIsUpdating(true);
    try {
      await onEdit(comment._id, editContent);
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update comment:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditContent(comment.content);
  };

  return (
    <div className="border-l-2 border-gray-200 pl-4">
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
            {comment.author.avatar ? (
              <img 
                src={comment.author.avatar} 
                alt={comment.author.username}
                className="w-8 h-8 rounded-full object-cover"
              />
            ) : (
              <User size={16} className="text-primary-600" />
            )}
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-medium text-gray-900 text-sm">
                {comment.author.username}
              </span>
              {comment.author.isVerified && (
                <span className="text-primary-600 text-xs">✓</span>
              )}
              <span className="text-xs text-gray-500">•</span>
              <span className="text-xs text-gray-500">
                {formatDate(comment.createdAt)}
              </span>
              {comment.updatedAt !== comment.createdAt && (
                <>
                  <span className="text-xs text-gray-500">•</span>
                  <span className="text-xs text-gray-500 italic">edited</span>
                </>
              )}
            </div>
            <div className="flex items-center space-x-1 text-xs text-gray-500">
              <span>{comment.author.englishLevel}</span>
              <span>•</span>
              <span>{comment.author.karma} karma</span>
            </div>
          </div>
        </div>
        
        {isCommentAuthor && !isEditing && (
          <div className="flex items-center space-x-2">
            <button 
              onClick={handleEditClick}
              className="text-gray-400 hover:text-blue-600 transition-colors p-1 rounded"
              title="Edit comment"
            >
              <Edit size={14} />
            </button>
            <button 
              onClick={() => onDelete(comment._id)}
              className="text-gray-400 hover:text-red-600 transition-colors p-1 rounded"
              title="Delete comment"
            >
              <Trash2 size={14} />
            </button>
          </div>
        )}
      </div>
      
      {/* AI Suggestions */}
      {comment.aiSuggestions && Object.keys(comment.aiSuggestions).length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-3">
          <div className="flex items-center space-x-2 mb-2">
            <span className="text-sm font-medium text-blue-900">🤖 AI Suggestions</span>
          </div>
          {comment.aiSuggestions.grammarCheck && (
            <p className="text-sm text-blue-800 mb-1">
              <strong>Grammar:</strong> {comment.aiSuggestions.grammarCheck}
            </p>
          )}
          {comment.aiSuggestions.betterPhrase && (
            <p className="text-sm text-blue-800">
              <strong>Better phrase:</strong> {comment.aiSuggestions.betterPhrase}
            </p>
          )}
        </div>
      )}
      
      {isEditing ? (
        <div className="mb-3">
          <textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent mb-3 resize-none"
            placeholder="Edit your comment..."
          />
          <div className="flex space-x-2">
            <button
              onClick={handleSaveEdit}
              disabled={!editContent.trim() || isUpdating}
              className="px-3 py-1 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
            >
              {isUpdating ? 'Saving...' : 'Save'}
            </button>
            <button
              onClick={handleCancelEdit}
              disabled={isUpdating}
              className="px-3 py-1 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 disabled:opacity-50 text-sm font-medium"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <p className="text-gray-700 mb-3 whitespace-pre-wrap leading-relaxed">
          {comment.content}
        </p>
      )}
      
      {!isEditing && (
        <div className="flex items-center space-x-4">
          {/* Voting */}
          <div className="flex items-center space-x-1">
            <button
              onClick={() => onVote(comment._id, 'up')}
              className="vote-btn p-1 rounded text-gray-400 hover:text-green-600 hover:bg-green-50 transition-colors"
              title="Upvote"
            >
              <ArrowUp size={16} />
            </button>
            <span className={`text-sm font-medium min-w-[2rem] text-center ${
              comment.score > 0 ? 'text-green-600' : 
              comment.score < 0 ? 'text-red-600' : 'text-gray-600'
            }`}>
              {comment.score}
            </span>
            <button
              onClick={() => onVote(comment._id, 'down')}
              className="vote-btn p-1 rounded text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
              title="Downvote"
            >
              <ArrowDown size={16} />
            </button>
          </div>
          
          {/* Reply button (for future implementation) */}
          <button className="text-sm text-gray-500 hover:text-gray-700 font-medium">
            Reply
          </button>
        </div>
      )}
    </div>
  );
};

export default CommentItem;
