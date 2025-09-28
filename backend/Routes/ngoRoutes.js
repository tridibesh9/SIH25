import express from "express";
import {
  createNgo,
  getAllNgos,
  getNgoById,
  updateNgo,
} from "../Controllers/ngoController.js";
import authMiddleware from "../middleware/Authmiddleware.js";

const router = express.Router();

// NGO Management Routes
router.post("/", authMiddleware, createNgo); // Create a new NGO
router.get("/", authMiddleware, getAllNgos); // Retrieve all NGOs
router.get("/:id", authMiddleware, getNgoById); // Get a single NGO by ID
router.patch("/:id", authMiddleware, updateNgo); // Update an NGO's details

export default router;