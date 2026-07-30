import express from "express";
import { searchJobs, getJobById } from "../controllers/jobController.js";

const router = express.Router();

router.get("/search", searchJobs);
router.get("/:id", getJobById);

export default router;
