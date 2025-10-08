import express from "express";
import {
  createCoupon,
  getAllCoupons,
  getCouponById,
  updateCoupon,
  deleteCoupon,
  validateCoupon,
} from "../controllers/couponController.js";
import { protectAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Admin routes (protected)
router.post("/", protectAdmin, createCoupon);
router.get("/", protectAdmin, getAllCoupons);
router.get("/:id", protectAdmin, getCouponById);
router.put("/:id", protectAdmin, updateCoupon);
router.delete("/:id", protectAdmin, deleteCoupon);

// Public routes (for users to validate coupons)
router.post("/validate", validateCoupon);

export default router;


