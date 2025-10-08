import Project from "../models/projectmodel.js"; 
import User from "../models/usermodel.js";
import {uploadJsonToPinata} from "./pinataUpload.js";
import axios from 'axios';
import { generateAndUploadCertificate } from '../certificate/certificateService.js'; // Import the new function
import AdminPanel from "../models/admindetailsmodel.js";

export const fetchProjectsForUser = async (userId, projectIds) => {
    try {
        if (!projectIds || projectIds.length === 0) {
            return [];
        }

        const projects = await Project.find(
            {

                projectId: { $in: projectIds },
                ownerId: userId
            },
            {
                projectId: 1,
                projectName: 1,
                owner: 1,
                email: 1,
                location: 1,
                contactNumber: 1,
                siteDescription: 1,
                type: 1,
                projectImages: 1,
                landDocuments: 1,
                verificationStatus: 1,
                carbonCredits: 1,

            }
        );

        return projects;
    } catch (error) {
        // Log the error for debugging and throw a new error to be handled by the caller.
        console.error("Error fetching projects for user:", error);
        throw new Error("Could not retrieve project information.");
    }
};

export const getAllProjectsOfUser = async (req, res) => {
    try{
        const user = await User.findOne({id: req.userId});
        if(!user){
            return res.status(404).json({message: "User not found."});
        }
        const projects = await fetchProjectsForUser(req.userId, user.projects);
        res.status(200).json({projects});
    } catch (error) {
        res.status(500).json({message: "Server error while fetching projects.", error: error.message});

    }
};

// You should have this helper function available in your controller file
const ensureAdminPanel = async () => {
    let adminPanel = await AdminPanel.findOne();
    if (!adminPanel) {
        // If it's the very first project, create the admin panel document
        adminPanel = await AdminPanel.create({});
    }
    return adminPanel;
};

export const registerProject = async (req, res) => {
    try {
        const {
            projectName,
            owner,
            email,
            location,
            contactNumber,
            type,
            siteDescription,
            landDocuments,
            projectImages,
        } = req.body;
        const userId = req.userId; // Extracted from auth middleware
        
        // Basic validation
        if (!projectName || !owner || !email || !landDocuments || !projectImages) {
            return res.status(400).json({ message: "Please provide all required fields." });
        }

        // Validate location field - it can be either a string description or GeoJSON
        let locationData = location;
        if (typeof location === 'string') {
            try {
                // Try to parse as JSON (GeoJSON case)
                const parsedLocation = JSON.parse(location);
                if (parsedLocation.type === 'Feature' && parsedLocation.geometry) {
                    // Valid GeoJSON, keep it as string in database
                    locationData = location;
                }
            } catch (e) {
                // Not JSON, treat as regular string description
                locationData = location;
            }
        }

        // Create new project instance
        const newProject = new Project({
            projectName,
            owner,
            email,
            location: locationData,
            contactNumber,
            type,
            siteDescription,
            landDocuments,
            projectImages,
            ownerId: userId,
        });

        const savedProject = await newProject.save();

        // Link project to user
        await User.findOneAndUpdate(
            { id: userId },
            { $push: { projects: savedProject.projectId } }
        );

        const adminPanel = await ensureAdminPanel();
        adminPanel.pending.push({
            projectId: savedProject.projectId,
            message: "New project submitted for land verification."
        });
        await adminPanel.save();

        res.status(201).json({
            message: "Project registered successfully. Awaiting verification.",
            project: savedProject,
        });

    } catch (error) {
        res.status(500).json({ message: "Server error during project registration.", error: error.message });
    }
};


export const updateSiteVerification = async (req, res) => {
    try {
        const { projectId } = req.params;
        const verificationDetails = req.body; // e.g., { role: "ngo", reportUrl: "...", findings: "..." }

        if (!projectId || Object.keys(verificationDetails).length === 0) {
            return res.status(400).json({ message: "Project ID and verification details are required." });
        }

        // Find the project by its custom projectId and update the siteVerification field
        const updatedProject = await Project.findOneAndUpdate(
            { projectId },
            { siteVerification: verificationDetails },
            { new: true, runValidators: true } 
        );

        if (!updatedProject) {
            return res.status(404).json({ message: "Project not found." });
        }

        res.status(200).json({
            message: "Site verification details updated successfully.",
            project: updatedProject,
        });

    } catch (error) {
        res.status(500).json({ message: "Server error while updating site verification.", error: error.message });
    }
};

export const updateDroneSurvey = async (req, res) => {
    try {
        const { projectId } = req.params;
        const surveyDetails = req.body; // e.g., { status: "completed", surveyUrl: "...", analysis: "..." }
        if (!projectId || Object.keys(surveyDetails).length === 0) {
            return res.status(400).json({ message: "Project ID and survey details are required." });
        }
        // Find the project by its custom projectId and update the droneSurvey field
        const updatedProject = await Project.findOneAndUpdate(
            { projectId },
            { droneSurvey: surveyDetails },
            { new: true, runValidators: true }
        );  
        if (!updatedProject) {
            return res.status(404).json({ message: "Project not found." });
        }
        res.status(200).json({
            message: "Drone survey details updated successfully.",

            project: updatedProject,
        });
    }
    catch (error) {
        res.status(500).json({ message: "Server error while updating drone survey.", error: error.message });
    }
};



