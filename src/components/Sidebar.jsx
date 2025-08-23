import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { HouseDoor, People, Briefcase, PlusCircle, Gear, BoxArrowRight } from "react-bootstrap-icons";
import "../styles/Sidebar.css";

export default function Sidebar({ onLogout }) {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  const menuItems = [
    { path: "/dashboard", label: "Dashboard", icon: <HouseDoor className="icon" /> },
    { path: "/users", label: "Users", icon: <People className="icon" /> },
    { path: "/jobs", label: "Manage Jobs", icon: <Briefcase className="icon" /> },
    { path: "/jobs/add", label: "Add Job", icon: <PlusCircle className="icon" /> },
  ];

  return (
    <aside className={`sidebar ${collapsed ? "collapsed" : ""}`}>
      <div className="sidebar-header">
        <h2 className="sidebar-title">{collapsed ? "AP" : "Admin Panel"}</h2>
        <button className="collapse-btn" onClick={() => setCollapsed(!collapsed)}>
          {collapsed ? "»" : "«"}
        </button>
      </div>

      <nav className="sidebar-nav">
        <ul className="sidebar-menu">
          {menuItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={location.pathname === item.path ? "active" : ""}
                title={collapsed ? item.label : ""}
              >
                {item.icon}
                {!collapsed && <span className="menu-label">{item.label}</span>}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="sidebar-footer">
        <button className="logout-btn" onClick={onLogout} title={collapsed ? "Logout" : ""}>
          <BoxArrowRight className="icon" />
          {!collapsed && <span className="logout-label">Logout</span>}
        </button>
      </div>
    </aside>
  );
}
