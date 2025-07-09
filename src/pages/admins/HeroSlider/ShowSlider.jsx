import React, { useEffect, useState } from "react";
import AdminSidebar from "../../../components/AdminSidebar";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { toast } from "react-toastify";
import { token } from "../../../utils/GetToken";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import "animate.css";

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

const ShowSlider = () => {
  const [heroSlider, setHeroSlider] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [imgLoaded, setImgLoaded] = useState({});

  const navigate = useNavigate();

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

  const fetchHeroSlider = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_LARAVEL_API}/heroslider`,
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
      setHeroSlider(result.data);
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
      iconColor: colors.warning,
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

    if (confirmResult.isConfirmed) {
      setDeleting(true);
      MySwal.fire({
        title: "Deleting...",
        allowOutsideClick: false,
        showConfirmButton: false,
        allowEscapeKey: false,
        // willOpen: () => Swal.showLoading(),
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
        console.error(err);
      } finally {
        setDeleting(false);
      }
    }
  };

  const handleEdit = async (id) => {
    // const MySwal = getCustomSwal();
    // await MySwal.fire({
    //   title: "Coming Soon",
    //   text: "Edit functionality will be available soon",
    //   icon: "info",
    //   iconColor: colors.info,
    // });
    const MySwal = getCustomSwal();

    await MySwal.fire({
      title: "Dili ko.",
      //   text: "You have been logged out successfully.",
      //   icon: "success",
      backdrop: true,
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
      didOpen: () => {
        // Swal.showLoading();
        document.body.style.overflow = "auto";
      },
      willClose: () => {
        document.body.style.overflow = "";
      },
    });
  };

  useEffect(() => {
    fetchHeroSlider();
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
            Manage your homepage sliders here.
          </span>
        </div>
      </header>

      <main className="px-4 py-8 md:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Sidebar */}
            <div className="md:w-1/4">
              <AdminSidebar />
            </div>

            {/* Main Content */}
            <div className="md:w-3/4 w-full animate__animated animate__fadeIn">
              <div
                className="shadow-lg rounded-xl overflow-hidden"
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
                      Hero Slider Contents
                    </h4>
                    <button
                      onClick={() => {
                        if (loading) return;

                        // if (heroSlider.length >= 4) {
                        //   const MySwal = getCustomSwal();
                        //   MySwal.fire({
                        //     icon: "warning",
                        //     title: "Limit Reached",
                        //     text: "You can only add up to 4 hero slider items. Please delete an existing one to proceed.",
                        //     iconColor: colors.warning,
                        //   });
                        // } else {
                        //   navigate("/admin/create-hero-slider");
                        // }

                        navigate("/admin/create-hero-slider");
                      }}
                      disabled={loading}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium shadow transition-all duration-300 ${
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
                          strokeWidth="2"
                          d="M12 4v16m8-8H4"
                        />
                      </svg>
                      {loading ? "Loading..." : "Create"}
                    </button>
                  </div>

                  <div
                    className="overflow-x-auto rounded-xl shadow-sm"
                    style={{ border: `1px solid ${colors.border}` }}
                  >
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead style={{ backgroundColor: colors.dark }}>
                        <tr>
                          {[
                            "ID",
                            "Image",
                            "Title",
                            "Description",
                            "Content",
                            "Actions",
                          ].map((header) => (
                            <th
                              key={header}
                              scope="col"
                              className="px-6 py-4 text-center text-sm font-semibold uppercase tracking-wider"
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
                              {/* <div className="flex flex-col items-center justify-center">
                                <div
                                  className="w-12 h-12 border-4 rounded-full animate-spin mb-4"
                                  style={{
                                    borderColor: colors.primary,
                                    borderTopColor: "transparent",
                                  }}
                                ></div>
                                <p className="text-gray-600 font-medium">
                                  Fetching hero slider, please wait...
                                </p>
                              </div> */}

                              <div className="flex flex-col items-center justify-center">
                                <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin mb-4"></div>
                                <p className="text-gray-600 font-medium">
                                  Loading hero slider data...
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
                                  className="w-16 h-16 mb-3"
                                  fill="none"
                                  stroke={colors.lightText}
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="1.5"
                                    d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                  />
                                </svg>
                                <h3
                                  className="text-lg font-medium"
                                  style={{ color: colors.text }}
                                >
                                  No hero slider content found
                                </h3>
                                <button
                                  onClick={() =>
                                    navigate("/admin/create-hero-slider")
                                  }
                                  className="mt-3 px-4 py-2 rounded-lg text-sm font-medium transition cursor-pointer"
                                  style={{
                                    backgroundColor: `${colors.primary}10`,
                                    color: colors.primary,
                                    hoverBackground: `${colors.primary}20`,
                                  }}
                                >
                                  Create New Slider
                                </button>
                              </div>
                            </td>
                          </tr>
                        ) : (
                          heroSlider.map((heroslider) => (
                            <tr
                              key={`slider-${heroslider.id}`}
                              className="hover:bg-gray-50 transition"
                            >
                              <td
                                className="px-6 py-4 whitespace-nowrap text-sm font-medium"
                                style={{ color: colors.text }}
                              >
                                {heroslider.id}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                {heroslider.image ? (
                                  <>
                                    {!imgLoaded[heroslider.id] && (
                                      <ImagePlaceholder />
                                    )}
                                    <img
                                      src={`${
                                        import.meta.env.VITE_LARAVEL_FILE_API
                                      }/uploads/Hero_Slider_Image/${
                                        heroslider.image
                                      }`}
                                      alt="hero"
                                      className={`w-12 h-12 object-cover rounded transition-opacity duration-500 ${
                                        imgLoaded[heroslider.id]
                                          ? "opacity-100"
                                          : "opacity-0 absolute"
                                      }`}
                                      onLoad={() =>
                                        setImgLoaded((prev) => ({
                                          ...prev,
                                          [heroslider.id]: true,
                                        }))
                                      }
                                    />
                                  </>
                                ) : (
                                  <div
                                    className="w-12 h-12 rounded flex items-center justify-center text-xs"
                                    style={{
                                      backgroundColor: colors.lightBg,
                                      color: colors.lightText,
                                    }}
                                  >
                                    N/A
                                  </div>
                                )}
                              </td>
                              <td
                                className="px-6 py-4 whitespace-nowrap text-sm"
                                style={{ color: colors.text }}
                              >
                                {heroslider.title}
                              </td>
                              <td
                                className="px-6 py-4 text-sm"
                                style={{ color: colors.text }}
                              >
                                {heroslider.description}
                              </td>
                              <td
                                className="px-6 py-4 text-sm"
                                style={{ color: colors.text }}
                              >
                                {heroslider.content}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <div className="flex justify-center space-x-2">
                                  <button
                                    onClick={() => handleEdit(heroslider.id)}
                                    className="inline-flex items-center px-3 py-2 rounded-md text-xs font-medium transition bg-green-50 text-green-700 hover:bg-green-100 border border-green-200 cursor-pointer"
                                    // style={{
                                    //   backgroundColor: `${colors.primary}10`,
                                    //   color: colors.primary,
                                    //   border: `1px solid ${colors.primary}`,
                                    //   hoverBackground: `${colors.primary}20`,
                                    // }}
                                  >
                                    Edit
                                  </button>
                                  <button
                                    onClick={() =>
                                      deleteHeroSlider(heroslider.id)
                                    }
                                    className="inline-flex items-center px-3 py-1 rounded-md text-xs font-medium g-red-50 text-red-700 hover:bg-red-100 border border-red-200 cursor-pointer transition"
                                    // style={{
                                    //   backgroundColor: `${colors.danger}10`,
                                    //   color: colors.danger,
                                    //   border: `1px solid ${colors.danger}`,
                                    //   hoverBackground: `${colors.danger}20`,
                                    // }}
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
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ShowSlider;
