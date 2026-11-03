import express from "express";
import {
  createEnquiry,
  getAllEnquiries,
  updateEnquiryStatus,
  deleteEnquiry,
} from "../controllers/enquiryController.js";
import { protectAdmin } from "../middleware/authMiddleware.js";
import { formLimiter } from "../middleware/rateLimiters.js";

const router = express.Router();

router.post("/", formLimiter, createEnquiry);
router.get("/", protectAdmin, getAllEnquiries);
router.put("/:id", protectAdmin, updateEnquiryStatus);
router.delete("/:id", protectAdmin, deleteEnquiry);

export default router;
