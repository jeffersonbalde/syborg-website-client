import React, { useEffect, useState } from "react";
import AdminSidebar from "../../../components/AdminSidebar";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { toast } from "react-toastify";
import { token } from "../../../utils/GetToken";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useNavigate } from "react-router-dom";
import { debounce } from "lodash";
import CreateEvent from "./CreateEvent";

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

const getCustomSwal = () => {
  return withReactContent(Swal).mixin({
    background: colors.lightBg,
    color: colors.text,
    confirmButtonColor: colors.primary,
    cancelButtonColor: colors.lightText,
    backdrop: `
        rgba(0,0,0,0.7)
        url("/images/loading.gif")
        center top
        no-repeat
        `,
    customClass: {
      confirmButton: "custom-confirm-btn",
      cancelButton: "custom-cancel-btn",
      title: "custom-title",
      content: "custom-content",
      popup: "custom-popup",
    },
  });
};

const ShowEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [totalCount, setTotalCount] = useState(0);

  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const handleCloseModal = () => {
    setIsModalClosing(true);
    setTimeout(() => {
      setIsCreateModalOpen(false);
      setIsModalClosing(false);
    }, 300);
  };

  const navigate = useNavigate();

  const fetchEvents = async () => {
    setLoading(true);

    const queryParams = new URLSearchParams();

    if (search) queryParams.append("search", search);
    if (dateFilter) queryParams.append("date", dateFilter);
    queryParams.append("page", currentPage);
    queryParams.append("per_page", perPage);

    try {
      const res = await fetch(
        `${import.meta.env.VITE_LARAVEL_API}/events?${queryParams.toString()}`,
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
      setEvents(result.data);
      setTotalItems(result.meta.total);
      setTotalPages(result.meta.last_page);
      setTotalCount(result.meta.total);
    } catch (error) {
      toast.error("Error fetching events");
      console.error("Error fetching events:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (event) => {
    // const MySwal = getCustomSwal();
    // const confirmResult = await MySwal.fire({
    //   title: "Are you sure?",
    //   text: `You are about to delete "${event.title}". This action cannot be undone.`,
    //   icon: "warning",
    //   showCancelButton: true,
    //   confirmButtonText: "Yes, delete",
    //   cancelButtonText: "Cancel",
    // });
    // if (!confirmResult.isConfirmed) return;
    // MySwal.fire({
    //   title: "Deleting...",
    //   allowOutsideClick: false,
    //   allowEscapeKey: false,
    //   didOpen: () => {
    //     Swal.showLoading();
    //   },
    // });
    // try {
    //   const res = await fetch(
    //     `${import.meta.env.VITE_LARAVEL_API}/events/${event.id}`,
    //     {
    //       method: "DELETE",
    //       headers: {
    //         "Content-type": "application/json",
    //         Authorization: `Bearer ${token()}`,
    //       },
    //     }
    //   );
    //   const result = await res.json();
    //   Swal.close();
    //   if (result.message) {
    //     toast.success(result.message);
    //     fetchEvents();
    //   } else {
    //     toast.error(result.message || "Failed to delete event.");
    //   }
    // } catch (err) {
    //   Swal.close();
    //   toast.error("Error occurred while deleting event.");
    //   console.error(err);
    // }
  };

  useEffect(() => {
    const debouncedFetch = debounce(() => {
      fetchEvents();
    }, 500);

    debouncedFetch();

    return () => {
      debouncedFetch.cancel();
    };
  }, [search, dateFilter]);

  const MySwal = getCustomSwal();

  const handleResetFilters = () => {
    setSearch("");
    setDateFilter("");
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const formatTime = (timeString) => {
    return new Date(timeString).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  useEffect(() => {
    fetchEvents();
  }, [currentPage, perPage]);

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
            {/* Your existing content here */}
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
                    //   backgroundColor: colors.lightBg,
                      borderBottom: `1px solid ${colors.border}`,
                    }}
                  >
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 ">
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
                            Events Management
                          </h4>
                          <p
                            className="text-sm mt-1 "
                            style={{ color: colors.lightBg }}
                          >
                            Create and manage your events
                          </p>
                        </div>
                      </div>

                      {/* Action button with hover effect */}
                      <button
                        onClick={() => setIsCreateModalOpen(true)}
                        className="group relative flex items-center justify-center px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 overflow-hidden cursor-pointer"
                        style={{
                          backgroundColor: colors.primary,
                          color: "white",
                          boxShadow: `0 2px 4px ${colors.primary}20`,
                          maxWidth: "200px",
                        }}
                      >
                        <span className="relative z-10 flex items-center gap-2">
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="4"
                              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                            />
                          </svg>
                          Create New Event
                        </span>
                        {/* This is the hover overlay - fixed to work with your color scheme */}
                        <span
                          className="absolute inset-0 transition-all duration-300"
                          style={{
                            backgroundColor: "rgba(0,0,0,0)",
                          }}
                        ></span>
                      </button>

                      {/* Add this to your CSS or style tag */}
                      <style jsx>{`
                        button:hover span:last-child {
                          background-color: rgba(0, 0, 0, 0.1) !important;
                        }
                      `}</style>
                    </div>
                  </div>

                  {/* Count Display */}
                  <div
                    className="rounded-xl p-4 mb-5 shadow-sm "
                    style={{
                      backgroundColor: "#D3D3D3",
                      border: `1px solid ${colors.border}`,
                    }}
                  >
                    <div className="flex flex-wrap justify-between items-center gap-4">
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
                              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                        </div>
                        <div>
                          <h3
                            className="text-xl font-semibold text-gray-700"
                            // style={{ color: colors.lightText }}
                          >
                            Total Events
                          </h3>
                          <p
                            className="text-4xl font-bold"
                            style={{ color: colors.dark }}
                          >
                            {totalCount}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* FILTER BAR */}
                  <div
                    className="rounded-xl p-4 mb-5 shadow-sm"
                    style={{
                      backgroundColor: "#D3D3D3",
                      border: `1px solid ${colors.border}`,
                    }}
                  >
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div className="flex flex-col">
                        <label
                          className="text-lg font-semibold mb-1 text-gray-700"
                        //   style={{ color: colors.lightText }}
                        >
                          Event Date
                        </label>
                        <input
                          type="date"
                          disabled={loading}
                          className="cursor-pointer w-full rounded-lg px-3 py-2 focus:outline-none focus:ring-2 shadow-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                          style={{
                            border: `1px solid ${colors.border}`,
                            backgroundColor: "white",
                            focusRing: colors.primary,
                            focusBorder: "transparent",
                          }}
                          value={dateFilter}
                          onChange={(e) => setDateFilter(e.target.value)}
                        />
                      </div>

                      {/* SEARCH FIELD */}
                      <div className="flex flex-col md:col-span-2">
                        <label
                          className="text-lg font-semibold mb-1 text-gray-700" 
                        //   style={{ color: colors.lightText }}
                        >
                          Search Events
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            placeholder="Search by event title or location..."
                            value={search}
                            disabled={loading}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full rounded-lg px-4 py-2 pl-10 focus:outline-none focus:ring-2 placeholder:text-sm shadow-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                            style={{
                              border: `1px solid ${colors.border}`,
                              backgroundColor: "white",
                              focusRing: colors.primary,
                              focusBorder: "transparent",
                            }}
                          />
                          <svg
                            className="absolute left-3 top-2.5 h-5 w-5"
                            fill="none"
                            stroke={colors.lightText}
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                            />
                          </svg>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-start mt-4">
                      <button
                        onClick={handleResetFilters}
                        disabled={loading}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 shadow ${
                          loading
                            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                            : "bg-[#D30203] text-white hover:brightness-90 transition-all duration-300 cursor-pointer"
                        }`}
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="4"
                            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                          />
                        </svg>
                        Reset Filters
                      </button>
                    </div>
                  </div>

                  <div
                    className="overflow-x-auto rounded-xl shadow-sm"
                    style={{ border: `1px solid ${colors.border}` }}
                  >
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead style={{ backgroundColor: colors.dark }}>
                        <tr>
                          {[
                            "#",
                            "Title",
                            "Location",
                            "Date",
                            "Start Time",
                            "End Time",
                            "Present",
                            "Absent",
                            "Actions",
                          ].map((header) => (
                            <th
                              key={header}
                              scope="col"
                              className="px-6 py-3 text-center text-sm font-semibold uppercase tracking-wider"
                              style={{ color: colors.primary }}
                            >
                              {header}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {loading ? (
                          <tr>
                            <td colSpan="8" className="px-6 py-12 text-center">
                              <div className="flex flex-col items-center justify-center">
                                <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin mb-4"></div>
                                <p className="text-gray-600 font-medium">
                                  Loading events data...
                                </p>
                                <p className="text-sm text-gray-500 mt-1">
                                  Please wait while we fetch the records
                                </p>
                              </div>
                            </td>
                          </tr>
                        ) : events.length === 0 ? (
                          <tr>
                            <td colSpan="8" className="px-6 py-8 text-center">
                              <div className="flex flex-col items-center justify-center">
                                <svg
                                  className="w-16 h-16 text-gray-400 mb-3"
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
                                <h3 className="text-lg font-medium text-gray-700 mb-1">
                                  No events found
                                </h3>
                                <p className="text-gray-500 max-w-md">
                                  {search || dateFilter
                                    ? "Try adjusting your search or filter criteria"
                                    : "There are currently no events scheduled"}
                                </p>
                                {(search || dateFilter) && (
                                  <button
                                    onClick={handleResetFilters}
                                    className="mt-3 px-4 py-2 bg-sky-100 text-sky-700 rounded-lg text-sm font-medium hover:bg-sky-200 transition cursor-pointer"
                                  >
                                    Reset Filters
                                  </button>
                                )}
                                {/* <button
                                  onClick={() => navigate("/admin/events/new")}
                                  onMouseEnter={(e) =>
                                    (e.currentTarget.style.backgroundColor = `${colors.primary}20`)
                                  }
                                  onMouseLeave={(e) =>
                                    (e.currentTarget.style.backgroundColor = `${colors.primary}10`)
                                  }
                                  className="mt-3 px-4 py-2 rounded-lg text-sm font-medium cursor-pointer transition-colors duration-200"
                                  style={{
                                    backgroundColor: `${colors.primary}10`,
                                    color: colors.primary,
                                  }}
                                >
                                  Create New Event
                                </button> */}
                              </div>
                            </td>
                          </tr>
                        ) : (
                          events.map((event, index) => (
                            <tr
                              key={`event-${event.id}`}
                              className="hover:bg-gray-50 transition"
                            >
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-700 font-bold">
                                {(currentPage - 1) * perPage + index + 1}
                              </td>

                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-gray-900">
                                  {event.title}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                {event.location}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                {formatDate(event.event_date)}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                {formatTime(event.start_time)}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                {formatTime(event.end_time)}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                                  {event.present_students_count}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                                  {event.absent_students_count}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <div className="flex justify-center space-x-2">
                                  <Link
                                    // to={`/admin/events/${event.id}/attendance`}
                                    className="inline-flex items-center px-3 py-2 rounded-md text-xs font-semibold bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 cursor-pointer"
                                  >
                                    Take Attendance
                                  </Link>
                                  <Link
                                    // to={`/admin/events/${event.id}/edit`}
                                    className="inline-flex items-center px-3 py-1 rounded-md text-xs font-semibold bg-yellow-50 text-yellow-700 hover:bg-yellow-100 border border-yellow-200 cursor-pointer"
                                  >
                                    Edit
                                  </Link>
                                  <button
                                    // onClick={() => handleDelete(event)}
                                    className="inline-flex items-center px-3 py-1 rounded-md text-xs font-semibold bg-red-50 text-red-700 hover:bg-red-100 border border-red-200 cursor-pointer"
                                  >
                                    Delete
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>

                  {/* Enhanced Pagination Controls */}
                  <div
                    className="mt-5 px-4 py-3 rounded-lg"
                    style={{
                      backgroundColor: "#D3D3D3",
                      border: `1px solid ${colors.border}`,
                    }}
                  >
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 font-semibold">
                      {/* Items Count */}
                      <div className="flex items-center">
                        <span
                          className="text-md mr-2 text-gray-700 "
                          //   style={{ color: colors.lightText }}
                        >
                          Rows per page:
                        </span>
                        <select
                          value={perPage}
                          onChange={(e) => {
                            setPerPage(Number(e.target.value));
                            setCurrentPage(1);
                          }}
                          className="cursor-pointer border rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 transition-all"
                          style={{
                            borderColor: colors.border,
                            backgroundColor: "white",
                            color: colors.text,
                            focusRing: colors.primary,
                          }}
                        >
                          {[5, 10, 20, 50].map((size) => (
                            <option
                              key={size}
                              value={size}
                              style={{ color: colors.text }}
                            >
                              {size}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Page Info */}
                      <div
                        className="text-md"
                        style={{ color: colors.lightText }}
                      >
                        <span
                        //   style={{ color: colors.text }}
                          className="font-semibold text-gray-700"
                        >
                          {(currentPage - 1) * perPage + 1}-
                          {Math.min(currentPage * perPage, totalItems)}
                        </span>{" "}
                        of{" "}
                        <span
                        //   style={{ color: colors.text }}
                          className="font-semibold text-gray-700"
                        >
                          {totalItems}
                        </span>
                      </div>

                      {/* Page Navigation */}
                      <div className="flex items-center space-x-1">
                        <button
                          onClick={() => setCurrentPage(1)}
                          disabled={currentPage === 1}
                          className={`p-2 rounded-md ${
                            currentPage === 1
                              ? "opacity-50 cursor-not-allowed"
                              : "hover:bg-gray-100"
                          }`}
                          style={{ color: colors.primary }}
                          aria-label="First page"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
                            />
                          </svg>
                        </button>

                        <button
                          onClick={() =>
                            setCurrentPage((prev) => Math.max(prev - 1, 1))
                          }
                          disabled={currentPage === 1}
                          className={`p-2 rounded-md ${
                            currentPage === 1
                              ? "opacity-50 cursor-not-allowed"
                              : "hover:bg-gray-100"
                          }`}
                          style={{ color: colors.primary }}
                          aria-label="Previous page"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M15 19l-7-7 7-7"
                            />
                          </svg>
                        </button>

                        {/* Page Numbers */}
                        <div className="flex space-x-1 mx-2">
                          {Array.from(
                            { length: Math.min(5, totalPages) },
                            (_, i) => {
                              let pageNum;
                              if (totalPages <= 5) {
                                pageNum = i + 1;
                              } else if (currentPage <= 3) {
                                pageNum = i + 1;
                              } else if (currentPage >= totalPages - 2) {
                                pageNum = totalPages - 4 + i;
                              } else {
                                pageNum = currentPage - 2 + i;
                              }

                              return (
                                <button
                                  key={pageNum}
                                  onClick={() => setCurrentPage(pageNum)}
                                  className={`w-8 h-8 rounded-md text-sm flex items-center justify-center transition-colors ${
                                    currentPage === pageNum
                                      ? "text-white"
                                      : "hover:bg-gray-100"
                                  }`}
                                  style={{
                                    backgroundColor:
                                      currentPage === pageNum
                                        ? colors.primary
                                        : "transparent",
                                    color:
                                      currentPage === pageNum
                                        ? "white"
                                        : colors.text,
                                  }}
                                >
                                  {pageNum}
                                </button>
                              );
                            }
                          )}
                          {totalPages > 5 && currentPage < totalPages - 2 && (
                            <span
                              className="px-2 flex items-end"
                              style={{ color: colors.lightText }}
                            >
                              ...
                            </span>
                          )}
                          {totalPages > 5 && currentPage < totalPages - 2 && (
                            <button
                              onClick={() => setCurrentPage(totalPages)}
                              className={`w-8 h-8 rounded-md text-sm flex items-center justify-center hover:bg-gray-100`}
                              style={{ color: colors.text }}
                            >
                              {totalPages}
                            </button>
                          )}
                        </div>

                        <button
                          onClick={() =>
                            setCurrentPage((prev) =>
                              Math.min(prev + 1, totalPages)
                            )
                          }
                          disabled={currentPage === totalPages}
                          className={`p-2 rounded-md ${
                            currentPage === totalPages
                              ? "opacity-50 cursor-not-allowed"
                              : "hover:bg-gray-100"
                          }`}
                          style={{ color: colors.primary }}
                          aria-label="Next page"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M9 5l7 7-7 7"
                            />
                          </svg>
                        </button>

                        <button
                          onClick={() => setCurrentPage(totalPages)}
                          disabled={currentPage === totalPages}
                          className={`p-2 rounded-md ${
                            currentPage === totalPages
                              ? "opacity-50 cursor-not-allowed"
                              : "hover:bg-gray-100"
                          }`}
                          style={{ color: colors.primary }}
                          aria-label="Last page"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M13 5l7 7-7 7M5 5l7 7-7 7"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <AnimatePresence>
        {isCreateModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto"
              style={{ border: `1px solid ${colors.border}` }}
            >
              <CreateEvent
                onClose={() => setIsCreateModalOpen(false)}
                onSuccess={() => {
                  setIsCreateModalOpen(false);
                  fetchEvents();
                }}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ShowEvents;
