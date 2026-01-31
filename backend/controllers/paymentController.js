import Payment from "../models/payment.js";
import Order from "../models/order.js";
import Product from "../models/product.js";
import { phonepeClient } from "../config/phonepeClient.js";
import { StandardCheckoutPayRequest } from "pg-sdk-node";

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
      method,
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

// @desc   Initiate PhonePe payment (redirect-only; no DB writes, no order creation)
// @route  POST /api/payments/phonepe/initiate
// Returns only the redirect URL from PhonePe. Caller redirects user to that URL.
export const initiatePhonePePayment = async (req, res) => {
  try {
    const { amount, amountInPaisa } = req.body;
    const amountPaisa = amountInPaisa != null ? Number(amountInPaisa) : (amount != null ? Number(amount) * 100 : 0);
    if (!amountPaisa || amountPaisa < 100) {
      return res.status(400).json({ message: "amount (INR) or amountInPaisa is required and must be at least 1 INR / 100 paisa" });
    }

    const merchantOrderId = `TX-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`.replace(/\./g, "-");

    if (!phonepeClient.pay) {
      return res.status(503).json({ message: "PhonePe payment is not configured. Set PHONEPE_CLIENT_ID and PHONEPE_CLIENT_SECRET." });
    }

    const baseRedirect = req.body.redirectUrl || process.env.PHONEPE_REDIRECT_URL || "https://topshot.co/checkout/return";
    const redirectUrl = `${baseRedirect}${baseRedirect.includes("?") ? "&" : "?"}merchantOrderId=${merchantOrderId}`;

    const request = StandardCheckoutPayRequest.builder()
      .merchantOrderId(merchantOrderId)
      .amount(amountPaisa)
      .redirectUrl(redirectUrl)
      .build();

    const response = await phonepeClient.pay(request);

    res.json({
      redirectUrl: response.redirectUrl,
      merchantOrderId,
    });
  } catch (error) {
    console.error("PhonePe initiate error:", error);
    res.status(500).json({ message: error.message });
  }
};

