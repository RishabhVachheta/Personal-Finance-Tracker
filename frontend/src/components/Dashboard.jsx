import React, { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip as RechartsTooltip  } from "recharts";
import { Line } from "react-chartjs-2";
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

  // Fetch transactions on component mount
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const { data } = await getTransactions();
        setTransactions(data);
        console.log("Data",data);
      } catch (err) {
        console.error(err.message);
      }
    };
    fetchTransactions();
  }, []);

  // // Calculate income and expenses
  // const income = transactions
  //   .filter((t) => t.type === "Income")
  //   .reduce((acc, t) => acc + t.amount, 0);
  // const expense = transactions
  //   .filter((t) => t.type === "Expense")
  //   .reduce((acc, t) => acc + t.amount, 0);

  // // Prepare data for the pie chart
  // const pieData = [
  //   { name: "Income", value: income },
  //   { name: "Expense", value: expense },
  // ];

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
  }));

  // Prepare data for the line chart
  const lineChartData = {
    labels: transactions.map((t) => t.date.split("T")[0]), // Extract dates from transactions
    datasets: [
      {
        label: "Income",
        data: transactions
          .filter((t) => t.type === "Income")
          .map((t) => t.amount), // Income amounts
        borderColor: "#00C49F", 
        backgroundColor: "rgba(0, 196, 159, 0.2)", 
        tension: 0.4, // Line curve
      },
      {
        label: "Expenses",
        data: transactions
          .filter((t) => t.type === "Expense")
          .map((t) => t.amount), // Expense amounts
        borderColor: "#FF8042", // Line color for expenses
        backgroundColor: "rgba(255, 128, 66, 0.2)", 
        tension: 0.4, // Line curve
      },
    ],
  };

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
          size: 16 // Adjust the font size as needed
      }
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
            >
              {pieData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.type === "Income" ? COLORS[index % COLORS.length] : "#FF8042"}
                />
              ))}
            </Pie>
            {/* Tooltip for the Pie Chart */}
            <RechartsTooltip />
          </PieChart>
        </div>

      <Categories></Categories>
        {/* Line Chart */}
        <div className="line-chart">
          <Line data={lineChartData} options={lineChartOptions} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
