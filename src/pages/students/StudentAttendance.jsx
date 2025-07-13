import React, { useEffect, useState } from "react";
import StudentSidebar from "../../components/StudentSidebar";
import { useAuth } from "../../context/AuthContext";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { token } from "../../utils/GetToken";
import { toast } from "react-toastify";
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
  cardBg: "linear-gradient(145deg, #6B0000 0%, #8B0000 50%, #6B0000 100%)",
  cardHighlight: "rgba(255, 255, 255, 0.1)",
};

const StudentAttendance = () => {
  const { user } = useAuth();
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all"); // 'all', 'present', 'absent'

  useEffect(() => {
    const fetchAttendanceRecords = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_LARAVEL_API}/student/attendance-records`,
          {
            headers: {
              Authorization: `Bearer ${token()}`,
            },
          }
        );

        if (!res.ok) {
          throw new Error("Failed to fetch attendance records");
        }

        const data = await res.json();
        setAttendanceRecords(data.data);
      } catch (error) {
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchAttendanceRecords();
    }
  }, [user]);

  // Filter records based on active tab
  const filteredRecords = attendanceRecords.filter((record) => {
    if (activeTab === "all") return true;
    if (activeTab === "present") return record.status === "Present";
    if (activeTab === "absent") return record.status === "Absent";
    return true;
  });

  // Format date and time
  const formatDateTime = (dateTimeString) => {
    if (!dateTimeString) return "--";

    const date = new Date(dateTimeString);
    return date.toLocaleString("en-PH", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
      timeZone: "Asia/Manila",
    });
  };

  // Format just the date
  const formatDate = (dateString) => {
    if (!dateString) return "--";

    const date = new Date(dateString);
    return date.toLocaleDateString("en-PH", {
      year: "numeric",
      month: "short",
      day: "numeric",
      timeZone: "Asia/Manila",
    });
  };

  return (
    <div
      className="min-h-screen flex overflow-hidden"
      style={{ backgroundColor: colors.lightBg }}
    >
      {/* Sidebar */}
      <StudentSidebar />

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
                  {/* Header Section */}
                  <div
                    className="sticky top-0 z-10 p-4 shadow-sm mb-5 bg-gray-700 rounded-xl"
                    style={{
                      borderBottom: `1px solid ${colors.border}`,
                    }}
                  >
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
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
                            Attendance Records
                          </h4>
                          <p
                            className="text-sm mt-1"
                            style={{ color: colors.lightBg }}
                          >
                            View your attendance history and missed events
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Tabs */}
                  <div className="flex border-b border-gray-200 mb-4">
                    <button
                      onClick={() => setActiveTab("all")}
                      className={`cursor-pointer py-2 px-4 font-semibold text-sm ${
                        activeTab === "all"
                          ? "border-b-4 border-red-600 text-red-600"
                          : "text-gray-500 hover:text-gray-700"
                      }`}
                    >
                      All Events
                    </button>
                    <button
                      onClick={() => setActiveTab("present")}
                      className={`cursor-pointer py-2 px-4 font-semibold text-sm ${
                        activeTab === "present"
                          ? "border-b-4 border-green-600 text-green-600"
                          : "text-gray-500 hover:text-gray-700"
                      }`}
                    >
                      Attended
                    </button>
                    <button
                      onClick={() => setActiveTab("absent")}
                      className={`cursor-pointer py-2 px-4 font-semibold text-sm ${
                        activeTab === "absent"
                          ? "border-b-4 border-red-600 text-red-600"
                          : "text-gray-500 hover:text-gray-700"
                      }`}
                    >
                      Missed Events
                    </button>
                  </div>

                  {/* Attendance Records Table */}
                  <div className="mt-6">
                    {loading ? (
                      <div className="flex justify-center items-center py-12">
                        <div className="flex flex-col items-center">
                          <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin mb-4"></div>
                          <p className="text-gray-600 font-medium">
                            Loading attendance records...
                          </p>
                          <p className="text-sm text-gray-500 mt-1">
                            Please wait while we fetch the records
                          </p>
                        </div>
                      </div>
                    ) : filteredRecords.length > 0 ? (
                      <div className="overflow-x-auto rounded-lg shadow">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead
                            className="bg-gray-50"
                            style={{ backgroundColor: colors.dark }}
                          >
                            <tr>
                              <th
                                style={{ color: colors.primary }}
                                className="px-6 py-3 text-left text-sm font-semibold text-gray-500 uppercase tracking-wider"
                              >
                                Event
                              </th>
                              <th
                                style={{ color: colors.primary }}
                                className="px-6 py-3 text-left text-sm font-semibold text-gray-500 uppercase tracking-wider"
                              >
                                Date
                              </th>
                              <th
                                style={{ color: colors.primary }}
                                className="px-6 py-3 text-left text-sm font-semibold text-gray-500 uppercase tracking-wider"
                              >
                                Location
                              </th>
                              <th
                                style={{ color: colors.primary }}
                                className="px-6 py-3 text-left text-sm font-semibold text-gray-500 uppercase tracking-wider"
                              >
                                Time In
                              </th>
                              <th
                                style={{ color: colors.primary }}
                                className="px-6 py-3 text-left text-sm font-semibold text-gray-500 uppercase tracking-wider"
                              >
                                Time Out
                              </th>
                              <th
                                style={{ color: colors.primary }}
                                className="px-6 py-3 text-left text-sm font-semibold text-gray-500 uppercase tracking-wider"
                              >
                                Status
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {filteredRecords.map((record, index) => (
                              <motion.tr
                                key={index}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.3 }}
                                className={`hover:bg-gray-50 ${
                                  record.record_type === "missed"
                                    ? "bg-red-50"
                                    : ""
                                }`}
                              >
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                  {record.event_title}
                                  {record.record_type === "missed" && (
                                    <span className="ml-2 text-xs text-red-500">
                                      (Missed Event)
                                    </span>
                                  )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  {formatDate(record.event_date)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  {record.location}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  {formatDateTime(record.time_in)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  {formatDateTime(record.time_out)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <span
                                    className={`px-2 py-2 text-xs font-semibold rounded-full ${
                                      record.status === "Present"
                                        ? "bg-green-100 text-green-800"
                                        : "bg-red-100 text-red-800"
                                    }`}
                                  >
                                    {record.status}
                                  </span>
                                </td>
                              </motion.tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <div className="text-center py-12 bg-white rounded-lg shadow">
                        <svg
                          className="w-16 h-16 mx-auto text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="1.5"
                            d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        <h3 className="mt-4 text-lg font-medium text-gray-900">
                          No Records Found
                        </h3>
                        <p className="mt-1 text-sm text-gray-500">
                          {activeTab === "present"
                            ? "You haven't attended any events yet."
                            : activeTab === "absent"
                            ? "You haven't missed any events."
                            : "No attendance records found."}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default StudentAttendance;
