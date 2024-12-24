import React, { useState, useEffect } from "react";
import { getTransactions, addTransaction } from "../services/api";
import "./css/Transaction.css";
// import "./Dashboard.css";
import Navbar from "./Navbar";

const Transaction = () => {
  const [transactions, setTransactions] = useState([]); // State to hold transactions
  const [formData, setFormData] = useState({
    type: "",
    amount: "",
    category: "",
    date: "",
  }); // State for new transaction form
  const [error, setError] = useState(""); // State for errors
  const [loading, setLoading] = useState(false); // State for loading spinner

  // Fetch transactions on component load
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true);
        const { data } = await getTransactions(); // API call to get transactions
        setTransactions(data); // Update state with fetched transactions
        setLoading(false);
      } catch (err) {
        setLoading(false);
        console.error(
          "Error fetching transactions: ",
          err.response?.data || err.message
        );
        setError("Failed to fetch transactions. Please try again.");
      }
    };

    fetchTransactions();
  }, []);

  // Handle input change in the form
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission to add a new transaction
  const handleFormSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const { data } = await addTransaction(formData); // API call to add a transaction
      setTransactions([...transactions, data]); // Update state with the new transaction
      setFormData({ type: "", amount: "", category: "", date: "" }); // Reset the form
      setLoading(false);
    } catch (err) {
      setLoading(false);
      console.error("Error response:", err.response); // Log detailed error response
      setError(
        err.response?.data?.error ||
          "Failed to add transaction. Please try again."
      );
    }
  };

  return (
    <>
      <Navbar></Navbar>
    <div className="transaction-container">
      <h2>Transactions</h2>

      {/* Transaction List */}
      <ul>
        {loading ? (
          <p>Loading...</p>
        ) : (
          transactions.map((tx) => (
            <li key={tx._id}>
              <strong
                style={{
                  color: tx.type === "Income" ? "#00C49F" : "#FF8042",
                }}
              >
                {tx.type}
              </strong>
              : ${tx.amount} | {tx.category} on{" "}
              {new Date(tx.date).toLocaleDateString()}
            </li>
          ))
        )}
      </ul>

      {/* Add Transaction Form */}
      <form onSubmit={handleFormSubmit}>
        <label>
          Type:
          <select
            name="type"
            value={formData.type}
            onChange={handleInputChange}
            required
          >
            <option value="">Select Type</option>
            <option value="Income">Income</option>
            <option value="Expense">Expense</option>
          </select>
        </label>
        <label>
          Amount:
          <input
            type="number"
            name="amount"
            value={formData.amount}
            onChange={handleInputChange}
            required
          />
        </label>
        <label>
          Category:
          <input
            type="text"
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            required
          />
        </label>
        <label>
          Date:
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleInputChange}
            required
          />
        </label>
        <button type="submit">Add Transaction</button>
      </form>
    </div>
    </>
  );
};

export default Transaction;
