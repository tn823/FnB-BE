const { Sequelize, DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const ProductImage = sequelize.define('ProductImage', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    productId: {
        type: DataTypes.STRING,
        allowNull: false,
        references: {
            model: 'products',
            key: 'id'
        }
    },
    url: {
        type: DataTypes.STRING,
        allowNull: false
    },
    created_at: {
        type: DataTypes.DATE(3),
        allowNull: true
    },
    updated_at: {
        type: DataTypes.DATE(3),
        allowNull: true
    },
    position: {
        type: DataTypes.INTEGER,
        allowNull: true
    }
}, {
    tableName: 'product_images',
    timestamps: false
});

module.exports = ProductImage;