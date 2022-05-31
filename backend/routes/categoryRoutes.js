import express from "express";
import auth from "../configs/auth.js";
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../controllers/categoryController.js";

const router = express.Router();

router.use(auth);

router.get("/", getCategories);
router.put("/", updateCategory);
router.post("/", createCategory);
router.delete("/", deleteCategory);

export default router;
