import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 3
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true
    },
    password: {
      type: String,
      required: true
    },
    authProvider: {
      type: String,
      enum: ["local", "google", "github"],
      default: "local"
    },
    fullName: {
      type: String
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user"
    },
    isBanned: {
      type: Boolean,
      default: false
    },
    isVerified: {
      type: Boolean,
      default: false
    },
    lastOtp: {
      type: Date,
      default: () => new Date("1980-01-01T00:00:00.000Z")
    }
  },
  {
    timestamps: true
  }
);

userSchema.pre("save", async function (next) {
  // Skip hashing for non-local auth (e.g., 'OAuth-Login')
  if (!this.isModified("password") || this.password === "OAuth-Login")
    return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

const User = mongoose.model("User", userSchema);
export default User;
