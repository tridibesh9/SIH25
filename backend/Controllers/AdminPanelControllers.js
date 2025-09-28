import User from "../models/usermodel.js";
import Project from "../models/projectmodel.js";
import AdminPanel from "../models/admindetailsmodel.js";

// Helper function to ensure admin panel exists
const ensureAdminPanel = async () => {
    let adminPanel = await AdminPanel.findOne();
    if (!adminPanel) {
        adminPanel = await AdminPanel.create({});
    }
    return adminPanel;
};

// Helper function to check if user is admin
const verifyAdmin = async (userId) => {
    // A robust implementation would also check if the user exists
    const user = await User.findOne({id:userId});
    // console.log("Verifying admin for user:", userId, user);
    if (!user || user.role !== 'admin') {
        throw new Error('Unauthorized: Admin access required');
    }
    return user;
};


// Helper function to move project between arrays
const moveProjectBetweenArrays = async (projectId, fromPath, toPath, additionalData = {}) => {
    const adminPanel = await ensureAdminPanel();
    
    // Using reduce to safely access nested properties
    const fromArray = fromPath.split('.').reduce((obj, key) => obj && obj[key], adminPanel);
    if (!fromArray) throw new Error(`Invalid source path: ${fromPath}`);

    const projectIndex = fromArray.findIndex(p => p.projectId === projectId);
    
    if (projectIndex === -1) {
        throw new Error(`Project ${projectId} not found in ${fromPath}`);
    }
    
    fromArray.splice(projectIndex, 1);
    
    // Using reduce to safely access nested properties
    const toArray = toPath.split('.').reduce((obj, key) => obj && obj[key], adminPanel);
    if (!toArray) throw new Error(`Invalid destination path: ${toPath}`);

    toArray.push({
        projectId,
        ...additionalData
    });
    
    await adminPanel.save();
    return adminPanel;
};

