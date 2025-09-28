import mongoose from "mongoose";

// Define the drone schema
const droneSchema = new mongoose.Schema(
  {
    model_name: {
      type: String,
      required: [true, "Model name is required."],
      trim: true,
    },
    serving_location: {
      type: String,
      required: [true, "Serving location is required."],
      trim: true,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
  }
);

// Create and export the Drone model
const Drone = mongoose.model("Drone", droneSchema);
export default Drone;