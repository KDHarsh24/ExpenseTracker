const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { getDB } = require("../config/db");
const protect = require("../middleware/authMiddleware");
const { ObjectId } = require("mongodb");  // <-- Add this

const router = express.Router();

// Register
router.post("/register", async (req, res) => {
    try {
        const { firstName, lastName, email, password } = req.body;
        const db = getDB();

        const existingUser = await db.collection("users").findOne({ email });
        if (existingUser) return res.status(400).json({ message: "User already exists" });

        const hashedPassword = await bcrypt.hash(password, 10);
        await db.collection("users").insertOne({ firstName, lastName, email, password: hashedPassword });

        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

// Login
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const db = getDB();
        const user = await db.collection("users").findOne({ email });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
        });

        res.json({ message: "Login successful", user: { firstName: user.firstName, email: user.email } });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

// Logout
router.post("/logout", (req, res) => {
    res.cookie("token", "", { expires: new Date(0) });
    res.json({ message: "Logged out successfully" });
});

// Get user info (check auth status)
router.get("/me", protect, async (req, res) => {
    try {
        const db = getDB();
        const user = await db.collection("users").findOne({ _id: new ObjectId(req.user.id) });

        if (!user) return res.status(404).json({ message: "User not found" });

        res.json({ firstName: user.firstName, email: user.email });
    } catch (error) {
        console.error("Error fetching user:", error);
        res.status(500).json({ message: "Server error" });
    }
});


module.exports = router;
