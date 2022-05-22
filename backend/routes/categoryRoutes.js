import express from "express";
import auth from "../configs/auth.js";
import { getCategories } from "../controllers/categoryController.js";

const router = express.Router();

router.use(auth);

router.get("/", getCategories);

export default router;
