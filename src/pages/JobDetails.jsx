// src/pages/JobDetails.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

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
        navigate("/admin/jobs"); // redirect back to jobs list
      } catch (err) {
        alert("Error deleting job.");
      }
    }
  };

  if (loading) return <p className="text-center">Loading job details...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="max-w-3xl mx-auto bg-white shadow-md rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-4">{job.title}</h2>
      {job.companyImage && (
        <img
          src={job.companyImage}
          alt="Company"
          className="w-32 h-32 object-cover mb-4 rounded"
        />
      )}
      <p className="mb-2">
        <span className="font-semibold">Company:</span> {job.company}
      </p>
      <p className="mb-2">
        <span className="font-semibold">Location:</span> {job.location}
      </p>
      <p className="mb-2">
        <span className="font-semibold">Type:</span> {job.type}
      </p>
      <p className="mb-2">
        <span className="font-semibold">Description:</span> {job.description}
      </p>
      {job.requirements && (
        <div className="mb-2">
          <span className="font-semibold">Requirements:</span>
          <ul className="list-disc ml-5">
            {job.requirements.map((req, idx) => (
              <li key={idx}>{req}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="flex gap-4 mt-6">
        <button
          onClick={() => navigate(`/admin/jobs/edit/${id}`)}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          Edit Job
        </button>
        <button
          onClick={handleDelete}
          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
        >
          Delete Job
        </button>
      </div>
    </div>
  );
};

export default JobDetails;
