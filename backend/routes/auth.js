const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const auth = require("../middleware/auth");

// Register user
router.post("/register", async (req, res) => {
  try {
    console.log("Registration request received:", req.body);
    const { email, password, name } = req.body;

    // Validate input
    if (!email || !password || !name) {
      console.log("Missing required fields");
      return res.status(400).json({ message: "All fields are required" });
    }

    // Initialize global users array
    if (!global.users) {
      global.users = [];
    }

    // Check if user already exists
    let user = global.users.find((u) => u.email === email.toLowerCase());
    if (user) {
      console.log("User already exists:", email);
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    user = {
      _id: Date.now().toString(),
      email: email.toLowerCase(),
      password: hashedPassword,
      name,
      createdAt: new Date(),
    };

    global.users.push(user);
    console.log("User created successfully:", user.email);

    // Create token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "24h",
    });

    res.status(201).json({
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Login user
router.post("/login", async (req, res) => {
  try {
    console.log("Login request received:", req.body);
    const { email, password } = req.body;

    if (!global.users) {
      global.users = [];
    }

    // Check if user exists
    const user = global.users.find((u) => u.email === email.toLowerCase());
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Create token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "24h",
    });

    res.json({
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get user profile
router.get("/profile", auth, async (req, res) => {
  try {
    if (!global.users) {
      return res.status(404).json({ message: "User not found" });
    }

    const user = global.users.find((u) => u._id === req.user.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      _id: user._id,
      email: user.email,
      name: user.name,
      createdAt: user.createdAt,
    });
  } catch (error) {
    console.error("Profile error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
