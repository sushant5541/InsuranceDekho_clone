const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

const { isAdmin } = require('../middleware/adminMiddleware');

// Admin login
router.post('/login', adminController.loginAdmin);

// Admin logout
router.post('/logout', adminController.logoutAdmin);

// Admin profile
router.get('/profile', isAdmin, adminController.getAdminProfile);

// ------- Category Routes -------
router.post('/categories', adminController.createCategory);
router.put('/categories/:categoryId', adminController.updateCategory);
router.delete('/categories/:categoryId', adminController.deleteCategory);

// ------- Product Routes -------
router.post('/products', adminController.createProduct);
router.put('/products/:productId', adminController.updateProduct);
router.delete('/products/:productId', adminController.deleteProduct);

// ------- User Management Routes -------
router.get('/users', adminController.getAllUsers);
router.put('/users/block/:userId', adminController.toggleBlockUser);
module.exports = router;
