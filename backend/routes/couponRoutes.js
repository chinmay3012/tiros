import express from "express";
import {
  createCoupon,
  getAllCoupons,
  getCouponById,
  updateCoupon,
  deleteCoupon,
  validateCoupon,
} from "../controllers/couponController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Admin routes (protected)
router.post("/", protect, createCoupon);
router.get("/", protect, getAllCoupons);
router.get("/:id", protect, getCouponById);
router.put("/:id", protect, updateCoupon);
router.delete("/:id", protect, deleteCoupon);

// Public routes (for users to validate coupons)
router.post("/validate", validateCoupon);

export default router;


