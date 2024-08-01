const Category = require('../models/categoty.model');
const { Op } = require("sequelize");
const Menu = require('../models/menu.model');
const moment = require('moment-timezone');
const CategoryService = require('../services/category.service');
const { sequelize } = require('../config/database');


exports.getCategories = async (req, res) => {
    try {
        const categories = await CategoryService.getCategories();
        res.json(categories);
    } catch (error) {
        console.error('Error while getting categories:', error);
        res.status(500).json({ error: 'Error while getting categories' });
    }
}


exports.getCategoriesKiotviet = async (req, res) => {
    try {
        const categories = await CategoryService.getCategoriesKiotviet(req.body);
        res.json(categories);
    } catch (error) {
        console.error('Error fetching categories:', error);
        res.status(500).json({ error: 'Error fetching categories' });
    }
};


exports.getCategoryById = async (req, res) => {
    try {
        const categoryId = req.params.id;
        const category = await CategoryService.getCategoryById(categoryId);
        if (!category) {
            return res.status(404).json({ error: 'Category not found' });
        }
        res.status(200).json(category);
    } catch (error) {
        console.error('Error while getting category by id:', error);
        res.status(500).json({ error: 'Error while getting category' });
    }
};


exports.createCategoryKiotviet = async (req, res) => {
    try {
        const category = await CategoryService.createCategoryKiotviet(req.body);
        res.json(category);
    } catch (error) {
        console.error('Error creating category:', error);
        res.status(500).json({ error: 'Error creating category' });
    }
};


exports.createCategory = async (req, res) => {
    try {
        const categoryData = req.body;
        const result = await CategoryService.createCategory(categoryData);
        res.status(201).json(result);
    } catch (error) {
        console.error('Error while adding category: ', error);
        res.status(500).json({ error: 'Error while adding category' });
    }
};



exports.deleteCategory = async (req, res) => {
    try {
        const categoryId = req.params.id;
        const result = await CategoryService.deleteCategory(categoryId);
        if (result === 0) {
            res.status(404).json({ message: 'Category not found' });
        } else {
            res.status(200).json({ message: 'Category deleted successfully' });
        }
    } catch (error) {
        console.error('Error while deleting category: ', error);
        res.status(500).json({ error: 'Error while deleting category' });
    }
};

exports.updateCategory = async (req, res) => {
    try {
        const categoryId = req.params.id;
        const { categoryName, menu_id } = req.body;

        const updatedCategory = await CategoryService.updateCategory(categoryId, { categoryName, menu_id });
        res.status(200).json({ message: 'Category updated successfully', data: updatedCategory });
    } catch (error) {
        if (error.message === 'Category not found') {
            res.status(404).json({ error: 'Category not found' });
        } else {
            console.error('Error while updating category:', error);
            res.status(500).json({ error: 'Error while updating category' });
        }
    }
};




exports.getCategoryByMenuId = async (req, res) => {
    try {
        const menuId = req.params.menuId;
        const categories = await Category.findAll({
            where: {
                menu_id: menuId
            },
            include: {
                model: Menu,
                attributes: ['id', 'name', 'created_at', 'updated_at']
            }
        });

        if (categories.length === 0) {
            return res.status(404).json({ error: 'Category not found' });
        }

        res.json(categories);
    } catch (error) {
        console.error('Error while getting category by menu_id:', error);
        res.status(500).json({ error: 'Error while getting category by menu_id' });
    }
};

exports.getCategoryByName = async (req, res) => {
    try {
        const categoryName = req.params.name;
        const categories = await CategoryService.getCategoryByName(categoryName);
        if (!categories || categories.length === 0) {
            return res.status(404).json({ error: 'Category not found' });
        }
        res.status(200).json(categories);
    } catch (error) {
        console.error('Error while getting category by name:', error);
        res.status(500).json({ error: 'Error while getting category by name' });
    }
};
