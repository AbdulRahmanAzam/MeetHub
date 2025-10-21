import Department from '../models/Department.js';
import User from '../models/User.js';

// @desc    Create department
// @route   POST /api/departments
// @access  Private (EXCOM or higher)
export const createDepartment = async (req, res) => {
  try {
    const { name, description, society, parentDepartment, level, head } = req.body;

    // Validate level permissions
    if (level === 1 && !['president', 'vicepresident', 'excom'].includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Only EXCOM or higher can create departments'
      });
    }

    if (level === 2 && !['president', 'vicepresident', 'excom'].includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Only EXCOM or higher can create sub-departments'
      });
    }

    if (level === 3 && !['president', 'vicepresident', 'excom', 'extended'].includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Only Extended members or higher can create modules'
      });
    }

    const department = await Department.create({
      name,
      description,
      society,
      parentDepartment: parentDepartment || null,
      level,
      head: head || req.user._id,
      createdBy: req.user._id,
      members: [req.user._id]
    });

    res.status(201).json({
      success: true,
      data: department
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get all departments in a society
// @route   GET /api/departments/society/:societyId
// @access  Private
export const getDepartmentsBySociety = async (req, res) => {
  try {
    const departments = await Department.find({
      society: req.params.societyId,
      isActive: true
    })
      .populate('head', 'name email')
      .populate('members', 'name email avatar')
      .populate('parentDepartment', 'name');

    res.json({
      success: true,
      data: departments
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get department hierarchy
// @route   GET /api/departments/:id/hierarchy
// @access  Private
export const getDepartmentHierarchy = async (req, res) => {
  try {
    const buildHierarchy = async (departmentId) => {
      const department = await Department.findById(departmentId)
        .populate('head', 'name email')
        .populate('members', 'name email avatar');

      if (!department) return null;

      const subDepartments = await Department.find({
        parentDepartment: departmentId,
        isActive: true
      });

      const children = await Promise.all(
        subDepartments.map(sub => buildHierarchy(sub._id))
      );

      return {
        ...department.toObject(),
        children: children.filter(child => child !== null)
      };
    };

    const hierarchy = await buildHierarchy(req.params.id);

    res.json({
      success: true,
      data: hierarchy
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update department
// @route   PUT /api/departments/:id
// @access  Private
export const updateDepartment = async (req, res) => {
  try {
    const department = await Department.findById(req.params.id);

    if (!department) {
      return res.status(404).json({
        success: false,
        message: 'Department not found'
      });
    }

    // Check if user has permission to update
    if (
      department.head.toString() !== req.user._id.toString() &&
      !['president', 'vicepresident'].includes(req.user.role)
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this department'
      });
    }

    const updatedDepartment = await Department.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('head', 'name email').populate('members', 'name email avatar');

    res.json({
      success: true,
      data: updatedDepartment
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Add member to department
// @route   POST /api/departments/:id/members
// @access  Private
export const addMemberToDepartment = async (req, res) => {
  try {
    const { userId } = req.body;
    const department = await Department.findById(req.params.id);

    if (!department) {
      return res.status(404).json({
        success: false,
        message: 'Department not found'
      });
    }

    // Check if user has permission
    if (
      department.head.toString() !== req.user._id.toString() &&
      !['president', 'vicepresident', 'excom', 'extended'].includes(req.user.role)
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized'
      });
    }

    // Check if user is already a member
    if (department.members.includes(userId)) {
      return res.status(400).json({
        success: false,
        message: 'User is already a member of this department'
      });
    }

    department.members.push(userId);
    await department.save();

    // Update user's department
    await User.findByIdAndUpdate(userId, {
      department: department._id
    });

    res.json({
      success: true,
      data: department,
      message: 'Member added successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete department
// @route   DELETE /api/departments/:id
// @access  Private (President/Vice President only)
export const deleteDepartment = async (req, res) => {
  try {
    const department = await Department.findById(req.params.id);

    if (!department) {
      return res.status(404).json({
        success: false,
        message: 'Department not found'
      });
    }

    // Soft delete
    department.isActive = false;
    await department.save();

    res.json({
      success: true,
      message: 'Department archived successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
