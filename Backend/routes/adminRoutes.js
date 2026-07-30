import express from "express";
import {
  getPendingVerifications,
  verifyCertificate,
  getPendingPayments,
  approvePayment,
  getPendingEmployers,
  approveEmployer,
  getAdminAnalytics,
} from "../controllers/adminController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect, authorize("Super-Admin"));

router.get("/verifications", getPendingVerifications);
router.put("/verifications", verifyCertificate);

router.get("/payments", getPendingPayments);
router.put("/payments", approvePayment);

router.get("/employers", getPendingEmployers);
router.put("/employers", approveEmployer);

router.get("/analytics", getAdminAnalytics);

export default router;
