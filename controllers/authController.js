const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Notification = require("../models/notification");

const signup = async (req, res) => {
  const { fullName, email, password, role } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      fullName,
      email,
      password: hashedPassword,
      role,
    });

    await Notification.create({
      userId: newUser._id,
      role: "admin",
      message: `👤 New ${newUser.role} registered: ${newUser.fullName} (${newUser.email})`,
      isread: false,
    });

    const token = jwt.sign({ userId: newUser._id, role: newUser.role }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    res.status(201).json({
      message: "User created successfully",
      token,
      role: newUser.role,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const foundUser = await User.findOne({ email });

    if (!foundUser) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    if (foundUser.status === "banned") {
      return res.status(403).json({
        message: "Your account has been suspended by admin.",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, foundUser.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign(
      { userId: foundUser._id, role: foundUser.role, foundUser },
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
    );

    res
      .status(200)
      .json({ message: "Login successful", token, role: foundUser.role });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const getuser = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

const putuser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.userId, req.body, {
      new: true,
    });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

const getallusers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { signup, login, getuser, putuser, getallusers };
