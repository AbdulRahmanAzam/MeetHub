import mongoose from 'mongoose';

const departmentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a department name'],
    trim: true
  },
  description: {
    type: String,
    default: ''
  },
  society: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Society',
    required: true
  },
  parentDepartment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Department',
    default: null
  },
  level: {
    type: Number, // 1 = Department, 2 = Sub-department, 3 = Module
    required: true,
    min: 1,
    max: 3
  },
  head: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  members: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Index for efficient hierarchy queries
departmentSchema.index({ society: 1, parentDepartment: 1 });

const Department = mongoose.model('Department', departmentSchema);

export default Department;
