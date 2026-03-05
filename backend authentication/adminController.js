const { Op } = require('sequelize');
const {
  User,
  Order,
  Product,
  Category,
  Review,
  Payment,
} = require('../models');
const logger = require('../utils/logger');

// Dashboard stats
exports.getDashboardStats = async (req, res) => {
  try {
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    // Get stats
    const [
      totalUsers,
      newUsersToday,
      totalOrders,
      ordersToday,
      totalRevenue,
      revenueToday,
      totalProducts,
      lowStockProducts,
      pendingOrders,
    ] = await Promise.all([
      User.count(),
      User.count({ where: { createdAt: { [Op.gte]: startOfDay } } }),
      Order.count(),
      Order.count({ where: { createdAt: { [Op.gte]: startOfDay } } }),
      Order.sum('totalAmount', { where: { paymentStatus: 'paid' } }),
      Order.sum('totalAmount', {
        where: {
          createdAt: { [Op.gte]: startOfDay },
          paymentStatus: 'paid',
        },
      }),
      Product.count(),
      Product.count({
        where: {
          quantity: { [Op.lte]: require('sequelize').col('lowStockThreshold') },
        },
      }),
      Order.count({ where: { status: 'pending' } }),
    ]);

    // Recent orders
    const recentOrders = await Order.findAll({
      limit: 10,
      order: [['createdAt', 'DESC']],
      include: [
        { model: User, attributes: ['firstName', 'lastName', 'email'] },
        { model: require('../models/OrderItem'), as: 'items' },
      ],
    });

    // Sales chart data (last 7 days)
    const salesData = await Order.findAll({
      where: {
        createdAt: {
          [Op.gte]: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        },
        paymentStatus: 'paid',
      },
      attributes: [
        [require('sequelize').fn('DATE', require('sequelize').col('createdAt')), 'date'],
        [require('sequelize').fn('SUM', require('sequelize').col('total')), 'total'],
        [require('sequelize').fn('COUNT', '*'), 'orders'],
      ],
      group: [require('sequelize').fn('DATE', require('sequelize').col('createdAt'))],
      raw: true,
    });

    res.json({
      success: true,
      data: {
        stats: {
          users: { total: totalUsers, today: newUsersToday },
          orders: { total: totalOrders, today: ordersToday, pending: pendingOrders },
          revenue: { total: totalRevenue || 0, today: revenueToday || 0 },
          products: { total: totalProducts, lowStock: lowStockProducts },
        },
        recentOrders,
        salesData,
      },
    });
  } catch (error) {
    logger.error('Get dashboard stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching dashboard stats',
    });
  }
};

// Get all users
exports.getUsers = async (req, res) => {
  try {
    const { page = 1, limit = 20, search } = req.query;

    const where = {};
    if (search) {
      where[Op.or] = [
        { firstName: { [Op.iLike]: `%${search}%` } },
        { lastName: { [Op.iLike]: `%${search}%` } },
        { email: { [Op.iLike]: `%${search}%` } },
      ];
    }

    const { count, rows: users } = await User.findAndCountAll({
      where,
      attributes: { exclude: ['password', 'refreshToken'] },
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: (parseInt(page) - 1) * parseInt(limit),
    });

    res.json({
      success: true,
      data: {
        users,
        pagination: {
          total: count,
          page: parseInt(page),
          pages: Math.ceil(count / parseInt(limit)),
        },
      },
    });
  } catch (error) {
    logger.error('Get users error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching users',
    });
  }
};

// Update user status
exports.updateUserStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { isActive, role } = req.body;

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    await user.update({ isActive, role });

    res.json({
      success: true,
      message: 'User updated successfully',
      data: { user },
    });
  } catch (error) {
    logger.error('Update user error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating user',
    });
  }
};

// Get all orders (admin)
exports.getOrders = async (req, res) => {
  try {
    const { page = 1, limit = 20, status, startDate, endDate } = req.query;

    const where = {};
    if (status) where.status = status;
    if (startDate && endDate) {
      where.createdAt = {
        [Op.between]: [new Date(startDate), new Date(endDate)],
      };
    }

    const { count, rows: orders } = await Order.findAndCountAll({
      where,
      include: [
        { model: User, attributes: ['firstName', 'lastName', 'email'] },
        { model: require('../models/OrderItem'), as: 'items' },
        { model: Payment, as: 'payment' },
      ],
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: (parseInt(page) - 1) * parseInt(limit),
    });

    res.json({
      success: true,
      data: {
        orders,
        pagination: {
          total: count,
          page: parseInt(page),
          pages: Math.ceil(count / parseInt(limit)),
        },
      },
    });
  } catch (error) {
    logger.error('Get orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching orders',
    });
  }
};

// Update order status
exports.updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, trackingNumber, trackingUrl } = req.body;

    const order = await Order.findByPk(id);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    const updates = { status };
    if (status === 'shipped') {
      updates.shippedAt = new Date();
      updates.trackingNumber = trackingNumber;
      updates.trackingUrl = trackingUrl;
    }
    if (status === 'delivered') {
      updates.deliveredAt = new Date();
    }

    await order.update(updates);

    res.json({
      success: true,
      message: 'Order status updated',
      data: { order },
    });
  } catch (error) {
    logger.error('Update order error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating order',
    });
  }
};

// Get pending reviews
exports.getPendingReviews = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;

    const { count, rows: reviews } = await require('../models/Review').findAndCountAll({
      where: { isApproved: false },
      include: [
        { model: User, as: 'user', attributes: ['firstName', 'lastName'] },
        { model: Product, as: 'product', attributes: ['id', 'nameEn'] },
      ],
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: (parseInt(page) - 1) * parseInt(limit),
    });

    res.json({
      success: true,
      data: {
        reviews,
        pagination: {
          total: count,
          page: parseInt(page),
          pages: Math.ceil(count / parseInt(limit)),
        },
      },
    });
  } catch (error) {
    logger.error('Get pending reviews error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching reviews',
    });
  }
};

// Approve/reject review
exports.updateReviewStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { isApproved } = req.body;

    const review = await require('../models/Review').findByPk(id);
    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found',
      });
    }

    await review.update({ isApproved });

    res.json({
      success: true,
      message: `Review ${isApproved ? 'approved' : 'rejected'}`,
      data: { review },
    });
  } catch (error) {
    logger.error('Update review error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating review',
    });
  }
};
