const { Address } = require('../models');
const logger = require('../utils/logger');

// Get user addresses
exports.getAddresses = async (req, res) => {
  try {
    const userId = req.user.id;

    const addresses = await Address.findAll({
      where: { userId },
      order: [['isDefault', 'DESC'], ['createdAt', 'DESC']],
    });

    res.json({
      success: true,
      data: { addresses },
    });
  } catch (error) {
    logger.error('Get addresses error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching addresses',
    });
  }
};

// Create address
exports.createAddress = async (req, res) => {
  try {
    const userId = req.user.id;
    const addressData = req.body;

    // If this is the first address, make it default
    const addressCount = await Address.count({ where: { userId } });
    if (addressCount === 0) {
      addressData.isDefault = true;
    }

    // If setting as default, unset other defaults
    if (addressData.isDefault) {
      await Address.update(
        { isDefault: false },
        { where: { userId } }
      );
    }

    const address = await Address.create({
      ...addressData,
      userId,
    });

    res.status(201).json({
      success: true,
      message: 'Address created successfully',
      data: { address },
    });
  } catch (error) {
    logger.error('Create address error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating address',
    });
  }
};

// Update address
exports.updateAddress = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const updates = req.body;

    const address = await Address.findOne({ where: { id, userId } });
    if (!address) {
      return res.status(404).json({
        success: false,
        message: 'Address not found',
      });
    }

    // If setting as default, unset other defaults
    if (updates.isDefault) {
      await Address.update(
        { isDefault: false },
        { where: { userId } }
      );
    }

    await address.update(updates);

    res.json({
      success: true,
      message: 'Address updated successfully',
      data: { address },
    });
  } catch (error) {
    logger.error('Update address error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating address',
    });
  }
};

// Delete address
exports.deleteAddress = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const address = await Address.findOne({ where: { id, userId } });
    if (!address) {
      return res.status(404).json({
        success: false,
        message: 'Address not found',
      });
    }

    await address.destroy();

    // If deleted address was default, set another as default
    if (address.isDefault) {
      const anotherAddress = await Address.findOne({ where: { userId } });
      if (anotherAddress) {
        await anotherAddress.update({ isDefault: true });
      }
    }

    res.json({
      success: true,
      message: 'Address deleted successfully',
    });
  } catch (error) {
    logger.error('Delete address error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting address',
    });
  }
};

// Set default address
exports.setDefaultAddress = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const address = await Address.findOne({ where: { id, userId } });
    if (!address) {
      return res.status(404).json({
        success: false,
        message: 'Address not found',
      });
    }

    // Unset other defaults
    await Address.update(
      { isDefault: false },
      { where: { userId } }
    );

    // Set this as default
    await address.update({ isDefault: true });

    res.json({
      success: true,
      message: 'Default address updated',
      data: { address },
    });
  } catch (error) {
    logger.error('Set default address error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating default address',
    });
  }
};
