const { Sequelize, DataTypes } = require("sequelize");
const { sequelize } = require('../config/database');
const Category = require('../models/categoty.model');
const Product = require("./product.model");

const Topping = sequelize.define('Topping', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: false
    },
    productId: {
        type: DataTypes.STRING,
        allowNull: true,
        references: {
            model: 'products',
            key: 'id',
        },
    },

    code: {
        type: DataTypes.STRING,
        allowNull: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: true
    },
    fullName: {
        type: DataTypes.STRING,
        allowNull: true
    },
    categoryId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'categories',
            key: 'id',
        },
    },
    basePrice: {
        type: DataTypes.DECIMAL,
        allowNull: true
    }
}, {
    tableName: 'toppings',
    timestamps: false
});

Topping.belongsTo(Category, { foreignKey: 'categoryId' });
Topping.belongsTo(Product, { foreignKey: 'productId' });

module.exports = Topping;