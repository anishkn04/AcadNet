import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import UserModel from './user.model.js';

const RefreshToken = sequelize.define('RefreshToken', {
  token_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: UserModel,
      key: 'user_id'
    }
  },
  token: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  expires_at: {
    type: DataTypes.DATE,
    allowNull: false
  }
}, {
  tableName: 'refresh_tokens',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

// Define associations
UserModel.hasMany(RefreshToken, { foreignKey: 'user_id' });
RefreshToken.belongsTo(UserModel, { foreignKey: 'user_id' });

export default RefreshToken;
