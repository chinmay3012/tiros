import express from "express";
import { 
  createPayment, 
  getUserPayments, 
  getPaymentById, 
  updatePaymentStatus 
} from "../controllers/paymentController.js";

const router = express.Router();

// Public routes for user payments
router.post("/", createPayment);
router.get("/user/:userId", getUserPayments);
router.get("/:id", getPaymentById);
router.put("/:id", updatePaymentStatus);

export default router;
