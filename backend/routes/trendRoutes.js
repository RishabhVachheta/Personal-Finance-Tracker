const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const Transaction = require("../models/Transaction");
const authenticate = require("../middleware/authenticate");

router.get("/spending-trends", authenticate, async (req, res) => {
  const userId = req.user.id;
  const objectId = mongoose.Types.ObjectId.createFromHexString(userId);
  try {
    const trends = await Transaction.aggregate([
      {
        $match: {
          userId: objectId, 
          type: "Expense",
        },
      },
      {
        $group: {
          _id: { month: { $month: "$date" }, year: { $year: "$date" } },
          total: { $sum: "$amount" },
        },
      },
    ]);
    res.json(trends);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to fetch trends" });
  }
});

router.get("/category-insights", authenticate, async (req, res) => {
  const userId = req.user.id;
  const objectId = mongoose.Types.ObjectId.createFromHexString(userId);
  try {
    const insights = await Transaction.aggregate([
      { $match: { userId: objectId, type: "Expense" } },
      {
        $group: {
          _id: "$category",
          total: { $sum: "$amount" },
        },
      },
    ]);
    res.json(insights);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch category insights" });
  }
});

router.get("/predict-expenses", authenticate, async (req, res) => {
  const userId = req.user.id;
  const objectId = mongoose.Types.ObjectId.createFromHexString(userId);
  try {
    const predictions = await Transaction.aggregate([
      { $match: { userId: objectId, type: "Expense" } },
      {
        $group: {
          _id: { month: { $month: "$date" }, year: { $year: "$date" } },
          total: { $sum: "$amount" },
        },
      },
      { $group: { _id: null, avgMonthlyExpense: { $avg: "$total" } } },
    ]);
    res.json(predictions[0]?.avgMonthlyExpense || 0);
  } catch (err) {
    res.status(500).json({ error: "Failed to predict expenses" });
  }
});

module.exports = router;
