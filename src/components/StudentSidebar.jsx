import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import syborg_logo from "../assets/images/syborg_logo.png";
import red_lions from "../assets/images/red_lions.jpg";
import {
  FiMenu,
  FiX,
  FiHome,
  FiUsers,
  FiCalendar,
  FiLogOut,
  FiChevronDown,
  FiChevronRight,
  FiLayout,
  FiImage,
} from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import Swal from "sweetalert2";
import { toast } from "react-toastify";

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

const getCustomSwal = () => {
  return Swal.mixin({
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

const hexToRgb = (hex) => {
  hex = hex.replace("#", "");
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  return `${r}, ${g}, ${b}`;
};

const StudentSidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile) {
        setIsOpen(false);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = () => setIsOpen(!isOpen);

  const sidebarVariants = {
    open: { x: 0 },
    closed: { x: "-100%" },
  };

  const overlayVariants = {
    open: { opacity: 1, display: "block" },
    closed: { opacity: 0, transitionEnd: { display: "none" } },
  };

  const isActive = (path) => {
    if (path === location.pathname) return true;
    if (path && location.pathname.startsWith(path + "/")) return true;
    return false;
  };

  const navItems = [
    {
      path: "/student/dashboard",
      icon: <FiHome size={20} />,
      label: "Student Dashboard",
    },
    {
      path: "/student/attendance",
      icon: <FiUsers size={20} />,
      label: "Attendance Records",
    },
    // {
    //   path: "/student/grades",
    //   icon: <FiCalendar size={20} />,
    //   label: "Grades",
    // },
  ];

  return (
    <>
      {/* Mobile Hamburger Button */}
      {isMobile && (
        <button
          onClick={toggleSidebar}
          className="fixed top-5 right-5 z-50 p-2 rounded-md bg-white shadow-lg"
          style={{ color: colors.primary }}
          aria-label="Toggle menu"
        >
          {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
      )}

      {/* Overlay for mobile */}
      <AnimatePresence>
        {isMobile && isOpen && (
          <motion.div
            initial="closed"
            animate="open"
            exit="closed"
            variants={overlayVariants}
            className="fixed inset-0 bg-black/40 bg-opacity-10 z-40"
            onClick={toggleSidebar}
            transition={{ duration: 0.2 }}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={isMobile ? "closed" : "open"}
        animate={isMobile ? (isOpen ? "open" : "closed") : "open"}
        variants={sidebarVariants}
        transition={{ type: "tween", duration: 0.2 }}
        className={`fixed md:relative z-40 h-screen w-72 overflow-y-auto transition-all duration-200 ease-in-out ${
          isMobile ? "fixed top-0 left-0 shadow-xl" : "md:block"
        }`}
        style={{
          backgroundColor: colors.dark,
          color: "white",
        }}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="border-b border-gray-700">
            <div className="p-4 border-b border-gray-700 relative overflow-hidden group">
              {/* Lion background with subtle animation */}
              <div
                className="absolute inset-0 bg-black bg-opacity-90 z-0 transition-all duration-1000 group-hover:opacity-30"
                style={{
                  backgroundImage: `url(${red_lions})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  opacity: 0.2,
                }}
              />

              {/* Subtle gold gradient overlay */}
              <div className="absolute inset-0 z-0 bg-gradient-to-br from-transparent via-transparent to-yellow-600 opacity-5" />

              <div className="flex flex-col items-center relative z-10">
                {/* Logo and SYBORG text with roar effect */}
                <div className="flex items-center justify-between w-full mb-1">
                  <div className="flex items-center">
                    <motion.img
                      src={syborg_logo}
                      alt="SYBORG Logo"
                      className="h-12 w-12 mr-3 filter drop-shadow-lg"
                    />
                  </div>

                  {/* Fixed SYBORG text with visible styling */}
                  <motion.h2 className="text-2xl font-extrabold text-white tracking-wider">
                    <span className="text-shadow-lg shadow-red-800/50">
                      SYBORG
                    </span>
                  </motion.h2>

                  {/* Balance div with hidden paw print */}
                  <div className="w-10 h-10 relative">
                    <div className="absolute inset-0 opacity-30 group-hover:opacity-30 transition-opacity duration-500">
                      <svg
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="text-white"
                      >
                        <path d="M19.5 12c0-1.933-2.067-3.5-4.5-3.5-1.362 0-2.582.572-3.5 1.5-.918-.928-2.138-1.5-3.5-1.5-2.433 0-4.5 1.567-4.5 3.5 0 .338.068.66.177.958C3.158 13.847 2 15.178 2 16.5 2 18.433 4.067 20 6.5 20c1.362 0 2.582-.572 3.5-1.5.918.928 2.138 1.5 3.5 1.5 2.433 0 4.5-1.567 4.5-3.5 0-1.322-1.158-2.653-1.677-3.542.109-.298.177-.62.177-.958z" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Subtitle with animated underline */}
                <motion.p className="text-xs text-gray-300 text-center relative pb-1">
                  <span className="font-medium tracking-wider">
                    SCC SYSTEM BUILDERS ORGANIZATION
                  </span>
                  <motion.span
                    className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-yellow-500 to-red-600"
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 1, delay: 0.5 }}
                  />
                </motion.p>

                {/* Mobile close button with claw marks effect */}
                {isMobile && (
                  <motion.button
                    onClick={toggleSidebar}
                    className="absolute top-0 right-0 p-2 rounded-md hover:bg-gray-800 transition-all"
                    style={{ color: colors.primary }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <FiX
                      size={20}
                      className="drop-shadow-[0_1px_1px_rgba(0,0,0,0.5)]"
                    />
                    <div className="absolute -bottom-1 left-2 w-6 h-1 bg-yellow-600 opacity-0 group-hover:opacity-30 rounded-full transition-opacity" />
                  </motion.button>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar Content */}
          <div className="flex-1 overflow-y-auto p-4">
            <nav className="space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center p-3 rounded-lg transition-all duration-200 group ${
                    isActive(item.path)
                      ? "bg-red-900 bg-opacity-50"
                      : "hover:bg-gray-700"
                  }`}
                  onClick={() => isMobile && setIsOpen(false)}
                >
                  <span
                    className={`mr-3 ${
                      isActive(item.path)
                        ? "text-white"
                        : "text-gray-400 group-hover:text-white"
                    }`}
                  >
                    {item.icon}
                  </span>
                  <span
                    className={`font-medium ${
                      isActive(item.path)
                        ? "text-white"
                        : "text-gray-300 group-hover:text-white"
                    }`}
                  >
                    {item.label}
                  </span>
                </Link>
              ))}
            </nav>
          </div>

          {/* Sidebar Footer */}
          <div className="p-4 border-t border-gray-700 space-y-2">
            <button
              onClick={async () => {
                const MySwal = getCustomSwal();

                // Show confirmation dialog
                const result = await MySwal.fire({
                  title: "Logout Confirmation",
                  text: "Are you sure you want to logout?",
                  icon: "question",
                  showCancelButton: true,
                  confirmButtonText: "Yes, logout!",
                  cancelButtonText: "Cancel",
                  confirmButtonColor: colors.primary,
                  cancelButtonColor: colors.lightText,
                  backdrop: `
                    rgba(${hexToRgb(colors.dark)},0.7)
                    url("/images/loading.gif")
                    center top
                    no-repeat
                  `,
                });

                if (result.isConfirmed) {
                  try {
                    // Show loading state
                    MySwal.fire({
                      title: "Logging out...",
                      allowOutsideClick: false,
                      showConfirmButton: false,
                      willOpen: () => {
                        Swal.showLoading();
                      },
                    });

                    // Perform logout
                    await logout();

                    // Close loading state
                    Swal.close();

                    // Show success toast
                    toast.success("Logged out successfully!", {
                      position: "top-right",
                      autoClose: 3000,
                      hideProgressBar: false,
                      closeOnClick: true,
                      pauseOnHover: true,
                      draggable: true,
                      progress: undefined,
                      theme: "colored",
                      style: {
                        background: colors.success,
                      },
                    });

                    // Redirect to login
                    navigate("/login");
                    if (isMobile) setIsOpen(false);
                  } catch (error) {
                    // Close loading state
                    Swal.close();

                    // Show error toast
                    toast.error("Logout failed. Please try again.", {
                      position: "top-right",
                      autoClose: 5000,
                      hideProgressBar: false,
                      closeOnClick: true,
                      pauseOnHover: true,
                      draggable: true,
                      progress: undefined,
                      theme: "colored",
                      style: {
                        background: colors.danger,
                      },
                    });

                    console.error("Logout failed:", error);
                  }
                }
              }}
              className="cursor-pointer flex items-center w-full p-3 rounded-lg hover:bg-gray-700 transition-all duration-200 group"
            >
              <span className="mr-3 text-gray-400 group-hover:text-white">
                <FiLogOut size={20} />
              </span>
              <span className="font-medium text-gray-300 group-hover:text-white">
                Logout
              </span>
            </button>

            {/* Developer Credits */}
            <div className="text-center pt-2">
              <p className="text-xs text-gray-500 font-semibold">
                Developed by{" "}
                <span className="text-gray-500 font-semibold">
                  Jeff Software Solutions
                </span>
              </p>
            </div>
          </div>
        </div>
      </motion.aside>
    </>
  );
};

export default StudentSidebar;
