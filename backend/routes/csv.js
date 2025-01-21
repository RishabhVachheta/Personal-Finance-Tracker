const express = require("express");
const { Parser } = require("json2csv");
const Transaction = require("../models/Transaction");
const authenticate = require("../middleware/authenticate");

const router = express.Router();

router.get("/export/csv", authenticate, async (req, res) => {
  try {
    const transactions = await Transaction.find({ userId: req.user.id });
    // console.log("Transactions fetched:", transactions); 

    if (!transactions.length) {
      return res.status(404).json({ message: "No transactions found" });
    }

    const fields = [
      { label: "Date", value: "date" },
      { label: "Type", value: "type" },
      { label: "Amount", value: "amount" },
      { label: "Category", value: "category" },
      { label: "Notes", value: "notes" },
    ];

    const json2csvParser = new Parser({ fields });
    const csv = json2csvParser.parse(transactions);

    res.header("Content-Type", "text/csv");
    res.attachment("Transactions.csv");
    res.send(csv);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
