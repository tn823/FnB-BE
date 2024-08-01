const { Sequelize, DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Combo = sequelize.define('Combo', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true
  },
  created_at: {
    type: DataTypes.DATE(3),
    allowNull: true
  },
  updated_at: {
    type: DataTypes.DATE(3),
    allowNull: true
  }
}, {
  tableName: 'combos',
  timestamps: false
});

module.exports = Combo;