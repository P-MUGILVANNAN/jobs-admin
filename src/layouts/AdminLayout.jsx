import { Outlet, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../styles/AdminLayout.css";

export default function AdminLayout() {
  const navigate = useNavigate();
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) navigate("/login");

    // Handle window resize for responsive behavior
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      if (!mobile) {
        setSidebarExpanded(false); // Auto-collapse sidebar when switching to desktop
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [navigate]);

  const toggleMobileSidebar = () => {
    setSidebarExpanded(!sidebarExpanded);
  };

  const toggleDesktopSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  return (
    <div className="admin-layout-container">
      {/* Mobile Toggle Button */}
      {isMobile && (
        <button
          className="mobile-toggle"
          onClick={toggleMobileSidebar}
          aria-label="Toggle menu"
        >
          {sidebarExpanded ? "✕" : "☰"}
        </button>
      )}

      {/* Sidebar */}
      <Sidebar
        onLogout={handleLogout}
        expanded={isMobile ? sidebarExpanded : !sidebarCollapsed}
        isMobile={isMobile}
        onToggleDesktopSidebar={toggleDesktopSidebar} // ✅ added
      />

      {/* Main Content */}
      <main
        className={`main-content ${
          sidebarCollapsed && !isMobile ? "collapsed" : ""
        }`}
      >
        {/* Header fixed */}
        <Header
          title="Admin Panel"
          subtitle="Manage your platform efficiently"
        />

        {/* Page content */}
        <div className="page-content">
          <Outlet />
        </div>

        {/* Footer */}
        <Footer />
      </main>

      {/* Overlay for mobile when sidebar is expanded */}
      {isMobile && sidebarExpanded && (
        <div
          className="sidebar-overlay"
          onClick={() => setSidebarExpanded(false)}
        />
      )}
    </div>
  );
}
