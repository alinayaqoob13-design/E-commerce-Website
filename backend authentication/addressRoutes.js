const express = require('express');
const router = express.Router();
const addressController = require('../controllers/addressController');
const { protect } = require('../middleware/auth');

// All routes require authentication
router.use(protect);

// Address CRUD
router.get('/', addressController.getAddresses);
router.post('/', addressController.createAddress);
router.put('/:id', addressController.updateAddress);
router.delete('/:id', addressController.deleteAddress);
router.patch('/:id/default', addressController.setDefaultAddress);

module.exports = router;
