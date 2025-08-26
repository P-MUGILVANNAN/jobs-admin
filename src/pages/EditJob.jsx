// src/pages/EditJob.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/editjobform.css";

const API_BASE = "https://jobs-backend-z4z9.onrender.com/api";

function EditJob() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    companyName: "",
    title: "",
    description: "",
    skills: "",
    location: "",
    salary: "",
    jobType: "",
    experience: "",
  });

  const [loading, setLoading] = useState(false);

  // 🔹 Load job data
  useEffect(() => {
    const token = localStorage.getItem("token");
    axios
      .get(`${API_BASE}/jobs/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const data = res.data;
        setFormData({
          companyName: data.companyName || "",
          title: data.title || "",
          description: data.description || "",
          skills: data.skills ? data.skills.join(",") : "",
          location: data.location || "",
          salary: data.salary || "",
          jobType: data.jobType || "",
          experience: data.experience || "",
        });
      })
      .catch((err) => {
        console.error("Error fetching job:", err);
        alert("Failed to load job details.");
      });
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      // Send as JSON
      await axios.put(`${API_BASE}/jobs/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert("Job updated successfully!");
      navigate("/admin/jobs");
    } catch (err) {
      console.error("Error updating job:", err);
      alert(err.response?.data?.message || "Failed to update job");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="job-form">
      <h2>Edit Job</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="companyName"
          placeholder="Company Name"
          value={formData.companyName}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="title"
          placeholder="Job Title"
          value={formData.title}
          onChange={handleChange}
          required
        />
        <textarea
          name="description"
          placeholder="Job Description"
          value={formData.description}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="skills"
          placeholder="Skills (comma separated)"
          value={formData.skills}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="location"
          placeholder="Location"
          value={formData.location}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="salary"
          placeholder="Salary"
          value={formData.salary}
          onChange={handleChange}
          required
        />
        <select
          name="jobType"
          value={formData.jobType}
          onChange={handleChange}
          required
        >
          <option value="">Select Job Type</option>
          <option value="Full-Time">Full-Time</option>
          <option value="Part-Time">Part-Time</option>
          <option value="Internship">Internship</option>
          <option value="Contract">Contract</option>
        </select>
        <select
          name="experience"
          value={formData.experience}
          onChange={handleChange}
          required
        >
          <option value="">Select Experience</option>
          <option value="Fresher">Fresher</option>
          <option value="0-1 Years">0-1 Years</option>
          <option value="1-3 Years">1-3 Years</option>
          <option value="3-5 Years">3-5 Years</option>
          <option value="5+ Years">5+ Years</option>
        </select>

        <button type="submit" disabled={loading}>
          {loading ? "Updating..." : "Update Job"}
        </button>
      </form>
    </div>
  );
}

export default EditJob;
