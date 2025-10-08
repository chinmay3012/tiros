import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configure Cloudinary storage for category images
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'topshot/categories', // Folder name in Cloudinary
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
    transformation: [
      { width: 400, height: 400, crop: 'limit' }, // Resize category images
      { quality: 'auto' }, // Auto quality optimization
      { fetch_format: 'auto' } // Auto format optimization
    ],
  },
});

// Create multer upload middleware for categories
export const uploadCategory = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

export default cloudinary;
