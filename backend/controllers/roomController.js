import Room from '../models/Room.js';
import Meeting from '../models/Meeting.js';

// @desc    Create room
// @route   POST /api/rooms
// @access  Private (Admin only)
export const createRoom = async (req, res) => {
  try {
    const { name, building, floor, capacity, amenities, society } = req.body;

    const room = await Room.create({
      name,
      building,
      floor,
      capacity,
      amenities,
      society
    });

    res.status(201).json({
      success: true,
      data: room
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get all rooms
// @route   GET /api/rooms
// @access  Private
export const getRooms = async (req, res) => {
  try {
    const { society } = req.query;
    const query = { isActive: true };

    if (society) query.society = society;

    const rooms = await Room.find(query).sort({ name: 1 });

    res.json({
      success: true,
      count: rooms.length,
      data: rooms
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get room availability
// @route   GET /api/rooms/:id/availability
// @access  Private
export const getRoomAvailability = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const room = await Room.findById(req.params.id);

    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Room not found'
      });
    }

    // Get all meetings in the room for the date range
    const query = {
      room: req.params.id,
      status: { $ne: 'cancelled' }
    };

    if (startDate && endDate) {
      query.startTime = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const bookings = await Meeting.find(query)
      .populate('organizer', 'name')
      .select('title startTime endTime organizer')
      .sort({ startTime: 1 });

    res.json({
      success: true,
      data: {
        room,
        bookings
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update room
// @route   PUT /api/rooms/:id
// @access  Private (Admin only)
export const updateRoom = async (req, res) => {
  try {
    const room = await Room.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Room not found'
      });
    }

    res.json({
      success: true,
      data: room
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete room
// @route   DELETE /api/rooms/:id
// @access  Private (Admin only)
export const deleteRoom = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);

    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Room not found'
      });
    }

    room.isActive = false;
    await room.save();

    res.json({
      success: true,
      message: 'Room deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
