import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
    },
    displayDescription: {
      type: String,
    },
    price: {
      type: Number,
      required: true,
    },
    image: {
      type: String, // primary image URL (for backward compatibility)
    },
    images: {
      type: [String], // array of image URLs for product gallery
      default: [],
    },
    stock: {
      type: Number,
      default: 0,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    subcategory: {
      type: String, // subcategory slug
      default: null,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    isHotSelling: {
      type: Boolean,
      default: false,
    },
    isCreateHype: {
      type: Boolean,
      default: false,
    },
    section: {
      type: String,
      enum: ["homepage_top", "homepage_mid", "homepage_bottom"],
      default: "homepage_top"
    },
    status: {
      type: String,
      enum: ["available", "coming_soon", "sold_out"],
      default: "available"
    },
  },
  { timestamps: true }
);

// Indexes for faster search and common queries
productSchema.index({ name: "text", description: "text" });
productSchema.index({ category: 1, isActive: 1, createdAt: -1 });
productSchema.index({ section: 1, isActive: 1, createdAt: -1 });
productSchema.index({ isActive: 1, createdAt: -1 });

const Product = mongoose.model("Product", productSchema);
export default Product;
