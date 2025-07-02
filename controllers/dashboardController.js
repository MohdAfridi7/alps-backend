const Client = require('../models/User'); // assuming 'User' has role field
const Project = require('../models/Project');
const Ticket = require('../models/Ticket');
const moment = require('moment'); 

// Total counts
exports.getDashboardStats = async (req, res) => {
  try {
    const totalClients = await Client.countDocuments({ role: 'Client' });
    const totalProjects = await Project.countDocuments();

    const totalTickets = await Ticket.countDocuments();
    const open = await Ticket.countDocuments({ status: 'open' });
    const pending = await Ticket.countDocuments({ status: 'pending' });
    const resolved = await Ticket.countDocuments({ status: 'resolved' });

    res.json({
      totalClients,
      totalProjects,
      tickets: {
        total: totalTickets,
        open,
        pending,
        resolved
      }
    });
  } catch (err) {
    console.error('Dashboard error:', err);
    res.status(500).json({ msg: 'Dashboard stats error', err });
  }
};

// Tickets in last 7 days (for chart)
exports.getTicketsLast7Days = async (req, res) => {
  try {
    const labels = [];
    const counts = [];

    for (let i = 6; i >= 0; i--) {
      const day = moment().subtract(i, 'days');
      const start = day.startOf('day').toDate();
      const end = day.endOf('day').toDate();

      const count = await Ticket.countDocuments({
        createdAt: { $gte: start, $lte: end }
      });

      labels.push(day.format('MMM D'));
      counts.push(count);
    }

    res.json({ labels, counts });
  } catch (err) {
    console.error('Chart API error:', err);
    res.status(500).json({ msg: 'Chart stats error', err });
  }
};

// New clients per day (last 7 days)
exports.getClientsLast7Days = async (req, res) => {
  try {
    const labels = [];
    const counts = [];

    for (let i = 6; i >= 0; i--) {
      const day = moment().subtract(i, 'days');
      const start = day.startOf('day').toDate();
      const end = day.endOf('day').toDate();

      const count = await Client.countDocuments({
        role: 'Client',
        createdAt: { $gte: start, $lte: end }
      });

      labels.push(day.format('MMM D'));
      counts.push(count);
    }

    res.json({ labels, counts });
  } catch (err) {
    console.error('Client chart error:', err);
    res.status(500).json({ msg: 'Client stats error', err });
  }
};

// Projects grouped by status
exports.getProjectsByStatus = async (req, res) => {
  try {
    const statuses = ['active', 'completed', 'on-hold'];
    const result = {};

    for (const status of statuses) {
      result[status] = await Project.countDocuments({ status });
    }

    res.json(result);
  } catch (err) {
    console.error('Project status error:', err);
    res.status(500).json({ msg: 'Project status stats error', err });
  }
};

// Tickets by priority
exports.getTicketsByPriority = async (req, res) => {
  try {
    const priorities = ['low', 'medium', 'high'];
    const result = {};

    for (const p of priorities) {
      result[p] = await Ticket.countDocuments({ priority: p });
    }

    res.json(result);
  } catch (err) {
    console.error('Ticket priority error:', err);
    res.status(500).json({ msg: 'Ticket priority stats error', err });
  }
};
