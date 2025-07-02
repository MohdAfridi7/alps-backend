const Project = require('../models/Project');
const User = require('../models/User');

// Create Project without assigning client immediately
exports.createProject = async (req, res) => {
  try {
    const { title, description, status, startDate, endDate } = req.body;
    const project = new Project({ title, description, status, startDate, endDate });
    await project.save();
    res.status(201).json(project);
  } catch (err) {
    res.status(500).json({ msg: 'Error creating project', err });
  }
};

// Assign project to a client (new controller)
exports.assignProjectToClient = async (req, res) => {
  try {
    const { projectId, clientId } = req.body;
    const client = await User.findById(clientId);
    if (!client || client.role !== 'Client') {
      return res.status(400).json({ msg: 'Invalid client' });
    }
    const project = await Project.findByIdAndUpdate(
      projectId,
      { client: clientId },
      { new: true }
    ).populate('client', 'name email');

    res.json({ msg: 'Project assigned successfully', project });
  } catch (err) {
    res.status(500).json({ msg: 'Error assigning project', err });
  }
};

// Get all Projects with optional filter/sort
exports.getAllProjects = async (req, res) => {
  try {
    const { status, sortBy = 'createdAt', order = 'desc' } = req.query;
    const filter = status ? { status } : {};
    const projects = await Project.find(filter)
      .populate('client', 'name email')
      .sort({ [sortBy]: order === 'asc' ? 1 : -1 });

    res.json(projects);
  } catch (err) {
    res.status(500).json({ msg: 'Error fetching projects', err });
  }
};

// Get Single Project
exports.getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id).populate('client', 'name email');
    if (!project) return res.status(404).json({ msg: 'Project not found' });
    res.json(project);
  } catch (err) {
    res.status(500).json({ msg: 'Error fetching project', err });
  }
};

// Update Project
exports.updateProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!project) return res.status(404).json({ msg: 'Project not found' });
    res.json(project);
  } catch (err) {
    res.status(500).json({ msg: 'Error updating project', err });
  }
};

// Delete Project
exports.deleteProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) return res.status(404).json({ msg: 'Project not found' });
    res.json({ msg: 'Project deleted' });
  } catch (err) {
    res.status(500).json({ msg: 'Error deleting project', err });
  }
};


// ✅ Get projects assigned to logged-in client
exports.getClientProjects = async (req, res) => {
  try {


    const projects = await Project.find({ client: req.user.id }).populate('client', 'name email');

    res.json(projects);
  } catch (err) {
    console.error("Client project fetch error:", err);
    res.status(500).json({ msg: "Error fetching project", err });
  }
};


