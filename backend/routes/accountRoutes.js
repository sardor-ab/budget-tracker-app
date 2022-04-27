import dotenv from "dotenv";
import express from "express";
import auth from "../configs/auth.js";
import {
  createAccount,
  deleteAccount,
  getAccount,
  getAll,
  updateAccount,
} from "../controllers/accountController.js";

dotenv.config();

const router = express.Router();

router.use(auth);

router.delete("/delete/:id", deleteAccount);

router.get("/accounts", getAll);
router.get("/accounts/:id", getAccount);

router.put("/update/:id", updateAccount);

router.post("/create", createAccount);

export default router;
