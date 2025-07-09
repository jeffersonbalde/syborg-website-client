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

const ImagePlaceholder = () => (
  <div className="relative w-12 h-12 bg-gray-300 rounded overflow-hidden animate-pulse">
    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent animate-shimmer" />
  </div>
);

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

  const navigate = useNavigate();

  const fetchStudents = async () => {
    setLoading(true);

    const queryParams = new URLSearchParams();

    if (search) queryParams.append("search", search);
    if (genderFilter) queryParams.append("gender", genderFilter);
    if (yearFilter) queryParams.append("year_level", yearFilter);
    if (statusFilter) queryParams.append("status", statusFilter);
    if (courseFilter) queryParams.append("course", courseFilter);

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
      setTotalCount(result.total_count || 0);
      setFilteredCount(result.filtered_count || 0);
    } catch (error) {
      toast.error("Error fetching students");
      console.error("Error fetching students:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (student) => {
    const MySwal = withReactContent(Swal);

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
      backdrop: true,
      didOpen: () => {
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
    const MySwal = withReactContent(Swal);

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
      backdrop: true,
      didOpen: () => {
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
    await MySwal.fire({
      title: "Dili ko.",
      //   text: "You have been logged out successfully.",
      //   icon: "success",
      backdrop: true,
      confirmButtonColor: "#3085d6",
      didOpen: () => {
        // Swal.showLoading();
        document.body.style.overflow = "auto";
      },
      willClose: () => {
        document.body.style.overflow = "";
      },
    });

    // const MySwal = withReactContent(Swal);

    // const confirmResult = await MySwal.fire({
    //   title: "Are you sure?",
    //   text: `You are about to permanently delete "${student.firstname} ${student.lastname}". This action cannot be undone.`,
    //   icon: "warning",
    //   showCancelButton: true,
    //   confirmButtonText: "Yes, delete",
    //   cancelButtonText: "Cancel",
    //   backdrop: true,
    //   didOpen: () => {
    //     document.body.style.overflow = "auto";
    //   },
    //   willClose: () => {
    //     document.body.style.overflow = "";
    //   },
    // });

    // if (!confirmResult.isConfirmed) return;

    // MySwal.fire({
    //   title: "Deleting...",
    //   allowOutsideClick: false,
    //   allowEscapeKey: false,
    //   backdrop: true,
    //   didOpen: () => {
    //     Swal.showLoading();
    //     document.body.style.overflow = "auto";
    //   },
    //   willClose: () => {
    //     document.body.style.overflow = "";
    //   },
    // });

    // try {
    //   const res = await fetch(
    //     `${import.meta.env.VITE_LARAVEL_API}/students/${student.id}`,
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

    //   if (result.status) {
    //     toast.success(result.message);
    //     fetchStudents();
    //   } else {
    //     toast.error(result.message || "Failed to delete student.");
    //   }
    // } catch (err) {
    //   Swal.close();
    //   toast.error("Error occurred while deleting student.");
    //   console.error(err);
    // }
  };

  useEffect(() => {
    const debouncedFetch = debounce(() => {
      fetchStudents();
    }, 500); // 500ms delay

    debouncedFetch();

    return () => {
      debouncedFetch.cancel();
    };
  }, [search, genderFilter, yearFilter, statusFilter, courseFilter]);

  const MySwal = withReactContent(Swal);

  const handleResetFilters = () => {
    setSearch("");
    setGenderFilter("");
    setYearFilter("");
    setStatusFilter("");
    setCourseFilter("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      {/* Header */}
      <header className="bg-sky-600 text-white shadow-md py-5 animate__animated animate__fadeInDown">
        <div className="max-w-7xl mx-auto px-4 md:px-8 flex items-center justify-between">
          <h1 className="text-2xl md:text-3xl font-bold tracking-wide">
            SYBORG Portal
          </h1>
          <span className="text-sm italic opacity-80 hidden md:block">
            View all registered students here.
          </span>
        </div>
      </header>

      <main className="px-4 py-8 md:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Sidebar */}
            <div className="md:w-1/4 animate__animated animate__fadeInLeft">
              <AdminSidebar />
            </div>

            {/* Main Content */}
            <div className="md:w-3/4 w-full animate__animated animate__fadeInUp">
              <div className="bg-white shadow-lg rounded-xl overflow-hidden">
                <div className="p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h4 className="text-xl font-bold text-sky-800">
                      Registered Students List
                    </h4>
                  </div>

                  {/* Count Display */}
                  <div className="bg-gradient-to-r from-sky-50 to-blue-50 border border-sky-100 rounded-xl p-5 mb-6 shadow-sm">
                    <div className="flex flex-wrap justify-between items-center gap-4">
                      <div className="flex items-center">
                        <div className="bg-blue-100 p-3 rounded-xl mr-4 shadow-inner">
                          <svg
                            className="w-6 h-6 text-blue-600"
                            fill="none"
                            stroke="currentColor"
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
                          <h3 className="text-sm font-medium text-gray-600">
                            Total Students
                          </h3>
                          <p className="text-2xl font-bold text-gray-800">
                            {totalCount}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center">
                        <div className="bg-green-100 p-3 rounded-xl mr-4 shadow-inner">
                          <svg
                            className="w-6 h-6 text-green-600"
                            fill="none"
                            stroke="currentColor"
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
                          <h3 className="text-sm font-medium text-gray-600">
                            Filtered Students
                          </h3>
                          <p className="text-2xl font-bold text-gray-800">
                            {filteredCount}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* FILTER BAR */}
                  <div className="bg-gradient-to-r from-sky-50 to-blue-50 border border-sky-100 rounded-xl p-5 mb-6 shadow-sm">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                      <div className="flex flex-col">
                        <label className="text-xs font-medium text-gray-600 mb-1">
                          Gender
                        </label>
                        <select
                          disabled={loading}
                          className="cursor-pointer w-full border border-sky-200 bg-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-300 focus:border-transparent shadow-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                          value={genderFilter}
                          onChange={(e) => setGenderFilter(e.target.value)}
                        >
                          <option value="">All Genders</option>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                        </select>
                      </div>

                      <div className="flex flex-col">
                        <label className="text-xs font-medium text-gray-600 mb-1">
                          Year Level
                        </label>
                        <select
                          disabled={loading}
                          className="cursor-pointer w-full border border-sky-200 bg-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-300 focus:border-transparent shadow-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
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
                        <label className="text-xs font-medium text-gray-600 mb-1">
                          Course
                        </label>
                        <select
                          disabled={loading}
                          className="cursor-pointer w-full border border-sky-200 bg-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-300 focus:border-transparent shadow-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
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
                        <label className="text-xs font-medium text-gray-600 mb-1">
                          Status
                        </label>
                        <select
                          disabled={loading}
                          className="cursor-pointer w-full border border-sky-200 bg-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-300 focus:border-transparent shadow-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                          value={statusFilter}
                          onChange={(e) => setStatusFilter(e.target.value)}
                        >
                          <option value="">All Statuses</option>
                          <option value="1">Approved</option>
                          <option value="0">Disapproved</option>
                          <option value="2">Pending</option>
                        </select>
                      </div>
                    </div>

                    {/* SEARCH FIELD */}
                    <div className="flex flex-col">
                      <label className="text-xs font-medium text-gray-600 mb-1">
                        Search Students
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="Search by name or EDP number..."
                          value={search}
                          disabled={loading}
                          onChange={(e) => setSearch(e.target.value)}
                          className="w-full border border-sky-200 bg-white rounded-lg px-4 py-2 pl-10 focus:outline-none focus:ring-2 focus:ring-sky-300 focus:border-transparent placeholder:text-sm shadow-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                        />
                        <svg
                          className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                          ></path>
                        </svg>
                      </div>
                    </div>

                    <div className="flex justify-start mt-4">
                      <button
                        onClick={handleResetFilters}
                        disabled={loading}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 shadow ${
                          loading
                            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                            : "bg-white text-sky-600 border border-sky-300 hover:bg-sky-50 hover:shadow-md"
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
                            strokeWidth="2"
                            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                          ></path>
                        </svg>
                        Reset Filters
                      </button>
                    </div>
                  </div>

                  <div className="overflow-x-auto rounded-xl border border-sky-100 shadow-sm">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-slate-950">
                        <tr>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-red-600 uppercase tracking-wider"
                          >
                            ID
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-red-600 uppercase tracking-wider"
                          >
                            Profile
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-red-600 uppercase tracking-wider"
                          >
                            QR Code
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-red-600 uppercase tracking-wider"
                          >
                            EDP
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-red-600 uppercase tracking-wider"
                          >
                            Name
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-red-600 uppercase tracking-wider"
                          >
                            Course
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-red-600 uppercase tracking-wider"
                          >
                            Year
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-red-600 uppercase tracking-wider"
                          >
                            Status
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-center text-xs font-medium text-red-600 uppercase tracking-wider"
                          >
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {loading ? (
                          <tr>
                            <td colSpan="9" className="px-6 py-12 text-center">
                              <div className="flex flex-col items-center justify-center">
                                <div className="w-12 h-12 border-4 border-sky-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                                <p className="text-gray-600 font-medium">
                                  Loading student data...
                                </p>
                                <p className="text-sm text-gray-500 mt-1">
                                  Please wait while we fetch the records
                                </p>
                              </div>
                            </td>
                          </tr>
                        ) : students.length === 0 ? (
                          <tr>
                            <td colSpan="9" className="px-6 py-8 text-center">
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
                                  ></path>
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
                                    className="mt-3 px-4 py-2 bg-sky-100 text-sky-700 rounded-lg text-sm font-medium hover:bg-sky-200 transition"
                                  >
                                    Reset Filters
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        ) : (
                          students.map((student) => (
                            <tr
                              key={`student-${student.id}`}
                              className="hover:bg-gray-50 transition"
                            >
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                {student.id}
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

                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-mono">
                                {student.edp_number}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-gray-900">
                                  {student.firstname} {student.lastname}
                                </div>
                                <div className="text-xs text-gray-500">
                                  {student.email}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                {student.course}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                {student.year_level}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span
                                  className={`px-2 py-1 text-xs font-medium rounded-full ${
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
                              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <div className="flex justify-center space-x-2">
                                  <button
                                    onClick={() => handleApprove(student)}
                                    className={`inline-flex items-center px-3 py-1 rounded-md text-xs font-medium ${
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
                                    className={`inline-flex items-center px-3 py-1 rounded-md text-xs font-medium ${
                                      student.active_status === 0
                                        ? "bg-red-100 text-red-800 cursor-not-allowed"
                                        : "bg-red-50 text-red-700 hover:bg-red-100 border border-red-200 cursor-pointer"
                                    }`}
                                    disabled={student.active_status === 0}
                                  >
                                    Disapprove
                                  </button>

                                  <button
                                    onClick={() => handleDelete(student)}
                                    className="inline-flex items-center px-3 py-1 rounded-md text-xs font-medium bg-red-50 text-red-700 hover:bg-red-100 border border-red-200 cursor-pointer"
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
