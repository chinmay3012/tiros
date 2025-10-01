import Payment from "../models/payment.js";
import Order from "../models/order.js";
import Product from "../models/product.js";

// @desc   Create payment receipt
// @route  POST /api/payments
export const createPayment = async (req, res) => {
  try {
    const { userId, orderId, paymentId, amount, status, method, items, shippingAddress } = req.body;
    
    if (!userId || !orderId || !paymentId || !amount) {
      return res.status(400).json({ message: "userId, orderId, paymentId, and amount are required" });
    }

    // Generate receipt number
    const receipt = `RCP-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    const payment = await Payment.create({
      userId,
      orderId,
      paymentId,
      amount,
      status: status || "paid",
      method: method || "razorpay",
      receipt,
      items: items || [],
      shippingAddress: shippingAddress || "N/A",
    });

    res.status(201).json(payment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Get user payments
// @route  GET /api/payments/user/:userId
export const getUserPayments = async (req, res) => {
  try {
    const { userId } = req.params;
    
    const payments = await Payment.find({ userId })
      .populate("orderId", "status totalAmount")
      .sort({ createdAt: -1 });

    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Get payment receipt by ID
// @route  GET /api/payments/:id
export const getPaymentById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const payment = await Payment.findById(id)
      .populate("userId", "name email")
      .populate("orderId", "status totalAmount");

    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }

    res.json(payment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Update payment status
// @route  PUT /api/payments/:id
export const updatePaymentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    const payment = await Payment.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }

    res.json(payment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Verify Razorpay payment
// @route  POST /api/payments/verify
export const verifyPayment = async (req, res) => {
  try {
    const { paymentId, orderId, signature } = req.body;
    
    if (!paymentId || !orderId || !signature) {
      return res.status(400).json({ message: "paymentId, orderId, and signature are required" });
    }

    // In a real application, you would verify the signature with Razorpay
    // For now, we'll just check if the payment exists in our database
    const payment = await Payment.findOne({ paymentId });
    
    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }

    if (payment.status === 'paid') {
      res.json({ 
        verified: true, 
        payment,
        message: "Payment verified successfully" 
      });
    } else {
      res.json({ 
        verified: false, 
        payment,
        message: "Payment not completed" 
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
