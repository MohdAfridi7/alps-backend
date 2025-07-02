const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  client: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
  title: { type: String, required: true },
  description: String,
  status: { type: String, enum: ['active', 'on-hold', 'completed'], default: 'active' },
  startDate: Date,
  endDate: Date,
}, { timestamps: true });

module.exports = mongoose.model('Project', projectSchema);
