const { User, Order, Review } = require('../models');
const logger = require('../utils/logger');

// Get user profile
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password'] },
      include: ['addresses']
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    logger.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching profile'
    });
  }
};

// Update user profile
exports.updateProfile = async (req, res) => {
  try {
    const { firstName, lastName, phone, avatar } = req.body;

    await User.update(
      { firstName, lastName, phone, avatar },
      { where: { id: req.user.id } }
    );

    const updatedUser = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password'] }
    });

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: updatedUser
    });
  } catch (error) {
    logger.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating profile'
    });
  }
};

// Get user orders
exports.getUserOrders = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const { count, rows: orders } = await Order.findAndCountAll({
      where: { userId: req.user.id },
      include: ['items', 'payment'],
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: (parseInt(page) - 1) * parseInt(limit)
    });

    res.json({
      success: true,
      data: {
        orders,
        pagination: {
          total: count,
          page: parseInt(page),
          pages: Math.ceil(count / parseInt(limit))
        }
      }
    });
  } catch (error) {
    logger.error('Get user orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching orders'
    });
  }
};

// Get user reviews
exports.getUserReviews = async (req, res) => {
  try {
    const reviews = await Review.findAll({
      where: { userId: req.user.id },
      include: ['product'],
      order: [['createdAt', 'DESC']]
    });

    res.json({
      success: true,
      data: reviews
    });
  } catch (error) {
    logger.error('Get user reviews error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching reviews'
    });
  }
};

// Delete account
exports.deleteAccount = async (req, res) => {
  try {
    const { password } = req.body;

    const user = await User.findByPk(req.user.id);

    if (!(await user.comparePassword(password))) {
      return res.status(400).json({
        success: false,
        message: 'Incorrect password'
      });
    }

    await user.update({ isActive: false });

    res.json({
      success: true,
      message: 'Account deactivated successfully'
    });
  } catch (error) {
    logger.error('Delete account error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deactivating account'
    });
  }
};
