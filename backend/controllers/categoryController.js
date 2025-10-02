import Category from "../models/category.js";
import { uploadCategory as upload } from "../config/cloudinaryCategory.js";

// @desc   Create category
// @route  POST /api/admin/categories
export const createCategory = async (req, res) => {
  try {
    const { name, description, imageUrl } = req.body;
    
    if (!name) {
      return res.status(400).json({ message: "Category name is required" });
    }
    
    // Check if category already exists
    const existingCategory = await Category.findOne({ name: { $regex: new RegExp(`^${name}$`, 'i') } });
    if (existingCategory) {
      return res.status(400).json({ message: "Category already exists" });
    }
    
    // Handle image - either uploaded file or URL
    let image = imageUrl;
    if (req.file) {
      // Cloudinary automatically provides the full URL in req.file.path
      image = req.file.path;
    }
    
    const category = await Category.create({
      name,
      description,
      image
    });
    
    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Get all categories
// @route  GET /api/admin/categories
export const getAllCategories = async (req, res) => {
  try {
    const { search, active, page = 1, limit = 10 } = req.query;
    
    let query = {};
    
    // Search filter
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } }
      ];
    }
    
    // Active filter
    if (active !== undefined) {
      query.isActive = active === "true";
    }
    
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;
    
    const categories = await Category.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);
    
    const total = await Category.countDocuments(query);
    
    res.json({
      categories,
      pagination: {
        currentPage: pageNum,
        totalPages: Math.ceil(total / limitNum),
        totalCategories: total,
        hasNext: pageNum < Math.ceil(total / limitNum),
        hasPrev: pageNum > 1
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Update category
// @route  PUT /api/admin/categories/:id
export const updateCategory = async (req, res) => {
  try {
    const { name, description, imageUrl, isActive } = req.body;
    
    const category = await Category.findById(req.params.id);
    
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
    
    // Check if name is being changed and if it already exists
    if (name && name !== category.name) {
      const existingCategory = await Category.findOne({ 
        name: { $regex: new RegExp(`^${name}$`, 'i') },
        _id: { $ne: req.params.id }
      });
      if (existingCategory) {
        return res.status(400).json({ message: "Category name already exists" });
      }
      category.name = name;
    }
    
    if (description !== undefined) category.description = description;
    if (isActive !== undefined) category.isActive = isActive;
    
    // Handle image - either uploaded file or URL
    let image = imageUrl || category.image;
    if (req.file) {
      // With Cloudinary, we don't need to delete old files manually
      // Cloudinary automatically provides the full URL in req.file.path
      image = req.file.path;
    }
    if (image) category.image = image;
    
    const updatedCategory = await category.save();
    
    res.json(updatedCategory);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Delete category
// @route  DELETE /api/admin/categories/:id
export const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
    
    // Check if category has products
    const Product = (await import("../models/product.js")).default;
    const productsCount = await Product.countDocuments({ category: req.params.id });
    
    if (productsCount > 0) {
      return res.status(400).json({ 
        message: `Cannot delete category. It has ${productsCount} product(s) associated with it.` 
      });
    }
    
    await Category.findByIdAndDelete(req.params.id);
    
    res.json({ message: "Category deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
