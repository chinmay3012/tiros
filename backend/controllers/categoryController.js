import Category from "../models/category.js";
import multer from "multer";
import path from "path";
import fs from "fs";

// Multer configuration for category images
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = 'uploads/categories';
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'category-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed'), false);
  }
};

export const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

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
      image = `http://localhost:3001/uploads/categories/${req.file.filename}`;
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
      // Delete old image file if it exists and is not a URL
      if (category.image && category.image.includes('/uploads/')) {
        const oldImagePath = category.image.replace('http://localhost:3001', '');
        if (fs.existsSync(oldImagePath.substring(1))) {
          fs.unlinkSync(oldImagePath.substring(1));
        }
      }
      image = `http://localhost:3001/uploads/categories/${req.file.filename}`;
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
