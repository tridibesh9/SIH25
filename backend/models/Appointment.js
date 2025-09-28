import mongoose from "mongoose";

// Define the appointment schema
const appointmentSchema = new mongoose.Schema(
  {
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      required: [true, "Project ID is required."],
    },
    appointable: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, "Appointable ID is required."],
      refPath: 'appointable_type'
    },
    appointable_type: {
      type: String,
      required: [true, "Appointable type is required."],
      enum: ['Drone', 'NGO'],
    },
    date_of_visit: {
      type: Date,
      required: [true, "Date of visit is required."],
    },
    picture_links: {
      type: [String],
      default: [],
    },
    status: {
      type: String,
      enum: ['pending', 'visited', 'verified'],
      default: 'pending'
    },
    remarks: {
      type: String,
    },
    checklist_data: {
      type: Object, // For flexible NGO checklist data
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
  }
);

// Create and export the Appointment model
const Appointment = mongoose.model("Appointment", appointmentSchema);
export default Appointment;