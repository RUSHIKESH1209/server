import express from "express";
import { addSchool, listSchools } from "./schoolController.js";

const schoolRouter = express.Router();

schoolRouter.post("/addSchool", addSchool);
schoolRouter.get("/listSchools", listSchools);

export default schoolRouter;
