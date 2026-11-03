import express from "express";
import {
  getAllReviews,
  submitPublicReview,
  approveReview,
  createReview,
  updateReview,
  deleteReview,
} from "../controllers/reviewController.js";
import { protectAdmin } from "../middleware/authMiddleware.js";
import { optionalAdmin } from "../middleware/optionalAdmin.js";
import { formLimiter } from "../middleware/rateLimiters.js";

const router = express.Router();

router.get("/", optionalAdmin, getAllReviews);
router.post("/submit", formLimiter, submitPublicReview); // Public review submission

// Admin protected routes
router.post("/", protectAdmin, createReview);
router.put("/:id/approve", protectAdmin, approveReview);
router.put("/:id", protectAdmin, updateReview);
router.delete("/:id", protectAdmin, deleteReview);

export default router;
