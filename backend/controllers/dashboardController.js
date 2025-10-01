import User from "../models/user.js";
import Product from "../models/product.js";
import Order from "../models/order.js";
import Category from "../models/category.js";

// @desc   Get dashboard summary
// @route  GET /api/admin/dashboard/summary
export const getDashboardSummary = async (req, res) => {
  try {
    const { period = "30" } = req.query; // days
    const days = parseInt(period);
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    
    // Get counts
    const totalUsers = await User.countDocuments();
    const totalProducts = await Product.countDocuments({ isActive: true });
    const totalCategories = await Category.countDocuments({ isActive: true });
    const totalOrders = await Order.countDocuments();
    
    // Get recent counts (within period)
    const recentUsers = await User.countDocuments({ 
      createdAt: { $gte: startDate } 
    });
    const recentOrders = await Order.countDocuments({ 
      createdAt: { $gte: startDate } 
    });
    
    // Calculate revenue
    const revenueData = await Order.aggregate([
      { $match: { status: { $in: ["delivered", "shipped"] } } },
      { $group: { _id: null, totalRevenue: { $sum: "$totalAmount" } } }
    ]);
    
    const totalRevenue = revenueData.length > 0 ? revenueData[0].totalRevenue : 0;
    
    // Recent revenue
    const recentRevenueData = await Order.aggregate([
      { 
        $match: { 
          status: { $in: ["delivered", "shipped"] },
          createdAt: { $gte: startDate }
        } 
      },
      { $group: { _id: null, totalRevenue: { $sum: "$totalAmount" } } }
    ]);
    
    const recentRevenue = recentRevenueData.length > 0 ? recentRevenueData[0].totalRevenue : 0;
    
    // Order status breakdown
    const orderStatusBreakdown = await Order.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } }
    ]);
    
    // Low stock products
    const lowStockProducts = await Product.countDocuments({ 
      stock: { $lte: 10 }, 
      isActive: true 
    });
    
    // Recent orders (last 5)
    const recentOrdersList = await Order.find()
      .populate("userId", "name email")
      .sort({ createdAt: -1 })
      .limit(5);
    
    res.json({
      summary: {
        totalUsers,
        totalProducts,
        totalCategories,
        totalOrders,
        totalRevenue,
        lowStockProducts
      },
      recent: {
        users: recentUsers,
        orders: recentOrders,
        revenue: recentRevenue,
        period: `${days} days`
      },
      orderStatusBreakdown,
      recentOrders: recentOrdersList
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Get sales report
// @route  GET /api/admin/dashboard/sales-report
export const getSalesReport = async (req, res) => {
  try {
    const { startDate, endDate, groupBy = "day" } = req.query;
    
    let matchQuery = { status: { $in: ["delivered", "shipped"] } };
    
    if (startDate && endDate) {
      matchQuery.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }
    
    let groupFormat;
    switch (groupBy) {
      case "hour":
        groupFormat = {
          year: { $year: "$createdAt" },
          month: { $month: "$createdAt" },
          day: { $dayOfMonth: "$createdAt" },
          hour: { $hour: "$createdAt" }
        };
        break;
      case "day":
        groupFormat = {
          year: { $year: "$createdAt" },
          month: { $month: "$createdAt" },
          day: { $dayOfMonth: "$createdAt" }
        };
        break;
      case "month":
        groupFormat = {
          year: { $year: "$createdAt" },
          month: { $month: "$createdAt" }
        };
        break;
      case "year":
        groupFormat = {
          year: { $year: "$createdAt" }
        };
        break;
      default:
        groupFormat = {
          year: { $year: "$createdAt" },
          month: { $month: "$createdAt" },
          day: { $dayOfMonth: "$createdAt" }
        };
    }
    
    const salesData = await Order.aggregate([
      { $match: matchQuery },
      {
        $group: {
          _id: groupFormat,
          totalSales: { $sum: "$totalAmount" },
          orderCount: { $sum: 1 },
          averageOrderValue: { $avg: "$totalAmount" }
        }
      },
      { $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1, "_id.hour": 1 } }
    ]);
    
    // Calculate totals
    const totals = await Order.aggregate([
      { $match: matchQuery },
      {
        $group: {
          _id: null,
          totalSales: { $sum: "$totalAmount" },
          totalOrders: { $sum: 1 },
          averageOrderValue: { $avg: "$totalAmount" }
        }
      }
    ]);
    
    res.json({
      salesData,
      totals: totals.length > 0 ? totals[0] : {
        totalSales: 0,
        totalOrders: 0,
        averageOrderValue: 0
      },
      period: {
        startDate,
        endDate,
        groupBy
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Get users report
// @route  GET /api/admin/dashboard/users-report
export const getUsersReport = async (req, res) => {
  try {
    const { startDate, endDate, groupBy = "day" } = req.query;
    
    let matchQuery = {};
    
    if (startDate && endDate) {
      matchQuery.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }
    
    let groupFormat;
    switch (groupBy) {
      case "day":
        groupFormat = {
          year: { $year: "$createdAt" },
          month: { $month: "$createdAt" },
          day: { $dayOfMonth: "$createdAt" }
        };
        break;
      case "month":
        groupFormat = {
          year: { $year: "$createdAt" },
          month: { $month: "$createdAt" }
        };
        break;
      case "year":
        groupFormat = {
          year: { $year: "$createdAt" }
        };
        break;
      default:
        groupFormat = {
          year: { $year: "$createdAt" },
          month: { $month: "$createdAt" },
          day: { $dayOfMonth: "$createdAt" }
        };
    }
    
    const userGrowthData = await User.aggregate([
      { $match: matchQuery },
      {
        $group: {
          _id: groupFormat,
          newUsers: { $sum: 1 }
        }
      },
      { $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 } }
    ]);
    
    // Get user statistics
    const userStats = await User.aggregate([
      {
        $group: {
          _id: null,
          totalUsers: { $sum: 1 },
          blockedUsers: { $sum: { $cond: ["$isBlocked", 1, 0] } },
          activeUsers: { $sum: { $cond: ["$isBlocked", 0, 1] } }
        }
      }
    ]);
    
    // Get recent users
    const recentUsers = await User.find()
      .select("name email createdAt isBlocked")
      .sort({ createdAt: -1 })
      .limit(10);
    
    res.json({
      userGrowthData,
      userStats: userStats.length > 0 ? userStats[0] : {
        totalUsers: 0,
        blockedUsers: 0,
        activeUsers: 0
      },
      recentUsers,
      period: {
        startDate,
        endDate,
        groupBy
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
