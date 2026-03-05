const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Address = sequelize.define('Address', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'user_id',
    references: {
      model: 'users',
      key: 'id'
    }
  },
  label: {
    type: DataTypes.STRING(50),
    allowNull: true,
    comment: 'e.g., Home, Office, etc.'
  },
  fullName: {
    type: DataTypes.STRING(200),
    allowNull: false,
    field: 'full_name'
  },
  phone: {
    type: DataTypes.STRING(20),
    allowNull: false
  },
  addressLine1: {
    type: DataTypes.STRING(255),
    allowNull: false,
    field: 'address_line1'
  },
  addressLine2: {
    type: DataTypes.STRING(255),
    allowNull: true,
    field: 'address_line2'
  },
  city: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  state: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  postalCode: {
    type: DataTypes.STRING(20),
    allowNull: false,
    field: 'postal_code'
  },
  country: {
    type: DataTypes.STRING(100),
    allowNull: false,
    defaultValue: 'Pakistan'
  },
  isDefault: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    field: 'is_default'
  },
  latitude: {
    type: DataTypes.DECIMAL(10, 8),
    allowNull: true
  },
  longitude: {
    type: DataTypes.DECIMAL(11, 8),
    allowNull: true
  }
}, {
  tableName: 'addresses',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = Address;
