import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";

import User from "../models/userModel.js";
import Transaction from "../models/transactionModel.js";

//@description Get user's all transactions
//@route GET api/transactions/:id
//@access PRIVATE
const getUserTransactions = asyncHandler(async (req, res) => {
  const transactions = await Transaction.find({
    user: req.user,
    card: req.params.id,
  });

  if (transactions.length != 0) {
    res.json({
      success: true,
      data: transactions,
      message: "At least one transaction is available",
    });
  } else {
    res.status(204).json({
      success: true,
      data: [],
      message: "No available transaction!",
    });
  }
});

//@description Delete user's exact transaction
//@route DELETE api/transactions/transaction/:id
//@access PRIVATE
const deleteTransaction = asyncHandler(async (req, res) => {
  const transaction = await Transaction.findById(req.params.id);

  if (!transaction) {
    res.status(404);
    throw new Error("Transaction not found");
  }

  await transaction.remove();

  res.status(200).json({
    success: true,
    data: {},
  });
});

export { getUserTransactions, deleteTransaction };
