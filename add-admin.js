// add-admin.js
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import dotenv from "dotenv";

// Load environment variables
dotenv.config({ path: './.env' });

// Admin schema (simplified)
const adminSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  lastLogin: { type: Date, default: null }
}, { timestamps: true });

const Admin = mongoose.model("Admin", adminSchema);

async function addAdmin(name, email, password) {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/topshot", {
      dbName: 'topshot'
    });
    console.log("Connected to MongoDB");

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      console.log(`❌ Admin with email ${email} already exists`);
      process.exit(1);
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create admin
    const admin = await Admin.create({
      name,
      email,
      password: hashedPassword
    });

    console.log("✅ Admin added successfully:");
    console.log("Name:", admin.name);
    console.log("Email:", admin.email);
    console.log("Password:", password);
    console.log("Created at:", admin.createdAt);

  } catch (error) {
    console.error("❌ Error adding admin:", error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

// Get parameters from command line arguments
const name = process.argv[2];
const email = process.argv[3];
const password = process.argv[4];

if (!name || !email || !password) {
  console.log("Usage: node add-admin.js <name> <email> <password>");
  console.log("Example: node add-admin.js 'John Doe' john@example.com mypassword123");
  process.exit(1);
}

addAdmin(name, email, password);

// to add : node add-admin.js "Admin Name" "admin@example.com" "password123"