const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const OrderDetail = require('./orderDetail.model');

const Order = sequelize.define('Order', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
    },
    orderDate: {
        type: DataTypes.DATE(3),
        allowNull: false,
    },
    totalPrice: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true
    },
    note: {
        type: DataTypes.STRING(200),
        allowNull: true
    },
    status: {
        type: DataTypes.INTEGER,
        allowNull: true
    }
}, {
    tableName: 'orders',
    timestamps: false
});

Order.hasMany(OrderDetail, { foreignKey: 'orderId' });

module.exports = Order;
