// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AdminProvider } from "./context/AdminContext";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ManageJobs from "./pages/ManageJobs";
import JobForm from "./pages/JobForm";
import EditJob from "./pages/EditJob";   // ✅ import edit form
import AdminLayout from "./layouts/AdminLayout";
import UserProfile from "./pages/UserProfile";
import AdminUserDetails from "./pages/AdminUserDetails";
import JobDetails from "./pages/JobDetails";
import Applications from "./pages/Applications";   // ✅ import Applications page

function App() {
  return (
    <AdminProvider>
      <Router>
        <Routes>
          {/* Redirect root to login */}
          <Route path="/" element={<Navigate to="/login" />} />

          {/* Public route */}
          <Route path="/login" element={<Login />} />

          {/* Admin routes with layout */}
          <Route element={<AdminLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/users" element={<UserProfile />} /> 
            <Route path="/jobs" element={<ManageJobs />} />
            <Route path="/jobs/add" element={<JobForm />} />

            {/* 🔹 Admin job routes */}
            <Route path="/admin/jobs" element={<ManageJobs />} />
            <Route path="/admin/jobs/add" element={<JobForm />} />
            <Route path="/admin/jobs/edit/:id" element={<EditJob />} /> {/* ✅ use separate edit form */}
            <Route path="/admin/jobs/:id" element={<JobDetails />} />

            <Route path="/admin/users/:id" element={<AdminUserDetails />} />

            {/* 🔹 Applications management route */}
            <Route path="/applications" element={<Applications />} /> {/* ✅ new route */}
          </Route>
        </Routes>
      </Router>
    </AdminProvider>
  );
}

export default App;
