"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const CommentSchema = new mongoose_1.Schema({
    content: {
        type: String,
        required: true,
        trim: true,
        maxlength: 5000
    },
    author: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    post: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Post',
        required: true
    },
    parent: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Comment',
        default: null
    },
    upvotes: [{
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: 'User'
        }],
    downvotes: [{
            type: mongoose_1.default.Schema.Types.ObjectId,
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
CommentSchema.pre('save', function (next) {
    this.score = this.upvotes.length - this.downvotes.length;
    next();
});
exports.default = mongoose_1.default.model('Comment', CommentSchema);
//# sourceMappingURL=Comment.js.map