import Product from "../models/product.js";

// @desc   Get low-stock alerts
// @route  GET /api/admin/inventory
export const getLowStockAlerts = async (req, res) => {
  try {
    const { threshold = 10, page = 1, limit = 10 } = req.query;
    
    const thresholdNum = parseInt(threshold);
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;
    
    const query = { 
      stock: { $lte: thresholdNum },
      isActive: true 
    };
    
    const lowStockProducts = await Product.find(query)
      .populate("category", "name")
      .sort({ stock: 1 }) // Sort by stock ascending (lowest first)
      .skip(skip)
      .limit(limitNum);
    
    const total = await Product.countDocuments(query);
    
    // Get summary statistics
    const totalProducts = await Product.countDocuments({ isActive: true });
    const outOfStock = await Product.countDocuments({ stock: 0, isActive: true });
    const lowStock = await Product.countDocuments({ 
      stock: { $lte: thresholdNum, $gt: 0 }, 
      isActive: true 
    });
    
    res.json({
      lowStockProducts,
      summary: {
        totalProducts,
        outOfStock,
        lowStock,
        threshold: thresholdNum
      },
      pagination: {
        currentPage: pageNum,
        totalPages: Math.ceil(total / limitNum),
        totalLowStock: total,
        hasNext: pageNum < Math.ceil(total / limitNum),
        hasPrev: pageNum > 1
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Update product stock
// @route  PUT /api/admin/inventory/:productId
export const updateProductStock = async (req, res) => {
  try {
    const { stock, operation = "set" } = req.body; // operation: "set", "add", "subtract"
    
    if (stock === undefined || stock < 0) {
      return res.status(400).json({ message: "Valid stock value is required" });
    }
    
    const product = await Product.findById(req.params.productId);
    
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    
    let newStock;
    switch (operation) {
      case "add":
        newStock = product.stock + stock;
        break;
      case "subtract":
        newStock = product.stock - stock;
        if (newStock < 0) {
          return res.status(400).json({ message: "Stock cannot be negative" });
        }
        break;
      case "set":
      default:
        newStock = stock;
        break;
    }
    
    product.stock = newStock;
    const updatedProduct = await product.save();
    
    const populatedProduct = await Product.findById(updatedProduct._id)
      .populate("category", "name");
    
    res.json({
      message: "Stock updated successfully",
      product: populatedProduct,
      operation,
      previousStock: product.stock,
      newStock
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
