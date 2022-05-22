import dotenv from "dotenv";
import asyncHandler from "express-async-handler";
import Category from "../models/categoryModel.js";

dotenv.config();

export const getCategories = asyncHandler(async (req, res) => {
  let { type } = req.query;

  if (type === "all") {
    type = ["income", "expense"];
  } else {
    type = [type];
  }

  const categories = await Category.find({ type: { $in: type } });

  return res.status(200).json({
    success: true,
    data: categories,
    count: categories.length,
  });
});
