import Product from "../models/product.js";
import Category from "../models/category.js";
import multer from "multer";
import path from "path";
import fs from "fs";

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads/products';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

export const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// @desc   Create new product
// @route  POST /api/admin/products
export const createProduct = async (req, res) => {
  try {
    const { name, description, price, stock, category, imageUrl, section } = req.body;
    
    // Validate required fields
    if (!name || !price || !category) {
      return res.status(400).json({ message: "Name, price, and category are required" });
    }
    
    // Check if category exists
    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
      return res.status(400).json({ message: "Category not found" });
    }
    
    // Handle image - either uploaded file or URL
    let image = imageUrl;
    if (req.file) {
      image = `http://localhost:3001/uploads/products/${req.file.filename}`;
    }
    
    const product = await Product.create({
      name,
      description,
      price,
      image,
      stock: stock || 0,
      category,
      section: section || "homepage_top"
    });
    
    const populatedProduct = await Product.findById(product._id).populate("category", "name");
    
    res.status(201).json(populatedProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Get all products with filters
// @route  GET /api/admin/products
export const getAllProducts = async (req, res) => {
  try {
    const { 
      search, 
      category, 
      minPrice, 
      maxPrice, 
      lowStock, 
      page = 1, 
      limit = 10 
    } = req.query;
    
    let query = {};
    
    // Search filter
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } }
      ];
    }
    
    // Category filter
    if (category) {
      query.category = category;
    }
    
    // Price range filter
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseFloat(minPrice);
      if (maxPrice) query.price.$lte = parseFloat(maxPrice);
    }
    
    // Low stock filter
    if (lowStock === "true") {
      query.stock = { $lte: 10 }; // Products with stock <= 10
    }
    
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;
    
    const products = await Product.find(query)
      .populate("category", "name")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);
    
    const total = await Product.countDocuments(query);
    
    res.json({
      products,
      pagination: {
        currentPage: pageNum,
        totalPages: Math.ceil(total / limitNum),
        totalProducts: total,
        hasNext: pageNum < Math.ceil(total / limitNum),
        hasPrev: pageNum > 1
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Get product details
// @route  GET /api/admin/products/:id
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate("category", "name");
    
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Update product
// @route  PUT /api/admin/products/:id
export const updateProduct = async (req, res) => {
  try {
    const { name, description, price, stock, category, isActive, imageUrl, section } = req.body;
    
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    
    // Check if category exists (if provided)
    if (category) {
      const categoryExists = await Category.findById(category);
      if (!categoryExists) {
        return res.status(400).json({ message: "Category not found" });
      }
      product.category = category;
    }
    
    // Handle image - either uploaded file or URL
    let image = imageUrl || product.image;
    if (req.file) {
      // Delete old image file if it exists and is not a URL
      if (product.image && product.image.includes('/uploads/')) {
        const oldImagePath = product.image.replace('http://localhost:3001', '');
        if (fs.existsSync(oldImagePath.substring(1))) {
          fs.unlinkSync(oldImagePath.substring(1));
        }
      }
      image = `http://localhost:3001/uploads/products/${req.file.filename}`;
    }
    
    if (name) product.name = name;
    if (description !== undefined) product.description = description;
    if (price !== undefined) product.price = price;
    if (image) product.image = image;
    if (stock !== undefined) product.stock = stock;
    if (isActive !== undefined) product.isActive = isActive;
    if (section !== undefined) product.section = section;
    
    const updatedProduct = await product.save();
    const populatedProduct = await Product.findById(updatedProduct._id).populate("category", "name");
    
    res.json(populatedProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Delete product
// @route  DELETE /api/admin/products/:id
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    
    await Product.findByIdAndDelete(req.params.id);
    
    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
