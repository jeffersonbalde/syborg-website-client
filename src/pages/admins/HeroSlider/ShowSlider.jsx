import React, { useEffect, useState } from "react";
import AdminSidebar from "../../../components/AdminSidebar";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { toast } from "react-toastify";
import { token } from "../../../utils/GetToken";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { debounce } from "lodash";
import { motion, AnimatePresence } from "framer-motion";
import CreateSlider from "./CreateSlider";

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

const ShowSlider = () => {
  const [heroSlider, setHeroSlider] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [imgLoaded, setImgLoaded] = useState({});
  const [search, setSearch] = useState("");
  const [totalCount, setTotalCount] = useState(0);

  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const navigate = useNavigate();

  const fetchHeroSlider = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams();
      if (search) queryParams.append("search", search);
      queryParams.append("page", currentPage);
      queryParams.append("per_page", perPage);

      const res = await fetch(
        `${
          import.meta.env.VITE_LARAVEL_API
        }/heroslider?${queryParams.toString()}`,
        {
          method: "GET",
          headers: {
            "Content-type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${token()}`,
          },
        }
      );

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const result = await res.json();

      // Update state with paginated data
      setHeroSlider(result.data);
      setTotalItems(result.meta?.total || 0);
      setTotalPages(result.meta?.last_page || 1);
      setTotalCount(result.meta?.total || 0);
    } catch (error) {
      console.error("Error fetching sliders:", error);
      toast.error("Error fetching hero sliders");
    } finally {
      setLoading(false);
    }
  };

  const deleteHeroSlider = async (id) => {
    if (deleting) return;

    const MySwal = getCustomSwal();

    const confirmResult = await MySwal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });

    if (confirmResult.isConfirmed) {
      setDeleting(true);
      MySwal.fire({
        title: "Deleting...",
        allowOutsideClick: false,
        showConfirmButton: false,
        allowEscapeKey: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      try {
        const res = await fetch(
          `${import.meta.env.VITE_LARAVEL_API}/heroslider/${id}`,
          {
            method: "DELETE",
            headers: {
              "Content-type": "application/json",
              Accept: "application/json",
              Authorization: `Bearer ${token()}`,
            },
          }
        );

        const result = await res.json();
        Swal.close();

        if (result.status === true) {
          toast.success(result.message);
          await fetchHeroSlider();
        } else {
          toast.error(result.message || "Failed to delete slider.");
        }
      } catch (error) {
        Swal.close();
        toast.error("Error occurred while deleting slider.");
        console.error(error);
      } finally {
        setDeleting(false);
      }
    }
  };

  const handleEdit = async (id) => {
    const MySwal = getCustomSwal();
    await MySwal.fire({
      title: "Dili ko.",
    });
  };

  useEffect(() => {
    const debouncedFetch = debounce(() => {
      fetchHeroSlider();
    }, 500);

    debouncedFetch();

    return () => {
      debouncedFetch.cancel();
    };
  }, [search]);

  useEffect(() => {
    fetchHeroSlider();
  }, [currentPage, perPage]);

  const handleResetFilters = () => {
    setSearch("");
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
                            Hero Slider Management
                          </h4>
                          <p
                            className="text-sm mt-1"
                            style={{ color: colors.lightBg }}
                          >
                            Manage your homepage slider contents
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
                          Create New Slider
                        </span>
                        <span
                          className="absolute inset-0 transition-all duration-300"
                          style={{
                            backgroundColor: "rgba(0,0,0,0)",
                          }}
                        ></span>
                      </button>

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
                              d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"
                            />
                          </svg>
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold text-gray-700">
                            Total Sliders
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
                    {/* SEARCH FIELD */}
                    <div className="flex flex-col">
                      <label className="text-lg font-semibold mb-1 text-gray-700">
                        Search Sliders
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="Search by title or description..."
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
                            "Image",
                            "Title",
                            "Description",
                            "Content",
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
                            <td colSpan="6" className="px-6 py-12 text-center">
                              <div className="flex flex-col items-center justify-center">
                                <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin mb-4"></div>
                                <p className="text-gray-600 font-semibold">
                                  Loading slider data...
                                </p>
                                <p className="text-sm text-gray-500 mt-1">
                                  Please wait while we fetch the records
                                </p>
                              </div>
                            </td>
                          </tr>
                        ) : heroSlider.length === 0 ? (
                          <tr>
                            <td colSpan="6" className="px-6 py-8 text-center">
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
                                <h3 className="text-lg font-semibold text-gray-700 mb-1">
                                  No sliders found
                                </h3>
                                <p className="text-gray-500 max-w-md">
                                  {search
                                    ? "Try adjusting your search criteria"
                                    : "There are currently no sliders"}
                                </p>
                                {search && (
                                  <button
                                    onClick={handleResetFilters}
                                    className="mt-3 px-4 py-2 bg-sky-100 text-sky-700 rounded-lg text-sm font-medium hover:bg-sky-200 transition cursor-pointer"
                                  >
                                    Reset Filters
                                  </button>
                                )}
                                {/* <button
                                  onClick={() =>
                                    navigate("/admin/create-hero-slider")
                                  }
                                  className="mt-3 px-4 py-2 rounded-lg text-sm font-medium cursor-pointer transition-colors duration-200"
                                  style={{
                                    backgroundColor: `${colors.primary}10`,
                                    color: colors.primary,
                                  }}
                                >
                                  Create New Slider
                                </button> */}
                              </div>
                            </td>
                          </tr>
                        ) : (
                          heroSlider.map((slider, index) => (
                            <tr
                              key={`slider-${slider.id}`}
                              className="hover:bg-gray-50 transition"
                            >
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-700 font-bold">
                                {(currentPage - 1) * perPage + index + 1}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                {slider.image ? (
                                  <>
                                    {!imgLoaded[slider.id] && (
                                      <ImagePlaceholder />
                                    )}
                                    <img
                                      src={`${
                                        import.meta.env.VITE_LARAVEL_FILE_API
                                      }/uploads/Hero_Slider_Image/${
                                        slider.image
                                      }`}
                                      alt="hero"
                                      className={`w-12 h-12 object-cover rounded transition-opacity duration-500 ${
                                        imgLoaded[slider.id]
                                          ? "opacity-100"
                                          : "opacity-0 absolute"
                                      }`}
                                      onLoad={() =>
                                        setImgLoaded((prev) => ({
                                          ...prev,
                                          [slider.id]: true,
                                        }))
                                      }
                                    />
                                  </>
                                ) : (
                                  <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center text-xs text-gray-500">
                                    N/A
                                  </div>
                                )}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                {slider.title}
                              </td>
                              <td className="px-6 py-4 text-sm text-gray-700">
                                {slider.description}
                              </td>
                              <td className="px-6 py-4 text-sm text-gray-700">
                                {slider.content}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <div className="flex justify-center space-x-2">
                                  <button
                                    onClick={() => handleEdit(slider.id)}
                                    className="inline-flex items-center px-3 py-2 rounded-md text-xs font-semibold bg-yellow-50 text-yellow-700 hover:bg-yellow-100 border border-yellow-200 cursor-pointer"
                                  >
                                    Edit
                                  </button>
                                  <button
                                    onClick={() => deleteHeroSlider(slider.id)}
                                    className="inline-flex items-center px-3 py-2 rounded-md text-xs font-semibold bg-red-50 text-red-700 hover:bg-red-100 border border-red-200 cursor-pointer"
                                    disabled={deleting}
                                  >
                                    {deleting ? "Deleting..." : "Delete"}
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
              <CreateSlider
                onClose={() => setIsCreateModalOpen(false)}
                onSuccess={() => {
                  setIsCreateModalOpen(false);
                  fetchHeroSlider();
                }}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ShowSlider;
