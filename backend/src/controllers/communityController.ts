import { Request, Response } from 'express';
import Community from '../models/Community';
import Post from '../models/Post';
import User from '../models/User';
import { AuthRequest } from '../middleware/auth';

// Create a new community
export const createCommunity = async (req: AuthRequest, res: Response) => {
  try {
    const { name, displayName, description, category, isPrivate, rules, tags } = req.body;
    const userId = req.user!.id;

    // Check if community name already exists
    const existingCommunity = await Community.findOne({ name: name.toLowerCase() });
    if (existingCommunity) {
      return res.status(400).json({ message: 'Community name already exists' });
    }

    const community = new Community({
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
  } catch (error) {
    console.error('Error creating community:', error);
    res.status(500).json({ message: 'Error creating community' });
  }
};

// Get all communities with pagination and filters
export const getCommunities = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const category = req.query.category as string;
    const search = req.query.search as string;
    const sortBy = req.query.sortBy as string || 'memberCount'; // memberCount, postCount, createdAt
    const order = req.query.order as string || 'desc';

    const query: any = {};
    
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
    const sortOptions: any = {};
    sortOptions[sortBy] = sortOrder;

    const communities = await Community.find(query)
      .populate('creator', 'username avatar englishLevel karma isVerified')
      .sort(sortOptions)
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await Community.countDocuments(query);

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
  } catch (error) {
    console.error('Error getting communities:', error);
    res.status(500).json({ message: 'Error retrieving communities' });
  }
};

// Get a specific community by name
export const getCommunity = async (req: Request, res: Response) => {
  try {
    const { name } = req.params;
    
    const community = await Community.findOne({ name: name.toLowerCase() })
      .populate('creator', 'username avatar englishLevel karma isVerified')
      .populate('moderators', 'username avatar englishLevel karma isVerified');

    if (!community) {
      return res.status(404).json({ message: 'Community not found' });
    }

    res.json({
      message: 'Community retrieved successfully',
      data: community
    });
  } catch (error) {
    console.error('Error getting community:', error);
    res.status(500).json({ message: 'Error retrieving community' });
  }
};

// Update community
export const updateCommunity = async (req: AuthRequest, res: Response) => {
  try {
    const { name } = req.params;
    const userId = req.user!.id;
    const { displayName, description, avatar, banner, rules, tags, isPrivate } = req.body;

    const community = await Community.findOne({ name: name.toLowerCase() });
    if (!community) {
      return res.status(404).json({ message: 'Community not found' });
    }

    // Check if user is creator or moderator
    if (community.creator.toString() !== userId && !community.moderators.includes(userId)) {
      return res.status(403).json({ message: 'Not authorized to update this community' });
    }

    // Update fields
    if (displayName) community.displayName = displayName;
    if (description) community.description = description;
    if (avatar !== undefined) community.avatar = avatar;
    if (banner !== undefined) community.banner = banner;
    if (rules !== undefined) community.rules = rules;
    if (tags !== undefined) community.tags = tags;
    if (isPrivate !== undefined) community.isPrivate = isPrivate;

    await community.save();
    await community.populate('creator', 'username avatar englishLevel karma isVerified');
    await community.populate('moderators', 'username avatar englishLevel karma isVerified');

    res.json({
      message: 'Community updated successfully',
      data: community
    });
  } catch (error) {
    console.error('Error updating community:', error);
    res.status(500).json({ message: 'Error updating community' });
  }
};

// Delete community
export const deleteCommunity = async (req: AuthRequest, res: Response) => {
  try {
    const { name } = req.params;
    const userId = req.user!.id;

    const community = await Community.findOne({ name: name.toLowerCase() });
    if (!community) {
      return res.status(404).json({ message: 'Community not found' });
    }

    // Only creator can delete community
    if (community.creator.toString() !== userId) {
      return res.status(403).json({ message: 'Only the creator can delete this community' });
    }

    // Delete all posts in the community
    await Post.deleteMany({ community: community._id });

    // Delete the community
    await Community.findByIdAndDelete(community._id);

    res.json({
      message: 'Community deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting community:', error);
    res.status(500).json({ message: 'Error deleting community' });
  }
};

// Join community
export const joinCommunity = async (req: AuthRequest, res: Response) => {
  try {
    const { name } = req.params;
    const userId = req.user!.id;

    const community = await Community.findOne({ name: name.toLowerCase() });
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
  } catch (error) {
    console.error('Error joining community:', error);
    res.status(500).json({ message: 'Error joining community' });
  }
};

// Leave community
export const leaveCommunity = async (req: AuthRequest, res: Response) => {
  try {
    const { name } = req.params;
    const userId = req.user!.id;

    const community = await Community.findOne({ name: name.toLowerCase() });
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
  } catch (error) {
    console.error('Error leaving community:', error);
    res.status(500).json({ message: 'Error leaving community' });
  }
};

// Get community members
export const getCommunityMembers = async (req: Request, res: Response) => {
  try {
    const { name } = req.params;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;

    const community = await Community.findOne({ name: name.toLowerCase() });
    if (!community) {
      return res.status(404).json({ message: 'Community not found' });
    }

    const members = await User.find({ _id: { $in: community.members } })
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
  } catch (error) {
    console.error('Error getting community members:', error);
    res.status(500).json({ message: 'Error retrieving community members' });
  }
};

// Get communities that user is a member of
export const getUserCommunities = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    
    const communities = await Community.find({ members: userId })
      .populate('creator', 'username avatar englishLevel karma isVerified')
      .sort({ memberCount: -1 });

    res.json({
      message: 'User communities retrieved successfully',
      data: communities
    });
  } catch (error) {
    console.error('Error getting user communities:', error);
    res.status(500).json({ message: 'Error retrieving user communities' });
  }
};

// Add/Remove moderator (only creator can do this)
export const toggleModerator = async (req: AuthRequest, res: Response) => {
  try {
    const { name } = req.params;
    const { userId: targetUserId } = req.body;
    const requesterId = req.user!.id;

    const community = await Community.findOne({ name: name.toLowerCase() });
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
    } else {
      // Add moderator
      community.moderators.push(targetUserId);
    }

    await community.save();

    res.json({
      message: isModerator ? 'Moderator removed successfully' : 'Moderator added successfully',
      data: { moderators: community.moderators }
    });
  } catch (error) {
    console.error('Error toggling moderator:', error);
    res.status(500).json({ message: 'Error managing moderator' });
  }
};
