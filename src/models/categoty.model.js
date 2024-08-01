const { Sequelize, DataTypes } = require("sequelize")
const { sequelize } = require('../config/database')
const Menu = require('./menu.model')

const Category = sequelize.define('Category', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    categoryId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        unique: true
    },
    categoryName: {
        type: DataTypes.STRING,
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
    menu_id: {
        type: DataTypes.INTEGER,
        allowNull: true
    }
}, {
    tableName: 'categories',
    timestamps: false,
});


module.exports = Category;