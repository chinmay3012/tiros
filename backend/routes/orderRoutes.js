import express from "express";
import { 
  getAllOrders, 
  getOrderById, 
  updateOrderStatus 
} from "../controllers/orderController.js";
import { protectAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();

// All order management routes require admin authentication
router.get("/", protectAdmin, getAllOrders);
router.get("/:id", protectAdmin, getOrderById);
router.put("/:id/status", protectAdmin, updateOrderStatus);

export default router;
