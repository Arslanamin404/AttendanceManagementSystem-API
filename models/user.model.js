import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { Attendance } from "./attendance.model.js";

const userSchema = new mongoose.Schema(
  {
    full_name: {
      type: String,
      required: [true, "Full Name is required"],
      minlength: [4, "Full name must be at least of 4 characters"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [7, "Password must be at least of 7 characters"],
      trim: true,
    },
    role: {
      type: String,
      enum: ["STUDENT", "TEACHER", "ADMIN"],
      default: "STUDENT",
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  try {
    this.password = await bcrypt.hash(this.password, 10);
    next();
  } catch (error) {
    next(error);
  }
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Middleware to delete attendance records when a user is deleted
userSchema.pre(
  "deleteOne",
  { document: true, query: false },
  async function (next) {
    const userId = this._id; // Get the user ID before deletion
    await Attendance.deleteMany({ userID: userId }); // Delete all related attendance records
    console.log(`🗑️ Deleted attendance records for user: ${userId}`);
    next();
  }
);

export const User = mongoose.model("User", userSchema);
