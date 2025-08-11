"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.toggleModerator = exports.getUserCommunities = exports.getCommunityMembers = exports.leaveCommunity = exports.joinCommunity = exports.deleteCommunity = exports.updateCommunity = exports.getCommunity = exports.getCommunities = exports.createCommunity = void 0;
const Community_1 = __importDefault(require("../models/Community"));
const Post_1 = __importDefault(require("../models/Post"));
const User_1 = __importDefault(require("../models/User"));
// Create a new community
const createCommunity = async (req, res) => {
    try {
        const { name, displayName, description, category, isPrivate, rules, tags } = req.body;
        const userId = req.user.id;
        // Check if community name already exists
        const existingCommunity = await Community_1.default.findOne({ name: name.toLowerCase() });
        if (existingCommunity) {
            return res.status(400).json({ message: 'Community name already exists' });
        }
        const community = new Community_1.default({
            name: name.toLowerCase(),
            displayName,
            description,
            category,
            creator: userId,
            moderators: [userId],
            members: [userId],
            isPrivate: isPrivate || false,
            rules: rules || [],
            tags: tags || []
        });
        await community.save();
        await community.populate('creator', 'username avatar englishLevel karma isVerified');
        res.status(201).json({
            message: 'Community created successfully',
            data: community
        });
    }
    catch (error) {
        console.error('Error creating community:', error);
        res.status(500).json({ message: 'Error creating community' });
    }
};
exports.createCommunity = createCommunity;
// Get all communities with pagination and filters
const getCommunities = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const category = req.query.category;
        const search = req.query.search;
        const sortBy = req.query.sortBy || 'memberCount'; // memberCount, postCount, createdAt
        const order = req.query.order || 'desc';
        const query = {};
        if (category) {
            query.category = category;
        }
        if (search) {
            query.$or = [
                { displayName: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
                { tags: { $in: [new RegExp(search, 'i')] } }
            ];
        }
        const sortOrder = order === 'desc' ? -1 : 1;
        const sortOptions = {};
        sortOptions[sortBy] = sortOrder;
        const communities = await Community_1.default.find(query)
            .populate('creator', 'username avatar englishLevel karma isVerified')
            .sort(sortOptions)
            .skip((page - 1) * limit)
            .limit(limit);
        const total = await Community_1.default.countDocuments(query);
        res.json({
            message: 'Communities retrieved successfully',
            data: communities,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit)
            }
        });
    }
    catch (error) {
        console.error('Error getting communities:', error);
        res.status(500).json({ message: 'Error retrieving communities' });
    }
};
exports.getCommunities = getCommunities;
// Get a specific community by name
const getCommunity = async (req, res) => {
    try {
        const { name } = req.params;
        const community = await Community_1.default.findOne({ name: name.toLowerCase() })
            .populate('creator', 'username avatar englishLevel karma isVerified')
            .populate('moderators', 'username avatar englishLevel karma isVerified');
        if (!community) {
            return res.status(404).json({ message: 'Community not found' });
        }
        res.json({
            message: 'Community retrieved successfully',
            data: community
        });
    }
    catch (error) {
        console.error('Error getting community:', error);
        res.status(500).json({ message: 'Error retrieving community' });
    }
};
exports.getCommunity = getCommunity;
// Update community
const updateCommunity = async (req, res) => {
    try {
        const { name } = req.params;
        const userId = req.user.id;
        const { displayName, description, avatar, banner, rules, tags, isPrivate } = req.body;
        const community = await Community_1.default.findOne({ name: name.toLowerCase() });
        if (!community) {
            return res.status(404).json({ message: 'Community not found' });
        }
        // Check if user is creator or moderator
        if (community.creator.toString() !== userId && !community.moderators.includes(userId)) {
            return res.status(403).json({ message: 'Not authorized to update this community' });
        }
        // Update fields
        if (displayName)
            community.displayName = displayName;
        if (description)
            community.description = description;
        if (avatar !== undefined)
            community.avatar = avatar;
        if (banner !== undefined)
            community.banner = banner;
        if (rules !== undefined)
            community.rules = rules;
        if (tags !== undefined)
            community.tags = tags;
        if (isPrivate !== undefined)
            community.isPrivate = isPrivate;
        await community.save();
        await community.populate('creator', 'username avatar englishLevel karma isVerified');
        await community.populate('moderators', 'username avatar englishLevel karma isVerified');
        res.json({
            message: 'Community updated successfully',
            data: community
        });
    }
    catch (error) {
        console.error('Error updating community:', error);
        res.status(500).json({ message: 'Error updating community' });
    }
};
exports.updateCommunity = updateCommunity;
// Delete community
const deleteCommunity = async (req, res) => {
    try {
        const { name } = req.params;
        const userId = req.user.id;
        const community = await Community_1.default.findOne({ name: name.toLowerCase() });
        if (!community) {
            return res.status(404).json({ message: 'Community not found' });
        }
        // Only creator can delete community
        if (community.creator.toString() !== userId) {
            return res.status(403).json({ message: 'Only the creator can delete this community' });
        }
        // Delete all posts in the community
        await Post_1.default.deleteMany({ community: community._id });
        // Delete the community
        await Community_1.default.findByIdAndDelete(community._id);
        res.json({
            message: 'Community deleted successfully'
        });
    }
    catch (error) {
        console.error('Error deleting community:', error);
        res.status(500).json({ message: 'Error deleting community' });
    }
};
exports.deleteCommunity = deleteCommunity;
// Join community
const joinCommunity = async (req, res) => {
    try {
        const { name } = req.params;
        const userId = req.user.id;
        const community = await Community_1.default.findOne({ name: name.toLowerCase() });
        if (!community) {
            return res.status(404).json({ message: 'Community not found' });
        }
        // Check if user is already a member
        if (community.members.includes(userId)) {
            return res.status(400).json({ message: 'Already a member of this community' });
        }
        // Add user to members
        community.members.push(userId);
        await community.save();
        // Reload to get updated memberCount
        await community.populate('creator', 'username avatar englishLevel karma isVerified');
        res.json({
            message: 'Successfully joined community',
            data: { memberCount: community.memberCount }
        });
    }
    catch (error) {
        console.error('Error joining community:', error);
        res.status(500).json({ message: 'Error joining community' });
    }
};
exports.joinCommunity = joinCommunity;
// Leave community
const leaveCommunity = async (req, res) => {
    try {
        const { name } = req.params;
        const userId = req.user.id;
        const community = await Community_1.default.findOne({ name: name.toLowerCase() });
        if (!community) {
            return res.status(404).json({ message: 'Community not found' });
        }
        // Check if user is a member
        if (!community.members.includes(userId)) {
            return res.status(400).json({ message: 'Not a member of this community' });
        }
        // Creator cannot leave their own community
        if (community.creator.toString() === userId) {
            return res.status(400).json({ message: 'Creator cannot leave their own community' });
        }
        // Remove user from members and moderators
        community.members = community.members.filter(member => member.toString() !== userId);
        community.moderators = community.moderators.filter(moderator => moderator.toString() !== userId);
        await community.save();
        // Reload to get updated memberCount
        await community.populate('creator', 'username avatar englishLevel karma isVerified');
        res.json({
            message: 'Successfully left community',
            data: { memberCount: community.memberCount }
        });
    }
    catch (error) {
        console.error('Error leaving community:', error);
        res.status(500).json({ message: 'Error leaving community' });
    }
};
exports.leaveCommunity = leaveCommunity;
// Get community members
const getCommunityMembers = async (req, res) => {
    try {
        const { name } = req.params;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const community = await Community_1.default.findOne({ name: name.toLowerCase() });
        if (!community) {
            return res.status(404).json({ message: 'Community not found' });
        }
        const members = await User_1.default.find({ _id: { $in: community.members } })
            .select('username avatar englishLevel karma isVerified joinedAt')
            .skip((page - 1) * limit)
            .limit(limit)
            .sort({ karma: -1 });
        const total = community.members.length;
        res.json({
            message: 'Community members retrieved successfully',
            data: members,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit)
            }
        });
    }
    catch (error) {
        console.error('Error getting community members:', error);
        res.status(500).json({ message: 'Error retrieving community members' });
    }
};
exports.getCommunityMembers = getCommunityMembers;
// Get communities that user is a member of
const getUserCommunities = async (req, res) => {
    try {
        const userId = req.user.id;
        const communities = await Community_1.default.find({ members: userId })
            .populate('creator', 'username avatar englishLevel karma isVerified')
            .sort({ memberCount: -1 });
        res.json({
            message: 'User communities retrieved successfully',
            data: communities
        });
    }
    catch (error) {
        console.error('Error getting user communities:', error);
        res.status(500).json({ message: 'Error retrieving user communities' });
    }
};
exports.getUserCommunities = getUserCommunities;
// Add/Remove moderator (only creator can do this)
const toggleModerator = async (req, res) => {
    try {
        const { name } = req.params;
        const { userId: targetUserId } = req.body;
        const requesterId = req.user.id;
        const community = await Community_1.default.findOne({ name: name.toLowerCase() });
        if (!community) {
            return res.status(404).json({ message: 'Community not found' });
        }
        // Only creator can add/remove moderators
        if (community.creator.toString() !== requesterId) {
            return res.status(403).json({ message: 'Only the creator can manage moderators' });
        }
        // Check if target user is a member
        if (!community.members.includes(targetUserId)) {
            return res.status(400).json({ message: 'User is not a member of this community' });
        }
        const isModerator = community.moderators.includes(targetUserId);
        if (isModerator) {
            // Remove moderator
            community.moderators = community.moderators.filter(mod => mod.toString() !== targetUserId);
        }
        else {
            // Add moderator
            community.moderators.push(targetUserId);
        }
        await community.save();
        res.json({
            message: isModerator ? 'Moderator removed successfully' : 'Moderator added successfully',
            data: { moderators: community.moderators }
        });
    }
    catch (error) {
        console.error('Error toggling moderator:', error);
        res.status(500).json({ message: 'Error managing moderator' });
    }
};
exports.toggleModerator = toggleModerator;
//# sourceMappingURL=communityController.js.map