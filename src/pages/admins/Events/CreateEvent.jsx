import React, { useEffect, useMemo, useRef, useState } from "react";
import AdminSidebar from "../../../components/AdminSidebar";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import JoditEditor from "jodit-react";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { token } from "../../../utils/GetToken";
import "animate.css";
import { format } from "date-fns";

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

const CreateEvent = ({}) => {
  const [loading, setLoading] = useState(false);

  const title = useRef(null);

  const {
    register,
    handleSubmit,
    watch,
    trigger,
    setFocus,
    formState: { errors },
    setError,
    clearErrors,
  } = useForm();

  useEffect(() => {
    const scrollTimer = setTimeout(() => {
      window.scrollTo({ top: 0, behavior: "instant" });
      setFocus("title");
    }, 500);

    return () => clearTimeout(scrollTimer);
  }, [setFocus]);

  const navigate = useNavigate();

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

  const onSubmit = async (data) => {
    setLoading(true);

    try {
      const MySwal = getCustomSwal();
      const confirmResult = await MySwal.fire({
        title: "Are you sure?",
        text: "Do you want to create this event?",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Yes, save it!",
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

      if (!confirmResult.isConfirmed) {
        setLoading(false);
        return;
      }

      MySwal.fire({
        title: "Creating Event...",
        allowOutsideClick: false,
        showConfirmButton: false,
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

      const eventData = {
        title: data.title,
        location: data.location,
        event_date: `${data.event_date}T00:00:00`,
        start_time: `${data.event_date}T${data.start_time}:00`,
        end_time: `${data.event_date}T${data.end_time}:00`,
      };

      const response = await fetch(
        `${import.meta.env.VITE_LARAVEL_API}/events`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token()}`,
          },
          body: JSON.stringify(eventData),
        }
      );

      const result = await response.json();

      Swal.close();
      setLoading(false);

      if (!response.ok) {
        throw new Error(result.message || "Failed to create event");
      }

      toast.success("Event created successfully!");
      navigate("/admin/events");
      console.log(result);
    } catch (error) {
      toast.error(error.message || "An error occurred");
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (watch("start_time") && watch("end_time")) {
      trigger("end_time");
    }
  }, [watch("start_time"), trigger]);

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
            Create a new event
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

            {/* Main Form Content */}
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
                      Create New Event
                    </h4>
                    <Link
                      to={loading ? "#" : "/admin/hero"}
                      onClick={(e) => {
                        if (loading) {
                          e.preventDefault();
                          toast.info(
                            "Please wait until the process completes."
                          );
                        }
                      }}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 shadow ${
                        loading
                          ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                          : "bg-white text-primary border border-primary hover:bg-gray-300"
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
                          d="M10 19l-7-7m0 0l7-7m-7 7h18"
                        />
                      </svg>
                      Back
                    </Link>
                  </div>

                  <hr className="my-4" style={{ borderColor: colors.border }} />

                  <form
                    onSubmit={handleSubmit(onSubmit)}
                    className={`${
                      loading ? "pointer-events-none opacity-50" : ""
                    }`}
                  >
                    {/* Title */}
                    <div className="mb-4">
                      <label
                        htmlFor="title"
                        className="cursor-pointer block text-sm font-medium mb-1"
                        style={{ color: colors.text }}
                      >
                        Title *
                      </label>
                      <input
                        {...register("title", {
                          required: "The title field is required.",
                        })}
                        id="title"
                        type="text"
                        className={`w-full px-4 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 ${
                          errors.title
                            ? "border-red-500 focus:ring-red-500"
                            : `border-gray-300 focus:ring-${colors.primary}`
                        }`}
                        placeholder="Title"
                        style={{
                          borderColor: errors.title
                            ? colors.danger
                            : colors.border,
                          focusRing: colors.primary,
                        }}
                      />
                      {errors.title && (
                        <p className="text-sm text-red-600 mt-1">
                          {errors.title?.message}
                        </p>
                      )}
                    </div>

                    {/* Location */}
                    <div className="mb-4">
                      <label
                        className="cursor-pointer block text-sm font-medium mb-1"
                        htmlFor="description"
                        style={{ color: colors.text }}
                      >
                        Location *
                      </label>
                      <input
                        {...register("location", {
                          required: "The location field is required.",
                        })}
                        id="description"
                        type="text"
                        className={`w-full px-4 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 ${
                          errors.location
                            ? "border-red-500 focus:ring-red-500"
                            : `border-gray-300 focus:ring-${colors.primary}`
                        }`}
                        placeholder="Location"
                        style={{
                          borderColor: errors.description
                            ? colors.danger
                            : colors.border,
                          focusRing: colors.primary,
                        }}
                      />
                      {errors.location && (
                        <p className="text-sm text-red-600 mt-1">
                          {errors.location?.message}
                        </p>
                      )}
                    </div>

                    {/* Event Date */}
                    <div className="mb-4">
                      <label
                        htmlFor="event_date"
                        className="cursor-pointer block text-sm font-medium mb-1"
                        style={{ color: colors.text }}
                      >
                        Event Date *
                      </label>
                      <input
                        {...register("event_date", {
                          required: "Event date is required",
                          validate: (value) => {
                            const selectedDate = new Date(value);
                            const year = selectedDate.getFullYear();
                            const currentYear = new Date().getFullYear();

                            if (year < currentYear) {
                              return "Event year must not be in the past.";
                            }

                            if (year > currentYear + 5) {
                              return `Event year is too far in the future (max: ${
                                currentYear + 5
                              })`;
                            }

                            return true;
                          },
                        })}
                        id="event_date"
                        type="date"
                        min={format(new Date(), "yyyy-MM-dd")} // Restrict to today or future
                        className={`w-full px-4 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 ${
                          errors.event_date
                            ? "border-red-500 focus:ring-red-500"
                            : `border-gray-300 focus:ring-${colors.primary}`
                        }`}
                        style={{
                          borderColor: errors.event_date
                            ? colors.danger
                            : colors.border,
                          focusRing: colors.primary,
                        }}
                      />
                      {errors.event_date && (
                        <p className="text-sm text-red-600 mt-1">
                          {errors.event_date?.message}
                        </p>
                      )}
                    </div>

                    {/* Start Time */}
                    <div className="mb-4">
                      <label
                        htmlFor="start_time"
                        className="cursor-pointer block text-sm font-medium mb-1"
                        style={{ color: colors.text }}
                      >
                        Start Time *
                      </label>
                      <input
                        {...register("start_time", {
                          required: "Start time is required",
                        })}
                        id="start_time"
                        type="time"
                        className={`w-full px-4 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 ${
                          errors.start_time
                            ? "border-red-500 focus:ring-red-500"
                            : `border-gray-300 focus:ring-${colors.primary}`
                        }`}
                        style={{
                          borderColor: errors.start_time
                            ? colors.danger
                            : colors.border,
                          focusRing: colors.primary,
                        }}
                      />
                      {errors.start_time && (
                        <p className="text-sm text-red-600 mt-1">
                          {errors.start_time?.message}
                        </p>
                      )}
                    </div>

                    {/* End Time */}
                    <div className="mb-4">
                      <label
                        htmlFor="end_time"
                        className="cursor-pointer block text-sm font-medium mb-1"
                        style={{ color: colors.text }}
                      >
                        End Time *
                      </label>
                      <input
                        {...register("end_time", {
                          required: "End time is required",
                          validate: (value) => {
                            const startTime = watch("start_time");
                            if (startTime && value <= startTime) {
                              return "End time must be after start time";
                            }
                            return true;
                          },
                        })}
                        id="end_time"
                        type="time"
                        className={`w-full px-4 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 ${
                          errors.end_time
                            ? "border-red-500 focus:ring-red-500"
                            : `border-gray-300 focus:ring-${colors.primary}`
                        }`}
                        style={{
                          borderColor: errors.end_time
                            ? colors.danger
                            : colors.border,
                          focusRing: colors.primary,
                        }}
                      />
                      {errors.end_time && (
                        <p className="text-sm text-red-600 mt-1">
                          {errors.end_time?.message}
                        </p>
                      )}
                    </div>

                    <button
                      type="submit"
                      className={`px-6 py-2 rounded-md text-sm font-semibold flex items-center gap-2 transition-colors ${
                        loading
                          ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                          : `bg-${colors.primary} transition-all duration-300 shadow hover:brightness-90 text-white cursor-pointer`
                      }`}
                      disabled={loading}
                      style={{
                        backgroundColor: loading
                          ? colors.border
                          : colors.primary,
                      }}
                    >
                      {loading ? (
                        <>
                          <svg
                            className="animate-spin h-4 w-4 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8v8H4z"
                            ></path>
                          </svg>
                          {loading && "Submitting..."}
                        </>
                      ) : (
                        "Submit"
                      )}
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CreateEvent;
