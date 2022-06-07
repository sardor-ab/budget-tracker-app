import dotenv from "dotenv";
import express from "express";
import auth from "../configs/auth.js";
import {
  createSubscription,
  deleteSubscription,
  getUserSubscriptions,
  updateSubscription,
} from "../controllers/subscriptionController.js";

dotenv.config();

const router = express.Router();

router.use(auth);

router.get("/:id", getUserSubscriptions);
router.put("/update", updateSubscription);
router.post("/create", createSubscription);
router.delete("/delete", deleteSubscription);

export default router;
