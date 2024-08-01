const { Sequelize, DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const Order = require('./order.model');
const Product = require('./product.model');
const OrderDetailTopping = require('./orderDetailTopping.model');

const OrderDetail = sequelize.define('OrderDetail', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    orderId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'orders',
            key: 'id'
        }
    },
    productId: {
        type: DataTypes.STRING(100),
        allowNull: false,
        references: {
            model: 'products',
            key: 'id'
        }
    },
    name: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    basePrice: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: true
    }
}, {
    tableName: 'order_details',
    timestamps: false
});


OrderDetail.belongsTo(Product, { foreignKey: 'productId' });
OrderDetail.hasMany(OrderDetailTopping, { foreignKey: 'orderDetailId' });

module.exports = OrderDetail;
