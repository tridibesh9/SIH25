import {
  registerUser,
  loginUser,
  renewToken,
  updatePassword,
  getUserProfile,
  updateUserProfile,
} from "../Controllers/userController.js";
import express from "express";
import authMiddleware from "../middleware/Authmiddleware.js";
import multer from "multer";
const upload = multer({ dest: "uploads/" }); // Temporary storage for uploaded files
const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/renew-token", renewToken);
router.get("/profile", authMiddleware, getUserProfile);
router.put("/profile", authMiddleware, updateUserProfile);
router.put("/profile/password", authMiddleware, updatePassword);

export default router;