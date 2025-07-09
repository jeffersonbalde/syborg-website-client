import React, { useEffect, useState } from "react";
import AdminSidebar from "../../components/AdminSidebar";
import "animate.css";
import { toast } from "react-toastify";
import { token } from "../../utils/GetToken";
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

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total_students: 0,
    approved_students: 0,
    pending_students: 0,
    dissaproved_students: 0,
  });

  const fetchDashboardStats = async () => {
    setLoading(true);

    try {
      const res = await fetch(
        `${import.meta.env.VITE_LARAVEL_API}/admin/dashboard-stats`,
        {
          method: "GET",
          headers: {
            "Content-type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${token()}`,
          },
        }
      );

      const result = await res.json();
      setStats(result.data);
    } catch (error) {
      toast.error("Error fetching dashboard stats.");
      console.error("Error fetching dashboard stats:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardStats();
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
            Welcome back, Administrator!
          </span>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 py-8 md:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Sidebar */}
            <div className="md:w-1/4">
              <AdminSidebar />
            </div>

            {/* Dashboard Content */}
            <div className="md:w-3/4 w-full animate__animated animate__fadeIn">
              {loading ? (
                <div className="flex flex-col items-center justify-center h-96">
                  <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin mb-4"></div>
                  <p className="text-gray-600 font-medium">
                    Fetching dashboard data....
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    Please wait while we fetch the records
                  </p>
                </div>
              ) : (
                // <div className="flex justify-center items-center h-96">
                //   <div className="flex flex-col items-center">
                //     <FaSpinner className="animate-spin text-4xl text-red-600 mb-4" />
                //     <p className="text-sm text-gray-500">
                //       Fetching dashboard data...
                //     </p>
                //   </div>
                // </div>

                // <div className="shadow-lg rounded-xl overflow-hidden p-6 bg-white border border-gray-200">
                //   <div className="mb-6">
                //     <Skeleton height={30} width={200} />
                //   </div>
                //   <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                //     {[1, 2, 3, 4].map((_, index) => (
                //       <div
                //         key={index}
                //         className="rounded-xl p-6 shadow-sm border border-gray-200 bg-gray-50"
                //       >
                //         <div className="flex items-center space-x-4">
                //           <Skeleton circle width={48} height={48} />
                //           <div className="flex-1">
                //             <Skeleton height={16} width={`60%`} />
                //             <Skeleton
                //               height={24}
                //               width={`80%`}
                //               className="mt-2"
                //             />
                //           </div>
                //         </div>
                //       </div>
                //     ))}
                //   </div>
                // </div>
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
                      {/* Total Students Card */}
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
                                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                              ></path>
                            </svg>
                          </div>
                          <div>
                            <h3
                              className="text-lg font-semibold"
                              style={{ color: colors.lightText }}
                            >
                              Total Students
                            </h3>
                            <p
                              className="text-4xl font-bold"
                              style={{ color: colors.dark }}
                            >
                              {stats.total_students}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Approved Students Card */}
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
                              Approved
                            </h3>
                            <p
                              className="text-4xl font-bold"
                              style={{ color: colors.dark }}
                            >
                              {stats?.approved_students ?? 0}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Pending Students Card */}
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
                                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                              ></path>
                            </svg>
                          </div>
                          <div>
                            <h3
                              className="text-lg font-semibold"
                              style={{ color: colors.lightText }}
                            >
                              Pending
                            </h3>
                            <p
                              className="text-4xl font-bold"
                              style={{ color: colors.dark }}
                            >
                              {stats?.pending_students ?? 0}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Pending Students Card */}
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
                                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                              ></path>
                            </svg>
                          </div>
                          <div>
                            <h3
                              className="text-lg font-semibold"
                              style={{ color: colors.lightText }}
                            >
                              Dissaproved
                            </h3>
                            <p
                              className="text-4xl font-bold"
                              style={{ color: colors.dark }}
                            >
                              {stats?.dissaproved_students ?? 0}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Quick Actions */}
                    {/* <div
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
                      <button
                        className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-300 shadow"
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
                            d="M12 4v16m8-8H4"
                          />
                        </svg>
                        Add New Student
                      </button>
                      <button
                        className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-300 shadow"
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
                            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                          />
                        </svg>
                        Generate Reports
                      </button>
                      <button
                        className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-300 shadow"
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
                            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                          />
                        </svg>
                        Export Data
                      </button>
                    </div>
                  </div> */}

                    {/* Recent Activity */}
                    {/* <div
                    className="rounded-xl p-6 shadow-sm"
                    style={{
                      backgroundColor: "#F9F9F9",
                      border: `1px solid ${colors.border}`,
                    }}
                  >
                    <h5
                      className="text-lg font-semibold mb-4"
                      style={{ color: colors.text }}
                    >
                      Recent Activity
                    </h5>
                    <div className="space-y-4">
                      {[1, 2, 3].map((item) => (
                        <div
                          key={item}
                          className="flex items-start pb-4 border-b"
                          style={{ borderColor: colors.border }}
                        >
                          <div
                            className="p-2 rounded-full mr-3"
                            style={{ backgroundColor: `${colors.primary}20` }}
                          >
                            <svg
                              className="w-5 h-5"
                              fill="none"
                              stroke={colors.primary}
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                          </div>
                          <div>
                            <p
                              className="text-sm"
                              style={{ color: colors.text }}
                            >
                              <span className="font-semibold">Admin User</span>{" "}
                              {item === 1
                                ? "approved 5 new student registrations"
                                : item === 2
                                ? "updated the system settings"
                                : "created a new admin account"}
                            </p>
                            <p
                              className="text-xs mt-1"
                              style={{ color: colors.lightText }}
                            >
                              {item === 1
                                ? "2 hours ago"
                                : item === 2
                                ? "5 hours ago"
                                : "1 day ago"}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div> */}
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

export default AdminDashboard;
