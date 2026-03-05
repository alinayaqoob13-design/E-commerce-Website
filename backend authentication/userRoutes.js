const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { protect } = require('../middleware/auth');

// All routes require authentication
router.use(protect);

// Profile routes
router.get('/profile', userController.getProfile);
router.put('/profile', userController.updateProfile);

// User orders and reviews
router.get('/orders', userController.getUserOrders);
router.get('/reviews', userController.getUserReviews);

// Delete account
router.delete('/account', userController.deleteAccount);

module.exports = router;
