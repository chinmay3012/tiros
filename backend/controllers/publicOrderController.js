import Order from "../models/order.js";

export const createOrder = async (req, res) => {
  try {
    const { userId, items, totalAmount, shippingAddress, paymentMethod, payment } = req.body;
    if (!userId || !Array.isArray(items) || items.length === 0 || !totalAmount) {
      return res.status(400).json({ message: "userId, items, and totalAmount are required" });
    }
    // Convert items -> products schema
    const products = items.map((it) => ({ productId: it.product || it.productId || it.product?._id || it.id, quantity: it.quantity || 1 }));
    const order = await Order.create({
      userId,
      products,
      totalAmount,
      shippingAddress: shippingAddress || "N/A",
      paymentMethod: paymentMethod || "cash",
      payment: payment || { status: 'created', amount: totalAmount },
    });
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


