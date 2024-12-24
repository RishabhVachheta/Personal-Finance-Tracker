
import React, { useEffect, useState } from "react";
import { getDashboardData } from "../services/api"; // Adjust the import path based on your file structure
import "./css/Categories.css"; // Import the new CSS file

const Categories = () => {
  const [dashboardData, setDashboardData] = useState(null); // State to store the dashboard data
  const [loading, setLoading] = useState(true); // State to show loading status
  const [error, setError] = useState(null); // State to handle errors

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await getDashboardData(); // Call the API to get dashboard data
        setDashboardData(response.data); // Store the data in state
        setLoading(false); // Set loading to false once data is fetched
        console.log(response.data);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError("Failed to fetch data. Please try again later."); // Set error message
        setLoading(false); // Set loading to false
      }
    };

    fetchDashboardData();
  }, []); // Empty dependency array ensures this runs only once on mount

  if (loading) {
    return <div>Loading...</div>; // Show loading spinner or message
  }

  if (error) {
    return <div>{error}</div>; // Show error message if any
  }

  return (
      <div className="dashboard-content">
        {/* Cards Section */}
        <div className="cards-container">
          {/* Spending by Category */}
          <div className="row">
          <div className="card popular-category">
            <h3>Spending by Category</h3>
            <div>
              {Object.entries(dashboardData.spendingByCategory).map(([category, Expense]) => (
                <div key={category}>
                  <strong>{category}:</strong> ${Expense}
                </div>
              ))}
            </div>
          </div>

          {/* Total Expenses */}
          <div className="card total-expenses">
            <h3>Total Expenses</h3>
            <p>
              <strong>Today:</strong> ${dashboardData.totalExpenses.today}
            </p>
            <p>
              <strong>This Week:</strong> ${dashboardData.totalExpenses.week}
            </p>
          </div>
          </div>

          {/* Transaction Frequency */}
          <div class="row">
          <div className="card transaction-frequency">
            <h3>Transaction Frequency</h3>
            <p>
              <strong>Daily:</strong> {dashboardData.frequency.daily} transactions
            </p>
            <p>
              <strong>Weekly:</strong> {dashboardData.frequency.weekly} transactions
            </p>
          </div>
          </div>
        </div>
      </div>
  );
};

export default Categories;
