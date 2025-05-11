// routes/adminUserRoutes.js
const express = require('express');
const router = express.Router();
const {
  getAllUsers,
  getUserById,
  updateUser,
  updateUserStatus,
  deleteUser,
  inviteUser
} = require('../controllers/adminUserController');
const { protect, admin } = require('../middleware/adminMiddleware');

router.route('/')
  .get(protect, admin, getAllUsers)
  .post(protect, admin, inviteUser);

router.route('/:id')
  .get(protect, admin, getUserById)
  .put(protect, admin, updateUser)
  .delete(protect, admin, deleteUser);

router.route('/:id/status')
  .put(protect, admin, updateUserStatus);

module.exports = router;