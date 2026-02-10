import Product from "../models/product.js";
import Category from "../models/category.js";
import { upload } from "../config/cloudinary.js";

// @desc   Create new product
// @route  POST /api/admin/products
export const createProduct = async (req, res) => {
  try {
    const { name, description, displayDescription, price, stock, category, subcategory, imageUrl, imageUrls, section, status, isHotSelling, isCreateHype } = req.body;

    console.log('Creating product with displayDescription:', displayDescription);

    // Validate required fields
    if (!name || !price || !category) {
      return res.status(400).json({ message: "Name, price, and category are required" });
    }

    // Check if category exists
    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
      return res.status(400).json({ message: "Category not found" });
    }

    // Validate subcategory if provided
    if (subcategory) {
      const subcategoryExists = categoryExists.subcategories.find(
        sub => sub.slug === subcategory && sub.isActive
      );
      if (!subcategoryExists) {
        return res.status(400).json({ message: "Invalid subcategory" });
      }
    }

    // Handle images - support multiple uploads and URLs
    let images = [];
    let image = null;

    // Handle uploaded files (req.files is an array when using upload.array())
    if (req.files && req.files.length > 0) {
      images = req.files.map(file => file.path);
    }

    // Handle image URLs from body (can be single URL or array)
    if (imageUrls) {
      const urls = Array.isArray(imageUrls) ? imageUrls : JSON.parse(imageUrls || '[]');
      images = [...images, ...urls];
    }

    // Support legacy single imageUrl for backward compatibility
    if (imageUrl && !imageUrls) {
      images.push(imageUrl);
    }

    // Set primary image (first image) for backward compatibility
    image = images.length > 0 ? images[0] : null;

    const product = await Product.create({
      name,
      description,
      displayDescription,
      price,
      image,
      images,
      stock: stock || 0,
      category,
      subcategory: subcategory || null,
      section: section || "homepage_top",
      status: status || "available",
      isHotSelling: isHotSelling === true || isHotSelling === 'true',
      isCreateHype: isCreateHype === true || isCreateHype === 'true'
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
    const { name, description, displayDescription, price, stock, category, subcategory, isActive, imageUrl, imageUrls, images: bodyImages, section, status, isHotSelling, isCreateHype } = req.body;

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

      // Validate subcategory if provided
      if (subcategory) {
        const subcategoryExists = categoryExists.subcategories.find(
          sub => sub.slug === subcategory && sub.isActive
        );
        if (!subcategoryExists) {
          return res.status(400).json({ message: "Invalid subcategory" });
        }
        product.subcategory = subcategory;
      } else {
        product.subcategory = null;
      }
    }

    // Handle images - support multiple uploads and URLs
    // If images/imageUrls is provided, use it as the source of truth (final list from frontend)
    // Only append newly uploaded files to this list
    let images = [];

    // Priority: bodyImages > imageUrls > existing images
    // If bodyImages or imageUrls is provided, use it as the base list (source of truth)
    if (bodyImages !== undefined) {
      // req.body.images takes highest priority as source of truth
      images = Array.isArray(bodyImages) ? [...bodyImages] : JSON.parse(bodyImages || '[]');
    } else if (imageUrls !== undefined) {
      // imageUrls as fallback source of truth
      if (imageUrls) {
        const urls = Array.isArray(imageUrls) ? imageUrls : JSON.parse(imageUrls || '[]');
        images = [...urls];
      } else {
        // If imageUrls is explicitly set to empty/null, start with empty array
        images = [];
      }
    } else {
      // If neither provided, fallback to existing images (backward compatibility)
      images = product.images || [];
    }

    // Append newly uploaded files (if any) to the final image list
    if (req.files && req.files.length > 0) {
      const uploadedImages = req.files.map(file => file.path);
      images = [...images, ...uploadedImages];
    }

    // Support legacy single imageUrl for backward compatibility (only if images/imageUrls not provided)
    if (imageUrl && bodyImages === undefined && imageUrls === undefined) {
      images = [imageUrl];
    }

    // Set primary image (first image) for backward compatibility
    const image = images.length > 0 ? images[0] : product.image;

    if (name) product.name = name;
    if (description !== undefined) product.description = description;
    if (displayDescription !== undefined) product.displayDescription = displayDescription;
    if (price !== undefined) product.price = price;
    if (image) product.image = image;
    // Always update images if it was provided or if we processed uploaded files
    // This allows clearing images by sending empty array
    if (bodyImages !== undefined || imageUrls !== undefined || (req.files && req.files.length > 0)) {
      product.images = images;
    }
    if (stock !== undefined) product.stock = stock;
    if (isActive !== undefined) product.isActive = isActive;
    if (section !== undefined) product.section = section;
    if (status !== undefined) product.status = status;
    if (isHotSelling !== undefined) product.isHotSelling = isHotSelling === true || isHotSelling === 'true';
    if (isCreateHype !== undefined) product.isCreateHype = isCreateHype === true || isCreateHype === 'true';

    const updatedProduct = await product.save();
    const populatedProduct = await Product.findById(updatedProduct._id).populate("category", "name");

    res.json(populatedProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Delete product (Soft Delete)
// @route  DELETE /api/admin/products/:id
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Perform soft delete by setting isActive to false
    product.isActive = false;
    await product.save();

    res.json({ message: "Product deactivated successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
