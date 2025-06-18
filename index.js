import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./db.js";
import schoolRouter from "./schoolRoute.js";

dotenv.config();
const app = express();

app.use(cors({ origin: "*" }));
app.use(express.json());

app.use("/api", schoolRouter);



connectDB();

export default app;
