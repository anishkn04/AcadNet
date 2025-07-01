import app from "./app.js";
import sequelize from './config/database.js';


const PORT = process.env.BACKEND_PORT || 3000;
// Sync database
try {
  await sequelize.authenticate();
  console.log('Database connected successfully');
  
  // Sync models (creates tables if they don't exist)
  // WARNING: { force: true } will drop existing tables and recreate them
  // Only use this in development when you don't have important data
  await sequelize.sync({ alter: true }); // Use { alter: true } for production

  app.listen(PORT, () => {
    console.log(`Server is running at PORT ${PORT}`);
  });
} catch (err) {
  console.log(`Database connection error: ${err}`);
}
