const Product = require("../models/product.model.js");
const ProductImage = require('../models/productImage.model.js');
const { Op } = require("sequelize");
const moment = require('moment-timezone');
const Category = require("../models/categoty.model.js");
const Menu = require("../models/menu.model.js");
const Attribute = require('../models/productAttribute.model.js');
const Topping = require('../models/topping.model.js');
const ProductService = require('../services/product.service.js');

Product.hasMany(ProductImage, { foreignKey: 'productId' });
ProductImage.belongsTo(Product, { foreignKey: 'productId' });
Category.belongsTo(Menu, { foreignKey: 'menu_id' });
Product.belongsTo(Category, { foreignKey: 'categoryId' });
Product.hasMany(Attribute, { foreignKey: 'productId' });
Product.hasMany(Topping, { foreignKey: 'productId' });

exports.getProducts = async (req, res) => {
    try {
        const products = await ProductService.getProducts();
        res.json(products);
    } catch (error) {
        console.error('Error while getting products: ', error);
        res.status(500).json({ error: 'Error while getting products' });
    }
};


exports.getProductsKiotviet = async (req, res) => {
    try {
        const products = await ProductService.getProductsKiotviet(req.body);
        res.json(products);
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ error: 'Error fetching products' });
    }
};


exports.createProductKiotviet = async (req, res) => {
    try {
        const productKyotviet = await ProductService.createProductKiotviet(req.body);
        res.json(productKyotviet);
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ error: 'Error fetching products' });
    }
};



exports.createProduct = async (req, res) => {
    try {
        const productData = req.body;
        const result = await ProductService.createProduct(productData);
        res.status(201).json(result);
    } catch (error) {
        console.error('Error while creating product:', error);
        res.status(500).json({ error: 'Error while creating product' });
    }
};


exports.deleteProductKiotviet = async (req, res) => {
    try {
        const productId = req.params.id;
        const result = await ProductService.deleteProductKiotviet(productId);
        res.json({ message: `Xóa sản phẩm trên KiotViet thành công với id ${productId}`, data: result });
    } catch (error) {
        console.error('Error deleting product in KiotViet', error);
        res.status(500).json({ error: 'Error deleting product in KiotViet', details: error.response?.data || error.message });
    }
};


exports.deleteProduct = async (req, res) => {
    try {
        const productId = req.params.id;
        const result = await ProductService.deleteProduct(productId);
        if (result) {
            res.json({ message: `Xóa sản phẩm thành công product có id ${productId}` });
        } else {
            res.status(404).json({ error: 'Sản phẩm không tồn tại' });
        }
    } catch (error) {
        console.error('Error deleting product', error);
        res.status(500).json({ error: 'Error deleting product' });
    }
};

exports.updateProduct = async (req, res) => {
    try {
        const productId = req.params.id;
        const productData = req.body;
        const updatedProduct = await ProductService.updateProduct(productId, productData);
        res.json(updatedProduct);
    } catch (error) {
        console.error('Error while updating product: ', error);
        res.status(500).json({ error: 'Error while updating product' });
    }
};


exports.getProductById = async (req, res) => {
    try {
        const id = req.params.id;
        const product = await ProductService.getProductById(id);
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.status(200).json(product);
    } catch (error) {
        console.error('Error while getting product: ', error);
        res.status(500).json({ error: 'Error while getting product' });
    }
};


exports.getProductsByCategory = async (req, res) => {
    try {
        const categoryId = req.params.categoryId;
        const products = await ProductService.getProductsByCategoryId(categoryId);
        if (products.length > 0) {
            res.json(products);
        } else {
            res.status(404).json({ error: 'Product not found' });
        }
    } catch (error) {
        console.error('Error while getting products by category: ', error);
        res.status(500).json({ error: 'Error while getting products by category' });
    }
};


exports.getProductByName = async (req, res) => {
    try {
        const name = req.params.name;
        const products = await ProductService.getProductByName(name);

        if (products.length > 0) {
            res.json(products);
        } else {
            res.status(404).json({ error: 'Product not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error while getting product by name' });
    }
};