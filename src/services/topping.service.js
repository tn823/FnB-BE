const axios = require('axios');
const getAccessToken = require('../auth/auth');
const { sequelize } = require('../config/database');
const dotenv = require('dotenv');
const Topping = require('../models/topping.model');
const Product = require('../models/product.model');
const Category = require('../models/category.model');
const { Op } = require('sequelize');
dotenv.config();

class ToppingService {

    async getTopping() {

        try {
            const topping = await Topping.findAll();
            return topping;
        } catch (error) {
            console.error('Error while getting topping from database: ', error);
            throw new Error(`Error while getting topping from database: ${error.message}`);
        }
    }

    async getToppingsById(id) {
        try {
            const toppings = await Topping.findOne({where: { id }});
            return toppings;
        } catch (error) {
            console.error('Error while getting toppings from database: ', error);
            throw new Error(`Error while getting toppings from database: ${error.message}`);
        }
    }

    async getToppingsByProductId(productId) {
        try {
            const toppings = await Topping.findAll({
                where: { productId }
            });
            return toppings;
        } catch (error) {
            console.error('Error while getting toppings from database: ', error);
            throw new Error(`Error while getting toppings from database: ${error.message}`);
        }
    }

    async getToppingsByName(name) {
        try {
            const toppings = await Topping.findAll({
                where: {
                    name: {
                        [Op.like]: `%${name}%`
                    }
                }
            });

            return toppings;
        } catch (error) {
            console.error('Error while getting product by name:', error);
            throw error;
        }
    }

    async deleteTopping(id) {
        try {
            const result = await Topping.destroy({
                where: { id }
            });
            return result;
        } catch (error) {
            console.error('Error while deleting topping from database: ', error);
            throw new Error(`Error while deleting topping from database: ${error.message}`);
        }
    }

    async createTopping(toppingData) {
        const transaction = await sequelize.transaction();
        try {
            const { productId, name, fullName, categoryId, basePrice } = toppingData;
            const product = await Product.findByPk(productId);

            if (!product) {
                throw new Error(`Product with id ${product} does not exist.`)
            }

            const category = await Category.findByPk(categoryId);
            if (!category) {
                throw new Error(`Category with id ${categoryId} does not exist.`)
            }

            const newTopping = await Topping.create({
                productId,
                name,
                fullName,
                categoryId,
                basePrice,
            }, { transaction });

            await transaction.commit();

            return newTopping;
        } catch (error) {
            // Rollback transaction nếu có lỗi
            await transaction.rollback();
            console.error('Error while creating topping: ', error);
            throw new Error(`Error while creating topping: ${error.message}`);
        }
    }


    async updateTopping(id, data) {
        try {
            const topping = await Topping.findByPk(id);
            if (!topping) {
                throw new Error('Topping not found');
            }
            if (data.productId) {
                const product = await Product.findByPk(data.productId);
                if (!product) {
                    throw new Error('Invalid productId')
                }
            }
            if (data.categoryId) {
                const category = await Category.findByPk(data.categoryId);
                if (!category) {
                    throw new Error('Invalid categoryId')
                }
            }
            await topping.update(data);
            return topping;
        } catch (error) {
            throw error;
        }
    };
}


module.exports = new ToppingService();