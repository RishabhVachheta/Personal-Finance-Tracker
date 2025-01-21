import React from "react";
import { ExportButtons } from "../services/api"; // Adjust the path if needed

const ExportCSV = () => {
  const handleExport = async () => {
    try {
      // Call the ExportButtons API to get the CSV file
      const response = await ExportButtons();

      // Create a Blob from the response data
      const blob = new Blob([response.data], { type: "text/csv" });

      // Create a link element to trigger the download
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "Transactions.csv"); // Set file name
      document.body.appendChild(link);
      link.click(); // Programmatically trigger the download
      document.body.removeChild(link); // Remove the link after download
    } catch (error) {
      console.error("Error exporting CSV:", error.message);
      alert("Failed to download the CSV file. Please try again.");
    }
  };

  return (
    <button onClick={handleExport} className="export-btn" style={{marginRight:15}}>
      Export CSV
    </button>
  );
};

export default ExportCSV;
