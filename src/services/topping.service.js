const axios = require('axios');
const getAccessToken = require('../auth/auth');
const dotenv = require('dotenv');
const Topping = require('../models/topping.model');
const Product = require('../models/product.model');
dotenv.config();

const apiUrl = 'https://publicfnb.kiotapi.com/products';

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


    async deleteProductKiotviet(productId) {
        const accessToken = await getAccessToken();
        try {
            const response = await axios.delete(`${apiUrl}/${productId}`, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Retailer': process.env.RETAILER_ID
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error deleting product in KiotViet', error.response?.data || error.message);
            throw error;
        }
    };

    async deleteTopping(productId) {
        try {
            await this.deleteProductKiotviet(productId);
            const result = await Topping.destroy({
                where: { productId }
            });
            return result;
        } catch (error) {
            console.error('Error while deleting topping from database: ', error);
            throw new Error(`Error while deleting topping from database: ${error.message}`);
        }
    }
}


module.exports = new ToppingService();