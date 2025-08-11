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
const CommunityMessageSchema = new mongoose_1.Schema({
    community: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Community',
        required: true
    },
    sender: {
        type: mongoose_1.Schema.Types.ObjectId,
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
                type: mongoose_1.Schema.Types.ObjectId,
                ref: 'User',
                required: true
            },
            emoji: {
                type: String,
                required: true
            }
        }],
    replyTo: {
        type: mongoose_1.Schema.Types.ObjectId,
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
exports.default = mongoose_1.default.model('CommunityMessage', CommunityMessageSchema);
//# sourceMappingURL=CommunityMessage.js.map