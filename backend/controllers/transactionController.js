import asyncHandler from "express-async-handler";
import Account from "../models/accountModel.js";
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

  let balance = 0;

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

  const transactions = await Transaction.find({
    user,
    card,
  });

  transactions.map((transaction) => {
    if (transaction.type === "income") {
      balance += transaction.amount;
    } else {
      balance -= transaction.amount;
    }
  });

  Account.findByIdAndUpdate(
    card,
    {
      $set: {
        balance,
      },
    },
    { new: true },
    function (error, { balance }) {
      if (error) {
        return res.send(error);
      }
    }
  );

  return res.json({
    success: true,
    message: "Transaction added",
    data: [],
  });
});

//@description Get user's all transactions based on card ID
//@route GET api/transactions/:id
//@access PRIVATE
const getUserTransactions = asyncHandler(async (req, res) => {
  let { type, date } = req.query;

  if (type === "all") {
    type = ["income", "expense"];
  } else {
    type = [type];
  }

  const transactions = await Transaction.find({
    user: req.user,
    card: req.params.id,
    type: { $in: type },
  });

  transactions.sort((a, b) => {
    if (date === "oldest") {
      return a.date - b.date;
    }
    return b.date - a.date;
  });

  //Think about this lenght changing!
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
