import express from "express";
import {
  getEmployerProfile,
  updateEmployerProfile,
  getEmployerJobs,
  createJob,
  deleteJob,
  submitJobPayment,
  getEmployerApplications,
  updateApplicationStage,
  searchVocationalTalent,
  inviteCandidate,
} from "../controllers/employerController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect, authorize("Employer"));

router.get("/profile", getEmployerProfile);
router.put("/profile", updateEmployerProfile);

router.get("/jobs", getEmployerJobs);
router.post("/jobs", createJob);
router.delete("/jobs/:jobId", deleteJob);
router.post("/jobs/:jobId/payment", submitJobPayment);

router.get("/applications", getEmployerApplications);
router.put("/applications/:applicationId/stage", updateApplicationStage);

router.get("/talent-search", searchVocationalTalent);
router.post("/invite", inviteCandidate);

export default router;
