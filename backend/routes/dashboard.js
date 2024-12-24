const express = require("express");
const router = express.Router();
const Transaction = require("../models/Transaction");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const { Types } = mongoose;

const authenticate = (req, res, next) => {
  const token = req.header("Authorization");
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  try {
    const cleanToken = token.startsWith("Bearer ") ? token.split(" ")[1] : token;
    const verified = jwt.verify(cleanToken, process.env.JWT_SECRET);
    req.user = verified; // Attach user data (e.g., userId) to request object
    next();
  } catch (err) {
    res.status(400).json({ message: "Invalid Token" });
  }
};

// Endpoint to fetch dashboard data
router.get("/", authenticate, async (req, res) => {
  try {
    const userId = req.user.id; // Extract the userId from the token

    // Today's Date
    const today = new Date();
    const todayStart = new Date(today.setHours(0, 0, 0, 0));
    const todayEnd = new Date(today.setHours(23, 59, 59, 999));
    
    // Week Start Date
    const weekStart = new Date();
    weekStart.setDate(today.getDate() - 7);
    
    // Fetch transactions for the logged-in user
    const transactions = await Transaction.find({ userId });
    
    // Calculate spending by category for the logged-in user
    const spendingByCategory = transactions.reduce((acc, tx) => {
      if (!acc[tx.category]) acc[tx.category] = 0;
      acc[tx.category] += tx.amount;
      return acc;
    }, {});
    
    // const objectId = new mongoose.Types.ObjectId(userId);
    const objectId = mongoose.Types.ObjectId.createFromHexString(userId);
    
    const todayExpenses = await Transaction.aggregate([
      {
        $match: {
          userId: objectId, // Filter by logged-in user's ID
          date: { $gte: todayStart, $lte: todayEnd },
          type: "Expense",
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$amount" },
        },
      },
    ]);

    const weekExpenses = await Transaction.aggregate([
      {
        $match: {
          userId: objectId, 
          date: { $gte: weekStart },
          type: "Expense",
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$amount" },
        },
      },
    ]);
    
    // Calculate daily transaction frequency for the logged-in user
    const dailyFrequency = await Transaction.countDocuments({
      userId, // Filter by logged-in user's ID
      date: { $gte: todayStart, $lte: todayEnd },
    });

    // Calculate weekly transaction frequency for the logged-in user
    const weeklyFrequency = await Transaction.countDocuments({
      userId, // Filter by logged-in user's ID
      date: { $gte: weekStart },
    });

    // Send response
    res.json({
      spendingByCategory,
      totalExpenses: {
        today: todayExpenses[0]?.total || 0,
        week: weekExpenses[0]?.total || 0,
      },
      frequency: {
        daily: dailyFrequency,
        weekly: weeklyFrequency,
      },
    });
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    res.status(500).json({ error: "Failed to fetch dashboard data" });
  }
});

module.exports = router;
