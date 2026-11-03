import express from "express";
import {
  getAllTours,
  getTourCategories,
  getTourById,
  createTour,
  updateTour,
  updateTourGallery,
  deleteTour,
} from "../controllers/tourController.js";
import { protectAdmin } from "../middleware/authMiddleware.js";
import { optionalAdmin } from "../middleware/optionalAdmin.js";

const router = express.Router();

router.get("/", optionalAdmin, getAllTours);
router.get("/categories", getTourCategories);
router.get("/:id", optionalAdmin, getTourById);

// Admin protected routes
router.post("/", protectAdmin, createTour);
router.put("/:id", protectAdmin, updateTour);
router.put("/:id/gallery", protectAdmin, updateTourGallery);
router.delete("/:id", protectAdmin, deleteTour);

export default router;
