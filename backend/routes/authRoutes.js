import express from "express";
import {
  adminLogin,
  adminLogout,
  getAdminProfile,
  updateAdminProfile,
  changeAdminPassword,
  forgotPassword,
  resetPassword,
} from "../controllers/authController.js";
import { protectAdmin } from "../middleware/authMiddleware.js";
import { authLimiter } from "../middleware/rateLimiters.js";

const router = express.Router();

// Public routes
router.post("/login", authLimiter, adminLogin);
router.post("/forgot-password", authLimiter, forgotPassword);
router.post("/reset-password/:token", authLimiter, resetPassword);

// Protected Admin routes
router.get("/me", protectAdmin, getAdminProfile);
router.put("/update-profile", protectAdmin, updateAdminProfile);
router.put("/change-password", protectAdmin, changeAdminPassword);
router.post("/logout", protectAdmin, adminLogout);

export default router;
