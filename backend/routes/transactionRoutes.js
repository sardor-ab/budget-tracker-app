import dotenv from "dotenv";
import express from "express";
import auth from "../configs/auth.js";
import {
  getUserTransactions,
  deleteTransaction,
} from "../controllers/transactionController.js";

dotenv.config();

const router = express.Router();

router.use(auth);

router.get("/:id", getUserTransactions);

export default router;
