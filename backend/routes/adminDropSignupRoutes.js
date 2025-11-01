import express from "express";
import { 
  getAllDropSignups, 
  deleteDropSignup,
  getDropSignupStats 
} from "../controllers/adminDropSignupController.js";
import { protectAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();

// All drop signup management routes require admin authentication
router.get("/", protectAdmin, getAllDropSignups);
router.get("/stats", protectAdmin, getDropSignupStats);
router.delete("/:id", protectAdmin, deleteDropSignup);

export default router;

