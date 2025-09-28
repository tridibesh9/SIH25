import Drone from "../models/Drone.js";

// POST /drones - Create a new drone
export const createDrone = async (req, res) => {
  try {
    const { model_name, serving_location } = req.body;

    // Validation
    if (!model_name || !serving_location) {
      return res.status(400).json({
        message: "Model name and serving location are required."
      });
    }

    const newDrone = new Drone({
      model_name,
      serving_location,
    });

    const savedDrone = await newDrone.save();

    res.status(201).json({
      message: "Drone created successfully.",
      drone: savedDrone,
    });
  } catch (error) {
    console.error("Error creating drone:", error);
    res.status(500).json({
      message: "Server error while creating drone.",
      error: error.message,
    });
  }
};

// GET /drones - Retrieve all drones
export const getAllDrones = async (req, res) => {
  try {
    const drones = await Drone.find({});
    res.status(200).json({
      drones,
    });
  } catch (error) {
    console.error("Error fetching drones:", error);
    res.status(500).json({
      message: "Server error while fetching drones.",
      error: error.message,
    });
  }
};

// GET /drones/:id - Get details of a single drone
export const getDroneById = async (req, res) => {
  try {
    const droneId = req.params.id;
    const drone = await Drone.findById(droneId);

    if (!drone) {
      return res.status(404).json({
        message: "Drone not found."
      });
    }

    res.status(200).json({
      drone,
    });
  } catch (error) {
    console.error("Error fetching drone:", error);
    res.status(500).json({
      message: "Server error while fetching drone.",
      error: error.message,
    });
  }
};

// PATCH /drones/:id - Update a drone's details
export const updateDrone = async (req, res) => {
  try {
    const droneId = req.params.id;
    const updateData = req.body;

    // Remove fields that should not be updated
    delete updateData._id;
    delete updateData.__v;

    const updatedDrone = await Drone.findByIdAndUpdate(
      droneId,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedDrone) {
      return res.status(404).json({
        message: "Drone not found."
      });
    }

    res.status(200).json({
      message: "Drone updated successfully.",
      drone: updatedDrone,
    });
  } catch (error) {
    console.error("Error updating drone:", error);
    res.status(500).json({
      message: "Server error while updating drone.",
      error: error.message,
    });
  }
};