const Menu = require('../models/menu.model');
const { Sequelize } = require('sequelize');
const { sequelize } = require("../config/database");
const moment = require('moment-timezone');

class MenuService {
    async getMenus() {
        try {
            const menus = await Menu.findAll();
            return menus;
        } catch (error) {
            console.error('Error while getting menus:', error);
            res.status(500).json({ error: 'Error while getting menus' });
        }
    }


    async getMenuById(menuId) {
        try {
            const menu = await Menu.findOne({
                where: { id: menuId }
            });
            return menu;
        } catch (error) {
            console.log('Error while getting menu by id: ', error);
            res.status(500).json({ error: 'Error while getting menu' });
        }
    }


    async updateMenu(id, name) {
        try {
            const menu = await Menu.findByPk(id);
            if (!menu) {
                throw new Error('Menu not found');
            }

            const currentTimeVN = moment().tz('Asia/Ho_Chi_Minh');
            const currentTimeUTCF = currentTimeVN.format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');

            menu.name = name;
            menu.updated_at = currentTimeUTCF;
            await menu.save();
            return menu;
        } catch (error) {
            throw error;
        }
    }

    async deleteMenu(id) {
        try {
            const menu = await Menu.findByPk(id);
            if (!menu) {
                throw new Error('Menu not found');
            }
            await menu.destroy();
            return menu;
        } catch (error) {
            throw error;
        }
    }


}


module.exports = new MenuService();