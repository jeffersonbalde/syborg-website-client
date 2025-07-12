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

const ImagePlaceholder = () => (
  <div className="relative w-12 h-12 bg-gray-300 rounded overflow-hidden animate-pulse">
    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent animate-shimmer" />
  </div>
);

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

const ShowStudents = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [imgLoadedProfile, setImgLoadedProfile] = useState({});
  const [imgLoadedQr, setImgLoadedQr] = useState({});
  const [search, setSearch] = useState("");
  const [genderFilter, setGenderFilter] = useState("");
  const [yearFilter, setYearFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [courseFilter, setCourseFilter] = useState("");
  const [totalCount, setTotalCount] = useState(0);
  const [filteredCount, setFilteredCount] = useState(0);

  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const navigate = useNavigate();

  const fetchStudents = async () => {
    setLoading(true);

    const queryParams = new URLSearchParams();

    if (search) queryParams.append("search", search);
    if (genderFilter) queryParams.append("gender", genderFilter);
    if (yearFilter) queryParams.append("year_level", yearFilter);
    if (statusFilter) queryParams.append("status", statusFilter);
    if (courseFilter) queryParams.append("course", courseFilter);
    queryParams.append("page", currentPage);
    queryParams.append("per_page", perPage);

    try {
      const res = await fetch(
        `${
          import.meta.env.VITE_LARAVEL_API
        }/students?${queryParams.toString()}`,
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
      setStudents(result.data);
      setTotalCount(result.meta?.total_count || 0);
      setFilteredCount(result.meta?.filtered_count || 0);
      setTotalItems(result.meta?.total || 0);
      setTotalPages(result.meta?.last_page || 1);
    } catch (error) {
      toast.error("Error fetching students");
      console.error("Error fetching students:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (student) => {
    const MySwal = getCustomSwal();

    if (student.active_status == 1) {
      MySwal.fire({
        icon: "info",
        title: "Already Approved",
        text: "This student is already marked as approved.",
        confirmButtonText: "OK",
      });
      return;
    }

    const confirmResult = await MySwal.fire({
      title: "Are you sure?",
      text: "This student will be marked as approved.",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, approve",
      cancelButtonText: "Cancel",
      iconColor: colors.info,
      backdrop: true,
      backdrop: `
      rgba(0,0,0,0.7)
      url("/images/loading.gif")
      center top
      no-repeat
    `,
      didOpen: () => {
        // Swal.showLoading();
        document.body.style.overflow = "auto";
      },
      willClose: () => {
        document.body.style.overflow = "";
      },
    });

    if (!confirmResult.isConfirmed) return;

    MySwal.fire({
      title: "Approving...",
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
      const res = await fetch(
        `${import.meta.env.VITE_LARAVEL_API}/students/${student.id}/approve`,
        {
          method: "PUT",
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${token()}`,
          },
        }
      );

      const result = await res.json();
      Swal.close();

      if (result.status) {
        toast.success(result.message);
        fetchStudents();
      } else {
        toast.error(result.message || "Failed to approve student.");
      }
    } catch (err) {
      Swal.close();
      toast.error("Error occurred while approving.");
      console.error(err);
    }
  };

  const handleDisapprove = async (student) => {
    const MySwal = getCustomSwal();

    if (student.active_status == 0) {
      MySwal.fire({
        icon: "info",
        title: "Already Disapproved",
        text: "This student is already marked as disapproved.",
        confirmButtonText: "OK",
      });
      return;
    }

    const confirmResult = await MySwal.fire({
      title: "Are you sure?",
      text: "This student will be marked as disapproved.",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, disapprove",
      cancelButtonText: "Cancel",
      iconColor: colors.info,
      backdrop: true,
      backdrop: `
      rgba(0,0,0,0.7)
      url("/images/loading.gif")
      center top
      no-repeat
    `,
      didOpen: () => {
        // Swal.showLoading();
        document.body.style.overflow = "auto";
      },
      willClose: () => {
        document.body.style.overflow = "";
      },
    });

    if (!confirmResult.isConfirmed) return;

    MySwal.fire({
      title: "Disapproving...",
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
      const res = await fetch(
        `${import.meta.env.VITE_LARAVEL_API}/students/${student.id}/disapprove`,
        {
          method: "PUT",
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${token()}`,
          },
        }
      );

      const result = await res.json();
      Swal.close();

      if (result.status) {
        toast.success(result.message);
        fetchStudents();
      } else {
        toast.error(result.message || "Failed to disapprove student.");
      }
    } catch (err) {
      Swal.close();
      toast.error("Error occurred while disapproving.");
      console.error(err);
    }
  };

  const handleDelete = async (student) => {
    const MySwal = getCustomSwal();
    await MySwal.fire({
      title: "Dili ko.",
    });
  };

  useEffect(() => {
    const debouncedFetch = debounce(() => {
      fetchStudents();
    }, 500);

    debouncedFetch();

    return () => {
      debouncedFetch.cancel();
    };
  }, [search, genderFilter, yearFilter, statusFilter, courseFilter]);

  useEffect(() => {
    fetchStudents();
  }, [currentPage, perPage]);

  const MySwal = getCustomSwal();

  const handleResetFilters = () => {
    setSearch("");
    setGenderFilter("");
    setYearFilter("");
    setStatusFilter("");
    setCourseFilter("");
  };

  return (
    <div
      className="min-h-screen flex overflow-hidden"
      style={{ backgroundColor: colors.lightBg }}
    >
      {/* Sidebar */}
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
                            Students Management
                          </h4>
                          <p
                            className="text-sm mt-1"
                            style={{ color: colors.lightBg }}
                          >
                            View and manage all registered students
                          </p>
                        </div>
                      </div>

                      {/* Action button with hover effect */}
                      {/* <Link
                        to="/admin/students/new"
                        className="group relative flex items-center justify-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 overflow-hidden cursor-pointer"
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
                              strokeWidth="2"
                              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                            />
                          </svg>
                          Register New Student
                        </span>
                        <span
                          className="absolute inset-0 transition-all duration-300"
                          style={{
                            backgroundColor: "rgba(0,0,0,0)",
                          }}
                        ></span>
                      </Link> */}

                      <style jsx>{`
                        button:hover span:last-child {
                          background-color: rgba(0, 0, 0, 0.1) !important;
                        }
                      `}</style>
                    </div>
                  </div>

                  {/* Count Display */}
                  <div
                    className="rounded-xl p-4 mb-5 shadow-sm"
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
                              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                            />
                          </svg>
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold text-gray-700">
                            Total Students
                          </h3>
                          <p
                            className="text-4xl font-bold"
                            style={{ color: colors.dark }}
                          >
                            {totalCount}
                          </p>
                        </div>
                      </div>

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
                              d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                            />
                          </svg>
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold text-gray-700">
                            Filtered Students
                          </h3>
                          <p
                            className="text-4xl font-bold"
                            style={{ color: colors.dark }}
                          >
                            {filteredCount}
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
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                      <div className="flex flex-col">
                        <label className="text-lg font-semibold mb-1 text-gray-700">
                          Gender
                        </label>
                        <select
                          disabled={loading}
                          className="cursor-pointer w-full rounded-lg px-3 py-2 focus:outline-none focus:ring-2 shadow-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                          style={{
                            border: `1px solid ${colors.border}`,
                            backgroundColor: "white",
                            focusRing: colors.primary,
                            focusBorder: "transparent",
                          }}
                          value={genderFilter}
                          onChange={(e) => setGenderFilter(e.target.value)}
                        >
                          <option value="">All Genders</option>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Prefer not to say">
                            Prefer not to say
                          </option>
                        </select>
                      </div>

                      <div className="flex flex-col">
                        <label className="text-lg font-semibold mb-1 text-gray-700">
                          Year Level
                        </label>
                        <select
                          disabled={loading}
                          className="cursor-pointer w-full rounded-lg px-3 py-2 focus:outline-none focus:ring-2 shadow-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                          style={{
                            border: `1px solid ${colors.border}`,
                            backgroundColor: "white",
                            focusRing: colors.primary,
                            focusBorder: "transparent",
                          }}
                          value={yearFilter}
                          onChange={(e) => setYearFilter(e.target.value)}
                        >
                          <option value="">All Year Levels</option>
                          <option value="1st Year">1st Year</option>
                          <option value="2nd Year">2nd Year</option>
                          <option value="3rd Year">3rd Year</option>
                          <option value="4th Year">4th Year</option>
                        </select>
                      </div>

                      <div className="flex flex-col">
                        <label className="text-lg font-semibold mb-1 text-gray-700">
                          Course
                        </label>
                        <select
                          disabled={loading}
                          className="cursor-pointer w-full rounded-lg px-3 py-2 focus:outline-none focus:ring-2 shadow-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                          style={{
                            border: `1px solid ${colors.border}`,
                            backgroundColor: "white",
                            focusRing: colors.primary,
                            focusBorder: "transparent",
                          }}
                          value={courseFilter}
                          onChange={(e) => setCourseFilter(e.target.value)}
                        >
                          <option value="">All Courses</option>
                          <option value="Bachelor of Science in Computer Science">
                            BSCS
                          </option>
                          <option value="Bachelor in Library and Information Science">
                            BLIS
                          </option>
                          <option value="Bachelor of Science in Information Systems">
                            BSIS
                          </option>
                        </select>
                      </div>

                      <div className="flex flex-col">
                        <label className="text-lg font-semibold mb-1 text-gray-700">
                          Status
                        </label>
                        <select
                          disabled={loading}
                          className="cursor-pointer w-full rounded-lg px-3 py-2 focus:outline-none focus:ring-2 shadow-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                          style={{
                            border: `1px solid ${colors.border}`,
                            backgroundColor: "white",
                            focusRing: colors.primary,
                            focusBorder: "transparent",
                          }}
                          value={statusFilter}
                          onChange={(e) => setStatusFilter(e.target.value)}
                        >
                          <option value="">All Status</option>
                          <option value="1">Approved</option>
                          <option value="0">Disapproved</option>
                          <option value="2">Pending</option>
                        </select>
                      </div>
                    </div>

                    {/* SEARCH FIELD */}
                    <div className="flex flex-col">
                      <label className="text-lg font-semibold mb-1 text-gray-700">
                        Search Students
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="Search by name or EDP number..."
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
                            "Profile",
                            "QR Code",
                            "EDP",
                            "Name",
                            "Course",
                            "Year",
                            "Gender",
                            "Status",
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
                            <td colSpan="10" className="px-6 py-12 text-center">
                              <div className="flex flex-col items-center justify-center">
                                <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin mb-4"></div>
                                <p className="text-gray-600 font-medium">
                                  Loading students data...
                                </p>
                                <p className="text-sm text-gray-500 mt-1">
                                  Please wait while we fetch the records
                                </p>
                              </div>
                            </td>
                          </tr>
                        ) : students.length === 0 ? (
                          <tr>
                            <td colSpan="10" className="px-6 py-8 text-center">
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
                                  No students found
                                </h3>
                                <p className="text-gray-500 max-w-md">
                                  {search ||
                                  genderFilter ||
                                  yearFilter ||
                                  statusFilter ||
                                  courseFilter
                                    ? "Try adjusting your search or filter criteria"
                                    : "There are currently no registered students"}
                                </p>
                                {(search ||
                                  genderFilter ||
                                  yearFilter ||
                                  statusFilter ||
                                  courseFilter) && (
                                  <button
                                    onClick={handleResetFilters}
                                    className="mt-3 px-4 py-2 bg-sky-100 text-sky-700 rounded-lg text-sm font-medium hover:bg-sky-200 transition cursor-pointer"
                                  >
                                    Reset Filters
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        ) : (
                          students.map((student, index) => (
                            <tr
                              key={`student-${student.id}`}
                              className="hover:bg-gray-50 transition"
                            >
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-700 font-bold">
                                {(currentPage - 1) * perPage + index + 1}
                              </td>

                              <td className="px-6 py-4 whitespace-nowrap">
                                {student.profile_picture ? (
                                  <>
                                    {!imgLoadedProfile[student.id] && (
                                      <ImagePlaceholder />
                                    )}
                                    <img
                                      src={`${
                                        import.meta.env.VITE_LARAVEL_FILE_API
                                      }/uploads/Student_Profile_Image/${
                                        student.profile_picture
                                      }`}
                                      alt="Profile"
                                      className={`w-10 h-10 object-cover rounded-full transition-opacity duration-500 ${
                                        imgLoadedProfile[student.id]
                                          ? "opacity-100"
                                          : "opacity-0 absolute"
                                      }`}
                                      onLoad={() =>
                                        setImgLoadedProfile((prev) => ({
                                          ...prev,
                                          [student.id]: true,
                                        }))
                                      }
                                    />
                                  </>
                                ) : (
                                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-xs text-gray-500">
                                    N/A
                                  </div>
                                )}
                              </td>

                              <td className="px-6 py-4 whitespace-nowrap">
                                {student.qr_code ? (
                                  <>
                                    {!imgLoadedQr[student.id] && (
                                      <ImagePlaceholder />
                                    )}
                                    <img
                                      src={`${
                                        import.meta.env.VITE_LARAVEL_FILE_API
                                      }/${student.qr_code}`}
                                      alt="QR"
                                      className={`w-10 h-10 object-contain transition-opacity duration-500 ${
                                        imgLoadedQr[student.id]
                                          ? "opacity-100"
                                          : "opacity-0 absolute"
                                      }`}
                                      onLoad={() =>
                                        setImgLoadedQr((prev) => ({
                                          ...prev,
                                          [student.id]: true,
                                        }))
                                      }
                                    />
                                  </>
                                ) : (
                                  <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center text-xs text-gray-500">
                                    N/A
                                  </div>
                                )}
                              </td>

                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-semibold">
                                {student.edp_number}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-gray-900">
                                  {student.firstname} {student.lastname}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {student.email}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                {student.course}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                {student.year_level}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                {student.gender}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span
                                  className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                    student.active_status === 1
                                      ? "bg-green-100 text-green-800"
                                      : student.active_status === 2
                                      ? "bg-yellow-100 text-yellow-800"
                                      : "bg-red-100 text-red-800"
                                  }`}
                                >
                                  {student.active_status === 1
                                    ? "Approved"
                                    : student.active_status === 2
                                    ? "Pending"
                                    : "Disapproved"}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-semibold">
                                <div className="flex justify-center space-x-2">
                                  <button
                                    onClick={() => handleApprove(student)}
                                    className={`inline-flex items-center px-3 py-2 rounded-md text-xs font-semibold ${
                                      student.active_status === 1
                                        ? "bg-green-100 text-green-800 cursor-not-allowed"
                                        : "bg-green-50 text-green-700 hover:bg-green-100 border border-green-200 cursor-pointer"
                                    }`}
                                    disabled={student.active_status === 1}
                                  >
                                    Approve
                                  </button>
                                  <button
                                    onClick={() => handleDisapprove(student)}
                                    className={`inline-flex items-center px-3 py-1 rounded-md text-xs font-semibold ${
                                      student.active_status === 0
                                        ? "bg-red-100 text-red-800 cursor-not-allowed"
                                        : "bg-red-50 text-red-700 hover:bg-red-100 border border-red-200 cursor-pointer transition"
                                    }`}
                                    disabled={student.active_status === 0}
                                  >
                                    Disapprove
                                  </button>

                                  <button
                                    onClick={() => handleDelete(student)}
                                    className="inline-flex items-center px-3 py-1 rounded-md text-xs font-semibold bg-red-50 text-red-700 hover:bg-red-100 border border-red-200 cursor-pointer"
                                  >
                                    Remove
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
                        <span className="text-md mr-2 text-gray-700">
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
                        <span className="font-semibold text-gray-700">
                          {(currentPage - 1) * perPage + 1}-
                          {Math.min(currentPage * perPage, totalItems)}
                        </span>{" "}
                        of{" "}
                        <span className="font-semibold text-gray-700">
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
    </div>
  );
};

export default ShowStudents;
