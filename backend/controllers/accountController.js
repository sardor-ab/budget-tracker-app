import asyncHandler from "express-async-handler";
import Account from "../models/accountModel.js";
import User from "../models/userModel.js";

//@description Provide all accounts based on user
//@route GET /api/accounts
//@access PRIVATE
const getAll = asyncHandler(async (req, res) => {
  const accounts = await Account.find({ user: req.user });

  if (accounts) {
    res.json({
      success: true,
      data: accounts,
      message: "At least one account is available",
    });
  } else {
    res.status(404).json({
      success: false,
      data: [],
      message: "No found accounts!",
    });
  }
});

//@description Provide the accounts based on ID
//@route GET /api/accounts/:id
//@access PRIVATE
const getAccount = asyncHandler(async (req, res) => {
  const account = await Account.findOne({
    user: req.user,
    _id: req.params.id,
  });

  if (account) {
    res.json({
      success: true,
      data: account,
      message: "Account is available",
    });
  } else {
    res.status(404).json({
      success: false,
      data: [],
      message: "No found account!",
    });
  }
});

//@description Create a new account
//@route POST api/accounts/create
//@access PRIVATE
const createAccount = asyncHandler(async (req, res) => {
  const { title, currency, type } = req.body;
  const { user } = req.user;

  const card = await Account.create({
    user,
    title,
    balance: 0,
    currency,
    type,
  });

  if (!card) {
    res.status(400).json({
      success: false,
      message: "Account cannot be added!",
    });
  }

  res.status(201).json({
    success: true,
    data: card,
  });
});

//@description Update the account data
//@route PUT api/accounts/update/:id
//@access PRIVATE
const updateAccount = asyncHandler(async (req, res) => {
  const { title, currency, balance, type } = req.body;
  const { user } = req.user;

  User.findByIdAndUpdate(
    { user, _id: req.params._id },
    {
      $set: {
        title,
        currency,
        type,
        balance,
      },
    },
    { new: true },
    (err, card) => {
      if (err) {
        return res.status(400).json({
          success: false,
          error: err,
        });
      } else {
        return res.json({
          success: true,
          data: card,
        });
      }
    }
  );
});

//@description Delete account
//@route DELETE api/accounts/:id
//@access PRIVATE
const deleteAccount = asyncHandler(async (req, res) => {
  const account = await Account.findOne({ _id: req.params.id, user: req.user });

  if (!account) {
    res.status(404);
    throw new Error("Account not found");
  }

  await card.remove();

  res.status(200).json({
    success: true,
    data: {},
  });
});

export { getAll, getAccount, createAccount, updateAccount, deleteAccount };
