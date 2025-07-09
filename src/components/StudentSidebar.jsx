import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { toast } from "react-toastify";

// Color variables
const colors = {
  primary: "#D30203",
  dark: "#151515",
  lightBg: "#F5F5F5",
  text: "#333333",
  lightText: "#777777",
  border: "#E0E0E0",
  success: "#28A745",
  warning: "#FFC107",
  danger: "#DC3545",
  info: "#17A2B8",
};

const StudentSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const getCustomSwal = () => {
    return withReactContent(Swal).mixin({
      background: colors.lightBg,
      color: colors.text,
      confirmButtonColor: colors.primary,
      cancelButtonColor: colors.lightText,
      customClass: {
        confirmButton: "custom-confirm-btn",
        cancelButton: "custom-cancel-btn",
        title: "custom-title",
        content: "custom-content",
        popup: "custom-popup",
      },
    });
  };

  const MySwal = withReactContent(Swal);

  const handleLogout = async () => {
    const confirm = await MySwal.fire({
      title: "Are you sure?",
      text: "You will be logged out from your account.",
      icon: "warning",
      background: colors.lightBg,
      color: colors.text,
      confirmButtonColor: colors.primary,
      cancelButtonColor: colors.lightText,
      backdrop: true,
      showCancelButton: true,
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
        toast.success("You have been logged out successfully.");
        navigate("/login");
      } catch (error) {
        toast.error("Something went wrong during logout.");
        console.error(error);
      }
    }
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div
      className="h-full rounded-xl shadow-lg overflow-hidden"
      style={{
        backgroundColor: "white",
        border: `1px solid ${colors.border}`,
      }}
    >
      <div
        className="p-6"
        style={{ borderBottom: `1px solid ${colors.border}` }}
      >
        <h4
          className="text-xl font-bold mb-1"
          style={{ color: colors.primary }}
        >
          Student Portal
        </h4>
        <p className="text-sm" style={{ color: colors.lightText }}>
          Navigation Menu
        </p>
      </div>

      <nav className="p-4">
        <ul className="space-y-2">
          {[
            {
              path: "/student/dashboard",
              label: "Dashboard",
              icon: (
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              ),
            },
            {
              path: "/student/attendance",
              label: "Attendance Records",
              icon: (
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
              ),
            },
            // {
            //   path: "/student/grades",
            //   label: "Grades",
            //   icon: (
            //     <svg
            //       className="w-5 h-5"
            //       fill="none"
            //       stroke="currentColor"
            //       viewBox="0 0 24 24"
            //     >
            //       <path
            //         strokeLinecap="round"
            //         strokeLinejoin="round"
            //         strokeWidth="2"
            //         d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            //       />
            //     </svg>
            //   ),
            // },
            // {
            //   path: "/student/profile",
            //   label: "Profile",
            //   icon: (
            //     <svg
            //       className="w-5 h-5"
            //       fill="none"
            //       stroke="currentColor"
            //       viewBox="0 0 24 24"
            //     >
            //       <path
            //         strokeLinecap="round"
            //         strokeLinejoin="round"
            //         strokeWidth="2"
            //         d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            //       />
            //     </svg>
            //   ),
            // },
          ].map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  isActive(item.path)
                    ? "font-semibold shadow-sm"
                    : "font-medium hover:bg-gray-50"
                }`}
                style={{
                  backgroundColor: isActive(item.path)
                    ? `${colors.primary}10`
                    : "transparent",
                  color: isActive(item.path) ? colors.primary : colors.text,
                }}
              >
                <span
                  style={{
                    color: isActive(item.path)
                      ? colors.primary
                      : colors.lightText,
                  }}
                >
                  {item.icon}
                </span>
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div
        className="p-4 mt-4"
        style={{ borderTop: `1px solid ${colors.border}` }}
      >
        <button
          onClick={handleLogout}
          className="cursor-pointer w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-all duration-300 shadow hover:brightness-90"
          style={{
            backgroundColor: colors.primary,
            color: "white",
          }}
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
      </div>
    </div>
  );
};

export default StudentSidebar;