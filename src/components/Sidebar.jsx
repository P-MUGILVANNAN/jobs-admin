import { Link, useLocation } from "react-router-dom";
import { HouseDoor, People, Briefcase, PlusCircle, BoxArrowRight, Inbox } from "react-bootstrap-icons"; 
import "../styles/Sidebar.css";
import Logo from "../assets/Logo.png";

export default function Sidebar({ onLogout, expanded, isMobile }) {
  const location = useLocation();

  const menuItems = [
    { path: "/dashboard", label: "Dashboard", icon: <HouseDoor className="icon" /> },
    { path: "/users", label: "Users", icon: <People className="icon" /> },
    { path: "/jobs", label: "Manage Jobs", icon: <Briefcase className="icon" /> },
    { path: "/jobs/add", label: "Add Job", icon: <PlusCircle className="icon" /> },
    { path: "/applications", label: "Applications", icon: <Inbox className="icon" /> }, // ✅ new
  ];

  const sidebarClass = `sidebar ${expanded ? "expanded" : ""} ${isMobile ? "mobile" : ""}`;

  return (
    <aside className={sidebarClass}>
      <div className="sidebar-header">
        <img src={Logo} alt="Logo" className="sidebar-logo" />
        <h2 className="sidebar-title">{expanded || !isMobile ? "Admin Panel" : "AP"}</h2>
        {!isMobile && (
          <button
            className="collapse-btn"
            onClick={() => {
              /* handled by parent */
            }}
            aria-label="Toggle sidebar"
          >
            {expanded ? "«" : "»"}
          </button>
        )}
      </div>

      <nav className="sidebar-nav">
        <ul className="sidebar-menu">
          {menuItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={location.pathname === item.path ? "active" : ""}
                title={!expanded && isMobile ? item.label : ""}
              >
                {item.icon}
                {(expanded || !isMobile) && <span className="menu-label">{item.label}</span>}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="sidebar-footer">
        <button
          className="logout-btn"
          onClick={onLogout}
          title={!expanded && isMobile ? "Logout" : ""}
        >
          <BoxArrowRight className="icon" />
          {(expanded || !isMobile) && <span className="logout-label">Logout</span>}
        </button>
      </div>
    </aside>
  );
}