// 1. Get all pending projects
export const getAllPendingProjects = async (req, res) => {
    try {
        await verifyAdmin(req.userId); // Admin check
        const adminPanel = await ensureAdminPanel();
        
        const pendingProjectIds = adminPanel.pending.map(p => p.projectId);
        const projects = await Project.find({ 
            projectId: { $in: pendingProjectIds } 
        });
        
        const pendingProjectsWithDetails = adminPanel.pending.map(pendingItem => {
            const project = projects.find(p => p.projectId === pendingItem.projectId);
            return {
                ...pendingItem.toObject(),
                projectDetails: project
            };
        });
        
        res.status(200).json({
            success: true,
            count: pendingProjectsWithDetails.length,
            data: pendingProjectsWithDetails
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// 2. Move project from pending to land approval
export const movePendingToLandApproval = async (req, res) => {
    try {
        await verifyAdmin(req.userId); // Admin check
        const { projectId, message = "Moved to land approval stage" } = req.body;
        
        if (!projectId) {
            return res.status(400).json({ success: false, message: "Project ID is required" });
        }
        
        const project = await Project.findOneAndUpdate(
            { projectId },
            { verificationStatus: "land approval" },
            { new: true }
        );
        
        if (!project) {
            return res.status(404).json({ success: false, message: "Project not found" });
        }
        
        await moveProjectBetweenArrays(projectId, 'pending', 'landApproval', { message });
        
        res.status(200).json({
            success: true,
            message: "Project moved to land approval",
            data: project
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// // 3. Move project from land approval to NGO assigning
// export const moveLandApprovalToNgoAssigning = async (req, res) => {
//     try {
//         await verifyAdmin(req.userId); // Admin check
//         const { projectId, message = "Awaiting NGO assignment" } = req.body;
        
//         if (!projectId) {
//             return res.status(400).json({ success: false, message: "Project ID is required" });
//         }
        
//         const project = await Project.findOneAndUpdate(
//             { projectId },
//             { verificationStatus: "ngo" },
//             { new: true }
//         );
        
//         if (!project) {
//             return res.status(404).json({ success: false, message: "Project not found" });
//         }
        
//         await moveProjectBetweenArrays(projectId, 'landApproval', 'ngoApproval.assigning', { message });
        
//         res.status(200).json({
//             success: true,
//             message: "Project moved to NGO assigning",
//             data: project
//         });
//     } catch (error) {
//         res.status(500).json({ success: false, message: error.message });
//     }
// };

// 4. Assign NGO to project
export const assignNgoToProject = async (req, res) => {
    try {
        await verifyAdmin(req.userId); // Admin check
        const { projectId, ngoUserId, message = "NGO assigned for verification" } = req.body;
        
        if (!projectId || !ngoUserId) {
            return res.status(400).json({ success: false, message: "Project ID and NGO User ID are required" });
        }
        
        const adminPanel = await ensureAdminPanel();
        
        const assigningIndex = adminPanel.landApproval.findIndex(p => p.projectId === projectId);
        
        if (assigningIndex === -1) {
            return res.status(404).json({ success: false, message: "Project not found in NGO assigning queue" });
        }
        
        adminPanel.landApproval.splice(assigningIndex, 1);
        
        adminPanel.ngoApproval.ngoAssigned.push({ projectId, ngoUserId, message });
        
        await adminPanel.save();
        
        res.status(200).json({
            success: true,
            message: "NGO assigned successfully",
            data: { projectId, ngoUserId }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// 5. Move from NGO approval to drone verification assigning
export const moveNgoToDroneAssigning = async (req, res) => {
    try {
        await verifyAdmin(req.userId); // Admin check
        const { projectId, message = "Awaiting drone verification assignment" } = req.body;
        
        if (!projectId) {
            return res.status(400).json({ success: false, message: "Project ID is required" });
        }
        
        const project = await Project.findOneAndUpdate(
            { projectId },
            { verificationStatus: "drones" },
            { new: true }
        );
        
        if (!project) {
            return res.status(404).json({ success: false, message: "Project not found" });
        }
        
        const adminPanel = await ensureAdminPanel();
        
        const ngoIndex = adminPanel.ngoApproval.ngoAssigned.findIndex(p => p.projectId === projectId);
        
        if (ngoIndex === -1) {
            return res.status(404).json({ success: false, message: "Project not found in NGO assigned" });
        }
        
        adminPanel.ngoApproval.ngoAssigned.splice(ngoIndex, 1);
        
        adminPanel.droneVerification.assigning.push({ projectId, message });
        
        await adminPanel.save();
        
        res.status(200).json({
            success: true,
            message: "Project moved to drone verification assigning",
            data: project
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// 6. Assign drone operator to project
export const assignDroneToProject = async (req, res) => {
    try {
        await verifyAdmin(req.userId); // Admin check
        const { projectId, droneUserId, message = "Drone operator assigned" } = req.body;
        
        if (!projectId || !droneUserId) {
            return res.status(400).json({ success: false, message: "Project ID and Drone User ID are required" });
        }
        
        const adminPanel = await ensureAdminPanel();
        
        const assigningIndex = adminPanel.droneVerification.assigning.findIndex(p => p.projectId === projectId);
        
        if (assigningIndex === -1) {
            return res.status(404).json({ success: false, message: "Project not found in drone assigning queue" });
        }
        
        adminPanel.droneVerification.assigning.splice(assigningIndex, 1);
        
        adminPanel.droneVerification.droneAssigned.push({ projectId, droneUserId, message });
        
        await adminPanel.save();
        
        res.status(200).json({
            success: true,
            message: "Drone operator assigned successfully",
            data: { projectId, droneUserId }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// 7. Move from drone verification to admin approval
export const moveDroneToAdminApproval = async (req, res) => {
    try {
        await verifyAdmin(req.userId); // Admin check
        const { projectId, message = "Awaiting admin approval" } = req.body;
        
        if (!projectId) {
            return res.status(400).json({ success: false, message: "Project ID is required" });
        }
        
        const project = await Project.findOneAndUpdate(
            { projectId },
            { verificationStatus: "admin approval pending" },
            { new: true }
        );
        
        if (!project) {
            return res.status(404).json({ success: false, message: "Project not found" });
        }
        
        const adminPanel = await ensureAdminPanel();
        
        const droneIndex = adminPanel.droneVerification.droneAssigned.findIndex(p => p.projectId === projectId);
        
        if (droneIndex === -1) {
            return res.status(404).json({ success: false, message: "Project not found in drone assigned" });
        }
        
        adminPanel.droneVerification.droneAssigned.splice(droneIndex, 1);
        
        adminPanel.adminApproval.push({ projectId, message });
        
        await adminPanel.save();
        
        res.status(200).json({
            success: true,
            message: "Project moved to admin approval",
            data: project
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// 8. Admin can change project status (admin approval pending to any status)
export const adminChangeProjectStatus = async (req, res) => {
    try {
        const { projectId, newStatus, message } = req.body;
        await verifyAdmin(req.userId); // Admin check
        
        if (!projectId || !newStatus || !message) {
            return res.status(400).json({ success: false, message: "Project ID, new status, and reason message are required" });
        }
        
        const validStatuses = ["land approval", "ngo", "drones"];
        if (!validStatuses.includes(newStatus)) {
            return res.status(400).json({ success: false, message: "Invalid status" });
        }
        
        const project = await Project.findOne({ projectId });
        if (!project) {
            return res.status(404).json({ success: false, message: "Project not found" });
        }
        
        const adminPanel = await ensureAdminPanel();
        const adminApprovalIndex = adminPanel.adminApproval.findIndex(p => p.projectId === projectId);
        
        if (adminApprovalIndex === -1) {
            return res.status(400).json({ success: false, message: "Project not in admin approval stage" });
        }
        
        adminPanel.adminApproval.splice(adminApprovalIndex, 1);
        
        switch (newStatus) {
            case "land approval": adminPanel.pending.push({ projectId, message }); break;
            case "ngo": adminPanel.landApproval.push({ projectId, message }); break;
            case "drones": adminPanel.ngoApproval.assigning.push({ projectId, message }); break;
        }
        
        await adminPanel.save();
        
        project.verificationStatus = newStatus;
        await project.save();
        
        res.status(200).json({
            success: true,
            message: `Project status changed to ${newStatus}`,
            data: project,
            reason: message
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// 9. Admin reject project
export const adminRejectProject = async (req, res) => {
    try {
        const { projectId, message } = req.body;
        await verifyAdmin(req.userId); // Admin check
        
        if (!projectId || !message) {
            return res.status(400).json({ success: false, message: "Project ID and rejection reason are required" });
        }
        
        const project = await Project.findOneAndUpdate(
            { projectId },
            { verificationStatus: "rejected" },
            { new: true }
        );
        
        if (!project) {
            return res.status(404).json({ success: false, message: "Project not found" });
        }
        
        const adminPanel = await ensureAdminPanel();
        
        const locations = ['pending', 'landApproval', 'ngoApproval.assigning', 'ngoApproval.ngoAssigned', 'droneVerification.assigning', 'droneVerification.droneAssigned', 'adminApproval'];
        
        for (const location of locations) {
            const array = location.split('.').reduce((obj, key) => obj && obj[key], adminPanel);
            if (array) {
                const index = array.findIndex(p => p.projectId === projectId);
                if (index !== -1) {
                    array.splice(index, 1);
                    break;
                }
            }
        }
        
        adminPanel.rejected.push({ projectId, message });
        await adminPanel.save();
        
        res.status(200).json({
            success: true,
            message: "Project rejected",
            data: project,
            reason: message
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// 10. Admin approve project (final approval)
export const adminApproveProject = async (req, res) => {
    try {
        const { projectId, message = "Project approved", carbonCredits} = req.body;
        await verifyAdmin(req.userId); // Admin check
        
        if (!projectId) {
            return res.status(400).json({ success: false, message: "Project ID is required" });
        }
        
        const project = await Project.findOne({ projectId });
        if (!project) {
            return res.status(404).json({ message: "Project not found." });
        }
        project.carbonCredits = carbonCredits;
        project.verificationStatus = "approved";
        await project.save();
        
        if (!project) {
            return res.status(404).json({ success: false, message: "Project not found" });
        }
        
        await moveProjectBetweenArrays(projectId, 'adminApproval', 'accepted', { message });
        
        res.status(200).json({
            success: true,
            message: "Project approved successfully",
            data: project
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// 11. Get all projects by status
export const getProjectsByStatus = async (req, res) => {
    try {
        await verifyAdmin(req.userId); // Admin check
        const { status } = req.params;
        const adminPanel = await ensureAdminPanel();
        
        let projectPointers = [];
        
        switch (status) {
            case 'pending': projectPointers = adminPanel.pending; break;
            case 'landApproval': projectPointers = adminPanel.landApproval; break;
            case 'ngoAssigned': projectPointers = adminPanel.ngoApproval.ngoAssigned; break;
            case 'droneAssigning': projectPointers = adminPanel.droneVerification.assigning; break;
            case 'droneAssigned': projectPointers = adminPanel.droneVerification.droneAssigned; break;
            case 'adminApproval': projectPointers = adminPanel.adminApproval; break;
            case 'accepted': projectPointers = adminPanel.accepted; break;
            case 'rejected': projectPointers = adminPanel.rejected; break;
            default: return res.status(400).json({ success: false, message: "Invalid status" });
        }

        const projectIds = projectPointers.map(p => p.projectId);
        let projects = [];
        if (projectIds.length > 0) {
            projects = await Project.find({ projectId: { $in: projectIds } });
        }
        
        res.status(200).json({
            success: true,
            count: projects.length,
            data: projects
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// 12. Get complete admin panel overview
export const getAdminPanelOverview = async (req, res) => {
    try {
        await verifyAdmin(req.userId); // Admin check
        const adminPanel = await ensureAdminPanel();
        
        const overview = {
            pending: adminPanel.pending.length,
            landApproval: adminPanel.landApproval.length,
            ngoAssigned: adminPanel.ngoApproval.ngoAssigned.length,
            droneAssigning: adminPanel.droneVerification.assigning.length,
            droneAssigned: adminPanel.droneVerification.droneAssigned.length,
            adminApproval: adminPanel.adminApproval.length,
            accepted: adminPanel.accepted.length,
            rejected: adminPanel.rejected.length,
        };
        
        const total = Object.values(overview).reduce((sum, count) => sum + count, 0);
        
        res.status(200).json({
            success: true,
            data: { ...overview, total }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};