const express = require('express');
const router = express.Router();
const {
  register,
  login,
  getUsersByRole,
  getUserById,
  updateUser,
  deleteUser,
  changePassword
} = require('../controllers/authController');

const { authMiddleware, adminOnly } = require('../middlewares/authMiddleware');

// 🔐 Public routes
router.post('/register', register);
router.post('/login', login);

// 🔐 Protected routes (Admin only)
router.get('/users', authMiddleware, adminOnly, getUsersByRole);
router.get('/users/:id', authMiddleware, adminOnly, getUserById);
router.put('/users/:id', authMiddleware, adminOnly, updateUser);
router.delete('/users/:id', authMiddleware, adminOnly, deleteUser);
router.put('/users/:id/password', authMiddleware, adminOnly, changePassword);


module.exports = router;
