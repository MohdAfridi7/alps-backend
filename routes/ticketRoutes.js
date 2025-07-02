const express = require('express');
const router = express.Router();
const {
  createTicket,
  getAllTickets,
  getMyTickets,
  getTicketById,
  updateTicket,
  deleteTicket,
  addComment,
  updateTicketStatus
} = require('../controllers/ticketController');
const { authMiddleware, adminOnly } = require('../middlewares/authMiddleware');

// Authenticated users
router.use(authMiddleware);

// Client-only
router.get('/my', getMyTickets);
router.put('/:id/status', updateTicketStatus);
router.post('/:id/comment', addComment);

// Admin-only
router.post('/', adminOnly, createTicket);
router.get('/', adminOnly, getAllTickets);
router.put('/:id', adminOnly, updateTicket);
router.delete('/:id', adminOnly, deleteTicket);

// Common
router.get('/:id', getTicketById);

module.exports = router;
