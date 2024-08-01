const axios = require('axios');
const getAccessToken = require('../auth/auth');
const dotenv = require('dotenv');
const moment = require('moment-timezone');
const { sequelize } = require('../config/database');
const Product = require('../models/product.model');
const ProductImage = require('../models/productImage.model');
const Attribute = require('../models/productAttribute.model');
const Category = require('../models/categoty.model');
const Topping = require('../models/topping.model');
const { Op } = require('sequelize');
dotenv.config();

const apiUrl = 'https://publicfnb.kiotapi.com/products';

class ProductService {
    async getProductsKiotviet() {
        const accessToken = await getAccessToken();
        const response = await axios.get(apiUrl, {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Retailer': process.env.RETAILER_ID
            }
        });
        return response.data;
    };


    async getProducts() {
        try {
            const products = await Product.findAll({
                include: [
                    {
                        model: Category,
                        attributes: ['id', 'categoryId', 'categoryName']
                    }, {
                        model: ProductImage,
                        attributes: ['id', 'productId', 'url', 'created_at', 'updated_at', 'position']
                    }, {
                        model: Attribute,
                        attributes: ['id', 'productId', 'attributeName', 'attributeValue']
                    }]
            });
            console.log();
            return products;
        } catch (error) {
            console.error('Error while getting products from database: ', error);
            throw new Error(`Error while getting products from database: ${error.message}`);
        }
    };


    async getProductById(id) {
        try {
            const product = await Product.findOne({
                where: { id },
                include: [
                    {
                        model: Category,
                        attributes: ['id', 'categoryId', 'categoryName']
                    },
                    {
                        model: ProductImage,
                        attributes: ['id', 'productId', 'url', 'created_at', 'updated_at', 'position']
                    },
                    {
                        model: Attribute,
                        attributes: ['id', 'productId', 'attributeName', 'attributeValue']
                    }
                ]
            });
            return product;
        } catch (error) {
            console.error('Error while getting product by id:', error);
            throw error;
        }
    }


    async getProductByName(name) {
        try {
            const products = await Product.findAll({
                where: {
                    name: {
                        [Op.like]: `%${name}%`
                    }
                },
                include: [{
                    model: Category,
                    attributes: ['id', 'categoryId', 'categoryName', 'createdDate', 'modifiedDate', 'menu_id'],
                }, {
                    model: ProductImage,
                    attributes: ['id', 'productId', 'url', 'created_at', 'updated_at', 'position']
                }, {
                    model: Attribute,
                    attributes: ['id', 'productId', 'attributeName', 'attributeValue']
                }]
            });

            return products;
        } catch (error) {
            console.error('Error while getting product by name:', error);
            throw error;
        }
    }


    async getProductsByCategoryId(categoryId) {
        try {
            const products = await Product.findAll({
                where: { categoryId },
                include: [
                    {
                        model: Category,
                        attributes: ['id', 'categoryId', 'categoryName', 'createdDate', 'modifiedDate', 'menu_id'],
                    },
                    {
                        model: ProductImage,
                        attributes: ['id', 'productId', 'url', 'created_at', 'updated_at', 'position']
                    },
                    {
                        model: Attribute,
                        attributes: ['id', 'productId', 'attributeName', 'attributeValue']
                    }
                ]
            });
            return products;
        } catch (error) {
            console.error('Error while getting products by category: ', error);
            throw new Error(`Error while getting products by category: ${error.message}`);
        }
    }


    async createProductKiotviet(productData) {
        try {
            const accessToken = await getAccessToken();
            const response = await axios.post(apiUrl, productData, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Retailer': process.env.RETAILER_ID,
                    'Content-Type': 'application/json'
                }
            });
            // console.log(response.data);
            return response.data;
        } catch (error) {
            console.error('Error while creating product in KiotViet: ', error);
            throw new Error(`Error while creating product in KiotViet: ${error.message}`);
        }
    };


    async createProduct(productData) {
        try {

            const { id, code, name, fullName, description, basePrice, categoryId, images, attributes } = productData;


            const category = await Category.findByPk(categoryId);
            if (!category) {
                throw new Error(`Category with id ${categoryId} does not exist.`);
            }

            const currentTimeVN = moment().tz('Asia/Ho_Chi_Minh');
            const currentTimeUTCF = currentTimeVN.format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');

            const newProduct = await Product.create({
                id,
                code,
                name,
                fullName: fullName,
                description,
                basePrice,
                categoryId,
                createdDate: currentTimeUTCF,
                modifiedDate: currentTimeUTCF
            });

            if (images && images.length > 0) {
                for (let image of images) {
                    await ProductImage.create({
                        productId: newProduct.id,
                        url: image.url,
                        created_at: currentTimeUTCF,
                        updated_at: currentTimeUTCF,
                        position: image.position
                    });
                }
            }

            if (attributes && attributes.length > 0) {
                for (let attribute of attributes) {
                    if (!attribute.attributeName || !attribute.attributeValue) {
                        throw new Error('Attribute name and value cannot be null');
                    }
                    await Attribute.create({
                        productId: newProduct.id,
                        attributeName: attribute.attributeName,
                        attributeValue: attribute.attributeValue
                    });
                }
            }


            const kiotVietProductData = {
                name: newProduct.name,
                code: newProduct.code,
                categoryId: newProduct.categoryId,
                allowsSale: true,
                hasVariants: true,
                basePrice: newProduct.basePrice,
                images: images.map(image => image.url),
                attributes: attributes.map(attr => ({
                    attributeName: attr.attributeName,
                    attributeValue: attr.attributeValue
                }))
            };


            const kiotVietProduct = await this.createProductKiotviet(kiotVietProductData);
            // console.log(kiotVietProduct);
            return newProduct;
        } catch (error) {
            console.error('Error while creating product: ', error);
            throw new Error(`Error while creating product: ${error.message}`);
        }
    };


    async updateProduct(productId, productData) {
        try {
            const { code, name, fullName, description, basePrice, categoryId, images, attributes } = productData;

            const category = await Category.findByPk(categoryId);
            if (!category) {
                throw new Error(`Category with id ${categoryId} does not exist.`);
            }

            const currentTimeVN = moment().tz('Asia/Ho_Chi_Minh');
            const currentTimeUTCF = currentTimeVN.format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');

            const product = await Product.findByPk(productId);
            if (!product) {
                throw new Error(`Product with id ${productId} does not exist.`);
            }

            product.code = code;
            product.name = name;
            product.fullName = fullName;
            product.description = description;
            product.basePrice = basePrice;
            product.categoryId = categoryId;
            product.modifiedDate = currentTimeUTCF;

            await product.save();

            // Delete existing images
            await ProductImage.destroy({
                where: { productId: productId }
            });

            // Insert new images
            if (images && images.length > 0) {
                for (let image of images) {
                    await ProductImage.create({
                        productId: productId,
                        url: image.url,
                        created_at: currentTimeUTCF,
                        updated_at: currentTimeUTCF,
                        position: image.position
                    });
                }
            }

            // Delete existing attributes
            await Attribute.destroy({
                where: { productId: productId }
            });

            // Insert new attributes
            if (attributes && attributes.length > 0) {
                for (let attribute of attributes) {
                    if (!attribute.attributeName || !attribute.attributeValue) {
                        throw new Error('Attribute name and value cannot be null');
                    }
                    await Attribute.create({
                        productId: productId,
                        attributeName: attribute.attributeName,
                        attributeValue: attribute.attributeValue
                    });
                }
            }

            const kiotVietProductData = {
                name: product.name,
                code: product.code,
                categoryId: product.categoryId,
                allowsSale: true,
                hasVariants: true,
                basePrice: product.basePrice,
                images: images.map(image => image.url),
                attributes: attributes.map(attr => ({
                    attributeName: attr.attributeName,
                    attributeValue: attr.attributeValue
                }))
            };

            const kiotVietProduct = await this.updateProductKiotviet(productId, kiotVietProductData);
            return product;
        } catch (error) {
            console.error('Error while updating product: ', error);
            throw new Error(`Error while updating product: ${error.message}`);
        }
    };

    async updateProductKiotviet(productId, productData) {
        const accessToken = await getAccessToken();
        try {
            const response = await axios.put(`${apiUrl}/${productId}`, productData, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Retailer': process.env.RETAILER_ID,
                    'Content-Type': 'application/json'
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error updating product in KiotViet', error.response?.data || error.message);
            throw error;
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


    async deleteProduct(productId) {
        const transaction = await sequelize.transaction();
        try {

            await this.deleteProductKiotviet(productId);

            await Topping.destroy({
                where: {
                    productId: productId
                },
                transaction
            });


            await Attribute.destroy({
                where: {
                    productId: productId
                },
                transaction
            });


            await ProductImage.destroy({
                where: {
                    productId: productId
                },
                transaction
            });


            const result = await Product.destroy({
                where: { id: productId },
                transaction
            });

            await transaction.commit();
            return result;
        } catch (error) {
            await transaction.rollback();
            console.error('Error deleting product', error.response?.data || error.message);
            throw error;
        }
    };



}


module.exports = new ProductService();

