// adminPanelRoutes.js
import express from 'express';
import {
    getAllPendingProjects,
    movePendingToLandApproval,
    assignNgoToProject,
    moveNgoToDroneAssigning,
    assignDroneToProject,
    moveDroneToAdminApproval,
    adminChangeProjectStatus,
    adminRejectProject,
    adminApproveProject,
    getProjectsByStatus,
    getAdminPanelOverview
} from '../Controllers/AdminPanelControllers.js';

// Assuming you have an auth middleware
import authMiddleware from '../middleware/Authmiddleware.js';

const router = express.Router();

// Get all pending projects
router.get('/pending', authMiddleware, getAllPendingProjects);

// Get projects by specific status
router.get('/projects/:status', authMiddleware, getProjectsByStatus);

// Get admin panel overview (counts for each status)
router.get('/overview', authMiddleware, getAdminPanelOverview);

// ==================== Workflow Progression Routes ====================

// Move project from pending to land approval
router.post('/pending-to-land-approval', authMiddleware, movePendingToLandApproval);

// Step 2: Land Approval -> NGO Assigned (NEW simplified route)
router.post('/move/assign-ngo', authMiddleware, assignNgoToProject);

// Move project from NGO to drone assigning
router.post('/ngo-to-drone-assigning', authMiddleware, moveNgoToDroneAssigning);

// Assign drone operator to a project
router.post('/assign-drone', authMiddleware, assignDroneToProject);

// Move project from drone verification to admin approval
router.post('/drone-to-admin-approval', authMiddleware, moveDroneToAdminApproval);

// ==================== Admin Only Routes ====================

// Admin can change project status (requires admin role)
router.post('/change-status', authMiddleware, adminChangeProjectStatus);

// Admin reject project
router.post('/reject', authMiddleware, adminRejectProject);

// Admin approve project (final approval)
router.post('/approve', authMiddleware, adminApproveProject);

export default router;