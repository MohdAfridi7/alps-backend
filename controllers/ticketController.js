const fs = require('fs');
const Ticket = require('../models/Ticket');
const path = require('path');
const Project = require('../models/Project');

// Admin/Client: Create ticket
exports.createTicket = async (req, res) => {
  try {
    const { project, subject, details, priority } = req.body;

    // ✅ Fetch project to get client
    const projectData = await Project.findById(project);
    if (!projectData) return res.status(404).json({ msg: 'Project not found' });

    const ticket = new Ticket({
      project,
      subject,
      details,
      priority,
      createdBy: req.user.id,
      assignedTo: projectData.client, // ✅ assign automatically
    });

    await ticket.save();
    res.status(201).json(ticket);
  } catch (err) {
    console.error("Create Ticket Error:", err);
    res.status(500).json({ msg: "Error creating ticket", err });
  }
};



// Admin: Get all tickets
exports.getAllTickets = async (req, res) => {
  try {
    const tickets = await Ticket.find()
      .populate('project', 'title')
      .populate('assignedTo', 'name')
      .populate('createdBy', 'name');
    res.json(tickets);
  } catch (err) {
    res.status(500).json({ msg: 'Error fetching tickets', err });
  }
};

// Client: Get tickets by user
exports.getMyTickets = async (req, res) => {
  try {
    const tickets = await Ticket.find({
      assignedTo: req.user.id // ✅ Only assignedTo client
    })
    .populate('project', 'title')
    .populate('assignedTo', 'name')
    .populate('createdBy', 'name');
    
    res.json(tickets);
  } catch (err) {
    res.status(500).json({ msg: 'Error fetching tickets', err });
  }
};


// Get single ticket
exports.getTicketById = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id)
      .populate('project')
      .populate('assignedTo')
      .populate('comments.user', 'name');
    res.json(ticket);
  } catch (err) {
    res.status(500).json({ msg: 'Error fetching ticket', err });
  }
};

// Admin: Update ticket
exports.updateTicket = async (req, res) => {
  try {
    const ticket = await Ticket.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(ticket);
  } catch (err) {
    res.status(500).json({ msg: 'Error updating ticket', err });
  }
};

// Admin: Delete ticket
exports.deleteTicket = async (req, res) => {
  try {
    await Ticket.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Ticket deleted' });
  } catch (err) {
    res.status(500).json({ msg: 'Error deleting ticket', err });
  }
};

// Client/Admin: Add comment
exports.addComment = async (req, res) => {
  try {
    console.log('Incoming user:', req.user); // 👈 Debug log
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) {
      return res.status(404).json({ msg: 'Ticket not found' });
    }

    ticket.comments.push({ user: req.user.id, message: req.body.message });
    await ticket.save();

    res.json(ticket);
  } catch (err) {
    console.error('Error in addComment:', err); // 👈 Print real error
    res.status(500).json({ msg: 'Error adding comment', err });
  }
};


// Client: Update status only
exports.updateTicketStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const ticket = await Ticket.findById(req.params.id);
    if (ticket.assignedTo.toString() !== req.user.id && ticket.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ msg: 'Not authorized' });
    }
    ticket.status = status;
    await ticket.save();
    res.json(ticket);
  } catch (err) {
    res.status(500).json({ msg: 'Error updating status', err });
  }
};


exports.uploadAttachment = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ msg: 'No file uploaded' });

    const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;

    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) return res.status(404).json({ msg: 'Ticket not found' });

    ticket.attachments.push({
      url: fileUrl,
      fileName: req.file.originalname,
      uploadedBy: req.user.id,
    });

    await ticket.save();
    res.json({ msg: 'File uploaded', attachment: fileUrl });
  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).json({ msg: 'Upload failed', error: err.message });
  }
};
