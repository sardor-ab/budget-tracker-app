import dotenv from "dotenv";
import asyncHandler from "express-async-handler";
import Category from "../models/categoryModel.js";
import Transaction from "../models/transactionModel.js";

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
    categories: categories,
    count: categories.length,
  });
});

export const createCategory = asyncHandler(async (req, res) => {
  let { name, type } = req.body;

  const existingCategory = await Category.find({ name });

  if (existingCategory.length > 0) {
    return res.status(409).json({
      success: false,
      message: "Category already exists",
    });
  }

  await Category.create({ name, type });
  const categories = await Category.find({});

  return res.status(201).json({
    success: true,
    categories: categories,
    message: "Category added successfully",
  });
});

export const updateCategory = asyncHandler(async (req, res) => {
  let { name, type } = req.body;
  const { categoryID } = req.query;

  const currentCategory = await Category.findById(categoryID);

  const currentCategoryName = [currentCategory.name];

  const isUsed = await Transaction.find({
    categories: { $in: currentCategoryName },
  });

  if (isUsed.length > 0) {
    return res.status(409).json({
      success: false,
      message: "Category is used in transactions",
    });
  }

  await Category.findByIdAndUpdate(categoryID, { name, type });

  const categories = await Category.find({});

  return res.status(200).json({
    success: true,
    categories: categories,
    message: "Category updated successfully",
  });
});

export const deleteCategory = asyncHandler(async (req, res) => {
  const { categoryID } = req.query;

  const currentCategory = await Category.findById(categoryID);

  const currentCategoryName = [currentCategory.name];

  const isUsed = await Transaction.find({
    categories: { $in: currentCategoryName },
  });

  if (isUsed.length > 0) {
    return res.status(409).json({
      success: false,
      message: "Category is used in transactions",
    });
  }

  await Category.findByIdAndDelete(categoryID);

  const categories = await Category.find({});

  return res.status(200).json({
    success: true,
    categories: categories,
    message: "Category deleted successfully",
  });
});
