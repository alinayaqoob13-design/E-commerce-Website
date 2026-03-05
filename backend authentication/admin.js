exports.requireAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Admin privileges required.'
    });
  }
  next();
};

exports.requireAdminOrVendor = (req, res, next) => {
  if (!['admin', 'vendor'].includes(req.user.role)) {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Admin or Vendor privileges required.'
    });
  }
  next();
};
