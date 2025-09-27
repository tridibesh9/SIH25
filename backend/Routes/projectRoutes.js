import express from "express";
import {
    registerProject,
    updateSiteVerification,
    updateVerificationStatus,
    updateDroneSurvey,
    getAllProjectsOfUser,
    updateCarbonCreditsAndApprove,
    RegisterProjectToChain,
    RetireProject,
} from "../Controllers/projectController.js"; // Adjust path

// Import the new controllers and middleware
import { imageUpload } from "../Controllers/imageUpload.js";
import { documentUpload } from "../Controllers/DocumentUpload.js";
import {
    uploadProjectImages,
    uploadProjectDocument
} from "../middleware/uploadMiddleware.js";
import authMiddleware from "../middleware/Authmiddleware.js";

const router = express.Router();

// Route to register a new project
router.post("/register", authMiddleware, registerProject);

router.get("/userprojects", authMiddleware, getAllProjectsOfUser);

// Route to update site verification details
router.patch("/:projectId/site-verification", authMiddleware, updateSiteVerification);

// Route for an admin to update the overall verification status
router.patch("/:projectId/status", authMiddleware, updateVerificationStatus);

// Route to update drone survey details
router.patch("/:projectId/drone-survey", authMiddleware, updateDroneSurvey);

//Route to approve and set carbon credits on blockchain
router.post("/:projectId/approve", authMiddleware, updateCarbonCreditsAndApprove);

//Route for uploading metadata to IPFS via Pinata
router.post("/upload-metadata", authMiddleware, RegisterProjectToChain);


//Route for genertaing NFT certificate and uploading to IPFS via Pinata
router.post("/retireproject", RetireProject);

// Route for uploading 1 to 3 project images
// The form field name must be 'projectImages'
router.post(
    "/upload-images",
    authMiddleware,
    uploadProjectImages,
    imageUpload
);



// Route for uploading a single project document (PDF)
// The form field name must be 'projectDocument'
router.post(
    "/upload-document",
    authMiddleware,
    uploadProjectDocument,
    documentUpload
);


export default router;
