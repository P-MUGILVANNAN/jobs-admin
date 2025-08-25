// src/pages/ManageJobs.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/managejobs.css";

const API_BASE = "https://jobs-backend-z4z9.onrender.com/api";

function ManageJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const navigate = useNavigate();

  // 🔹 Fetch Jobs
  const fetchJobs = async (pageNum = 1) => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE}/jobs?page=${pageNum}&limit=10`);
      setJobs(res.data.jobs || []);
      setTotalPages(res.data.totalPages || 1);
    } catch (err) {
      console.error("Error fetching jobs:", err);
      setError("Failed to load jobs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs(page);
  }, [page]);

  // 🔹 Delete Job
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this job?")) return;
    try {
      const token = localStorage.getItem("token"); // must be admin
      await axios.delete(`${API_BASE}/jobs/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setJobs(jobs.filter((job) => job._id !== id));
    } catch (err) {
      console.error("Delete error:", err);
      alert("Failed to delete job");
    }
  };

  return (
    <div className="managejobs-container container mt-4">
      <h2 className="text-center mb-4 fw-bold">Manage Jobs</h2>

      {loading ? (
        <div className="text-center my-5">
          <div className="spinner-border text-primary" role="status"></div>
          <p className="mt-2">Loading jobs...</p>
        </div>
      ) : error ? (
        <div className="alert alert-danger text-center">{error}</div>
      ) : jobs.length === 0 ? (
        <div className="alert alert-info text-center">No jobs available</div>
      ) : (
        <div className="table-responsive shadow rounded">
          <table className="table table-hover align-middle">
            <thead className="table-dark">
              <tr>
                <th>S.No</th>
                <th>Company</th>
                <th>Job Title</th>
                <th>Location</th>
                <th>Type</th>
                <th>Experience</th>
                <th>Salary</th>
                <th>Posted</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {jobs.map((job, index) => (
                <tr key={job._id}>
                  <td>{index + 1 + (page - 1) * 10}</td>
                  <td>
                    {job.companyImage ? (
                      <img
                        src={job.companyImage}
                        alt="company"
                        style={{
                          width: "40px",
                          height: "40px",
                          objectFit: "cover",
                          borderRadius: "50%",
                        }}
                      />
                    ) : (
                      <span className="text-muted">No Logo</span>
                    )}
                  </td>
                  <td>{job.title}</td>
                  <td>{job.location}</td>
                  <td>
                    <span className="badge bg-primary">{job.jobType}</span>
                  </td>
                  <td>
                    <span className="badge bg-info">{job.experience}</span>
                  </td>
                  <td>₹ {job.salary.toLocaleString()}</td>
                  <td>{new Date(job.createdAt).toLocaleDateString()}</td>
                  <td className="text-center">
                    <button
                      className="btn btn-sm btn-info me-2"
                      onClick={() => navigate(`/admin/jobs/${job._id}`)}
                    >
                      View Details
                    </button>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => handleDelete(job._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="d-flex justify-content-center mt-3">
          <nav>
            <ul className="pagination">
              <li className={`page-item ${page === 1 ? "disabled" : ""}`}>
                <button className="page-link" onClick={() => setPage(page - 1)}>
                  Previous
                </button>
              </li>
              {[...Array(totalPages)].map((_, idx) => (
                <li
                  key={idx}
                  className={`page-item ${page === idx + 1 ? "active" : ""}`}
                >
                  <button className="page-link" onClick={() => setPage(idx + 1)}>
                    {idx + 1}
                  </button>
                </li>
              ))}
              <li
                className={`page-item ${page === totalPages ? "disabled" : ""}`}
              >
                <button className="page-link" onClick={() => setPage(page + 1)}>
                  Next
                </button>
              </li>
            </ul>
          </nav>
        </div>
      )}
    </div>
  );
}

export default ManageJobs;
