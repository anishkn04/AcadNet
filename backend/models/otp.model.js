import mongoose from "mongoose";
import bcrypt from "bcrypt";

const otpModelSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  type: {
    type: String,
    enum: ["verification", "reset"],
    default: "verification"
  },
  otp: {
    type: String,
    required: true
  },
  otpToken: {
    type: String,
    required: true,
    unique: true
  },
  tries: {
    type: String,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  expiresAt: {
    type: Date,
    required: true
  }
});

otpModelSchema.pre("save", async function (next) {
  if (this.isModified("otp")) {
    try {
      const saltRounds = 10;
      this.otp = await bcrypt.hash(this.otp, saltRounds);
    } catch (error) {
      return next(error);
    }
  }
  next();
});

otpModelSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const otpModel = mongoose.model("otpModel", otpModelSchema);

export default otpModel;
