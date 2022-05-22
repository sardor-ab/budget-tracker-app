import asyncHandler from "express-async-handler";
import Transaction from "../models/transactionModel.js";

//@description Create a new transaction
//@route POST api/transactions/create
//@access PRIVATE
const createTransaction = asyncHandler(async (req, res) => {
  const {
    title,
    type,
    categories,
    amount,
    payee,
    date,
    description,
    card,
    attachment,
  } = req.body;

  const user = req.user;

  const transaction = await Transaction.create({
    user,
    title,
    type,
    categories,
    amount,
    payee,
    date,
    description,
    card,
    attachment,
  });

  if (!transaction) {
    return res.status(400).json({
      success: false,
      message: "Transaction cannot be added!",
    });
  }

  return res.json({
    success: true,
    message: "Transaction added",
    data: [],
  });
});

//@description Get user's all transactions
//@route GET api/transactions/:id
//@access PRIVATE
const getUserTransactions = asyncHandler(async (req, res) => {
  const transactions = await Transaction.find({
    user: req.user,
    card: req.params.id,
  });
  //Think about this!
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

export { getUserTransactions, deleteTransaction, createTransaction };
