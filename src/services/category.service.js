const axios = require('axios');
const getAccessToken = require('../auth/auth');
const dotenv = require('dotenv');

const apiUrl = 'https://publicfnb.kiotapi.com/categories';
const Category = require('../models/category.model')
const Menu = require("../models/menu.model")
const { sequelize } = require('../config/database');
const moment = require('moment-timezone');
const { Op } = require('sequelize');

dotenv.config();
class CategoryService {

    async getCategories() {
        try {
            const categories = await Category.findAll({
                include: [
                    {
                        model: Menu,
                        attributes: ['name']
                    }
                ]
            });
            return categories;
        } catch (error) {
            console.error('Error while getting categories:', error);
            throw error;
        }
    }


    // async getCategoriesKiotviet() {
    //     const accessToken = await getAccessToken();
    //     const response = await axios.get(apiUrl, {
    //         headers: {
    //             'Authorization': `Bearer ${accessToken}`,
    //             'Retailer': process.env.RETAILER_ID
    //         }
    //     });
    //     return response.data;
    // }


    async getCategoryById(id) {
        try {
            const category = await Category.findOne({
                where: { id },
                include: [
                    {
                        model: Menu,
                        attributes: ['name']
                    }
                ]
            });
            return category;
        } catch (error) {
            console.error('Error while getting category by id:', error);
            throw error;
        }
    }


    // async createCategoryKiotviet(categoryData) {
    //     const accessToken = await getAccessToken();
    //     try {
    //         const response = await axios.post(apiUrl, categoryData, {
    //             headers: {
    //                 'Authorization': `Bearer ${accessToken}`,
    //                 'Retailer': process.env.RETAILER_ID,
    //                 'Content-Type': 'application/json'
    //             }
    //         });
    //         return response.data;
    //     } catch (error) {
    //         console.error('Error creating category:', error.response?.data || error.message);
    //         throw error;
    //     }
    // }


    async createCategory(categoryData) {
        const transaction = await sequelize.transaction();
        try {
            const { categoryName, menuId } = categoryData;

            const exitstingCategory = await Category.findOne({ where: { categoryName } })
            if (exitstingCategory) {
                throw new error('Category name already exists');
            }

            const currentTimeVN = moment().tz('Asia/Ho_Chi_Minh').format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');
            const newCategory = await Category.create({ categoryName, menuId, createdDate: currentTimeVN, updatedDate: currentTimeVN }, { transaction });


            await transaction.commit();

            return {
                message: 'Category added successfully',
                category: newCategory,

            };
        } catch (error) {
            await transaction.rollback();
            console.error('Error while adding category: ', error);
            throw error;
        }
    }


    // async deleteCategoryKiotviet(categoryId) {
    //     const accessToken = await getAccessToken();
    //     try {
    //         const response = await axios.delete(`${apiUrl}/${categoryId}`, {
    //             headers: {
    //                 'Authorization': `Bearer ${accessToken}`,
    //                 'Retailer': process.env.RETAILER_ID
    //             }
    //         });
    //         return response.data;
    //     } catch (error) {
    //         confirm.error('Error deleting category in KiotViet', error.response?.data || error.message);
    //         throw error;
    //     }
    // }


    async deleteCategory(id) {
        const transaction = await sequelize.transaction();
        try {
            // await this.deleteCategoryKiotviet(categoryId);
            const result = await Category.destroy({
                where: { id },
                // transaction
            });
            // await transaction.commit();
            return result;
        } catch (error) {
            // await transaction.rollback();
            confirm.error('Error deleting category in KiotViet', error.response?.data || error.message);
            throw error;
        }
    }


    // async updateCategoryKiotviet(categoryId, categoryName) {
    //     const accessToken = await getAccessToken();
    //     try {
    //         const response = await axios.put(`${apiUrl}/${categoryId}`, {
    //             categoryName
    //         }, {
    //             headers: {
    //                 'Authorization': `Bearer ${accessToken}`,
    //                 'Retailer': process.env.RETAILER_ID,
    //                 'Content-Type': 'application/json'
    //             }
    //         });
    //         console.log(response.data);
    //         return response.data;
    //     } catch (error) {
    //         console.error('Error updating category in KiotViet:', error.response?.data || error.message);
    //         throw error;
    //     }
    // }


    async updateCategory(id, categoryData) {
        const transaction = await sequelize.transaction();
        try {
            const { categoryName, menuId } = categoryData;
            const currentTimeVN = moment().tz('Asia/Ho_Chi_Minh').format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');

            const [updated] = await Category.update(
                { categoryName, menuId, modifiedDate: currentTimeVN }, // sửa lại tên cột ở đây
                { where: { id }, transaction }
            );

            await transaction.commit();

            if (updated) {
                const updatedCategory = await Category.findOne({ where: { id } });
                return updatedCategory;
            } else {
                throw new Error('Category not found');
            }
        } catch (error) {
            await transaction.rollback();
            console.error('Error while updating category:', error);
            throw error;
        }
    }



    async getCategoryByName(categoryName) {
        try {
            const categories = await Category.findAll({
                where: {
                    categoryName: {
                        [Op.like]: `%${categoryName}%`
                    }
                },
                include: [
                    {
                        model: Menu,
                        attributes: ['name']
                    }
                ]
            });

            return categories;
        } catch (error) {
            console.error('Error while getting category by name:', error);
            throw error;
        }
    }

}



module.exports = new CategoryService();

