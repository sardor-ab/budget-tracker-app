import dotenv from "dotenv";
import express from "express";
import auth from "../configs/auth.js";
import {
  authUser,
  getProfile,
  registerUser,
} from "../controllers/userController.js";

dotenv.config();

const router = express.Router();

router.post("/login", authUser);
router.post("/register", registerUser);
router.get("/profile", auth, getProfile);

export default router;
