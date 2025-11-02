import Product from "../models/product.js";
import Category from "../models/category.js";

export const listProducts = async (req, res) => {
  try {
    const { search, category, subcategory, limit } = req.query;
    const findQuery = { isActive: { $ne: false } };
    if (search) {
      findQuery.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } }
      ];
    }
    if (category) {
      findQuery.category = category;
    }
    if (subcategory) {
      findQuery.subcategory = subcategory;
    }
    const limitNum = Math.min(parseInt(limit || '50', 10), 100);

    // Remove .populate() to avoid N+1 query problem - category info is not needed for list view
    const products = await Product.find(findQuery)
      .select("name price image category subcategory section status displayDescription isHotSelling createdAt")
      .sort({ createdAt: -1 })
      .limit(limitNum)
      .lean();

    // Set cache headers for better performance
    res.set('Cache-Control', 'public, max-age=60'); // 1 minute cache
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate("category", "name");
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const listCategories = async (req, res) => {
  try {
    const categories = await Category.find({ isActive: true }).select('name description image subcategories');
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


