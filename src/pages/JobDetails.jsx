// src/pages/JobDetails.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/JobDetails.css";

const API_BASE = "https://jobs-backend-z4z9.onrender.com/api";

const JobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false); // 🔹 modal state

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await axios.get(`${API_BASE}/jobs/${id}`);
        setJob(res.data);
      } catch (err) {
        setError("Failed to load job details.");
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [id]);

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API_BASE}/jobs/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setShowModal(false);
      navigate("/jobs"); // ✅ go back to manage jobs
    } catch (err) {
      alert("Error deleting job.");
    }
  };

  if (loading) return <p className="text-center loading">Loading job details...</p>;
  if (error) return <p className="text-center error">{error}</p>;
  if (!job) return <p className="text-center no-data">Job not found</p>;

  return (
    <div className="job-details-container">
      <h2>{job.title}</h2>

      {job.companyImage && (
        <img src={job.companyImage} alt={job.company} className="company-img" />
      )}

      <div className="job-info">
        <p><span>Company:</span> {job.companyName}</p>
        <p><span>Location:</span> {job.location}</p>
        <p><span>Type:</span> {job.jobType || job.type}</p>
        <p><span>Salary:</span> ₹ {job.salary?.toLocaleString()}</p>
        <p><span>Description:</span> {job.description}</p>
      </div>

      {job.requirements?.length > 0 && (
        <div className="job-requirements">
          <h4>Requirements</h4>
          <ul>
            {job.requirements.map((req, idx) => (
              <li key={idx}>{req}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="job-actions">
        <button
          className="btn btn-primary"
          onClick={() => navigate(`/admin/jobs/edit/${id}`)} // ✅ edit page
        >
          Edit Job
        </button>
        <button
          className="btn btn-danger"
          onClick={() => setShowModal(true)} // ✅ open modal
        >
          Delete Job
        </button>
      </div>

      {/* 🔹 Delete Confirmation Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h3>Are you sure you want to delete this job?</h3>
            <div className="modal-actions">
              <button className="btn btn-danger" onClick={handleDelete}>
                Yes, Delete
              </button>
              <button className="btn btn-secondary" onClick={() => setShowModal(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobDetails;
