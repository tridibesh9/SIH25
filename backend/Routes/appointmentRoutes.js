import express from "express";
import {
  createAppointment,
  getDroneAppointments,
  getNgoAppointments,
  verifyAppointment,
  deleteAppointment,
} from "../Controllers/appointmentController.js";
import authMiddleware from "../middleware/Authmiddleware.js";

const router = express.Router();

// Appointment Management Routes
router.post("/", authMiddleware, createAppointment); // Schedule an appointment
router.patch("/:id/verify", authMiddleware, verifyAppointment); // Verify a completed appointment
router.delete("/:id", authMiddleware, deleteAppointment); // Delete/cancel an appointment

// Special routes for getting appointments by drone/NGO ID
router.get("/drones/:id/appointments", authMiddleware, getDroneAppointments); // Get all appointments for a specific drone
router.get("/ngos/:id/appointments", authMiddleware, getNgoAppointments); // Get all appointments for a specific NGO

export default router;