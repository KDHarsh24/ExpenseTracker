const express = require("express");
const { getDB } = require("../config/db");
const protect = require("../middleware/authMiddleware");
const { ObjectId } = require("mongodb");  // <-- Add this
const router = express.Router();

// Add expense
router.post("/", protect, async (req, res) => {
    try {
        const { amount, category, date, description } = req.body;
        const db = getDB();

        const newExpense = { 
            userId: req.user.id, 
            amount: parseFloat(amount), 
            category, 
            date: new Date(date), 
            description 
        };

        await db.collection("expenses").insertOne(newExpense);

        res.status(201).json(newExpense);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

// Get expenses (with filtering & pagination)
router.get("/", protect, async (req, res) => {
    try {
        const { category, startDate, endDate, page = 1, limit = 10 } = req.query;
        const db = getDB();
        const filters = { userId: req.user.id };

        if (category) filters.category = category;
        if (startDate || endDate) {
            filters.date = {};
            if (startDate) filters.date.$gte = new Date(startDate);
            if (endDate) filters.date.$lte = new Date(endDate);
        }

        const expenses = await db.collection("expenses")
            .find(filters)
            .sort({ date: -1 })
            .skip((page - 1) * limit)
            .limit(parseInt(limit))
            .toArray();

        res.json(expenses);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

// Update an expense
router.put("/:id", protect, async (req, res) => {
    try {
        const { id } = req.params;
        const { amount, category, date, description } = req.body;
        const db = getDB();
        console.log('debug1')
        const updatedExpense = await db.collection("expenses").findOneAndUpdate(
            { _id: new ObjectId(id), userId: req.user.id },
            { $set: { amount: parseFloat(amount), category, date: new Date(date), description } },
            { returnDocument: "after" }
        );
        // if (!updatedExpense.value) {
        //     console.log('debug3')
        //     return res.status(404).json({ message: "Expense not found" });
        // }

        res.json(updatedExpense.value);
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Server error" });
    }
});

// Delete an expense
router.delete("/:id", protect, async (req, res) => {
    try {
        const { id } = req.params;
        const db = getDB();
        console.log(req.user.id)
        const deletedExpense = await db.collection("expenses").findOneAndDelete({
            _id: new ObjectId(id),
            userId: req.user.id
        });


        res.json({ message: "Expense deleted successfully", deletedExpense: deletedExpense.value });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

// Insights - Total Spending Per Category
router.get("/insights", protect, async (req, res) => {
    try {
        const db = getDB();

        const insights = await db.collection("expenses").aggregate([
            { $match: { userId: req.user.id } },
            { $group: { _id: "$category", total: { $sum: "$amount" } } }
        ]).toArray();

        res.json(insights);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;
