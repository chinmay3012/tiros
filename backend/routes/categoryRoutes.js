import express from "express";
import { 
  createCategory, 
  getAllCategories, 
  updateCategory, 
  deleteCategory 
} from "../controllers/categoryController.js";
import { uploadCategory } from "../config/cloudinaryCategory.js";
import { protectAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();

// All category management routes require admin authentication
router.post("/", protectAdmin, uploadCategory.single('image'), createCategory);
router.get("/", protectAdmin, getAllCategories);
router.put("/:id", protectAdmin, uploadCategory.single('image'), updateCategory);
router.delete("/:id", protectAdmin, deleteCategory);

export default router;
