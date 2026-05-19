import jwt from "jsonwebtoken";
import User from "../models/User.js";

function generateToken(id) {
  return jwt.sign({ id }, process.env.JWT_SECRET || "hh_super_secret_jwt_key_9988", {
    expiresIn: "30d",
  });
}

// @desc    Register a new user
// @route   POST /api/auth/register
export async function registerUser(req, res) {
  const { username, email, password } = req.body;

  try {
    if (!username || !email || !password) {
      return res.status(400).json({ message: "Please fill in all credentials" });
    }

    const emailExists = await User.findOne({ email });
    if (emailExists) {
      return res.status(400).json({ message: "Email has already been registered" });
    }

    const usernameExists = await User.findOne({ username });
    if (usernameExists) {
      return res.status(400).json({ message: "Username is already taken" });
    }

    const user = await User.create({ username, email, password });

    res.status(201).json({
      token: generateToken(user._id),
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
export async function loginUser(req, res) {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ message: "Please provide both email and password" });
    }

    const user = await User.findOne({ email });
    if (user && (await user.matchPassword(password))) {
      res.json({
        token: generateToken(user._id),
        user: {
          _id: user._id,
          username: user.username,
          email: user.email,
        },
      });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// @desc    Get user profile
// @route   GET /api/auth/profile
export async function getUserProfile(req, res) {
  try {
    // req.user has already been populated by authMiddleware
    res.json({
      _id: req.user._id,
      username: req.user.username,
      email: req.user.email,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}