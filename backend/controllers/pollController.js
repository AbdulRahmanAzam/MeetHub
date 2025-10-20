import Poll from '../models/Poll.js';
import Notification from '../models/Notification.js';
import User from '../models/User.js';

// @desc    Create poll
// @route   POST /api/polls
// @access  Private (EXCOM or higher)
export const createPoll = async (req, res) => {
  try {
    const { question, description, society, department, options, allowMultipleVotes, endDate } = req.body;

    const poll = await Poll.create({
      question,
      description,
      society,
      department,
      createdBy: req.user._id,
      options,
      allowMultipleVotes,
      endDate
    });

    // Get recipients and create notifications
    const query = { society };
    if (department) query.department = department;

    const recipients = await User.find(query);

    const notifications = recipients.map(user => ({
      recipient: user._id,
      type: 'poll',
      title: 'New Poll',
      message: question,
      relatedId: poll._id,
      relatedModel: 'Poll'
    }));

    await Notification.insertMany(notifications);

    const populatedPoll = await Poll.findById(poll._id)
      .populate('createdBy', 'name email')
      .populate('department', 'name');

    res.status(201).json({
      success: true,
      data: populatedPoll
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get polls
// @route   GET /api/polls
// @access  Private
export const getPolls = async (req, res) => {
  try {
    const { society, department, isActive } = req.query;
    const query = {};

    if (society) query.society = society;
    if (department) query.department = department;
    if (isActive !== undefined) query.isActive = isActive === 'true';

    const polls = await Poll.find(query)
      .populate('createdBy', 'name email avatar')
      .populate('department', 'name')
      .populate('options.votes', 'name email')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: polls.length,
      data: polls
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get single poll
// @route   GET /api/polls/:id
// @access  Private
export const getPoll = async (req, res) => {
  try {
    const poll = await Poll.findById(req.params.id)
      .populate('createdBy', 'name email avatar')
      .populate('department', 'name')
      .populate('options.votes', 'name email avatar');

    if (!poll) {
      return res.status(404).json({
        success: false,
        message: 'Poll not found'
      });
    }

    res.json({
      success: true,
      data: poll
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Vote on poll
// @route   POST /api/polls/:id/vote
// @access  Private
export const voteOnPoll = async (req, res) => {
  try {
    const { optionIds } = req.body; // Array of option IDs
    const poll = await Poll.findById(req.params.id);

    if (!poll) {
      return res.status(404).json({
        success: false,
        message: 'Poll not found'
      });
    }

    if (!poll.isActive) {
      return res.status(400).json({
        success: false,
        message: 'This poll is closed'
      });
    }

    if (poll.endDate && new Date() > poll.endDate) {
      return res.status(400).json({
        success: false,
        message: 'This poll has ended'
      });
    }

    // Check if user has already voted
    const hasVoted = poll.options.some(option =>
      option.votes.includes(req.user._id)
    );

    if (hasVoted && !poll.allowMultipleVotes) {
      return res.status(400).json({
        success: false,
        message: 'You have already voted on this poll'
      });
    }

    // Remove previous votes if exists
    poll.options.forEach(option => {
      option.votes = option.votes.filter(
        vote => vote.toString() !== req.user._id.toString()
      );
    });

    // Add new votes
    optionIds.forEach(optionId => {
      const option = poll.options.id(optionId);
      if (option) {
        option.votes.push(req.user._id);
      }
    });

    await poll.save();

    const updatedPoll = await Poll.findById(poll._id)
      .populate('createdBy', 'name email')
      .populate('options.votes', 'name email');

    res.json({
      success: true,
      data: updatedPoll,
      message: 'Vote recorded successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Close poll
// @route   PUT /api/polls/:id/close
// @access  Private
export const closePoll = async (req, res) => {
  try {
    const poll = await Poll.findById(req.params.id);

    if (!poll) {
      return res.status(404).json({
        success: false,
        message: 'Poll not found'
      });
    }

    // Check authorization
    if (poll.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to close this poll'
      });
    }

    poll.isActive = false;
    await poll.save();

    res.json({
      success: true,
      data: poll,
      message: 'Poll closed successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete poll
// @route   DELETE /api/polls/:id
// @access  Private
export const deletePoll = async (req, res) => {
  try {
    const poll = await Poll.findById(req.params.id);

    if (!poll) {
      return res.status(404).json({
        success: false,
        message: 'Poll not found'
      });
    }

    // Check authorization
    if (
      poll.createdBy.toString() !== req.user._id.toString() &&
      !['president', 'vicepresident'].includes(req.user.role)
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this poll'
      });
    }

    await poll.deleteOne();

    res.json({
      success: true,
      message: 'Poll deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
