import express from "express";
import { 
  createProduct, 
  getAllProducts, 
  getProductById, 
  updateProduct, 
  deleteProduct
} from "../controllers/productController.js";
import { upload } from "../config/cloudinary.js";
import { protectAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();

// All product management routes require admin authentication
router.post("/", protectAdmin, upload.single('image'), createProduct);
router.get("/", protectAdmin, getAllProducts);
router.get("/:id", protectAdmin, getProductById);
router.put("/:id", protectAdmin, upload.single('image'), updateProduct);
router.delete("/:id", protectAdmin, deleteProduct);

export default router;
