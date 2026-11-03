import express from "express";
import { getContent, updateContent } from "../controllers/contentController.js";
import { protectAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getContent);
router.put("/", protectAdmin, updateContent);

export default router;
