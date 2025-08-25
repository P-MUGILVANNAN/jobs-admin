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
    if (window.confirm("Are you sure you want to delete this job?")) {
      try {
        await axios.delete(`${API_BASE}/jobs/${id}`);
        navigate("/admin/jobs");
      } catch (err) {
        alert("Error deleting job.");
      }
    }
  };

  if (loading) return <p className="text-center">Loading job details...</p>;
  if (error) return <p className="text-center text-error">{error}</p>;

  return (
    <div className="job-details-container">
      <h2>{job.title}</h2>

      {job.companyImage && (
        <img src={job.companyImage} alt="Company" />
      )}

      <p>
        <span>Company:</span> {job.company}
      </p>
      <p>
        <span>Location:</span> {job.location}
      </p>
      <p>
        <span>Type:</span> {job.type}
      </p>
      <p>
        <span>Description:</span> {job.description}
      </p>

      {job.requirements && (
        <div>
          <span>Requirements:</span>
          <ul>
            {job.requirements.map((req, idx) => (
              <li key={idx}>{req}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="job-actions">
        <button
          onClick={() => navigate(`/admin/jobs/edit/${id}`)}
          className="edit-btn"
        >
          Edit Job
        </button>
        <button onClick={handleDelete} className="delete-btn">
          Delete Job
        </button>
      </div>
    </div>
  );
};

export default JobDetails;
