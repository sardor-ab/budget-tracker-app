import asyncHandler from "express-async-handler";
import Account from "../models/accountModel.js";
import User from "../models/userModel.js";

//@description Provide all accounts based on user
//@route GET /api/accounts
//@access PRIVATE
const getUserAccounts = asyncHandler(async (req, res) => {
  const accounts = await Account.find({ user: req.user });

  if (accounts.length != 0) {
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

  Account.findByIdAndUpdate(
    req.params.id,
    {
      $set: {
        title,
        currency,
        balance,
        type,
      },
    },
    { new: true },
    function (error, { title, currency, balance, type }) {
      if (error) {
        res.send(error);
      } else {
        res.json({
          success: true,
          data: {
            title,
            currency,
            balance,
            type,
          },
        });
      }
    }
  );
});

//@description Delete account
//@route DELETE api/accounts/:id
//@access PRIVATE
const deleteAccount = asyncHandler(async (req, res) => {
  console.log("first");
  const account = await Account.findOne({ _id: req.params.id, user: req.user });

  if (!account) {
    res.status(404);
    throw new Error("Account not found");
  }

  await account.remove();

  res.status(200).json({
    success: true,
    data: {},
  });
});

export {
  getUserAccounts,
  getAccount,
  createAccount,
  updateAccount,
  deleteAccount,
};
