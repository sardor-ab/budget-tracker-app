import asyncHandler from "express-async-handler";
import Account from "../models/accountModel.js";
import Transaction from "../models/transactionModel.js";

const calculateBalance = async (user, card) => {
  const transactions = await Transaction.find({
    user,
    card,
  });
  let balance = 0;
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
    function (error, balance) {
      if (error) {
        return res.send(error);
      }
    }
  );
};

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

  await calculateBalance(user, card);

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
//@route DELETE api/transactions/delete
//@access PRIVATE
const deleteTransaction = asyncHandler(async (req, res) => {
  const { card, transaction } = req.query;
  const user = req.user;

  await Transaction.findByIdAndRemove({ _id: transaction });

  calculateBalance(user, card);

  res.status(200).json({
    success: true,
    data: {},
  });
});

//@description Update a transaction data based on id
//@route PUT api/transactions/update/:id
//@access PRIVATE
const updateTransaction = asyncHandler(async (req, res) => {
  const {
    title,
    currency,
    amount,
    type,
    description,
    categories,
    payee,
    date,
  } = req.body;

  const user = req.user;
  const { card, transaction } = req.query;

  Transaction.findByIdAndUpdate(
    transaction,
    {
      $set: {
        title,
        currency,
        amount,
        type,
        description,
        categories,
        payee,
        date,
      },
    },
    { new: true },
    function (
      error,
      title,
      currency,
      amount,
      type,
      description,
      categories,
      payee,
      date
    ) {
      if (error) {
        res.send(error);
      } else {
        calculateBalance(user, card);
        res.json({
          success: true,
          data: {
            title,
            currency,
            amount,
            type,
            description,
            categories,
            payee,
            date,
          },
        });
      }
    }
  );
});

export {
  getUserTransactions,
  deleteTransaction,
  createTransaction,
  updateTransaction,
};
