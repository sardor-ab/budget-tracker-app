import dotenv from "dotenv";
import express from "express";
import auth from "../configs/auth.js";
import {
  getUserTransactions,
  deleteTransaction,
  createTransaction,
  updateTransaction,
} from "../controllers/transactionController.js";

dotenv.config();

const router = express.Router();

router.use(auth);

router.get("/:id", getUserTransactions);
router.put("/update", updateTransaction);
router.post("/create", createTransaction);
router.delete("/delete", deleteTransaction);

export default router;
