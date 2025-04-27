const express = require('express');
const router = express.Router();
const { getProductsByCategory, getProductDetail, createCategory, createProduct } = require('../controllers/productController');

// Create Category
router.post('/categories', createCategory);

// Create Product
router.post('/products', createProduct);

// List Products by Category
router.get('/category/:categoryId', getProductsByCategory);

// Get Product Details
router.get('/products/:productId', getProductDetail);

module.exports = router;
