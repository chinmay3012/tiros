import express from "express";
import { 
  createCategory, 
  getAllCategories, 
  updateCategory, 
  deleteCategory,
  addSubcategory,
  updateSubcategory,
  deleteSubcategory
} from "../controllers/categoryController.js";
import { uploadCategory } from "../config/cloudinaryCategory.js";
import { protectAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();

// All category management routes require admin authentication
router.post("/", protectAdmin, uploadCategory.single('image'), createCategory);
router.get("/", protectAdmin, getAllCategories);
router.put("/:id", protectAdmin, uploadCategory.single('image'), updateCategory);
router.delete("/:id", protectAdmin, deleteCategory);

// Subcategory management routes
router.post("/:categoryId/subcategories", protectAdmin, addSubcategory);
router.put("/:categoryId/subcategories/:subcategoryId", protectAdmin, updateSubcategory);
router.delete("/:categoryId/subcategories/:subcategoryId", protectAdmin, deleteSubcategory);

export default router;
