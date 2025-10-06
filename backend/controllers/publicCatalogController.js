import Product from "../models/product.js";
import Category from "../models/category.js";

export const listProducts = async (req, res) => {
  try {
    const { search, category, limit } = req.query;
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
    const limitNum = Math.min(parseInt(limit || '50', 10), 100);

    const products = await Product.find(findQuery)
      .select("name price image category section")
      .populate("category", "name")
      .sort({ createdAt: -1 })
      .limit(limitNum)
      .lean();

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
    const categories = await Category.find({});
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


