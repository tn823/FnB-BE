const { Sequelize, DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const Combo = require('./combo.model');
const Product = require('./product.model');

const ComboDetail = sequelize.define('ComboDetail', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    combo_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Combo,
            key: 'id',
        },
    },
    product_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Product,
            key: 'id',
        },
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
    }
}, {
    tableName: 'combo_details',
    timestamps: false,
});


module.exports = ComboDetail;