const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { protect } = require('../middleware/auth');
const { requireAdmin } = require('../middleware/admin');

// All routes require admin authentication
router.use(protect, requireAdmin);

// Dashboard
router.get('/dashboard', adminController.getDashboardStats);

// Users
router.get('/users', adminController.getUsers);
router.put('/users/:id/status', adminController.updateUserStatus);

// Orders
router.get('/orders', adminController.getOrders);
router.put('/orders/:id/status', adminController.updateOrderStatus);

// Reviews
router.get('/reviews/pending', adminController.getPendingReviews);
router.put('/reviews/:id/status', adminController.updateReviewStatus);

module.exports = router;
