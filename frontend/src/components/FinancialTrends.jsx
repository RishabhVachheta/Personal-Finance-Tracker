import React, { useEffect, useState } from "react";
import {
  getSpendingTrends,
  getCategoryInsights,
  getPredictedExpenses,
} from "../services/api";
import "./css/FinancialTrends.css";

const FinancialTrends = () => {
  const [spendingTrends, setSpendingTrends] = useState([]);
  const [categoryInsights, setCategoryInsights] = useState([]);
  const [predictedExpense, setPredictedExpense] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [trends, insights, prediction] = await Promise.all([
          getSpendingTrends(),
          getCategoryInsights(),
          getPredictedExpenses(),
        ]);

        setSpendingTrends(Array.isArray(trends.data) ? trends.data : []);
        setCategoryInsights(Array.isArray(insights.data) ? insights.data : []);
        setPredictedExpense(
          typeof prediction.data === "number" ? prediction.data : 0
        );
      } catch (err) {
        setError("Failed to load financial trends. Please try again.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <section className="financial-trends-container">
      <h2 className="financial-trends-heading">Spending Trends</h2>
      {spendingTrends.length === 0 ? (
        <p className="financial-trends-no-data">
          No spending trends available.
        </p>
      ) : (
        <ul className="financial-trends-list">
          {spendingTrends.map((trend, index) => (
            <li key={index} className="financial-trends-item">
              <span className="financial-trends-date">
                {trend._id.month}/{trend._id.year}:
              </span>{" "}
              <span className="financial-trends-amount">
                ${trend.total.toFixed(2)}
              </span>
            </li>
          ))}
        </ul>
      )}

      <h2 className="financial-trends-heading">Category Insights</h2>
      {categoryInsights.length === 0 ? (
        <p className="financial-trends-no-data">
          No category insights available.
        </p>
      ) : (
        <ul className="financial-trends-list">
          {categoryInsights.map((insight, index) => (
            <li key={index} className="financial-trends-item">
              <span className="financial-trends-category">{insight._id}:</span>{" "}
              <span className="financial-trends-amount">
                ${insight.total.toFixed(2)}
              </span>
            </li>
          ))}
        </ul>
      )}

      <h2 className="financial-trends-heading">Predicted Monthly Expenses</h2>
      <p className="financial-trends-predicted">
        ${predictedExpense.toFixed(2)}
      </p>
    </section>
  );
};

export default FinancialTrends;
