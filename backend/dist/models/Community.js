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
const CommunitySchema = new mongoose_1.Schema({
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
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    moderators: [{
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'User'
        }],
    members: [{
            type: mongoose_1.Schema.Types.ObjectId,
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
CommunitySchema.pre('save', function (next) {
    this.memberCount = this.members.length;
    next();
});
exports.default = mongoose_1.default.model('Community', CommunitySchema);
//# sourceMappingURL=Community.js.map