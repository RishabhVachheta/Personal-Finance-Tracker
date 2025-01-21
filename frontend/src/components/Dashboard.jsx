import React, { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip as RechartsTooltip } from "recharts";
import { Line } from "react-chartjs-2";
import dayjs from "dayjs";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { getTransactions } from "../services/api";
import "./css/Dashboard.css";
import Categories from "./Categories";
import FinancialTrends from "./FinancialTrends";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const [transactions, setTransactions] = useState([]);
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  // Fetch transactions on component mount
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const { data } = await getTransactions();
        setTransactions(data);
        console.log("Data", data);
      } catch (err) {
        console.error(err.message);
      }
    };
    fetchTransactions();
  }, []);

  const COLORS = [
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#A28CFF",
    "#FF6666",
    "#66B2FF",
    "#66FFB2",
  ];

  const pieData = transactions.map((t) => ({
    name: `${t.type}: ${t.date.split("T")[0]}`, // Combine type and date for the label
    value: t.amount, // Use transaction amount as the value
    type: t.type, // For color differentiation
    transaction: t,
  }));

  const handlePieSliceClick = (data) => {
    setSelectedTransaction(data.transaction); // Set the clicked transaction
  };

  // Prepare data for the line chart
  const lineChartData = {
    labels: transactions
    .sort((a, b) => new Date(a.date) - new Date(b.date)) // Sort by date
    .map((t) => dayjs(t.date).format("YYYY-MM-DD")), // Format date
    datasets: [
      {
        label: "Income",
        data: transactions.map((t) => (t.type === "Income" ? t.amount : null)),
        borderColor: "#00C49F",
        backgroundColor: "rgba(0, 196, 159, 0.2)",
        fill: false, // No fill under the line
      spanGaps: true,
        tension: 0.4, // Line curve
      },
      {
        label: "Expenses",
        data: transactions.map((t) => (t.type === "Expense" ? t.amount : null)),
        borderColor: "#FF8042", // Line color for expenses
        backgroundColor: "rgba(255, 128, 66, 0.2)",
        fill: false, // No fill under the line
      spanGaps: true,
        tension: 0.4, // Line curve
      },
    ],
  };

  console.log(transactions.map((t) => t.date));

  // Chart.js options
  const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: true, // Keep the chart proportional
    aspectRatio: 2, // Adjust the aspect ratio for width/height
    plugins: {
      legend: {
        position: "top", // Position of the legend
      },
      title: {
        display: true,
        text: "Income vs Expenses Over Time", // Title for the chart
        font: {
          size: 16, // Adjust the font size as needed
        },
      },
    },
  };

  return (
    <div className="dashboard-container">
      <div className="charts-container">
        {/* Pie Chart */}
        <div className="pie-chart">
          <PieChart width={650} height={400}>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              label={({ name, value }) => `${name}: ${value}`} // Show name and value on the chart
              outerRadius={120}
              dataKey="value"
              onClick={handlePieSliceClick}
            >
              {pieData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={
                    entry.type === "Income"
                      ? COLORS[index % COLORS.length]
                      : "#FF8042"
                  }
                />
              ))}
            </Pie>
            {/* Tooltip for the Pie Chart */}
            {/* <RechartsTooltip /> */}
          </PieChart>
        </div>

        <div className="transaction-details">
          {selectedTransaction ? (
            <div className="transaction-card">
              <h3>Transaction Details</h3>
              <p>
                <strong>Type:</strong> {selectedTransaction.type}
              </p>
              <p>
                <strong>Date:</strong> {selectedTransaction.date.split("T")[0]}
              </p>
              <p>
                <strong>Amount:</strong> ${selectedTransaction.amount}
              </p>
              <p>
                <strong>cetegory:</strong>{" "}
                {selectedTransaction.category || "N/A"}
              </p>
            </div>
          ) : (
            <p>Click on a pie chart slice to view details here.</p>
          )}
        </div>
        <Categories></Categories>
        <FinancialTrends />
        

        {/* Line Chart */}
        <div className="line-chart">
          <Line data={lineChartData} options={lineChartOptions} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
