const axios = require('axios');
const getAccessToken = require('../auth/auth');
const dotenv = require('dotenv');
const moment = require('moment-timezone');
const { sequelize } = require('../config/database');
const Product = require('../models/product.model');
const ProductImage = require('../models/productImage.model');
const Attribute = require('../models/productAttribute.model');
const Category = require('../models/category.model');
const Topping = require('../models/topping.model');
const { Op } = require('sequelize');
dotenv.config();

const apiUrl = 'https://publicfnb.kiotapi.com/products';

class ProductService {
    async getProducts() {
        try {
            const products = await Product.findAll({
                include: [
                    {
                        model: Category,
                        attributes: ['id', 'categoryName', 'createdDate', 'modifiedDate', 'menuId']
                    }, {
                        model: ProductImage,
                        attributes: ['id', 'productId', 'url', 'created_at', 'updated_at', 'position']
                    }, {
                        model: Attribute,
                        attributes: ['id', 'productId', 'attributeName', 'attributeValue']
                    }, {
                        model: Topping,
                        attributes: ['id', 'productId', 'name', 'categoryId', 'basePrice']
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
                        attributes: ['id', 'categoryName', 'createdDate', 'modifiedDate', 'menuId']
                    },
                    {
                        model: ProductImage,
                        attributes: ['id', 'productId', 'url', 'created_at', 'updated_at', 'position']
                    },
                    {
                        model: Attribute,
                        attributes: ['id', 'productId', 'attributeName', 'attributeValue']
                    }, {
                        model: Topping,
                        attributes: ['id', 'productId', 'name', 'categoryId', 'basePrice']
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
                    attributes: ['id', 'categoryName', 'createdDate', 'modifiedDate', 'menuId'],
                }, {
                    model: ProductImage,
                    attributes: ['id', 'productId', 'url', 'created_at', 'updated_at', 'position']
                }, {
                    model: Attribute,
                    attributes: ['id', 'productId', 'attributeName', 'attributeValue']
                }, {
                    model: Topping,
                    attributes: ['id', 'productId', 'name', 'categoryId', 'basePrice']
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
                        attributes: ['id', 'categoryName', 'createdDate', 'modifiedDate', 'menuId'],
                    },
                    {
                        model: ProductImage,
                        attributes: ['id', 'productId', 'url', 'created_at', 'updated_at', 'position']
                    },
                    {
                        model: Attribute,
                        attributes: ['id', 'productId', 'attributeName', 'attributeValue']
                    }, {
                        model: Topping,
                        attributes: ['id', 'productId', 'name', 'categoryId', 'basePrice']
                    }
                ]
            });
            return products;
        } catch (error) {
            console.error('Error while getting products by category: ', error);
            throw new Error(`Error while getting products by category: ${error.message}`);
        }
    }

    async createProduct(productData) {
        const transaction = await sequelize.transaction();
        try {
            const { code, name, fullName, description, basePrice, images, attributes, categoryId, toppings } = productData;

            // Kiểm tra categoryId có tồn tại không
            const category = await Category.findByPk(categoryId);
            if (!category) {
                throw new Error(`Category with id ${categoryId} does not exist.`);
            }

            const currentTimeVN = moment().tz('Asia/Ho_Chi_Minh');
            const currentTimeUTCF = currentTimeVN.format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');

            const newProduct = await Product.create({
                code,
                name,
                fullName,
                description,
                basePrice,
                categoryId,
                createdDate: currentTimeUTCF,
                modifiedDate: currentTimeUTCF
            }, { transaction });

            if (images && images.length > 0) {
                for (let image of images) {
                    await ProductImage.create({
                        productId: newProduct.id,
                        url: image.url,
                        created_at: currentTimeUTCF,
                        updated_at: currentTimeUTCF,
                        position: image.position
                    }, { transaction });
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
                    }, { transaction });
                }
            }

            if(toppings && toppings.length > 0) {
                for(let topping of toppings) {
                    if(!topping.name || !topping.basePrice) {
                        throw new Error('Tipping name and price cannot be null');
                    }
                    await Topping.create({
                        productId: newProduct.id,
                        name: topping.name,
                        basePrice: topping.basePrice,
                        categoryId: topping.categoryId
                    },{transaction})
                }
            }

            // Commit transaction nếu tất cả thành công
            await transaction.commit();
            return newProduct;
        } catch (error) {
            // Rollback transaction nếu có lỗi
            await transaction.rollback();
            console.error('Error while creating product: ', error);
            throw new Error(`Error while creating product: ${error.message}`);
        }
    }


    async updateProduct(productId, productData) {
        const transaction = await sequelize.transaction();
        try {
            const { code, name, fullName, description, basePrice, categoryId, images, attributes, toppings } = productData;

            // Kiểm tra categoryId có tồn tại không
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

            // Cập nhật thông tin sản phẩm
            product.code = code;
            product.name = name;
            product.fullName = fullName;
            product.description = description;
            product.basePrice = basePrice;
            product.categoryId = categoryId;
            product.modifiedDate = currentTimeUTCF;

            await product.save({ transaction });

            // Xóa hình ảnh hiện tại
            await ProductImage.destroy({
                where: { productId: productId },
                transaction
            });

            // Thêm hình ảnh mới
            if (images && images.length > 0) {
                for (let image of images) {
                    await ProductImage.create({
                        productId: productId,
                        url: image.url,
                        created_at: currentTimeUTCF,
                        updated_at: currentTimeUTCF,
                        position: image.position
                    }, { transaction });
                }
            }

            // Xóa thuộc tính hiện tại
            await Attribute.destroy({
                where: { productId: productId },
                transaction
            });

            // Thêm thuộc tính mới
            if (attributes && attributes.length > 0) {
                for (let attribute of attributes) {
                    if (!attribute.attributeName || !attribute.attributeValue) {
                        throw new Error('Attribute name and value cannot be null');
                    }
                    await Attribute.create({
                        productId: productId,
                        attributeName: attribute.attributeName,
                        attributeValue: attribute.attributeValue
                    }, { transaction });
                }
            }

            // Xóa toppings hiện tại
            await Topping.destroy({
                where: { productId: productId },
                transaction
            });

            // Thêm toppings mới
            if (toppings && toppings.length > 0) {
                for (let topping of toppings) {
                    if (!topping.name || !topping.basePrice) {
                        throw new Error('Topping name and price cannot be null');
                    }
                    await Topping.create({
                        productId: productId,
                        name: topping.name,
                        basePrice: topping.basePrice,
                        categoryId: topping.categoryId
                    }, { transaction });
                }
            }

            // Commit transaction nếu mọi thứ thành công
            await transaction.commit();
            return product;
        } catch (error) {
            // Rollback nếu có lỗi
            await transaction.rollback();
            console.error('Error while updating product: ', error);
            throw new Error(`Error while updating product: ${error.message}`);
        }
    }



    async deleteProduct(productId) {
        const transaction = await sequelize.transaction();
        try {

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

