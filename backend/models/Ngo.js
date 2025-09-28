import mongoose from "mongoose";

// Define the NGO schema
const ngoSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "NGO name is required."],
      trim: true,
    },
    location: {
      type: String,
      required: [true, "NGO location is required."],
      trim: true,
    },
    volunteer_count: {
      type: Number,
      required: [true, "Volunteer count is required."],
      min: [0, "Volunteer count cannot be negative."],
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
  }
);

// Create and export the NGO model
const NGO = mongoose.model("NGO", ngoSchema);
export default NGO;