import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./db.js";
import schoolRouter from "./schoolRoute.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors(
  { origin: "*" }
));
app.use(express.json());

app.use("/api", schoolRouter);

app.get('/ping', (req, res) => {
  console.log("pong");
  res.send("pong");
});


// connect to MongoDB then start server

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
    
  });
});

export default app;