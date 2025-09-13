import { Sequelize } from 'sequelize';

// Use AZURE_POSTGRESQL_CONNECTIONSTRING if available, fallback to DATABASE_URL or construct from individual env vars
const sequelize = new Sequelize(process.env.AZURE_POSTGRESQL_CONNECTIONSTRING, {
  dialect: 'postgres',
  logging: false,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});

export default sequelize;
