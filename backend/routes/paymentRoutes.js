import express from "express";
import {
  createPayment,
  getUserPayments,
  getPaymentById,
  updatePaymentStatus,
  verifyPayment,
  initiatePhonePePayment,
  handlePhonePeWebhook,
} from "../controllers/paymentController.js";

const router = express.Router();

// Public routes for user payments (no auth required)
router.post("/", createPayment);
router.post("/verify", verifyPayment);
router.post("/phonepe/initiate", initiatePhonePePayment);
router.post("/phonepe/webhook", handlePhonePeWebhook);

// GET /phonepe/initiate returns 405 - route is POST only (fixes "Cannot GET" when hit by browser/health check)
router.get("/phonepe/initiate", (req, res) =>
  res.status(405).json({ message: "Method not allowed. Use POST to initiate payment." })
);

// Debug: confirm payment routes and env are reachable (no auth)
router.get("/status", (req, res) =>
  res.json({
    ok: true,
    phonepe: !!process.env.PHONEPE_CLIENT_ID && !!process.env.PHONEPE_CLIENT_SECRET,
    timestamp: new Date().toISOString(),
  })
);

router.get("/user/:userId", getUserPayments);
router.get("/:id", getPaymentById);
router.put("/:id", updatePaymentStatus);

export default router;
