import express from "express";
import { 
  getLowStockAlerts, 
  updateProductStock 
} from "../controllers/inventoryController.js";
import { protectAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();

// All inventory management routes require admin authentication
router.get("/", protectAdmin, getLowStockAlerts);
router.put("/:productId", protectAdmin, updateProductStock);

export default router;
