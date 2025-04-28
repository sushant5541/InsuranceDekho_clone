const express = require('express');
const router = express.Router();
const { getProductsByCategory, getProductDetail, createCategory, createProduct } = require('../controllers/productController');


router.post('/categories', createCategory);


router.post('/products', createProduct);


router.get('/category/:categoryId', getProductsByCategory);


router.get('/products/:productId', getProductDetail);

module.exports = router;
