import express from "express";
import { 
  createProduct, 
  getAllProducts, 
  getProductById, 
  updateProduct, 
  deleteProduct,
  upload
} from "../controllers/productController.js";
import { protectAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();

// All product management routes require admin authentication
router.post("/", protectAdmin, upload.single('image'), createProduct);
router.get("/", protectAdmin, getAllProducts);
router.get("/:id", protectAdmin, getProductById);
router.put("/:id", protectAdmin, upload.single('image'), updateProduct);
router.delete("/:id", protectAdmin, deleteProduct);

export default router;
