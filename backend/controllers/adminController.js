const User = require('../models/User');

// @desc    Get all users with search, filter, and pagination
// @route   GET /api/admin/users
// @access  Private (Admin Only)
const getAllUsers = async (req, res) => {
  try {
    const { search, role, status, page = 1, limit = 10 } = req.query;

    let query = {};

    // Search filter (name or email regex)
    if (search) {
      query.$or = [
        { fullName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    // Role filter
    if (role && role !== 'All') {
      query.role = role;
    }

    // Status filter
    if (status && status !== 'All') {
      query.status = status;
    }

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 10;
    const skip = (pageNum - 1) * limitNum;

    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    const totalUsers = await User.countDocuments(query);

    return res.status(200).json({
      success: true,
      count: users.length,
      totalUsers,
      totalPages: Math.ceil(totalUsers / limitNum) || 1,
      currentPage: pageNum,
      users
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Error fetching users list.'
    });
  }
};

// @desc    Get single user details
// @route   GET /api/admin/users/:id
// @access  Private (Admin Only)
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found.'
      });
    }
    return res.status(200).json({
      success: true,
      user
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error fetching user details.'
    });
  }
};

// @desc    Create new user by Admin
// @route   POST /api/admin/users
// @access  Private (Admin Only)
const createUser = async (req, res) => {
  try {
    const { fullName, email, password, role, status, phone, bio } = req.body;

    if (!fullName || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Full name, email, and password are required.'
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists.'
      });
    }

    const user = await User.create({
      fullName,
      email,
      password,
      role: role || 'User',
      status: status || 'Active',
      phone: phone || '',
      bio: bio || ''
    });

    return res.status(201).json({
      success: true,
      message: 'User created successfully by Administrator!',
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        status: user.status,
        phone: user.phone,
        bio: user.bio,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Error creating user.'
    });
  }
};

// @desc    Update user details, role, or status by Admin
// @route   PUT /api/admin/users/:id
// @access  Private (Admin Only)
const updateUser = async (req, res) => {
  try {
    const { fullName, email, role, status, phone, bio, password } = req.body;
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found.'
      });
    }

    if (fullName) user.fullName = fullName.trim();
    if (email) user.email = email.trim().toLowerCase();
    if (role) user.role = role;
    if (status) user.status = status;
    if (phone !== undefined) user.phone = phone.trim();
    if (bio !== undefined) user.bio = bio.trim();
    if (password && password.length >= 6) {
      user.password = password;
    }

    await user.save();

    return res.status(200).json({
      success: true,
      message: 'User updated successfully!',
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        status: user.status,
        phone: user.phone,
        bio: user.bio,
        updatedAt: user.updatedAt
      }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Error updating user.'
    });
  }
};

// @desc    Delete user account by Admin
// @route   DELETE /api/admin/users/:id
// @access  Private (Admin Only)
const deleteUser = async (req, res) => {
  try {
    const userIdToDelete = req.params.id;

    // Prevent Admin from deleting their own current active session
    if (req.user.id.toString() === userIdToDelete.toString()) {
      return res.status(400).json({
        success: false,
        message: 'You cannot delete your own logged-in admin account.'
      });
    }

    const user = await User.findById(userIdToDelete);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found.'
      });
    }

    await User.findByIdAndDelete(userIdToDelete);

    return res.status(200).json({
      success: true,
      message: `User '${user.fullName}' was permanently deleted.`
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Error deleting user.'
    });
  }
};

// @desc    Get dashboard metrics & statistics
// @route   GET /api/admin/stats
// @access  Private (Admin Only)
const getStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ status: 'Active' });
    const adminCount = await User.countDocuments({ role: 'Admin' });

    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const newThisWeek = await User.countDocuments({
      createdAt: { $gte: oneWeekAgo }
    });

    return res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        activeUsers,
        adminCount,
        newThisWeek
      }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error loading dashboard metrics.'
    });
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  getStats
};
