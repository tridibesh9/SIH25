const mongoose = require('mongoose');

const VolunteerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  phone: {
    type: String,
    required: true
  },
  assignedNgo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Ngo',
    default: null
  }
});

module.exports = mongoose.model('Volunteer', VolunteerSchema);
