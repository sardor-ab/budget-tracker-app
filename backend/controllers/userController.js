import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import asyncHandler from "express-async-handler";

const generateToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

//@description Auth and get token
//@route POST api/users/login
//@access PUBLIC
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    const payload = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    };

    const token = generateToken(payload);

    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: `Bearer ${token}`,
    });
  } else {
    res.status(401).json({ message: "Invalid credentials" });
  }
});

//@description Register a new user
//@route POST api/users/register
//@access PUBLIC
const registerUser = asyncHandler(async (req, res) => {
  const { email, password, name } = req.body;

  const userExists = User.findOne({ email });

  if (userExists) {
    res.status(400).json({ message: "User already exists!" });
  }

  const user = await User.create({
    name,
    email,
    password,
  });

  if (user) {
    const token = generateToken({ user });

    res.status(201).json({
      id: user.id,
      email: user.email,
      token: `Bearer ${token}`,
    });
  } else {
    res.status(400).json({
      message: "Invalid user data!",
    });
  }
});

//@description Get user info
//@route GET api/users/profile
//@access PRIVATE
const getProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.role,
    });
  } else {
    res.status(404).json({
      message: "No found user!",
    });
  }
});

export { authUser, registerUser, getProfile };
