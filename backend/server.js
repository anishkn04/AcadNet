import app from "./app.js";
import mongoose from "mongoose";

const PORT = process.env.BACKEND_PORT || 3000;
try {
  await mongoose.connect(process.env.MONGO_URI);

  app.listen(PORT, () => {
    console.log(`Server is running at PORT ${PORT}`);
  });
} catch (err) {
  console.log(`Mongo-Error: ${err}`);
}
