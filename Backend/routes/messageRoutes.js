import express from "express";
import { getMessages, sendMessage } from "../controllers/messageController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);

router.get("/:applicationId", getMessages);
router.post("/:applicationId", sendMessage);

export default router;
