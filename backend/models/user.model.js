import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { createRequire } from 'module';
import countries from 'i18n-iso-countries';

const require = createRequire(import.meta.url);
const enLocale = require('i18n-iso-countries/langs/en.json');

countries.registerLocale(enLocale);

const countryNames = countries.getNames('en');
const countryEnum = Object.values(countryNames);

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
    },
    age: {
      type: Number
    },
    phone: {
      type: String,
      match: /^[0-9]{10}$/
    },
    nationality: {
      type: String,
      enum: countryEnum
    },
    address: {
      state: { type: String },
      district: { type: String },
      municipality: { type: String },
      ward: { type: Number }
    },
    education: {
      level: {
        type: String,
        enum: ["School", "Undergrad", "Grad"]
      },
      field_of_study: {
        type: String,
       
        validate: {
          validator: function(value) {
          
            if (!value) {
              return true;
            }
            return this.level && this.level !== 'School';
          },
          message: 'A field of study can only be specified for "Undergrad" or "Grad" levels.'
        },
        enum: [
          "Computer Science",
          "Software Engineering",
          "Information Technology",
          "Electronics and Communication Engineering",
          "Mechanical Engineering",
          "Civil Engineering",
          "Architecture",
          "Business Administration",
          "Economics",
          "Psychology",
          "Physics",
          "Mathematics",
          "Biotechnology",
          "Medicine",
          "Law",
          "Others"
        ]
      },
      academicInstitution: {
        type: String
      }
    }
  },
  {
    timestamps: true
  }
);

userSchema.pre("save", async function(next) {
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