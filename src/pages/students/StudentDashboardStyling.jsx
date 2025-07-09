import React, { useEffect, useState } from "react";
import StudentSidebar from "../../components/StudentSidebar";
import "animate.css";
import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";
import { FaSpinner } from "react-icons/fa";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

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

const StudentDashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    current_courses: 0,
    average_grade: 0,
    upcoming_assignments: 0,
  });

  // Simulate loading student stats
  useEffect(() => {
    const timer = setTimeout(() => {
      setStats({
        current_courses: 5,
        average_grade: 87.5,
        upcoming_assignments: 3,
      });
      setLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen" style={{ backgroundColor: colors.lightBg }}>
      {/* Header */}
      <header
        className="shadow-md py-5"
        style={{ backgroundColor: colors.dark }}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-8 flex items-center justify-between">
          <h1 className="text-2xl md:text-3xl font-bold tracking-wide text-white">
            SYBORG Portal
          </h1>
          <span
            className="text-lg italic hidden md:block"
            style={{ color: "rgba(255,255,255,0.7)" }}
          >
            Welcome back, {user?.firstname}!
          </span>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 py-8 md:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Sidebar */}
            <div className="md:w-1/4">
              <StudentSidebar />
            </div>

            {/* Dashboard Content */}
            <div className="md:w-3/4 w-full animate__animated animate__fadeIn">
              {loading ? (
                <div className="shadow-lg rounded-xl overflow-hidden animate__animated animate__fadeIn"
                  style={{
                    backgroundColor: "white",
                    border: `1px solid ${colors.border}`,
                  }}>
                  <div className="p-6">
                    <div className="flex justify-between items-center mb-6">
                      <Skeleton height={30} width={200} />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {[1, 2, 3].map((_, index) => (
                        <div
                          key={index}
                          className="rounded-xl p-6 shadow-sm"
                          style={{
                            backgroundColor: "#F9F9F9",
                            border: `1px solid ${colors.border}`,
                          }}
                        >
                          <div className="flex items-center space-x-4">
                            <Skeleton circle width={48} height={48} />
                            <div className="flex-1">
                              <Skeleton height={16} width={`60%`} />
                              <Skeleton
                                height={24}
                                width={`80%`}
                                className="mt-2"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div
                  className="shadow-lg rounded-xl overflow-hidden animate__animated animate__fadeIn"
                  style={{
                    backgroundColor: "white",
                    border: `1px solid ${colors.border}`,
                  }}
                >
                  <div className="p-6">
                    <div className="flex justify-between items-center mb-6">
                      <h4
                        className="text-xl font-bold"
                        style={{ color: colors.primary }}
                      >
                        Dashboard Overview
                      </h4>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                      {/* Current Courses Card */}
                      <div
                        className="rounded-xl p-6 shadow-sm"
                        style={{
                          backgroundColor: "#F9F9F9",
                          border: `1px solid ${colors.border}`,
                        }}
                      >
                        <div className="flex items-center">
                          <div
                            className="p-3 rounded-xl mr-4 shadow-inner"
                            style={{ backgroundColor: `${colors.primary}20` }}
                          >
                            <svg
                              className="w-6 h-6"
                              fill="none"
                              stroke={colors.primary}
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                              ></path>
                            </svg>
                          </div>
                          <div>
                            <h3
                              className="text-lg font-semibold"
                              style={{ color: colors.lightText }}
                            >
                              Current Courses
                            </h3>
                            <p
                              className="text-4xl font-bold"
                              style={{ color: colors.dark }}
                            >
                              {stats.current_courses}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Average Grade Card */}
                      <div
                        className="rounded-xl p-6 shadow-sm"
                        style={{
                          backgroundColor: "#F9F9F9",
                          border: `1px solid ${colors.border}`,
                        }}
                      >
                        <div className="flex items-center">
                          <div
                            className="p-3 rounded-xl mr-4 shadow-inner"
                            style={{ backgroundColor: `${colors.success}20` }}
                          >
                            <svg
                              className="w-6 h-6"
                              fill="none"
                              stroke={colors.success}
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                              ></path>
                            </svg>
                          </div>
                          <div>
                            <h3
                              className="text-lg font-semibold"
                              style={{ color: colors.lightText }}
                            >
                              Average Grade
                            </h3>
                            <p
                              className="text-4xl font-bold"
                              style={{ color: colors.dark }}
                            >
                              {stats.average_grade}%
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Upcoming Assignments Card */}
                      <div
                        className="rounded-xl p-6 shadow-sm"
                        style={{
                          backgroundColor: "#F9F9F9",
                          border: `1px solid ${colors.border}`,
                        }}
                      >
                        <div className="flex items-center">
                          <div
                            className="p-3 rounded-xl mr-4 shadow-inner"
                            style={{ backgroundColor: `${colors.warning}20` }}
                          >
                            <svg
                              className="w-6 h-6"
                              fill="none"
                              stroke={colors.warning}
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                              ></path>
                            </svg>
                          </div>
                          <div>
                            <h3
                              className="text-lg font-semibold"
                              style={{ color: colors.lightText }}
                            >
                              Upcoming Assignments
                            </h3>
                            <p
                              className="text-4xl font-bold"
                              style={{ color: colors.dark }}
                            >
                              {stats.upcoming_assignments}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Student Info Section */}
                    <div
                      className="rounded-xl p-6 mb-6 shadow-sm"
                      style={{
                        backgroundColor: "#F9F9F9",
                        border: `1px solid ${colors.border}`,
                      }}
                    >
                      <h5
                        className="text-lg font-semibold mb-4"
                        style={{ color: colors.text }}
                      >
                        Student Information
                      </h5>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm" style={{ color: colors.lightText }}>
                            EDP Number
                          </p>
                          <p className="text-md font-medium" style={{ color: colors.text }}>
                            {user?.edp_number}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm" style={{ color: colors.lightText }}>
                            Full Name
                          </p>
                          <p className="text-md font-medium" style={{ color: colors.text }}>
                            {user?.firstname} {user?.middlename} {user?.lastname}
                          </p>
                        </div>
                      </div>

                      {user?.qr_code && (
                        <div className="mt-6 text-center">
                          <h3 className="text-lg font-semibold mb-2" style={{ color: colors.text }}>
                            Your QR Code
                          </h3>
                          <div className="flex justify-center">
                            <img
                              src={`${import.meta.env.VITE_LARAVEL_FILE_API}/${
                                user.qr_code
                              }`}
                              alt="Student QR Code"
                              className="w-48 h-48 border-4 border-white shadow-md"
                              style={{ borderColor: colors.primary }}
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Quick Actions */}
                    <div
                      className="rounded-xl p-6 mb-6 shadow-sm"
                      style={{
                        backgroundColor: "#F9F9F9",
                        border: `1px solid ${colors.border}`,
                      }}
                    >
                      <h5
                        className="text-lg font-semibold mb-4"
                        style={{ color: colors.text }}
                      >
                        Quick Actions
                      </h5>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Link
                          to="/student/courses"
                          className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-300 shadow hover:shadow-md"
                          style={{
                            backgroundColor: `${colors.primary}10`,
                            color: colors.primary,
                            border: `1px solid ${colors.primary}`,
                          }}
                        >
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
                          View Courses
                        </Link>
                        <Link
                          to="/student/grades"
                          className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-300 shadow hover:shadow-md"
                          style={{
                            backgroundColor: `${colors.info}10`,
                            color: colors.info,
                            border: `1px solid ${colors.info}`,
                          }}
                        >
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
                              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                          Check Grades
                        </Link>
                        <Link
                          to="/student/profile"
                          className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-300 shadow hover:shadow-md"
                          style={{
                            backgroundColor: `${colors.success}10`,
                            color: colors.success,
                            border: `1px solid ${colors.success}`,
                          }}
                        >
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
                              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                            />
                          </svg>
                          Update Profile
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default StudentDashboard;