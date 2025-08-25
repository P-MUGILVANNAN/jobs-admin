// src/pages/Login.jsx
import React, { useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AdminContext } from "../context/AdminContext";
import "../styles/Login.css";
import Logo from "../assets/Logo.png";
import { motion, AnimatePresence } from "framer-motion";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { login } = useContext(AdminContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await axios.post(
        "https://jobs-backend-z4z9.onrender.com/api/auth/login",
        { email, password }
      );

      if (response.data?.token) {
        login(response.data.token, { email });
        setSuccess(true);
        setTimeout(() => {
          setSuccess(false);
          navigate("/dashboard");
        }, 2000);
      } else {
        setError("Invalid login response");
      }
    } catch (err) {
      setError("Invalid credentials or server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container d-flex justify-content-center align-items-center vh-100">
      <div className="card p-5 shadow-lg">
        {/* Logo & Title */}
        <div className="text-center mb-5">
          <motion.img
            src={Logo}
            alt="FIIT Jobs Logo"
            className="login-logo mb-3"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
          />
          <h2 className="panel-title">FIIT Jobs Admin Panel</h2>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleSubmit}>
          <motion.div
            className="mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />
          </motion.div>

          <motion.div
            className="mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
            />
          </motion.div>

          <motion.button
            type="submit"
            className="btn btn-primary w-100"
            disabled={loading}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            {loading ? "Logging in..." : "Login"}
          </motion.button>
        </form>
      </div>

      {/* Success Slide Right Alert */}
      <AnimatePresence>
        {success && (
          <motion.div
            initial={{ x: "100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "100%", opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="success-toast"
          >
            ✅ Successfully Logged In
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Login;