export const updateVerificationStatus = async (req, res) => {
    try {
        const { projectId } = req.params;
        const { status } = req.body; // e.g., { "status": "approved" }

        if (!status) {
            return res.status(400).json({ message: "Verification status is required." });
        }
        const userId = req.userId;
        const user = await User.findOne({id: userId});
        if(!user || user.role !== "admin"){
            return res.status(403).json({message: "Only admins can update verification status."});
        }
        // The 'enum' in your schema will automatically validate if the status is a valid value
        const updatedProject = await Project.findOneAndUpdate(
            { projectId },
            { verificationStatus: status },
            { new: true, runValidators: true } // Return the updated doc and run schema validators
        );

        if (!updatedProject) {
            return res.status(404).json({ message: "Project not found." });
        }

        res.status(200).json({
            message: `Project status updated to '${status}'.`,
            project: updatedProject,
        });

    } catch (error) {
        res.status(500).json({ message: "Server error while updating status.", error: error.message });
    }
};

export const updateCarbonCreditsAndApprove = async (req,res) => {
    try {

        const { projectId } = req.params;
        const { carbonCredits } = req.body; // e.g., { "status": "approved" }
        if (!projectId || typeof carbonCredits !== 'number' || carbonCredits <= 0) {
            throw new Error("Valid project ID and positive credits to add are required.");
        }
        const userId = req.userId;
        const user = await User.findOne({id: userId});
        if(!user || user.role !== "admin"){
            return res.status(403).json({message: "Only admins can update carbon credits."});
        }
        const project = await Project.findOne({ projectId });
        if (!project) {
            return res.status(404).json({ message: "Project not found." });
        }
        project.carbonCredits = carbonCredits;
        project.verificationStatus = "approved";
        await project.save();
        res.status(200).json({
            message: `Added ${carbonCredits} carbon credits and approved the project.`,
            project,
        });
    } catch (error) {
        res.status(500).json({ message: "Server error while updating carbon credits.", error: error.message });
    }
}


export const RegisterProjectToChain = async (req, res) => {
    try {
        const { projectId} = req.body;
        if (!projectId) {
            return res.status(400).json({ message: "Project ID is required." });
        }
        const project = await Project.findOne({ projectId });
        if (!project) {
            return res.status(404).json({ message: "Project not found." });
        }
        if (project.verificationStatus !== "approved") {
            return res.status(400).json({ message: "Only approved projects can be registered on-chain." });
        }

        // Prepare metadata for IPFS
        const metadata = {
            projectId: project.projectId,
            projectName: project.projectName,
            owner: project.owner,
            email: project.email,
            location: project.location,
            contactNumber: project.contactNumber,
            type: project.type,
            siteDescription: project.siteDescription,
            landDocuments: project.landDocuments,
            projectImages: project.projectImages,
            carbonCredits: project.carbonCredits,
        };
        // Upload metadata to Pinata
        const ipfsHash = await uploadJsonToPinata(metadata);
        res.status(200).json({
            message: "Project registered on-chain successfully.",
            ipfsHash,
        });
    }
    catch (error) {
        res.status(500).json({ message: "Server error while registering project on-chain.", error: error.message });
    }
};



export const RetireProject = async (req, res) => {
    try {
        // 1. Destructure the payload from the request body
        const {
            projectId,
            externalId,
            projectName,
            quantityRetired,
            retiredByAddress,
            transactionHash,
            DocumentCID,
            retiredAt,
        } = req.body;
        console.log(req.body);
        // 2. Validate the project
        const project = await Project.findOne({ projectId: externalId });
        if (!project) {
            return res.status(404).json({ message: "Project not found." });
        }
        if (project.verificationStatus !== "approved") {
            return res.status(400).json({ message: "Only approved projects can be retired." });
        }

        const retirementDetails = {
            projectId,
            externalId,
            projectName,
            quantityRetired,
            retiredByAddress,
            transactionHash,
            retiredAt,
        };

        // 3. Fetch original project metadata from Pinata
        const metadataUrl = `https://gateway.pinata.cloud/ipfs/${DocumentCID}`;
        const response = await axios.get(metadataUrl);
        const originalMetadata = response.data;


        // 4. Call the certificate service to generate and upload the PDF
        // The `retirementDetails` object (containing quantityRetired, retiredByAddress, etc.)
        // and the fetched metadata are passed to the service.
        console.log(retirementDetails, originalMetadata);
        const certificateCID = await generateAndUploadCertificate(retirementDetails, originalMetadata);

        // // 5. (Optional) Save the certificate CID to your database if needed
        // console.log(`Certificate created with CID: ${certificateCID}`);

        // 6. Send the final success response
        res.status(200).json({
            message: "Project retired and certificate generated successfully.",
            certificateCID,
            certificateUrl: `https://gateway.pinata.cloud/ipfs/${certificateCID}`

        });

    } catch (error) {
        console.error("Error processing project retirement:", error.response?.data || error.message);
        res.status(500).json({ message: "An internal server error occurred.", error: error.message });
    }
};