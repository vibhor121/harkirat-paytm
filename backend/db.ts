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

const accountSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  // stored in paise (1 INR = 100 paise) to avoid float precision errors
  balance: {
    type: Number,
    required: true,
  },
});

accountSchema.pre("save", async function () {
  const userExists = await mongoose.model("User").exists({ _id: this.userId });
  if (!userExists) throw new Error("User not found");
});

export const Account = mongoose.model("Account", accountSchema);
