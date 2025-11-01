import mongoose from "mongoose";

const dropSignupSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address']
    },
  },
  { timestamps: true }
);

const DropSignup = mongoose.model("DropSignup", dropSignupSchema);
export default DropSignup;

