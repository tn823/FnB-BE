const { Sequelize, DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const Category = require('./categoty.model');

const Product = sequelize.define('Product', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    code: {
        type: DataTypes.STRING,
        allowNull: false
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    fullName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    basePrice: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    createdDate: {
        type: DataTypes.DATE(3),
        allowNull: true
    },
    modifiedDate: {
        type: DataTypes.DATE(3),
        allowNull: true
    },
    categoryId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'categories',
            key: 'id'
        }
    }
}, {
    tableName: 'products',
    timestamps: false
});

Product.belongsTo(Category, { foreignKey: 'categoryId' });

module.exports = Product;
