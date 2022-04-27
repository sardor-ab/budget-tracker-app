import dotenv from "dotenv";
import express from "express";
import auth from "../configs/auth.js";
import {
  authUser,
  getProfile,
  registerUser,
  updateProfile,
} from "../controllers/userController.js";

dotenv.config();

const router = express.Router();

router.post("/login", authUser);
router.post("/register", registerUser);

router.get("/profile", auth, getProfile);

router.put("/update", auth, updateProfile);

export default router;
