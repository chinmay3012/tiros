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

// @desc   Delete category (Soft Delete)
// @route  DELETE /api/admin/categories/:id
export const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    // Soft delete: set isActive to false
    category.isActive = false;
    await category.save();

    res.json({ message: "Category deactivated successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Add subcategory to category
// @route  POST /api/admin/categories/:categoryId/subcategories
export const addSubcategory = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Subcategory name is required" });
    }

    const category = await Category.findById(req.params.categoryId);

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    // Generate slug from name
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    // Check if subcategory already exists
    const existingSubcategory = category.subcategories.find(
      sub => sub.name.toLowerCase() === name.toLowerCase()
    );

    if (existingSubcategory) {
      return res.status(400).json({ message: "Subcategory already exists" });
    }

    // Add subcategory
    category.subcategories.push({
      name,
      slug,
      isActive: true
    });

    const updatedCategory = await category.save();

    res.status(201).json(updatedCategory);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Update subcategory
// @route  PUT /api/admin/categories/:categoryId/subcategories/:subcategoryId
export const updateSubcategory = async (req, res) => {
  try {
    const { name, isActive } = req.body;

    const category = await Category.findById(req.params.categoryId);

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    const subcategory = category.subcategories.id(req.params.subcategoryId);

    if (!subcategory) {
      return res.status(404).json({ message: "Subcategory not found" });
    }

    // Check if name is being changed and if it already exists
    if (name && name !== subcategory.name) {
      const existingSubcategory = category.subcategories.find(
        sub => sub.name.toLowerCase() === name.toLowerCase() && sub._id.toString() !== req.params.subcategoryId
      );

      if (existingSubcategory) {
        return res.status(400).json({ message: "Subcategory name already exists" });
      }

      subcategory.name = name;
      subcategory.slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    }

    if (isActive !== undefined) {
      subcategory.isActive = isActive;
    }

    const updatedCategory = await category.save();

    res.json(updatedCategory);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Delete subcategory
// @route  DELETE /api/admin/categories/:categoryId/subcategories/:subcategoryId
export const deleteSubcategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.categoryId);

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    const subcategory = category.subcategories.id(req.params.subcategoryId);

    if (!subcategory) {
      return res.status(404).json({ message: "Subcategory not found" });
    }

    // Check if subcategory has products (you might want to add this check later)
    // For now, we'll just remove the subcategory

    subcategory.deleteOne();

    const updatedCategory = await category.save();

    res.json({ message: "Subcategory deleted successfully", category: updatedCategory });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
