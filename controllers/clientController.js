const Client = require('../models/Client');

// Create Client (Admin only)
exports.createClient = async (req, res) => {
  try {
    const client = new Client({ ...req.body, createdBy: req.user.id });
    await client.save();
    res.status(201).json(client);
  } catch (err) {
    res.status(500).json({ msg: 'Error creating client', err });
  }
};

// Get all clients
exports.getAllClients = async (req, res) => {
  try {
    const clients = await Client.find().populate('createdBy', 'name email');
    res.json(clients);
  } catch (err) {
    res.status(500).json({ msg: 'Error fetching clients', err });
  }
};

// Get single client
exports.getClientById = async (req, res) => {
  try {
    const client = await Client.findById(req.params.id);
    if (!client) return res.status(404).json({ msg: 'Client not found' });
    res.json(client);
  } catch (err) {
    res.status(500).json({ msg: 'Error fetching client', err });
  }
};

// Update client
exports.updateClient = async (req, res) => {
  try {
    const client = await Client.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!client) return res.status(404).json({ msg: 'Client not found' });
    res.json(client);
  } catch (err) {
    res.status(500).json({ msg: 'Error updating client', err });
  }
};

// Delete client
exports.deleteClient = async (req, res) => {
  try {
    const client = await Client.findByIdAndDelete(req.params.id);
    if (!client) return res.status(404).json({ msg: 'Client not found' });
    res.json({ msg: 'Client deleted' });
  } catch (err) {
    res.status(500).json({ msg: 'Error deleting client', err });
  }
};
