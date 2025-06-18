import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./db.js"; 
import schoolRouter from "./schoolRoute.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use("/api", schoolRouter);

// connect to MongoDB then start server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
  });
});
