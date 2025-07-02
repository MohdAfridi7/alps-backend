const express = require('express');
const router = express.Router();
const {
  getDashboardStats,
  getTicketsLast7Days,
  getClientsLast7Days,
  getProjectsByStatus,
  getTicketsByPriority
} = require('../controllers/dashboardController');
const { authMiddleware, adminOnly } = require('../middlewares/authMiddleware');


router.get('/stats', authMiddleware, adminOnly, getDashboardStats);
router.get('/tickets-last-7-days', authMiddleware, adminOnly, getTicketsLast7Days);
router.get('/clients-last-7-days', authMiddleware, adminOnly, getClientsLast7Days);
router.get('/projects-by-status', authMiddleware, adminOnly, getProjectsByStatus);
router.get('/tickets-by-priority', authMiddleware, adminOnly, getTicketsByPriority);


module.exports = router;
