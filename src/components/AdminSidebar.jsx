import React from "react";
import { Link, useLocation } from "react-router-dom";

const AdminSidebar = () => {
  const location = useLocation();

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h4 className="text-lg font-semibold mb-4">Sidebar</h4>
      <ul className="space-y-3">
        <li>
          <Link
            to="/admin/dashboard"
            className={`${
              location.pathname === "/admin/dashboard"
                ? "text-[var(--color-primary)] font-bold"
                : "font-semibold text-gray-800"
            } hover:text-[var(--color-primary)] transition-colors`}
          >
            Dashboard
          </Link>
        </li>
        <li>
          <Link
            to="/admin/hero"
            className={`${
              location.pathname === "/admin/hero"
                ? "text-[var(--color-primary)] font-bold"
                : "font-semibold text-gray-800"
            } hover:text-[var(--color-primary)] transition-colors`}
          >
            Hero Slider
          </Link>
        </li>
        <li>
          <Link
            to="/admin/about us"
            className={`${
              location.pathname === "/admin/about us"
                ? "text-[var(--color-primary)] font-bold"
                : "font-semibold text-gray-800"
            } hover:text-[var(--color-primary)] transition-colors`}
          >
            About Us
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default AdminSidebar;
