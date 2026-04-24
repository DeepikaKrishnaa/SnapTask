import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: String,
    
    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: function () {
        return this.provider === "local";
      },
    },

    googleId: {
      type: String,
    },

    provider: {
      type: String,
      enum: ["local", "google"],
      default: "local",
    },

    isPremium: {
      type: Boolean,
      default: false,
    },

    plan: {
      type: String,
      enum: ["free", "plus"],
      default: "free",
    },

    otp: String,
    otpExpiry: Date,
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);