const jwt = require('jsonwebtoken');
const { User, Cart } = require('../models');
const { validationResult } = require('express-validator');
const redis = require('../config/redis');
const { Op } = require('sequelize');
const emailService = require('../services/emailService');
const smsService = require('../services/smsService');
const { generateOTP } = require('../utils/otp');

const generateTokens = (user) => {
  const accessToken = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE }
  );
  
  const refreshToken = jwt.sign(
    { id: user.id },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_REFRESH_EXPIRE }
  );
  
  return { accessToken, refreshToken };
};

exports.register = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }
    
    const { email, phone, password, firstName, lastName } = req.body;
    
    // Check existing user
    const existingUser = await User.findOne({ 
      where: { 
        [Op.or]: [{ email }, { phone }] 
      } 
    });
    
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'User already exists with this email or phone'
      });
    }
    
    // Create user
    const user = await User.create({
      email,
      phone,
      password,
      firstName,
      lastName
    });
    
    // Create cart for user
    await Cart.create({ user_id: user.id });
    
    // Generate verification OTP
    const emailOTP = generateOTP();
    const phoneOTP = phone ? generateOTP() : null;
    
    // Save OTPs to Redis (5 min expiry)
    await redis.setex(`verify:email:${user.id}`, 300, emailOTP);
    if (phone) await redis.setex(`verify:phone:${user.id}`, 300, phoneOTP);
    
    // Send verification emails/SMS
    await emailService.sendVerificationEmail(email, emailOTP);
    if (phone) await smsService.sendOTP(phone, phoneOTP);
    
    const tokens = generateTokens(user);
    
    res.status(201).json({
      success: true,
      message: 'Registration successful. Please verify your email.',
      data: {
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName
        },
        tokens
      }
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ success: false, message: 'Registration failed' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await User.findOne({ 
      where: { email, isActive: true } 
    });
    
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }
    
    // Update last login
    user.lastLogin = new Date();
    await user.save();
    
    const tokens = generateTokens(user);
    
    res.json({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          isVerified: user.isVerified
        },
        tokens
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Login failed' });
  }
};

exports.verifyEmail = async (req, res) => {
  try {
    const { userId, otp } = req.body;
    
    const storedOTP = await redis.get(`verify:email:${userId}`);
    
    if (!storedOTP || storedOTP !== otp) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired OTP'
      });
    }
    
    await User.update(
      { isVerified: true, emailVerifiedAt: new Date() },
      { where: { id: userId } }
    );
    
    await redis.del(`verify:email:${userId}`);
    
    res.json({
      success: true,
      message: 'Email verified successfully'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Verification failed' });
  }
};

exports.refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    
    const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);
    const user = await User.findByPk(decoded.id);
    
    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Invalid refresh token'
      });
    }
    
    const tokens = generateTokens(user);
    
    res.json({
      success: true,
      data: tokens
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Invalid refresh token'
    });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ where: { email } });
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    const resetToken = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    
    await redis.setex(`reset:${user.id}`, 3600, resetToken);
    
    await emailService.sendPasswordResetEmail(email, resetToken);
    
    res.json({
      success: true,
      message: 'Password reset link sent to email'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to send reset link' });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const storedToken = await redis.get(`reset:${decoded.id}`);
    
    if (!storedToken || storedToken !== token) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired reset token'
      });
    }
    
    const user = await User.findByPk(decoded.id);
    user.password = newPassword;
    await user.save();
    
    await redis.del(`reset:${decoded.id}`);
    
    res.json({
      success: true,
      message: 'Password reset successful'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Password reset failed' });
  }
};

exports.getMe = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      include: ['addresses', 'cart']
    });
    
    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to get user' });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { firstName, lastName, avatar } = req.body;
    
    await User.update(
      { firstName, lastName, avatar },
      { where: { id: req.user.id } }
    );
    
    res.json({
      success: true,
      message: 'Profile updated successfully'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Update failed' });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    const user = await User.findByPk(req.user.id);
    
    if (!(await user.comparePassword(currentPassword))) {
      return res.status(400).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }
    
    user.password = newPassword;
    await user.save();
    
    res.json({
      success: true,
      message: 'Password changed successfully'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Password change failed' });
  }
};

exports.logout = async (req, res) => {
  try {
    // Add token to blacklist in Redis
    await redis.setex(`blacklist:${req.token}`, 86400, 'true');
    
    res.json({
      success: true,
      message: 'Logged out successfully'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Logout failed' });
  }
};
