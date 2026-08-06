import express from "express";
import {
  getSeekerProfile,
  updateSeekerProfile,
  addOrUpdateSkill,
  deleteSkill,
  uploadCertificate,
  deleteCertificate,
  hideJob,
  getMyApplications,
} from "../controllers/seekerController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect, authorize("Job-Seeker"));

router.get("/profile", getSeekerProfile);
router.put("/profile", updateSeekerProfile);

router.put("/skills", addOrUpdateSkill);
router.delete("/skills/:skillId", deleteSkill);

router.post("/skills/:skillId/certificates", uploadCertificate);
router.delete("/skills/:skillId/certificates/:certificateId", deleteCertificate);

router.post("/jobs/:jobId/hide", hideJob);

router.get("/applications", getMyApplications);

export default router;
