import Order from "../models/order.js";
import User from "../models/user.js";
import Product from "../models/product.js";

// @desc   Get all orders with filters
// @route  GET /api/admin/orders
export const getAllOrders = async (req, res) => {
  try {
    const {
      status,
      userId,
      startDate,
      endDate,
      page = 1,
      limit = 10
    } = req.query;

    let query = {};

    // Status filter
    if (status) {
      query.status = status;
    }

    // User filter
    if (userId) {
      query.userId = userId;
    }

    // Date range filter
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) {
        query.createdAt.$gte = new Date(startDate);
      }
      if (endDate) {
        query.createdAt.$lte = new Date(endDate);
      }
    }

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const orders = await Order.find(query)
      .populate("userId", "name email address")
      .populate("products.productId", "name price image")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    const total = await Order.countDocuments(query);

    res.json({
      orders,
      pagination: {
        currentPage: pageNum,
        totalPages: Math.ceil(total / limitNum),
        totalOrders: total,
        hasNext: pageNum < Math.ceil(total / limitNum),
        hasPrev: pageNum > 1
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Get single order details
// @route  GET /api/admin/orders/:id
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("userId", "name email address")
      .populate("products.productId", "name price image description");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Update order status
// @route  PUT /api/admin/orders/:id/status
export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ message: "Status is required" });
    }

    const validStatuses = ["pending", "confirmed", "shipped", "delivered", "cancelled"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        message: `Invalid status. Must be one of: ${validStatuses.join(", ")}`
      });
    }

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // If order is being cancelled or delivered, update product stock
    if (status === "cancelled" && order.status !== "cancelled") {
      // Restore stock for cancelled orders
      for (const item of order.products) {
        await Product.findByIdAndUpdate(
          item.productId,
          { $inc: { stock: item.quantity } }
        );
      }
    } else if (status === "delivered" && order.status === "pending") {
      // Reduce stock when order is confirmed/delivered
      for (const item of order.products) {
        const product = await Product.findById(item.productId);
        if (product.stock < item.quantity) {
          return res.status(400).json({
            message: `Insufficient stock for product: ${product.name}`
          });
        }
        await Product.findByIdAndUpdate(
          item.productId,
          { $inc: { stock: -item.quantity } }
        );
      }
    }

    order.status = status;
    const updatedOrder = await order.save();

    const populatedOrder = await Order.findById(updatedOrder._id)
      .populate("userId", "name email address")
      .populate("products.productId", "name price image");

    res.json({
      message: "Order status updated successfully",
      order: populatedOrder
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// @desc   Delete an order
// @route  DELETE /api/admin/orders/:id
export const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    await order.deleteOne();

    res.json({ message: "Order deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
