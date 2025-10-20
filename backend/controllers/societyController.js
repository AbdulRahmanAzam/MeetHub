import Society from '../models/Society.js';
import User from '../models/User.js';
import { generateInviteCode } from '../utils/helpers.js';

// @desc    Create new society
// @route   POST /api/societies
// @access  Private
export const createSociety = async (req, res) => {
  try {
    const { name, description, logo } = req.body;

    // Check if society name already exists
    const societyExists = await Society.findOne({ name });
    if (societyExists) {
      return res.status(400).json({
        success: false,
        message: 'Society with this name already exists'
      });
    }

    // Create society with current user as president
    const society = await Society.create({
      name,
      description,
      logo,
      president: req.user._id,
      inviteCode: generateInviteCode(),
      members: [{
        user: req.user._id,
        role: 'president'
      }]
    });

    // Update user's society and role
    await User.findByIdAndUpdate(req.user._id, {
      society: society._id,
      role: 'president'
    });

    res.status(201).json({
      success: true,
      data: society
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get society details
// @route   GET /api/societies/:id
// @access  Private
export const getSociety = async (req, res) => {
  try {
    const society = await Society.findById(req.params.id)
      .populate('president', 'name email')
      .populate('vicePresident', 'name email')
      .populate('members.user', 'name email avatar');

    if (!society) {
      return res.status(404).json({
        success: false,
        message: 'Society not found'
      });
    }

    res.json({
      success: true,
      data: society
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update society
// @route   PUT /api/societies/:id
// @access  Private (President/Vice President only)
export const updateSociety = async (req, res) => {
  try {
    const society = await Society.findById(req.params.id);

    if (!society) {
      return res.status(404).json({
        success: false,
        message: 'Society not found'
      });
    }

    // Check if user is president or vice president
    if (
      society.president.toString() !== req.user._id.toString() &&
      (!society.vicePresident || society.vicePresident.toString() !== req.user._id.toString())
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this society'
      });
    }

    const updatedSociety = await Society.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      data: updatedSociety
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Join society with invite code
// @route   POST /api/societies/join
// @access  Private
export const joinSociety = async (req, res) => {
  try {
    const { inviteCode } = req.body;

    const society = await Society.findOne({ inviteCode });

    if (!society) {
      return res.status(404).json({
        success: false,
        message: 'Invalid invite code'
      });
    }

    // Check if user is already a member
    const isMember = society.members.some(
      member => member.user.toString() === req.user._id.toString()
    );

    if (isMember) {
      return res.status(400).json({
        success: false,
        message: 'You are already a member of this society'
      });
    }

    // Add user to society
    society.members.push({
      user: req.user._id,
      role: 'member'
    });

    await society.save();

    // Update user's society
    await User.findByIdAndUpdate(req.user._id, {
      society: society._id
    });

    res.json({
      success: true,
      data: society,
      message: 'Successfully joined society'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Assign role to member
// @route   PUT /api/societies/:id/members/:userId/role
// @access  Private (President/Vice President only)
export const assignRole = async (req, res) => {
  try {
    const { role } = req.body;
    const { id, userId } = req.params;

    const society = await Society.findById(id);

    if (!society) {
      return res.status(404).json({
        success: false,
        message: 'Society not found'
      });
    }

    // Check authorization
    if (
      society.president.toString() !== req.user._id.toString() &&
      (!society.vicePresident || society.vicePresident.toString() !== req.user._id.toString())
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized'
      });
    }

    // Find and update member role
    const memberIndex = society.members.findIndex(
      member => member.user.toString() === userId
    );

    if (memberIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'User is not a member of this society'
      });
    }

    society.members[memberIndex].role = role;

    // Update vice president if role is vicepresident
    if (role === 'vicepresident') {
      society.vicePresident = userId;
    }

    await society.save();

    // Update user's role
    await User.findByIdAndUpdate(userId, { role });

    res.json({
      success: true,
      data: society,
      message: 'Role assigned successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get society members
// @route   GET /api/societies/:id/members
// @access  Private
export const getSocietyMembers = async (req, res) => {
  try {
    const society = await Society.findById(req.params.id)
      .populate('members.user', 'name email avatar');

    if (!society) {
      return res.status(404).json({
        success: false,
        message: 'Society not found'
      });
    }

    res.json({
      success: true,
      data: society.members
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
