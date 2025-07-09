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

const AdminSidebar = () => {
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
      // confirmButtonColor: "#d33",
      // cancelButtonColor: "#3085d6",
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

        // await MySwal.fire({
        //   title: "Logged out",
        //   text: "You have been logged out successfully.",
        //   icon: "success",
        //   confirmButtonColor: "#3085d6",
        // });

        toast.success("You have been logged out successfully.")

        navigate("/login");
      } catch (error) {
        // Swal.close();
        // MySwal.fire("Error", "Something went wrong during logout.", "error");
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
          Admin Panel
        </h4>
        <p className="text-sm" style={{ color: colors.lightText }}>
          Navigation Menu
        </p>
      </div>

      <nav className="p-4">
        <ul className="space-y-2">
          {[
            {
              path: "/admin/dashboard",
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
              path: "/admin/hero",
              label: "Hero Slider",
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
                    d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
                  />
                </svg>
              ),
            },
            {
              path: "/admin/students",
              label: "Students",
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
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              ),
            },
            // {
            //   path: "/admin/about us",
            //   label: "About Us",
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
            //         d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
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

export default AdminSidebar;
