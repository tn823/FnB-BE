const { Op } = require('sequelize');
const Menu = require('../models/menu.model');
const moment = require('moment-timezone');

exports.getMenus = async (req, res) => {
    try {
        const menus = await Menu.findAll();
        res.json(menus);
    } catch (error) {
        console.error('Error while getting menus:', error);
        res.status(500).json({ error: 'Error while getting menus' });
    }
};


exports.createMenu = async (req, res) => {
    try {
        const { name } = req.body;
        const currentTimeVN = moment().tz('Asia/Ho_Chi_Minh');
        const currentTimeUTCF = currentTimeVN.format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');

        const newMenu = await Menu.create({ name, created_at: currentTimeUTCF, updated_at: currentTimeUTCF });
        res.status(200).json({ message: 'Menu created successfull', menu: newMenu });
    } catch (error) {
        console.error('Error while creating menu:', error);
        res.status(500).json({ error: 'Error while creating menu' });
    }
};


exports.deleteMenu = async (req, res) => {
    const { id } = req.params;
    try {
        const menu = await Menu.findByPk(id);
        if (!menu) {
            return res.status(200).json({ error: 'Menu not found' });
        }
        await menu.destroy();
        res.json({ message: 'Menu deleted successfully' });
    } catch (error) {
        console.error('Error while deleting menu:', error);
        res.status(500).json({ error: 'Error while deleting menu' });
    }
};

exports.updateMenu = async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;
    try {
        let menu = await Menu.findByPk(id);
        if (!menu) {
            return res.status(404).json({ error: 'Menu not found' });
        }
        const currentTimeVN = moment().tz('Asia/Ho_Chi_Minh');
        const currentTimeUTCF = currentTimeVN.format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');

        menu.name = name;
        menu.updated_at = currentTimeUTCF;
        await menu.save();
        res.json({ message: 'Menu update successfully' });
    } catch (error) {
        console.error('Error while updating menu:', error);
        res.status(500).json({ error: 'Error while updating menu' });
    }
};


exports.getMenuById = async (req, res) => {
    try {
        const menuId = req.params.id;
        const menu = await Menu.findByPk(menuId);
        if (!menu) {
            return res.status(404).json({ error: 'Menu not found' });
        }
        res.status(201).json(menu);
    } catch (error) {
        console.log('Error while getting menu by id: ', error);
        res.status(500).json({ error: 'Error while getting menu' });
    }
};

exports.getMenuByName = async (req, res) => {
    try {
        const name = req.params.name;
        const menus = await Menu.findAll({
            where: {
                name: {
                    [Op.like]: `%${name}%`
                }
            }
        });
        if (menus.length === 0) {
            return res.status(404).json({ error: 'Menu not found' });
        }
        res.status(200).json(menus);
    } catch (error) {
        console.error('Error while getting menu by name:', error);
        res.status(500).json({ error: 'Error while getting menu' });
    }
};