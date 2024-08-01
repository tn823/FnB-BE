const express = require("express");
const router = express.Router();
const productController = require('../controllers/product.controller')

router.get('/products', productController.getProducts);


router.post('/products', productController.createProduct);

router.delete('/products/:id', productController.deleteProduct);

router.delete('/deleteProductKiotviet/:id', productController.deleteProductKiotviet);

router.put('/products/:id', productController.updateProduct);

router.get('/products/:id', productController.getProductById);

router.get('/products/category/:categoryId', productController.getProductsByCategory);

router.get('/products/name/:name', productController.getProductByName);

router.get('/getProductsKiotviet', productController.getProductsKiotviet);

router.post('/createProductKiotviet', productController.createProductKiotviet);

module.exports = router;
