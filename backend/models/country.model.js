import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const CountryModel = sequelize.define(
  "Country",
  {
    country_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    country_name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  },
  {
    tableName: "countries",
    timestamps: false,
  }
);

export default CountryModel;
