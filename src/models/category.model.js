const { DataTypes } = require("sequelize")
const { sequelize } = require('../config/database')
const Menu = require("../models/menu.model")

const Category = sequelize.define('Category', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    categoryName: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    createdDate: {
        type: DataTypes.DATE(3),
        allowNull: true
    },
    modifiedDate: {
        type: DataTypes.DATE(3),
        allowNull: true
    },
    menuId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'menus',
            key: 'id'
        }
    }
}, {
    tableName: 'categories',
    timestamps: false,
});

Category.belongsTo(Menu, { foreignKey: 'menuId' })

module.exports = Category;