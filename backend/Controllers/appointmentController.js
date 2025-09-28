import Appointment from "../models/Appointment.js";
import Drone from "../models/Drone.js";
import NGO from "../models/Ngo.js";
import Project from "../models/projectmodel.js";

// POST /appointments - Schedule an appointment for a project with either a drone or an NGO
export const createAppointment = async (req, res) => {
  try {
    const { project, appointable_type, appointable, date_of_visit } = req.body;

    // Validation
    if (!project || !appointable_type || !appointable || !date_of_visit) {
      return res.status(400).json({
        message: "Project ID, appointable type, appointable ID, and date of visit are required."
      });
    }

    // Validate appointable_type
    if (!['Drone', 'NGO'].includes(appointable_type)) {
      return res.status(400).json({
        message: "Appointable type must be either 'Drone' or 'NGO'."
      });
    }

    // Check if the project, drone/ngo exist
    const projectExists = await Project.findById(project);
    if (!projectExists) {
      return res.status(404).json({
        message: "Project not found."
      });
    }

    let appointableExists;
    if (appointable_type === 'Drone') {
      appointableExists = await Drone.findById(appointable);
    } else { // NGO
      appointableExists = await NGO.findById(appointable);
    }

    if (!appointableExists) {
      return res.status(404).json({
        message: `${appointable_type} not found.`
      });
    }

    const newAppointment = new Appointment({
      project,
      appointable_type,
      appointable,
      date_of_visit,
    });

    const savedAppointment = await newAppointment.save();

    // Populate the project field to return project details
    const populatedAppointment = await Appointment.findById(savedAppointment._id)
      .populate('project')
      .populate({
        path: 'appointable',
        model: appointable_type
      });

    res.status(201).json({
      message: "Appointment scheduled successfully.",
      appointment: populatedAppointment,
    });
  } catch (error) {
    console.error("Error creating appointment:", error);
    res.status(500).json({
      message: "Server error while creating appointment.",
      error: error.message,
    });
  }
};

// GET /drones/:id/appointments - Get all appointments for a specific drone
export const getDroneAppointments = async (req, res) => {
  try {
    const droneId = req.params.id;

    // Verify drone exists
    const drone = await Drone.findById(droneId);
    if (!drone) {
      return res.status(404).json({
        message: "Drone not found."
      });
    }

    const appointments = await Appointment.find({
      appointable_type: "Drone",
      appointable: droneId
    })
    .populate('project')
    .populate({
      path: 'appointable',
      model: 'Drone'
    });

    res.status(200).json({
      appointments,
    });
  } catch (error) {
    console.error("Error fetching drone appointments:", error);
    res.status(500).json({
      message: "Server error while fetching drone appointments.",
      error: error.message,
    });
  }
};

// GET /ngos/:id/appointments - Get all appointments for a specific NGO
export const getNgoAppointments = async (req, res) => {
  try {
    const ngoId = req.params.id;

    // Verify NGO exists
    const ngo = await NGO.findById(ngoId);
    if (!ngo) {
      return res.status(404).json({
        message: "NGO not found."
      });
    }

    const appointments = await Appointment.find({
      appointable_type: "NGO",
      appointable: ngoId
    })
    .populate('project')
    .populate({
      path: 'appointable',
      model: 'NGO'
    });

    res.status(200).json({
      appointments,
    });
  } catch (error) {
    console.error("Error fetching NGO appointments:", error);
    res.status(500).json({
      message: "Server error while fetching NGO appointments.",
      error: error.message,
    });
  }
};

// PATCH /appointments/:id/verify - Verify a completed appointment
export const verifyAppointment = async (req, res) => {
  try {
    const appointmentId = req.params.id;
    const { remarks, picture_links } = req.body;

    // Find the appointment
    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      return res.status(404).json({
        message: "Appointment not found."
      });
    }

    // Update the appointment status and other fields
    appointment.status = 'verified';
    if (remarks) appointment.remarks = remarks;
    if (picture_links && Array.isArray(picture_links)) appointment.picture_links = picture_links;

    const updatedAppointment = await appointment.save();

    // Check the appointment's appointable_type and update project verification status
    if (appointment.appointable_type === 'Drone') {
      // Update the associated Project's drone_verification_status to 'verified'
      await Project.findByIdAndUpdate(
        appointment.project,
        { drone_verification_status: 'verified' },
        { new: true, runValidators: true }
      );
    } else if (appointment.appointable_type === 'NGO') {
      // Update the associated Project's ngo_verification_status to 'verified'
      await Project.findByIdAndUpdate(
        appointment.project,
        { ngo_verification_status: 'verified' },
        { new: true, runValidators: true }
      );
    }

    // Populate the response
    const populatedAppointment = await Appointment.findById(updatedAppointment._id)
      .populate('project')
      .populate({
        path: 'appointable',
        model: appointment.appointable_type
      });

    res.status(200).json({
      message: "Appointment verified successfully.",
      appointment: populatedAppointment,
    });
  } catch (error) {
    console.error("Error verifying appointment:", error);
    res.status(500).json({
      message: "Server error while verifying appointment.",
      error: error.message,
    });
  }
};

// DELETE /appointments/:id - Delete/cancel an appointment
export const deleteAppointment = async (req, res) => {
  try {
    const appointmentId = req.params.id;

    const deletedAppointment = await Appointment.findByIdAndDelete(appointmentId);

    if (!deletedAppointment) {
      return res.status(404).json({
        message: "Appointment not found."
      });
    }

    res.status(204).send(); // No Content response
  } catch (error) {
    console.error("Error deleting appointment:", error);
    res.status(500).json({
      message: "Server error while deleting appointment.",
      error: error.message,
    });
  }
};