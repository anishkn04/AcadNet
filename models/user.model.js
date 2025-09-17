import { Sequelize, DataTypes } from "sequelize";
import bcrypt from "bcrypt";
import { createRequire } from "module";
import countries from "i18n-iso-countries";
import sequelize from "../config/database.js";

const require = createRequire(import.meta.url);
const enLocale = require("i18n-iso-countries/langs/en.json");

countries.registerLocale(enLocale);

const countryNames = countries.getNames("en");
const countryEnum = Object.values(countryNames);

const UserModel = sequelize.define(
  "userModel",
  {
    user_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
      validate: {
        len: [3, 255],
      },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
      set(value) {
        this.setDataValue("email", value.toLowerCase());
      },
    },
    password_hash: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "password_hash",
    },
    auth_provider: {
      type: DataTypes.ENUM("local", "google", "github"),
      defaultValue: "local",
      allowNull: false,
    },
    fullName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    role: {
      type: DataTypes.ENUM("user", "groupadmin", "admin"),
      defaultValue: "user",
      allowNull: false,
    },
    is_banned: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    is_verified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    last_otp: {
      type: DataTypes.DATE,
      defaultValue: () => new Date("1980-01-01T00:00:00.000Z"),
    },
    age: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        is: /^[0-9]{10}$/,
      },
    },
    nationality: {
      type: DataTypes.ENUM(...countryEnum),
      allowNull: true,
    },
    address: {
      type: DataTypes.JSONB,
      allowNull: true,
      defaultValue: {},
    },
    education: {
      type: DataTypes.JSONB,
      allowNull: true,
      defaultValue: {},
    },
  },
  {
    tableName: "users",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
    hooks: {
      beforeSave: async (user, options) => {
        if (
          !user.changed("password_hash") ||
          user.password_hash === "OAuth-Login"
        ) {
          return;
        }

        try {
          const salt = await bcrypt.genSalt(10);
          user.password_hash = await bcrypt.hash(user.password_hash, salt);
        } catch (err) {
          throw err;
        }
      },
    },
  }
);

UserModel.prototype.comparePassword = async function (candidatePassword) {
  if (this.password_hash === "OAuth-Login") {
    return false;
  }
  return await bcrypt.compare(candidatePassword, this.password_hash);
};

export { sequelize };
export default UserModel;
