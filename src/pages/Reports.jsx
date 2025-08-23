import React from "react";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";
import "../styles/reports.css";

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement
);

function Reports() {
  // Mock Data (later connect with backend API)
  const totalJobs = 25;
  const jobsByCategory = {
    IT: 10,
    "Data Science": 5,
    Marketing: 4,
    HR: 3,
    Design: 3,
  };
  const jobsByLocation = {
    Chennai: 8,
    Bangalore: 7,
    Delhi: 4,
    Mumbai: 3,
    Remote: 3,
  };

  const categoryData = {
    labels: Object.keys(jobsByCategory),
    datasets: [
      {
        label: "Jobs by Category",
        data: Object.values(jobsByCategory),
        backgroundColor: ["#1a237e", "#3949ab", "#5c6bc0", "#7986cb", "#9fa8da"],
      },
    ],
  };

  const locationData = {
    labels: Object.keys(jobsByLocation),
    datasets: [
      {
        label: "Jobs by Location",
        data: Object.values(jobsByLocation),
        backgroundColor: "#1a237e",
      },
    ],
  };

  return (
    <div className="reports-container">
      <h2 className="mb-4 text-center">Reports & Analytics</h2>

      <div className="row mb-4">
        <div className="col-md-4">
          <div className="card summary-card">
            <div className="card-body text-center">
              <h5>Total Jobs Posted</h5>
              <h2 className="royal-text">{totalJobs}</h2>
            </div>
          </div>
        </div>
      </div>

      <div className="row mb-4">
        <div className="col-md-6">
          <div className="card chart-card">
            <div className="card-body">
              <h5 className="text-center">Jobs by Category</h5>
              <Pie data={categoryData} />
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card chart-card">
            <div className="card-body">
              <h5 className="text-center">Jobs by Location</h5>
              <Bar data={locationData} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Reports;
