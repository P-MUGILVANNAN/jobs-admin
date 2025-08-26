// src/components/Header.jsx
import React from "react";
import "../styles/Header.css";

export default function Header({ title, subtitle }) {
  return (
    <header className="admin-header">
      <div className="header-inner">
        <h1 className="header-title">{title}</h1>
        {subtitle && <p className="header-subtitle">{subtitle}</p>}
      </div>
    </header>
  );
}
