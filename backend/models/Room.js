import mongoose from 'mongoose';

const roomSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a room name'],
    trim: true
  },
  building: {
    type: String,
    default: ''
  },
  floor: {
    type: String,
    default: ''
  },
  capacity: {
    type: Number,
    required: true,
    min: 1
  },
  amenities: [{
    type: String // e.g., 'Projector', 'Whiteboard', 'Video Conference'
  }],
  society: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Society',
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  bookings: [{
    meeting: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Meeting'
    },
    startTime: Date,
    endTime: Date
  }]
}, {
  timestamps: true
});

// Index for efficient availability queries
roomSchema.index({ society: 1, isActive: 1 });

const Room = mongoose.model('Room', roomSchema);

export default Room;
