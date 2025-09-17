import { Sequelize } from 'sequelize';

// Use DATABASE_URL if available (for production) or construct from individual env vars
const sequelize = new Sequelize(
  process.env.DATABASE_URL || process.env.PG_DATABASE || 'acadnet',
  process.env.PG_USER || 'postgres',
  process.env.PG_PASSWORD || 'password',
  {
    host: process.env.PG_HOST || 'localhost',
    port: process.env.PG_PORT || 5432,
    dialect: 'postgres',
    logging: false,
    // logging: process.env.NODE_ENV === 'development' ? console.log : false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);

export default sequelize;
