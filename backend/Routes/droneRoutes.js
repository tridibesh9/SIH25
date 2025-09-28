import express from "express";
import {
  createDrone,
  getAllDrones,
  getDroneById,
  updateDrone,
} from "../Controllers/droneController.js";
import authMiddleware from "../middleware/Authmiddleware.js";

const router = express.Router();

// Drone Management Routes
router.post("/", authMiddleware, createDrone); // Create a new drone
router.get("/", authMiddleware, getAllDrones); // Retrieve all drones
router.get("/:id", authMiddleware, getDroneById); // Get a single drone by ID
router.patch("/:id", authMiddleware, updateDrone); // Update a drone's details

export default router;