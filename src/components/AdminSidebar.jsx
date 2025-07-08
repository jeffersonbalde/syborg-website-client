import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // Adjust the path if needed
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const AdminSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const MySwal = withReactContent(Swal);

  const handleLogout = async () => {
    const confirm = await MySwal.fire({
      title: "Are you sure?",
      text: "You will be logged out from your account.",
      icon: "warning",
      backdrop: true,
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, logout",
      didOpen: () => {
        document.body.style.overflow = "auto";
      },
      willClose: () => {
        document.body.style.overflow = "";
      },
    });

    if (confirm.isConfirmed) {
      MySwal.fire({
        title: "Logging out...",
        text: "Please wait while we end your session.",
        allowOutsideClick: false,
        allowEscapeKey: false,
        backdrop: true,
        didOpen: () => {
          Swal.showLoading();
          document.body.style.overflow = "auto";
        },
        willClose: () => {
          document.body.style.overflow = "";
        },
      });

      try {
        await logout();
        Swal.close();

        await MySwal.fire({
          title: "Logged out",
          text: "You have been logged out successfully.",
          icon: "success",
          confirmButtonColor: "#3085d6",
        });

        navigate("/login");
      } catch (error) {
        Swal.close();
        MySwal.fire("Error", "Something went wrong during logout.", "error");
      }
    }
  };

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
            to="/admin/students"
            className={`${
              location.pathname === "/admin/students"
                ? "text-[var(--color-primary)] font-bold"
                : "font-semibold text-gray-800"
            } hover:text-[var(--color-primary)] transition-colors`}
          >
            Registered Students
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
        <li>
          <button
            onClick={handleLogout}
            className="mt-6 w-40 flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-red-500 via-red-600 to-red-700 text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform active:scale-95 cursor-pointer"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 002 2h3a2 2 0 002-2V7a2 2 0 00-2-2h-3a2 2 0 00-2 2v1"
              />
            </svg>
            Logout
          </button>
        </li>
      </ul>
    </div>
  );
};

export default AdminSidebar;
