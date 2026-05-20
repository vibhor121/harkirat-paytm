import mongoose from "mongoose";

// 1. Connect to database
mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/paytm");

// 2. Create the schema
const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true,
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
});

// 3. Export the model
export const User = mongoose.model("User", userSchema);
