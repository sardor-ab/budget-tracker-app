import dotenv from "dotenv";
import asyncHandler from "express-async-handler";
import Currency from "../models/currencyModel.js";

dotenv.config();

export const getCurrencies = asyncHandler(async (req, res) => {
  const currencies = await Currency.find({});

  return res.json({
    success: true,
    data: currencies,
  });
});
