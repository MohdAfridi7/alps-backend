const express = require('express');
const router = express.Router();
const {
  createProject,
  getAllProjects,
  getProjectById,
  updateProject,
  deleteProject,
  assignProjectToClient,
  getClientProjects,
} = require('../controllers/projectController');

const { authMiddleware, adminOnly } = require('../middlewares/authMiddleware');

// ✅ Client route - place it before any :id based routes
router.get('/my', authMiddleware, getClientProjects);

// ✅ Admin-only routes
router.post('/', authMiddleware, adminOnly, createProject);
router.get('/', authMiddleware, adminOnly, getAllProjects);
router.put('/assign', authMiddleware, adminOnly, assignProjectToClient);
router.get('/:id', authMiddleware, adminOnly, getProjectById); // ❗ now it won't block /my
router.put('/:id', authMiddleware, adminOnly, updateProject);
router.delete('/:id', authMiddleware, adminOnly, deleteProject);






module.exports = router;
