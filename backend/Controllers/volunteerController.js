const Volunteer = require('../models/Volunteer');
const Ngo = require('../models/Ngo');

// Create volunteer
exports.createVolunteer = async (req, res) => {
  try {
    const volunteer = new Volunteer(req.body);
    await volunteer.save();
    res.status(201).json(volunteer);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get all volunteers
exports.getVolunteers = async (req, res) => {
  try {
    const volunteers = await Volunteer.find().populate('assignedNgo');
    res.json(volunteers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get volunteer by ID
exports.getVolunteerById = async (req, res) => {
  try {
    const volunteer = await Volunteer.findById(req.params.id).populate('assignedNgo');
    if (!volunteer) return res.status(404).json({ error: 'Volunteer not found' });
    res.json(volunteer);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update volunteer
exports.updateVolunteer = async (req, res) => {
  try {
    const volunteer = await Volunteer.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!volunteer) return res.status(404).json({ error: 'Volunteer not found' });
    res.json(volunteer);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete volunteer
exports.deleteVolunteer = async (req, res) => {
  try {
    const volunteer = await Volunteer.findByIdAndDelete(req.params.id);
    if (!volunteer) return res.status(404).json({ error: 'Volunteer not found' });
    res.json({ message: 'Volunteer deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Assign NGO to volunteer
exports.assignNgo = async (req, res) => {
  try {
    const { ngoId } = req.body;
    const ngo = await Ngo.findById(ngoId);
    if (!ngo) return res.status(404).json({ error: 'NGO not found' });
    const volunteer = await Volunteer.findByIdAndUpdate(
      req.params.id,
      { assignedNgo: ngoId },
      { new: true }
    ).populate('assignedNgo');
    if (!volunteer) return res.status(404).json({ error: 'Volunteer not found' });
    res.json(volunteer);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Remove assigned NGO
exports.removeNgo = async (req, res) => {
  try {
    const volunteer = await Volunteer.findByIdAndUpdate(
      req.params.id,
      { assignedNgo: null },
      { new: true }
    );
    if (!volunteer) return res.status(404).json({ error: 'Volunteer not found' });
    res.json(volunteer);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Check if volunteer is assigned to any NGO
exports.isAssignedNgo = async (req, res) => {
  try {
    const volunteer = await Volunteer.findById(req.params.id);
    if (!volunteer) return res.status(404).json({ error: 'Volunteer not found' });
    res.json({ assigned: !!volunteer.assignedNgo });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get current assigned NGO
exports.getAssignedNgo = async (req, res) => {
  try {
    const volunteer = await Volunteer.findById(req.params.id).populate('assignedNgo');
    if (!volunteer) return res.status(404).json({ error: 'Volunteer not found' });
    res.json({ ngo: volunteer.assignedNgo });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
