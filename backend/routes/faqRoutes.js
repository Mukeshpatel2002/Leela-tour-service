import express from "express";
import {
  getAllFaqs,
  createFaq,
  updateFaq,
  deleteFaq,
} from "../controllers/faqController.js";
import { protectAdmin } from "../middleware/authMiddleware.js";
import { optionalAdmin } from "../middleware/optionalAdmin.js";

const router = express.Router();

router.get("/", optionalAdmin, getAllFaqs);
router.post("/", protectAdmin, createFaq);
router.put("/:id", protectAdmin, updateFaq);
router.delete("/:id", protectAdmin, deleteFaq);

export default router;
