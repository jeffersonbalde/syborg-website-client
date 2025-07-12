import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { token } from "../../../utils/GetToken";
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

function hexToRgb(hex) {
  hex = hex.replace("#", "");
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  return `${r}, ${g}, ${b}`;
}

const CreateEvent = ({ onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    trigger,
    setFocus,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    setFocus("title");
  }, [setFocus]);

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

      if (!response.ok) {
        throw new Error(result.message || "Failed to create event");
      }

      toast.success("Event created successfully!");
      onSuccess();
    } catch (error) {
      toast.error(error.message || "An error occurred");
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="px-6 pt-6 bg-[#D3D3D3]">
      {/* Header */}
      <div
        className="top-0 z-10 p-4 shadow-sm mb-6 rounded-xl"
        style={{
          backgroundColor: colors.dark,
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
                Create New Event
              </h4>
              <p className="text-sm mt-1" style={{ color: colors.lightBg }}>
                Fill in the details to schedule a new event
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            disabled={loading}
            className="group relative flex items-center justify-center px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 overflow-hidden"
            style={{
              backgroundColor: loading ? colors.border : colors.primary,
              color: "white",
              boxShadow: `0 2px 4px ${colors.primary}20`,
              maxWidth: "120px",
              opacity: loading ? 0.7 : 1,
              cursor: loading ? "not-allowed" : "pointer",
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
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
              Close
            </span>
            {!loading && (
              <span
                className="absolute inset-0 transition-all duration-300"
                style={{
                  backgroundColor: "rgba(0,0,0,0)",
                }}
              ></span>
            )}
          </button>
        </div>
      </div>

      <hr className="my-4" style={{ borderColor: colors.border }} />

      <form
        onSubmit={handleSubmit(onSubmit)}
        className={`${loading ? "pointer-events-none opacity-50" : ""}`}
      >
        {/* Title */}
        <div className="mb-4">
          <label
            htmlFor="title"
            className="cursor-pointer block text-sm font-semibold mb-1 text-gray-700"
          >
            Title *
          </label>
          <input
            {...register("title", {
              required: "The title field is required.",
            })}
            id="title"
            type="text"
            className={`bg-white w-full px-4 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 font-semibold ${
              errors.title
                ? "border-red-500 focus:ring-red-500"
                : `border-gray-300 focus:ring-${colors.primary}`
            }`}
            placeholder="Title"
          />
          {errors.title && (
            <p className="text-sm text-red-600 mt-1">{errors.title?.message}</p>
          )}
        </div>

        {/* Location */}
        <div className="mb-4">
          <label
            className="cursor-pointer block text-sm font-semibold mb-1 text-gray-700"
            htmlFor="location"
          >
            Location *
          </label>
          <input
            {...register("location", {
              required: "The location field is required.",
            })}
            id="location"
            type="text"
            className={`font-semibold bg-white w-full px-4 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 ${
              errors.location
                ? "border-red-500 focus:ring-red-500"
                : `border-gray-300 focus:ring-${colors.primary}`
            }`}
            placeholder="Location"
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
            className="cursor-pointer block text-sm font-semibold mb-1 text-gray-700"
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
            min={format(new Date(), "yyyy-MM-dd")}
            className={`font-semibold bg-white w-full px-4 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 ${
              errors.event_date
                ? "border-red-500 focus:ring-red-500"
                : `border-gray-300 focus:ring-${colors.primary}`
            }`}
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
            className="cursor-pointer block text-sm font-semibold mb-1 text-gray-700"
          >
            Start Time *
          </label>
          <input
            {...register("start_time", {
              required: "Start time is required",
            })}
            id="start_time"
            type="time"
            className={`font-semibold bg-white w-full px-4 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 ${
              errors.start_time
                ? "border-red-500 focus:ring-red-500"
                : `border-gray-300 focus:ring-${colors.primary}`
            }`}
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
            className="cursor-pointer block text-sm font-semibold mb-1 text-gray-700"
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
            className={`font-semibold bg-white w-full px-4 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 ${
              errors.end_time
                ? "border-red-500 focus:ring-red-500"
                : `border-gray-300 focus:ring-${colors.primary}`
            }`}
          />
          {errors.end_time && (
            <p className="text-sm text-red-600 mt-1">
              {errors.end_time?.message}
            </p>
          )}
        </div>

        {/* Footer with action buttons */}
        <div className="mt-8 pt-4 bg-white border-t border-gray-200 sticky bottom-0 left-0 right-0 py-4 px-6 -mx-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 max-w-full">
            <div className="text-sm text-gray-500 flex items-center w-full md:w-auto font-semibold">
              <svg
                className="w-4 h-4 mr-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              {errors && Object.keys(errors).length > 0 ? (
                <span className="text-red-500">
                  Please fix the {Object.keys(errors).length} error(s) above
                </span>
              ) : (
                "All fields marked with * are required"
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto justify-end">
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className={`
                  px-4 py-2 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 
                  transition-all duration-200 border
                  ${
                    loading
                      ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                      : "bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200 hover:shadow-sm cursor-pointer"
                  }
                `}
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={loading}
                className={`
                  px-4 py-2 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 
                  transition-all duration-200 shadow-md
                  ${
                    loading
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : `bg-${colors.primary} text-white hover:shadow-lg cursor-pointer`
                  }
                `}
                style={{
                  backgroundColor: loading ? undefined : colors.primary,
                  boxShadow: loading
                    ? "none"
                    : `0 4px 6px -1px rgba(${hexToRgb(
                        colors.primary
                      )}, 0.2), 0 2px 4px -1px rgba(${hexToRgb(
                        colors.primary
                      )}, 0.1)`,
                  "--hover-color": `color-mix(in srgb, ${colors.primary} 80%, #64748b 20%)`,
                }}
                onMouseEnter={(e) => {
                  if (!loading) {
                    e.currentTarget.style.backgroundColor = `var(--hover-color)`;
                  }
                }}
                onMouseLeave={(e) => {
                  if (!loading) {
                    e.currentTarget.style.backgroundColor = colors.primary;
                  }
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
                    Processing...
                  </>
                ) : (
                  "Create Event"
                )}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreateEvent;