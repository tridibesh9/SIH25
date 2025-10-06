const express = require('express');
const router = express.Router();
const volunteerController = require('../Controllers/volunteerController');

// CRUD routes
router.post('/', volunteerController.createVolunteer);
router.get('/', volunteerController.getVolunteers);
router.get('/:id', volunteerController.getVolunteerById);
router.put('/:id', volunteerController.updateVolunteer);
router.delete('/:id', volunteerController.deleteVolunteer);

// Assign/Remove NGO
router.post('/:id/assign-ngo', volunteerController.assignNgo);
router.post('/:id/remove-ngo', volunteerController.removeNgo);

// Check assignment & get current NGO
router.get('/:id/is-assigned', volunteerController.isAssignedNgo);
router.get('/:id/current-ngo', volunteerController.getAssignedNgo);

module.exports = router;
