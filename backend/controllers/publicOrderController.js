import Order from "../models/order.js";
import Payment from "../models/payment.js";
import Product from "../models/product.js";
import { applyCouponToOrder } from "./couponController.js";

export const createOrder = async (req, res) => {
  try {
    const { userId, items, totalAmount, shippingAddress, paymentMethod, payment, couponCode } = req.body;
    if (!userId || !Array.isArray(items) || items.length === 0 || !totalAmount) {
      return res.status(400).json({ message: "userId, items, and totalAmount are required" });
    }
    
    // Convert items -> products schema
    const products = items.map((it) => ({ productId: it.product || it.productId || it.product?._id || it.id, quantity: it.quantity || 1 }));
    
    // Handle coupon if provided
    let finalAmount = totalAmount;
    let couponDetails = null;
    
    if (couponCode) {
      try {
        const couponResult = await applyCouponToOrder(couponCode, userId, totalAmount);
        finalAmount = couponResult.finalAmount;
        couponDetails = {
          code: couponResult.couponDetails.code,
          discountType: couponResult.couponDetails.discountType,
          discountValue: couponResult.couponDetails.discountValue,
          discountAmount: couponResult.discountAmount,
        };
      } catch (couponError) {
        return res.status(400).json({ message: couponError.message });
      }
    }
    
    const order = await Order.create({
      userId,
      products,
      totalAmount,
      coupon: couponDetails,
      finalAmount: finalAmount,
      shippingAddress: shippingAddress || "N/A",
      paymentMethod: paymentMethod || "cash",
      payment: payment || { status: 'created', amount: finalAmount },
    });

    // Create payment receipt if payment was successful
    if (payment && payment.status === 'paid' && payment.paymentId) {
      try {
        // Get product details for receipt
        const productDetails = await Product.find({
          _id: { $in: items.map(it => it.product || it.productId || it.product?._id || it.id) }
        });

        const receiptItems = items.map(item => {
          const product = productDetails.find(p => 
            p._id.toString() === (item.product || item.productId || item.product?._id || item.id).toString()
          );
          return {
            productName: product?.name || 'Unknown Product',
            quantity: item.quantity || 1,
            price: item.price || product?.price || 0
          };
        });

        await Payment.create({
          userId,
          orderId: order._id,
          paymentId: payment.paymentId,
          amount: finalAmount,
          status: 'paid',
          method: payment.method || 'razorpay',
          items: receiptItems,
          shippingAddress: shippingAddress || "N/A",
        });
      } catch (paymentError) {
        console.error('Error creating payment receipt:', paymentError);
        // Don't fail the order creation if payment receipt creation fails
      }
    }

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const listUserOrders = async (req, res) => {
  try {
    const userId = req.params.id;
    const orders = await Order.find({ userId }).populate("products.productId", "name price image");
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


