const express = require("express");
const Goal = require("../models/Goal");
const Transaction = require("../models/Transaction")
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");


const router = express.Router();

// Middleware to authenticate requests
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

// Route to create a new goal
router.post("/", authenticate, async (req, res) => {
  const { title, targetAmount, deadline, category } = req.body;
  const userId = req.user.id;

  try {
    // Calculate the total income for the user
    const totalIncome = await Transaction.aggregate([
      { $match: { userId: mongoose.Types.ObjectId.createFromHexString(userId), type: "Income" } },
      { $group: { _id: null, totalIncome: { $sum: "$amount" } } },
    ]);

    const currentAmount = totalIncome.length > 0 ? totalIncome[0].totalIncome : 0;

    const newGoal = new Goal({
      userId,
      title,
      targetAmount,
      deadline,
      category,
      currentAmount, // Dynamically set currentAmount from transactions
    });

    await newGoal.save();
    res.status(201).json(newGoal);
  } catch (err) {
    console.error("Error creating goal:", err);
    res.status(500).json({ error: "Failed to create goal" });
  }
});


router.get("/", authenticate, async (req, res) => {
  try {
    const userId = req.user.id;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      throw new Error("Invalid userId");
    }    

    // Calculate the total income for the user
    const totalIncome = await Transaction.aggregate([
      { $match: { userId: mongoose.Types.ObjectId.createFromHexString(userId), type: "Income" } },
      { $group: { _id: null, totalIncome: { $sum: "$amount" } } },
    ]);

    const currentAmount = totalIncome.length > 0 ? totalIncome[0].totalIncome : 0;

    // Fetch user goals and attach dynamic currentAmount
    const goals = await Goal.find({ userId }).sort({ deadline: 1 });

    const updatedGoals = goals.map((goal) => ({
      ...goal.toObject(),
      currentAmount, // Dynamically set currentAmount
    }));

    res.status(200).json(updatedGoals);
  } catch (err) {
    console.error("Error fetching goals:", err);
    res.status(500).json({ error: "Failed to fetch goals" });
  }
});

router.put("/:id", authenticate, async (req, res) => {
  const { targetAmount } = req.body;

  // Validate targetAmount
  if (typeof targetAmount !== "number" || targetAmount <= 0) {
    return res.status(400).json({ error: "Invalid target amount" });
  }

  try {
    // Find and update the goal, ensuring it belongs to the authenticated user
    const updatedGoal = await Goal.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { targetAmount }, // Update only the targetAmount field
      { new: true } // Return the updated document
    );

    // Handle case where the goal is not found
    if (!updatedGoal) {
      return res.status(404).json({ error: "Goal not found" });
    }

    // Respond with the updated goal
    res.status(200).json(updatedGoal);
  } catch (err) {
    console.error("Error updating goal:", err);
    res.status(500).json({ error: "Failed to update goal" });
  }
});


module.exports = router;
