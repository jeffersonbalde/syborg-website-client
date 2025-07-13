import React, { useEffect, useState } from "react";
import AdminSidebar from "../../components/AdminSidebar";
import { toast } from "react-toastify";
import { token } from "../../utils/GetToken";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { motion, AnimatePresence } from "framer-motion";

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
    <div
      className="min-h-screen flex overflow-hidden"
      style={{ backgroundColor: colors.lightBg }}
    >
      {/* Sidebar - now handled by AdminSidebar component */}
      <AdminSidebar />

      {/* Content */}
      <main className="flex-1 overflow-x-hidden overflow-y-auto h-screen min-w-0">
        <div className="px-4 py-3 md:px-3">
          <div className="max-w-7xl mx-auto">
            <div className="w-full animate__animated animate__fadeIn">
              <div
                className="shadow-lg rounded-xl overflow-hidden relative"
                style={{
                  backgroundColor: "white",
                  border: `1px solid ${colors.border}`,
                }}
              >
                <div className="p-4">
                  <div
                    className="sticky top-0 z-10 p-4 shadow-sm mb-5 bg-gray-700 rounded-xl"
                    style={{
                      borderBottom: `1px solid ${colors.border}`,
                    }}
                  >
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      {/* Title with decorative element */}
                      <div className="flex items-center">
                        <div className="hidden md:block mr-3">
                          <div
                            className="w-2 h-8 rounded-full"
                            style={{ backgroundColor: colors.primary }}
                          ></div>
                        </div>
                        <div>
                          <h4
                            className="text-xl md:text-2xl font-bold tracking-tight"
                            style={{ color: colors.lightBg }}
                          >
                            Dashboard Overview
                          </h4>
                          <p
                            className="text-sm mt-1"
                            style={{ color: colors.lightBg }}
                          >
                            View and manage your dashboard
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Stats Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {/* Total Students Card */}
                    <div
                      className="rounded-xl p-6 shadow-sm"
                      style={{
                        backgroundColor: "#D3D3D3",
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
                            style={{ color: colors.text }}
                          >
                            Total Students
                          </h3>
                          <p
                            className="text-4xl font-bold"
                            style={{ color: colors.dark }}
                          >
                            {loading ? (
                              <Skeleton width={60} />
                            ) : (
                              stats.total_students
                            )}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Approved Students Card */}
                    <div
                      className="rounded-xl p-6 shadow-sm"
                      style={{
                        backgroundColor: "#D3D3D3",
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
                            style={{ color: colors.text }}
                          >
                            Approved
                          </h3>
                          <p
                            className="text-4xl font-bold"
                            style={{ color: colors.dark }}
                          >
                            {loading ? (
                              <Skeleton width={60} />
                            ) : (
                              stats.approved_students
                            )}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Pending Students Card */}
                    <div
                      className="rounded-xl p-6 shadow-sm"
                      style={{
                        backgroundColor: "#D3D3D3",
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
                            style={{ color: colors.text }}
                          >
                            Pending
                          </h3>
                          <p
                            className="text-4xl font-bold"
                            style={{ color: colors.dark }}
                          >
                            {loading ? (
                              <Skeleton width={60} />
                            ) : (
                              stats.pending_students
                            )}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Disapproved Students Card */}
                    <div
                      className="rounded-xl p-6 shadow-sm"
                      style={{
                        backgroundColor: "#D3D3D3",
                        border: `1px solid ${colors.border}`,
                      }}
                    >
                      <div className="flex items-center">
                        <div
                          className="p-3 rounded-xl mr-4 shadow-inner"
                          style={{ backgroundColor: `${colors.danger}20` }}
                        >
                          <svg
                            className="w-6 h-6"
                            fill="none"
                            stroke={colors.danger}
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M6 18L18 6M6 6l12 12"
                            ></path>
                          </svg>
                        </div>
                        <div>
                          <h3
                            className="text-lg font-semibold"
                            style={{ color: colors.text }}
                          >
                            Disapproved
                          </h3>
                          <p
                            className="text-4xl font-bold"
                            style={{ color: colors.dark }}
                          >
                            {loading ? (
                              <Skeleton width={60} />
                            ) : (
                              stats.dissaproved_students
                            )}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {loading && (
                    <div className="flex justify-center items-center py-12">
                      <div className="flex flex-col items-center">
                        <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin mb-4"></div>
                        <p className="text-gray-600 font-semibold">
                          Fetching dashboard data...
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                          Please wait while we fetch the records
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