// @desc   Verify payment (provider-agnostic: Razorpay or PhonePe). No order/receipt creation.
// @route  POST /api/payments/verify
// Request shape unchanged: { paymentId, orderId?, signature? }. For PhonePe, paymentId = merchantOrderId (TX-*).
// Response shape unchanged: { verified, payment?, message }.
export const verifyPayment = async (req, res) => {
  try {
    const { paymentId, orderId, signature, provider } = req.body;

    if (!paymentId) {
      return res.status(400).json({ message: "paymentId is required" });
    }

    const isPhonePe = provider === "phonepe" || (typeof paymentId === "string" && paymentId.startsWith("TX-"));

    if (isPhonePe) {
      if (!phonepeClient.getOrderStatus) {
        return res.status(503).json({ verified: false, payment: null, message: "PhonePe is not configured" });
      }
      try {
        const statusResponse = await phonepeClient.getOrderStatus(paymentId);
        const transactionId = statusResponse.transactionId || statusResponse.paymentDetails?.[0]?.transactionId;
        const amountRupees = (statusResponse.amount || 0) / 100;

        if (statusResponse.state === "COMPLETED") {
          // Persist: update Order and Payment records (idempotent)
          const order = await Order.findOne({ "payment.paymentId": paymentId });
          if (order) {
            if (order.payment.status !== "paid") {
              order.payment.status = "paid";
              order.payment.transactionId = transactionId;
              await order.save();

              // Upsert Payment record (idempotent: skip if already exists and paid)
              const existingPayment = await Payment.findOne({ paymentId, status: "paid" });
              if (!existingPayment) {
                const productDetails = await Product.find({
                  _id: { $in: order.products.map((p) => p.productId) },
                });
                const receiptItems = order.products.map((item) => {
                  const product = productDetails.find((p) => p._id.toString() === item.productId.toString());
                  return {
                    productName: product?.name || "Unknown Product",
                    quantity: item.quantity,
                    price: product?.price || 0,
                  };
                });
                const receipt = `RCP-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
                await Payment.create({
                  userId: order.userId,
                  orderId: order._id,
                  paymentId,
                  transactionId,
                  amount: amountRupees,
                  status: "paid",
                  method: "phonepe",
                  receipt,
                  items: receiptItems,
                  shippingAddress: order.shippingAddress || "N/A",
                });
              }
            }
          }

          res.json({
            verified: true,
            payment: {
              paymentId,
              transactionId,
              status: "paid",
              method: "phonepe",
              amount: amountRupees,
            },
            message: "Payment verified successfully",
          });
        } else if (statusResponse.state === "FAILED") {
          // Persist failed status (idempotent)
          const order = await Order.findOne({ "payment.paymentId": paymentId });
          if (order && order.payment.status !== "failed") {
            order.payment.status = "failed";
            await order.save();
          }
          res.json({
            verified: false,
            payment: null,
            message: "Payment failed",
          });
        } else {
          res.json({
            verified: false,
            payment: null,
            message: "Payment not completed",
          });
        }
      } catch (error) {
        return res.status(500).json({
          verified: false,
          payment: null,
          message: error.message || "Could not verify PhonePe payment",
        });
      }
      return;
    }

    // Razorpay path (keep unchanged)
    if (!orderId || !signature) {
      return res.status(400).json({
        message: "orderId and signature are required for Razorpay verification",
      });
    }

    const payment = await Payment.findOne({ paymentId });
    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }

    if (payment.status === "paid") {
      res.json({
        verified: true,
        payment,
        message: "Payment verified successfully",
      });
    } else {
      res.json({
        verified: false,
        payment,
        message: "Payment not completed",
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Handle PhonePe webhook callback
// @route  POST /api/payments/phonepe/webhook
export const handlePhonePeWebhook = async (req, res) => {
  try {
    if (!phonepeClient.validateCallback) {
      return res.status(503).json({ message: "PhonePe is not configured" });
    }
    const authHeader = req.headers.authorization;
    const responseBody = JSON.stringify(req.body);

    const callbackResponse = phonepeClient.validateCallback(
      process.env.PHONEPE_WEBHOOK_USERNAME,
      process.env.PHONEPE_WEBHOOK_PASSWORD,
      authHeader,
      responseBody
    );

    const { type, payload } = callbackResponse;

    if (type === "CHECKOUT_ORDER_COMPLETED") {
      const order = await Order.findOne({ "payment.paymentId": payload.originalMerchantOrderId });
      if (order) {
        if (order.payment.status !== "paid") {
          order.payment.status = "paid";
          order.payment.transactionId = payload.paymentDetails?.[0]?.transactionId;
          await order.save();
        }

        // Idempotent: skip Payment create if already exists (e.g. verify ran first)
        const existingPayment = await Payment.findOne({ paymentId: payload.originalMerchantOrderId, status: "paid" });
        if (!existingPayment) {
          const productDetails = await Product.find({
            _id: { $in: order.products.map((p) => p.productId) },
          });

          const receiptItems = order.products.map((item) => {
            const product = productDetails.find((p) => p._id.toString() === item.productId.toString());
            return {
              productName: product?.name || "Unknown Product",
              quantity: item.quantity,
              price: product?.price || 0,
            };
          });

          await Payment.create({
          userId: order.userId,
          orderId: order._id,
          paymentId: payload.originalMerchantOrderId,
          transactionId: payload.paymentDetails?.[0]?.transactionId,
          amount: payload.amount / 100,
          status: "paid",
          method: "phonepe",
          items: receiptItems,
          shippingAddress: order.shippingAddress,
        });
        }
      }
    } else if (type === "CHECKOUT_ORDER_FAILED") {
      const order = await Order.findOne({ "payment.paymentId": payload.originalMerchantOrderId });
      if (order) {
        order.payment.status = "failed";
        await order.save();
      }
    }

    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Webhook error:", error);
    res.status(500).json({ message: error.message });
  }
};
