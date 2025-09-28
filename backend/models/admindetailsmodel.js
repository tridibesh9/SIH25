import mongoose from "mongoose";

const adminPanelSchema = new mongoose.Schema(
    {
        pending: {
            type: [
            {
                projectId: { type: String, required: true },
                message: { type: String, required: true }
            }
            ],
            default: []
        },
        ngoApproval: {
            ngoAssigned: {
            type: [
                {
                projectId: { type: String, required: true },
                ngoUserId: { type: String, required: true },
                message: { type: String, required: true }
                }
            ],
            default: []
            }
        },
        landApproval: {
            type: [
            {
                projectId: { type: String, required: true },
                message: { type: String, required: true }
            }
            ],
            default: []
        },
        droneVerification: {
            assigning: {
            type: [
                {
                projectId: { type: String, required: true },
                message: { type: String, required: true }
                }
            ],
            default: []
            },
            droneAssigned: {
            type: [
                {
                projectId: { type: String, required: true },
                droneUserId: { type: String, required: true },
                message: { type: String, required: true }
                }
            ],
            default: []
            }
        },
        adminApproval: {
            type: [
            {
                projectId: { type: String, required: true },
                message: { type: String, required: true }
            }
            ],
            default: []
        },
        accepted: {
            type: [
            {
                projectId: { type: String, required: true },
                message: { type: String, required: true }
            }
            ],
            default: []
        },
        rejected: {
            type: [
            {
                projectId: { type: String, required: true },
                message: { type: String, required: true }
            }
            ],
            default: []
        }
    },
    {
    timestamps: true,
    collection: "adminPanel",
  }
);

export default mongoose.model("AdminPanel", adminPanelSchema);
