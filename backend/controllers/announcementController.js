import Announcement from '../models/Announcement.js';
import Notification from '../models/Notification.js';
import User from '../models/User.js';

// @desc    Create announcement
// @route   POST /api/announcements
// @access  Private (EXCOM or higher)
export const createAnnouncement = async (req, res) => {
  try {
    const { title, content, society, department, priority, attachments } = req.body;

    const announcement = await Announcement.create({
      title,
      content,
      society,
      department,
      author: req.user._id,
      priority,
      attachments
    });

    // Get recipients
    const query = { society };
    if (department) query.department = department;

    const recipients = await User.find(query);

    // Create notifications
    const notifications = recipients.map(user => ({
      recipient: user._id,
      type: 'announcement',
      title: 'New Announcement',
      message: title,
      relatedId: announcement._id,
      relatedModel: 'Announcement'
    }));

    await Notification.insertMany(notifications);

    const populatedAnnouncement = await Announcement.findById(announcement._id)
      .populate('author', 'name email')
      .populate('department', 'name');

    res.status(201).json({
      success: true,
      data: populatedAnnouncement
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get announcements
// @route   GET /api/announcements
// @access  Private
export const getAnnouncements = async (req, res) => {
  try {
    const { society, department } = req.query;
    const query = { isActive: true };

    if (society) query.society = society;
    if (department) query.department = department;

    const announcements = await Announcement.find(query)
      .populate('author', 'name email avatar')
      .populate('department', 'name')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: announcements.length,
      data: announcements
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get single announcement
// @route   GET /api/announcements/:id
// @access  Private
export const getAnnouncement = async (req, res) => {
  try {
    const announcement = await Announcement.findById(req.params.id)
      .populate('author', 'name email avatar')
      .populate('department', 'name');

    if (!announcement) {
      return res.status(404).json({
        success: false,
        message: 'Announcement not found'
      });
    }

    res.json({
      success: true,
      data: announcement
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update announcement
// @route   PUT /api/announcements/:id
// @access  Private
export const updateAnnouncement = async (req, res) => {
  try {
    const announcement = await Announcement.findById(req.params.id);

    if (!announcement) {
      return res.status(404).json({
        success: false,
        message: 'Announcement not found'
      });
    }

    // Check authorization
    if (announcement.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this announcement'
      });
    }

    const updatedAnnouncement = await Announcement.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )
      .populate('author', 'name email')
      .populate('department', 'name');

    res.json({
      success: true,
      data: updatedAnnouncement
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete announcement
// @route   DELETE /api/announcements/:id
// @access  Private
export const deleteAnnouncement = async (req, res) => {
  try {
    const announcement = await Announcement.findById(req.params.id);

    if (!announcement) {
      return res.status(404).json({
        success: false,
        message: 'Announcement not found'
      });
    }

    // Check authorization
    if (
      announcement.author.toString() !== req.user._id.toString() &&
      !['president', 'vicepresident'].includes(req.user.role)
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this announcement'
      });
    }

    announcement.isActive = false;
    await announcement.save();

    res.json({
      success: true,
      message: 'Announcement deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
