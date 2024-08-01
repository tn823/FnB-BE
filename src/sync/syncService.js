const cron = require('node-cron');
const axios = require('axios');
const getAccessToken = require('../auth/auth');
const dotenv = require('dotenv');
const Category = require('../models/categoty.model');
const Product = require('../models/product.model');
const Attribute = require('../models/productAttribute.model');
const ProductImage = require('../models/productImage.model');
const Topping = require('../models/topping.model');

const { sequelize } = require('../config/database');
dotenv.config();

const apiCategoryUrl = 'https://publicfnb.kiotapi.com/categories';
const apiProductUrl = 'https://publicfnb.kiotapi.com/products'

class SyncService {
    async syncCategories() {
        const accessToken = await getAccessToken();
        try {
            const response = await axios.get(apiCategoryUrl, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Retailer': process.env.RETAILER_ID
                }
            });

            const categoriesFromKiotViet = response.data.data;

            const transaction = await sequelize.transaction();
            try {

                const localCategories = await Category.findAll({ transaction });


                const localCategoriesMap = new Map();
                localCategories.forEach(category => {
                    localCategoriesMap.set(category.categoryId.toString(), category);
                });

                const deletedCategoriesIds = new Set(localCategoriesMap.keys());


                for (const kiotvietCategory of categoriesFromKiotViet) {
                    const { categoryId, categoryName, createdDate, modifiedDate } = kiotvietCategory;

                    if (localCategoriesMap.has(categoryId.toString())) {
                        const category = localCategoriesMap.get(categoryId.toString());


                        await category.update({
                            categoryName,
                            modifiedDate
                        }, { transaction });


                        deletedCategoriesIds.delete(categoryId.toString());
                    } else {

                        await Category.create({
                            categoryId,
                            categoryName,
                            createdDate,
                            modifiedDate
                        }, { transaction });
                    }
                }


                for (const categoryId of deletedCategoriesIds) {
                    const categoryToDelete = localCategoriesMap.get(categoryId);
                    await categoryToDelete.destroy({ transaction });
                }


                for (const kiotvietCategory of categoriesFromKiotViet) {
                    const { categoryId } = kiotvietCategory;
                    await Category.update(
                        { id: categoryId },
                        { where: { categoryId }, transaction }
                    );
                }

                await transaction.commit();
                console.log('Categories synced successfully');
            } catch (error) {
                await transaction.rollback();
                console.error('Error during sync transaction:', error);
            }
        } catch (error) {
            console.error('Error fetching categories from KiotViet:', error.response?.data || error.message);
        }
    };


    async syncProducts() {
        const accessToken = await getAccessToken();
        try {
            const response = await axios.get(apiProductUrl, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Retailer': process.env.RETAILER_ID
                }
            });

            const productsFromKiotViet = response.data.data;

            const transaction = await sequelize.transaction();
            try {
                const localProducts = await Product.findAll({ transaction });
                const localToppings = await Topping.findAll({ transaction });

                const localProductsMap = new Map();
                localProducts.forEach(product => {
                    localProductsMap.set(product.id.toString(), product);
                });

                const localToppingsMap = new Map();
                localToppings.forEach(topping => {
                    localToppingsMap.set(topping.id.toString(), topping);
                });

                const kiotVietProductIds = new Set(productsFromKiotViet.map(product => product.id.toString()));
                const deletedProductsIds = new Set(localProductsMap.keys());

                for (const kiotvietProduct of productsFromKiotViet) {
                    const { id, code, name, fullName, description, basePrice, createdDate, modifiedDate, categoryId, attributes, images, isTopping } = kiotvietProduct;

                    const categoryExists = await Category.findByPk(categoryId);
                    if (!categoryExists) {
                        console.error(`Category with id ${categoryId} does not exist. Skipping product sync for productId ${id}.`);
                        continue;
                    }


                    if (localProductsMap.has(id.toString())) {
                        const product = localProductsMap.get(id.toString());

                        const productChanged = (
                            product.code !== code ||
                            product.name !== name ||
                            product.fullName !== fullName ||
                            product.description !== description ||
                            product.basePrice !== basePrice ||
                            product.modifiedDate !== modifiedDate ||
                            product.categoryId !== categoryId
                        );

                        if (productChanged) {
                            await product.update({
                                code,
                                name,
                                fullName,
                                description,
                                basePrice,
                                modifiedDate,
                                categoryId
                            }, { transaction });
                        }

                        if (images && images.length > 0) {
                            const existingImages = await ProductImage.findAll({ where: { productId: id }, transaction });
                            const existingImageUrls = existingImages.map(image => image.url);
                            const newImageUrls = images.filter(imageUrl => !existingImageUrls.includes(imageUrl));
                            const deletedImageUrls = existingImageUrls.filter(imageUrl => !images.includes(imageUrl));

                            for (const imageUrl of deletedImageUrls) {
                                await ProductImage.destroy({ where: { productId: id, url: imageUrl }, transaction });
                            }
                            for (const imageUrl of newImageUrls) {
                                await ProductImage.create({
                                    productId: id,
                                    url: imageUrl,
                                    created_at: createdDate,
                                    updated_at: modifiedDate
                                }, { transaction });
                            }
                        }

                        if (attributes && attributes.length > 0) {
                            const existingAttributes = await Attribute.findAll({ where: { productId: id }, transaction });
                            const existingAttributeMap = new Map(existingAttributes.map(attr => [attr.attributeName, attr]));

                            for (const attribute of attributes) {
                                if (existingAttributeMap.has(attribute.attributeName)) {
                                    const existingAttribute = existingAttributeMap.get(attribute.attributeName);
                                    if (existingAttribute.attributeValue !== attribute.attributeValue) {
                                        await existingAttribute.update({
                                            attributeValue: attribute.attributeValue
                                        }, { transaction });
                                    }
                                    existingAttributeMap.delete(attribute.attributeName);
                                } else {
                                    await Attribute.create({
                                        productId: id,
                                        attributeName: attribute.attributeName,
                                        attributeValue: attribute.attributeValue
                                    }, { transaction });
                                }
                            }

                            for (const remainingAttribute of existingAttributeMap.values()) {
                                await remainingAttribute.destroy({ transaction });
                            }
                        }

                        if (isTopping) {
                            if (localToppingsMap.has(id.toString())) {
                                const topping = localToppingsMap.get(id.toString());
                                const toppingChanged = (
                                    topping.code !== code ||
                                    topping.name !== name ||
                                    topping.fullName !== fullName ||
                                    topping.basePrice !== basePrice ||
                                    topping.categoryId !== categoryId
                                );

                                if (toppingChanged) {
                                    await topping.update({
                                        code,
                                        name,
                                        fullName,
                                        basePrice,
                                        categoryId
                                    }, { transaction });
                                }
                                localToppingsMap.delete(id.toString());
                            } else {
                                await Topping.create({
                                    id,
                                    productId: id,
                                    code,
                                    name,
                                    fullName,
                                    categoryId,
                                    basePrice
                                }, { transaction });
                            }
                        }

                        deletedProductsIds.delete(id.toString());
                    } else {
                        await Product.create({
                            id,
                            code,
                            name,
                            fullName,
                            description,
                            basePrice,
                            createdDate,
                            modifiedDate,
                            categoryId
                        }, { transaction });

                        if (images && images.length > 0) {
                            for (const imageUrl of images) {
                                await ProductImage.create({
                                    productId: id,
                                    url: imageUrl,
                                    created_at: createdDate,
                                    updated_at: modifiedDate
                                }, { transaction });
                            }
                        }

                        if (attributes && attributes.length > 0) {
                            for (const attribute of attributes) {
                                await Attribute.create({
                                    productId: id,
                                    attributeName: attribute.attributeName,
                                    attributeValue: attribute.attributeValue
                                }, { transaction });
                            }
                        }

                        if (isTopping) {
                            await Topping.create({
                                id,
                                productId: id,
                                code,
                                name,
                                fullName,
                                categoryId,
                                basePrice
                            }, { transaction });
                        }
                    }
                }

                for (const productId of deletedProductsIds) {
                    const productToDelete = localProductsMap.get(productId);
                    await Attribute.destroy({ where: { productId }, transaction });
                    await ProductImage.destroy({ where: { productId }, transaction });
                    await Topping.destroy({ where: { productId }, transaction });
                    await productToDelete.destroy({ transaction });
                }

                for (const [id, topping] of localToppingsMap) {
                    if (!kiotVietProductIds.has(id)) {
                        await topping.destroy({ transaction });
                    }
                }

                await transaction.commit();
                console.log('Products synced successfully');
            } catch (error) {
                await transaction.rollback();
                console.error('Error during sync transaction:', error);
            }
        } catch (error) {
            console.error('Error fetching products from KiotViet:', error.response?.data || error.message);
        }
    }




}

module.exports = new SyncService();
