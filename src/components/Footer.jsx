// src/components/Footer.jsx
import React from "react";
import "../styles/Footer.css";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="admin-footer">
      <p>© {year} Job Platform Admin. All rights reserved.</p>
    </footer>
  );
}
