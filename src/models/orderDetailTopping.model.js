const { Sequelize, DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const OrderDetail = require('./orderDetail.model');
const Topping = require('./topping.model');

const OrderDetailTopping = sequelize.define('OrderDetailTopping', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    orderDetailId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'order_details',
            key: 'id'
        }
    },
    toppingId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'toppings',
            key: 'id'
        }
    },
    name: {
        type: DataTypes.STRING(200),
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
    tableName: 'order_detail_toppings',
    timestamps: false
});


OrderDetailTopping.belongsTo(Topping, { foreignKey: 'toppingId' });

module.exports = OrderDetailTopping;
