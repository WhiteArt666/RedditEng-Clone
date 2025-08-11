"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRecentMessages = exports.addReaction = exports.deleteMessage = exports.editMessage = exports.getCommunityMessages = exports.sendMessage = void 0;
const CommunityMessage_1 = __importDefault(require("../models/CommunityMessage"));
const Community_1 = __importDefault(require("../models/Community"));
// Send a message in community
const sendMessage = async (req, res) => {
    try {
        const { communityName } = req.params;
        const { content, type, attachments, replyTo } = req.body;
        const userId = req.user.id;
        // Find community
        const community = await Community_1.default.findOne({ name: communityName.toLowerCase() });
        if (!community) {
            return res.status(404).json({ message: 'Community not found' });
        }
        // Check if user is a member
        if (!community.members.includes(userId)) {
            return res.status(403).json({ message: 'You must be a member to send messages' });
        }
        const message = new CommunityMessage_1.default({
            community: community._id,
            sender: userId,
            content,
            type: type || 'text',
            attachments: attachments || [],
            replyTo: replyTo || undefined
        });
        await message.save();
        await message.populate('sender', 'username avatar englishLevel karma isVerified');
        if (replyTo) {
            await message.populate('replyTo', 'content sender createdAt');
        }
        res.status(201).json({
            message: 'Message sent successfully',
            data: message
        });
    }
    catch (error) {
        console.error('Error sending message:', error);
        res.status(500).json({ message: 'Error sending message' });
    }
};
exports.sendMessage = sendMessage;
// Get messages in community
const getCommunityMessages = async (req, res) => {
    try {
        const { communityName } = req.params;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 50;
        // Find community
        const community = await Community_1.default.findOne({ name: communityName.toLowerCase() });
        if (!community) {
            return res.status(404).json({ message: 'Community not found' });
        }
        const messages = await CommunityMessage_1.default.find({
            community: community._id,
            isDeleted: false
        })
            .populate('sender', 'username avatar englishLevel karma isVerified')
            .populate('replyTo', 'content sender createdAt')
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit);
        const total = await CommunityMessage_1.default.countDocuments({
            community: community._id,
            isDeleted: false
        });
        res.json({
            message: 'Messages retrieved successfully',
            data: messages.reverse(), // Reverse to show oldest first
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit)
            }
        });
    }
    catch (error) {
        console.error('Error getting community messages:', error);
        res.status(500).json({ message: 'Error retrieving messages' });
    }
};
exports.getCommunityMessages = getCommunityMessages;
// Edit a message
const editMessage = async (req, res) => {
    try {
        const { messageId } = req.params;
        const { content } = req.body;
        const userId = req.user.id;
        const message = await CommunityMessage_1.default.findById(messageId);
        if (!message) {
            return res.status(404).json({ message: 'Message not found' });
        }
        // Check if user is the sender
        if (message.sender.toString() !== userId) {
            return res.status(403).json({ message: 'You can only edit your own messages' });
        }
        // Check if message is not deleted
        if (message.isDeleted) {
            return res.status(400).json({ message: 'Cannot edit deleted message' });
        }
        message.content = content;
        message.isEdited = true;
        message.editedAt = new Date();
        await message.save();
        await message.populate('sender', 'username avatar englishLevel karma isVerified');
        res.json({
            message: 'Message edited successfully',
            data: message
        });
    }
    catch (error) {
        console.error('Error editing message:', error);
        res.status(500).json({ message: 'Error editing message' });
    }
};
exports.editMessage = editMessage;
// Delete a message
const deleteMessage = async (req, res) => {
    try {
        const { messageId } = req.params;
        const userId = req.user.id;
        const message = await CommunityMessage_1.default.findById(messageId);
        if (!message) {
            return res.status(404).json({ message: 'Message not found' });
        }
        // Find community to check moderator status
        const community = await Community_1.default.findById(message.community);
        if (!community) {
            return res.status(404).json({ message: 'Community not found' });
        }
        // Check if user is the sender, moderator, or creator
        const isSender = message.sender.toString() === userId;
        const isModerator = community.moderators.includes(userId);
        const isCreator = community.creator.toString() === userId;
        if (!isSender && !isModerator && !isCreator) {
            return res.status(403).json({ message: 'Not authorized to delete this message' });
        }
        message.isDeleted = true;
        message.deletedAt = new Date();
        await message.save();
        res.json({
            message: 'Message deleted successfully'
        });
    }
    catch (error) {
        console.error('Error deleting message:', error);
        res.status(500).json({ message: 'Error deleting message' });
    }
};
exports.deleteMessage = deleteMessage;
// Add reaction to message
const addReaction = async (req, res) => {
    try {
        const { messageId } = req.params;
        const { emoji } = req.body;
        const userId = req.user.id;
        const message = await CommunityMessage_1.default.findById(messageId);
        if (!message) {
            return res.status(404).json({ message: 'Message not found' });
        }
        // Check if user already reacted with this emoji
        const existingReaction = message.reactions.find(reaction => reaction.user.toString() === userId && reaction.emoji === emoji);
        if (existingReaction) {
            // Remove reaction
            message.reactions = message.reactions.filter(reaction => !(reaction.user.toString() === userId && reaction.emoji === emoji));
        }
        else {
            // Add reaction
            message.reactions.push({ user: userId, emoji });
        }
        await message.save();
        res.json({
            message: existingReaction ? 'Reaction removed' : 'Reaction added',
            data: { reactions: message.reactions }
        });
    }
    catch (error) {
        console.error('Error adding reaction:', error);
        res.status(500).json({ message: 'Error managing reaction' });
    }
};
exports.addReaction = addReaction;
// Get recent messages for user's communities
const getRecentMessages = async (req, res) => {
    try {
        const userId = req.user.id;
        const limit = parseInt(req.query.limit) || 20;
        // Get user's communities
        const userCommunities = await Community_1.default.find({ members: userId }).select('_id');
        const communityIds = userCommunities.map(c => c._id);
        const messages = await CommunityMessage_1.default.find({
            community: { $in: communityIds },
            isDeleted: false
        })
            .populate('sender', 'username avatar englishLevel karma isVerified')
            .populate('community', 'name displayName avatar')
            .sort({ createdAt: -1 })
            .limit(limit);
        res.json({
            message: 'Recent messages retrieved successfully',
            data: messages
        });
    }
    catch (error) {
        console.error('Error getting recent messages:', error);
        res.status(500).json({ message: 'Error retrieving recent messages' });
    }
};
exports.getRecentMessages = getRecentMessages;
//# sourceMappingURL=communityMessageController.js.map