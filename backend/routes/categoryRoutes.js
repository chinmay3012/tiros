import express from "express";
import { 
  createCategory, 
  getAllCategories, 
  updateCategory, 
  deleteCategory 
} from "../controllers/categoryController.js";
import { protectAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();

// All category management routes require admin authentication
router.post("/", protectAdmin, createCategory);
router.get("/", protectAdmin, getAllCategories);
router.put("/:id", protectAdmin, updateCategory);
router.delete("/:id", protectAdmin, deleteCategory);

export default router;
