import mongoose from "mongoose";

const subcategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  slug: {
    type: String,
    required: true,
    trim: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, { _id: true });

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    description: {
      type: String,
    },
    image: {
      type: String, // category image URL
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    subcategories: [subcategorySchema],
  },
  { timestamps: true }
);

const Category = mongoose.model("Category", categorySchema);
export default Category;
