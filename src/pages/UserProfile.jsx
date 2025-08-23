// src/pages/AdminUsers.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/UserProfile.css";

const API_BASE = "https://jobs-backend-z4z9.onrender.com/api";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${API_BASE}/admin/users`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(res.data.users || []);
      } catch (err) {
        console.error("Error fetching users:", err);
        if (err.response?.status === 401) {
          setError("Unauthorized. Admin login required.");
        } else if (err.response?.status === 403) {
          setError("Access forbidden. Admin role required.");
        } else {
          setError("Failed to load users. Please try again.");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API_BASE}/admin/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers((prev) => prev.filter((u) => u._id !== userId));
      alert("User deleted successfully");
    } catch (err) {
      console.error("Error deleting user:", err);
      alert("Failed to delete user");
    }
  };

  const handleToggleSuspicious = async (userId, currentStatus) => {
    try {
      const token = localStorage.getItem("token");
      await axios.patch(`${API_BASE}/admin/users/${userId}/toggle-suspicious`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUsers((prev) =>
        prev.map((u) =>
          u._id === userId ? { ...u, isSuspicious: !currentStatus } : u
        )
      );

      alert(`User marked as ${!currentStatus ? "suspicious" : "normal"}`);
    } catch (err) {
      console.error("Error toggling suspicious status:", err);
      alert("Failed to update user status");
    }
  };

  if (loading) return <p className="loading">Loading users...</p>;
  if (error) return <p className="error">{error}</p>;
  if (!users.length) return <p className="no-data">No users found.</p>;

  return (
    <div className="user-list-container">
      <h1>User Management</h1>
      <div className="users-grid">
        {users.map((user) => (
          <div
            key={user._id}
            className={`user-card ${user.isSuspicious ? "suspicious" : ""}`}
          >
            {/* Header */}
            <div className="user-card-header">
              <h3>{user.name || "Unnamed User"}</h3>
              <div className="user-actions">
                <button
                  onClick={() => handleToggleSuspicious(user._id, user.isSuspicious)}
                  className={`btn ${user.isSuspicious ? "btn-warning" : "btn-secondary"}`}
                >
                  {user.isSuspicious ? "Unflag" : "Flag"}
                </button>
                <button
                  onClick={() => handleDeleteUser(user._id)}
                  className="btn btn-danger"
                >
                  Delete
                </button>
              </div>
            </div>

            {/* Basic Info */}
            <div className="user-basic-info">
              <img
                src={user.profileImage || user.avatar || "/default-avatar.png"}
                alt={user.name}
                className="user-avatar"
              />
              <div className="user-details">
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Role:</strong> {user.role}</p>
                <p><strong>Provider:</strong> {user.provider}</p>
                {user.phone && <p><strong>Phone:</strong> {user.phone}</p>}
                {user.location && <p><strong>Location:</strong> {user.location}</p>}
                {user.experience && <p><strong>Experience:</strong> {user.experience}</p>}
                <p className={`status ${user.isSuspicious ? "suspicious" : "normal"}`}>
                  Status: {user.isSuspicious ? "Suspicious" : "Normal"}
                </p>
              </div>
            </div>

            {/* Skills */}
            {user.skills?.length > 0 && (
              <div className="user-section">
                <h4>Skills</h4>
                <div className="skills">
                  {user.skills.map((skill, idx) => (
                    <span key={idx} className="skill-badge">{skill}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Additional Info */}
            <div className="user-additional-info">
              {user.about && (
                <div className="user-section">
                  <h4>About</h4>
                  <p>{user.about}</p>
                </div>
              )}

              {user.education?.length > 0 && (
                <div className="user-section">
                  <h4>Education</h4>
                  <ul>
                    {user.education.map((edu, idx) => (
                      <li key={idx}>
                        <strong>{edu.level}</strong> at {edu.institution}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {user.projects?.length > 0 && (
                <div className="user-section">
                  <h4>Projects ({user.projects.length})</h4>
                </div>
              )}

              {user.appliedJobs?.length > 0 && (
                <div className="user-section">
                  <h4>Applied Jobs ({user.appliedJobs.length})</h4>
                </div>
              )}
            </div>

            {/* View Profile */}
            <div className="user-card-footer">
              <button
                onClick={() => (window.location.href = `/admin/users/${user._id}`)}
                className="btn btn-primary"
              >
                View Full Profile
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
