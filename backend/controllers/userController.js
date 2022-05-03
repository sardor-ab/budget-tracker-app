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
      success: true,
      data: {
        id: user.id,
        name: user.name,
        role: user.role,
        token: `Bearer ${token}`,
      },
    });
  } else {
    res
      .status(401)
      .json({ success: false, message: "Incorrect username or password" });
  }
});

//@description Register a new user
//@route POST api/users/register
//@access PUBLIC
const registerUser = asyncHandler(async (req, res) => {
  const { email, password, name } = req.body;

  const userExists = await User.findOne({ email: email });

  if (userExists) {
    return res
      .status(400)
      .json({ success: false, message: "Email account is already in use!" });
  }

  const user = await User.create({
    name,
    email,
    password,
  });

  if (user) {
    const token = generateToken({ user });

    return res.status(201).json({
      success: true,
      data: {
        id: user.id,
        name: user.name,
        role: user.role,
        token: `Bearer ${token}`,
      },
    });
  } else {
    return res.status(400).json({
      success: false,
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

const updateProfile = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        name,
        email,
        password,
      },
    },
    { new: true },
    (err, transaction) => {
      if (err) {
        return res.status(400).json({
          success: false,
          error: err,
        });
      } else {
        return res.json({
          success: true,
          data: transaction,
        });
      }
    }
  );
});

export { authUser, registerUser, getProfile, updateProfile };
