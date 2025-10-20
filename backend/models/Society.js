import mongoose from 'mongoose';

const societySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a society name'],
    unique: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  logo: {
    type: String,
    default: ''
  },
  president: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  vicePresident: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  members: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    role: {
      type: String,
      enum: ['president', 'vicepresident', 'excom', 'extended', 'member']
    },
    joinedAt: {
      type: Date,
      default: Date.now
    }
  }],
  inviteCode: {
    type: String,
    unique: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  settings: {
    allowMemberInvites: {
      type: Boolean,
      default: false
    },
    requireApproval: {
      type: Boolean,
      default: true
    },
    calendarSync: {
      type: Boolean,
      default: false
    }
  }
}, {
  timestamps: true
});

const Society = mongoose.model('Society', societySchema);

export default Society;
