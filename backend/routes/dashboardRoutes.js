import express from "express";
import { 
  getDashboardSummary, 
  getSalesReport, 
  getUsersReport 
} from "../controllers/dashboardController.js";
import { protectAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();

// All dashboard routes require admin authentication
router.get("/summary", protectAdmin, getDashboardSummary);
router.get("/sales-report", protectAdmin, getSalesReport);
router.get("/users-report", protectAdmin, getUsersReport);

export default router;
