import Meeting from '../models/Meeting.js';
import Room from '../models/Room.js';
import User from '../models/User.js';
import Notification from '../models/Notification.js';
import { checkTimeOverlap, findBestMeetingSlots } from '../utils/helpers.js';

// @desc    Create meeting
// @route   POST /api/meetings
// @access  Private (EXCOM or higher)
export const createMeeting = async (req, res) => {
  try {
    const {
      title,
      description,
      society,
      department,
      startTime,
      endTime,
      room,
      location,
      attendees,
      agenda,
      tags,
      meetingLink
    } = req.body;

    // Check room availability if room is specified
    if (room) {
      const roomDoc = await Room.findById(room);
      if (!roomDoc) {
        return res.status(404).json({
          success: false,
          message: 'Room not found'
        });
      }

      // Check for conflicts
      const conflictingMeetings = await Meeting.find({
        room,
        status: { $ne: 'cancelled' },
        $or: [
          {
            startTime: { $lt: new Date(endTime) },
            endTime: { $gt: new Date(startTime) }
          }
        ]
      });

      if (conflictingMeetings.length > 0) {
        return res.status(400).json({
          success: false,
          message: 'Room is already booked for this time slot',
          conflicts: conflictingMeetings
        });
      }
    }

    // Create meeting
    const meeting = await Meeting.create({
      title,
      description,
      society,
      department,
      organizer: req.user._id,
      startTime,
      endTime,
      room,
      location,
      attendees: attendees || [],
      agenda,
      tags,
      meetingLink
    });

    // Create notifications for attendees
    if (attendees && attendees.length > 0) {
      const notifications = attendees.map(attendee => ({
        recipient: attendee.user,
        type: 'meeting',
        title: 'New Meeting Invitation',
        message: `You have been invited to "${title}"`,
        relatedId: meeting._id,
        relatedModel: 'Meeting'
      }));

      await Notification.insertMany(notifications);
    }

    const populatedMeeting = await Meeting.findById(meeting._id)
      .populate('organizer', 'name email')
      .populate('room', 'name building')
      .populate('attendees.user', 'name email');

    res.status(201).json({
      success: true,
      data: populatedMeeting
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get meetings
// @route   GET /api/meetings
// @access  Private
export const getMeetings = async (req, res) => {
  try {
    const { society, department, startDate, endDate, status } = req.query;

    const query = {};

    if (society) query.society = society;
    if (department) query.department = department;
    if (status) query.status = status;

    if (startDate && endDate) {
      query.startTime = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const meetings = await Meeting.find(query)
      .populate('organizer', 'name email')
      .populate('room', 'name building capacity')
      .populate('department', 'name')
      .populate('attendees.user', 'name email avatar')
      .sort({ startTime: 1 });

    res.json({
      success: true,
      count: meetings.length,
      data: meetings
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get single meeting
// @route   GET /api/meetings/:id
// @access  Private
export const getMeeting = async (req, res) => {
  try {
    const meeting = await Meeting.findById(req.params.id)
      .populate('organizer', 'name email')
      .populate('room', 'name building capacity amenities')
      .populate('department', 'name')
      .populate('attendees.user', 'name email avatar');

    if (!meeting) {
      return res.status(404).json({
        success: false,
        message: 'Meeting not found'
      });
    }

    res.json({
      success: true,
      data: meeting
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update meeting
// @route   PUT /api/meetings/:id
// @access  Private
export const updateMeeting = async (req, res) => {
  try {
    const meeting = await Meeting.findById(req.params.id);

    if (!meeting) {
      return res.status(404).json({
        success: false,
        message: 'Meeting not found'
      });
    }

    // Check authorization
    if (meeting.organizer.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this meeting'
      });
    }

    // Check room availability if room is being changed
    if (req.body.room && req.body.room !== meeting.room?.toString()) {
      const conflictingMeetings = await Meeting.find({
        _id: { $ne: meeting._id },
        room: req.body.room,
        status: { $ne: 'cancelled' },
        $or: [
          {
            startTime: { $lt: new Date(req.body.endTime || meeting.endTime) },
            endTime: { $gt: new Date(req.body.startTime || meeting.startTime) }
          }
        ]
      });

      if (conflictingMeetings.length > 0) {
        return res.status(400).json({
          success: false,
          message: 'Room is already booked for this time slot'
        });
      }
    }

    const updatedMeeting = await Meeting.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )
      .populate('organizer', 'name email')
      .populate('room', 'name building')
      .populate('attendees.user', 'name email');

    // Notify attendees of changes
    if (meeting.attendees && meeting.attendees.length > 0) {
      const notifications = meeting.attendees.map(attendee => ({
        recipient: attendee.user,
        type: 'meeting',
        title: 'Meeting Updated',
        message: `The meeting "${meeting.title}" has been updated`,
        relatedId: meeting._id,
        relatedModel: 'Meeting'
      }));

      await Notification.insertMany(notifications);
    }

    res.json({
      success: true,
      data: updatedMeeting
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Respond to meeting invitation
// @route   PUT /api/meetings/:id/respond
// @access  Private
export const respondToMeeting = async (req, res) => {
  try {
    const { status } = req.body; // accepted, declined, tentative
    const meeting = await Meeting.findById(req.params.id);

    if (!meeting) {
      return res.status(404).json({
        success: false,
        message: 'Meeting not found'
      });
    }

    // Find attendee
    const attendeeIndex = meeting.attendees.findIndex(
      a => a.user.toString() === req.user._id.toString()
    );

    if (attendeeIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'You are not invited to this meeting'
      });
    }

    // Update status
    meeting.attendees[attendeeIndex].status = status;
    meeting.attendees[attendeeIndex].respondedAt = new Date();

    await meeting.save();

    res.json({
      success: true,
      data: meeting,
      message: 'Response recorded successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get best meeting time slots
// @route   POST /api/meetings/suggest-slots
// @access  Private
export const suggestMeetingSlots = async (req, res) => {
  try {
    const { memberIds, duration } = req.body;

    // Get all members with their availability
    const members = await User.find({
      _id: { $in: memberIds }
    }).select('name email availability');

    if (members.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No members found'
      });
    }

    const bestSlots = findBestMeetingSlots(members, duration);

    res.json({
      success: true,
      data: bestSlots
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Cancel meeting
// @route   DELETE /api/meetings/:id
// @access  Private
export const cancelMeeting = async (req, res) => {
  try {
    const meeting = await Meeting.findById(req.params.id);

    if (!meeting) {
      return res.status(404).json({
        success: false,
        message: 'Meeting not found'
      });
    }

    // Check authorization
    if (meeting.organizer.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to cancel this meeting'
      });
    }

    meeting.status = 'cancelled';
    await meeting.save();

    // Notify attendees
    if (meeting.attendees && meeting.attendees.length > 0) {
      const notifications = meeting.attendees.map(attendee => ({
        recipient: attendee.user,
        type: 'meeting',
        title: 'Meeting Cancelled',
        message: `The meeting "${meeting.title}" has been cancelled`,
        relatedId: meeting._id,
        relatedModel: 'Meeting'
      }));

      await Notification.insertMany(notifications);
    }

    res.json({
      success: true,
      message: 'Meeting cancelled successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
