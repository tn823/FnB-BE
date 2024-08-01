const { Sequelize, DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Menu = sequelize.define('Menu', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
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
    }
}, {
    tableName: 'menus',
    timestamps: false
});

module.exports = Menu;
