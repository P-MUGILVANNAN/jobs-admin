// src/pages/ManageJobs.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/managejobs.css";

const API_BASE = "https://jobs-backend-z4z9.onrender.com/api";

function ManageJobs() {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  const navigate = useNavigate();

  // 🔹 Fetch Jobs
  const fetchJobs = async (pageNum = 1) => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE}/jobs?page=${pageNum}&limit=10`);
      setJobs(res.data.jobs || []);
      setFilteredJobs(res.data.jobs || []);
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
      setFilteredJobs(filteredJobs.filter((job) => job._id !== id));
    } catch (err) {
      console.error("Delete error:", err);
      alert("Failed to delete job");
    }
  };

  // 🔹 Search Filter
  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    if (!term) return setFilteredJobs(jobs);

    const filtered = jobs.filter(
      (job) =>
        job.title.toLowerCase().includes(term) ||
        (job.location && job.location.toLowerCase().includes(term)) ||
        (job.companyName && job.companyName.toLowerCase().includes(term))
    );
    setFilteredJobs(filtered);
  };

  return (
    <div className="managejobs-container container mt-4">
      {/* Header with Title, Add Job Button and Search */}
      <div className="managejobs-header d-flex flex-wrap justify-content-between align-items-center mb-3">
        <h2 className="fw-bold mb-2">Job List</h2>
        <div className="d-flex gap-2 mb-2">
          <input
            type="text"
            placeholder="Search jobs..."
            className="search-input"
            value={searchTerm}
            onChange={handleSearch}
          />
          <button
            className="btn btn-primary"
            onClick={() => navigate("/jobs/add")}
          >
            Add Job
          </button>
        </div>
      </div>

      {/* Table / Loading / Error */}
      {loading ? (
        <div className="text-center my-5">
          <div className="spinner-border text-primary" role="status"></div>
          <p className="mt-2">Loading jobs...</p>
        </div>
      ) : error ? (
        <div className="alert alert-danger text-center">{error}</div>
      ) : filteredJobs.length === 0 ? (
        <div className="alert alert-info text-center">No jobs found</div>
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
              {filteredJobs.map((job, index) => (
                <tr key={job._id}>
                  <td>{index + 1 + (page - 1) * 10}</td>
                  <td>
                    {job.companyImage ? (
                      <img
                        src={job.companyImage}
                        alt="company"
                        className="table-avatar"
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
                  <td className="actions-cell">
                    <button
                      className="btn btn-sm btn-info"
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
