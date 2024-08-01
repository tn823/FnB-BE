const express = require('express')
const router = express.Router();
const categoryController = require('../controllers/category.controller')


router.get('/categories', categoryController.getCategories);

router.get('/categories/:id', categoryController.getCategoryById);

router.post('/categories', categoryController.createCategory);

router.delete('/categories/:id', categoryController.deleteCategory);

router.put('/categories/:id', categoryController.updateCategory);

router.get('/categories/name/:name', categoryController.getCategoryByName);

router.get('/categories/menu/:menuId', categoryController.getCategoryByMenuId);

router.get('/getCategoriesKiotviet', categoryController.getCategoriesKiotviet);

router.post('/createCategoryKiotviet', categoryController.createCategoryKiotviet);




module.exports = router;