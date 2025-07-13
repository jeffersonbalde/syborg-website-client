import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { token } from "../../../utils/GetToken";
import AdminSidebar from "../../../components/AdminSidebar";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import QrScanner from "qr-scanner";
import Select from "react-select";
import Swal from "sweetalert2";

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

const TakeAttendance = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const scannerRef = useRef(null);
  const fileInputRef = useRef(null);

  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [attendees, setAttendees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [eventsLoading, setEventsLoading] = useState(true);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [tableLoading, setTableLoading] = useState(false); // New state for table loading
  const [edpNumber, setEdpNumber] = useState("");
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState(null);
  const [attendanceType, setAttendanceType] = useState(null);
  const [excuseFile, setExcuseFile] = useState(null);
  const [excuseReason, setExcuseReason] = useState("");

  const edpInputRef = useRef(null);

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

  // Fetch events for dropdown
  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      setEventsLoading(true);
      try {
        const res = await fetch(
          `${import.meta.env.VITE_LARAVEL_API}/attendance/events`,
          {
            headers: {
              Authorization: `Bearer ${token()}`,
            },
          }
        );
        const data = await res.json();
        setEvents(data);

        if (eventId) {
          const event = data.find((e) => e.id == eventId);
          if (event) {
            setSelectedEvent(event);
            await fetchEventDetails(event.id);
          }
        }
      } catch (err) {
        toast.error("Error fetching events");
        console.error(err);
      } finally {
        setEventsLoading(false);
        setLoading(false);
      }
    };

    fetchEvents();
  }, [eventId]);

  // Update the fetchEventDetails function
  const fetchEventDetails = async (eventId) => {
    setDetailsLoading(true);
    setTableLoading(true); // Set table loading state
    try {
      const res = await fetch(
        `${import.meta.env.VITE_LARAVEL_API}/attendance/${eventId}`,
        {
          headers: {
            Authorization: `Bearer ${token()}`,
          },
          cache: "no-store",
        }
      );
      const data = await res.json();
      setSelectedEvent(data.event);

      // Group by edp_number and keep only the most complete record
      const uniqueAttendees = data.attendees.reduce((acc, current) => {
        const existing = acc.find(
          (item) => item.edp_number === current.edp_number
        );

        if (!existing) {
          acc.push(current);
        } else {
          // Prefer the record with time_out if available
          if (current.time_out && !existing.time_out) {
            const index = acc.indexOf(existing);
            acc[index] = current;
          }
        }
        return acc;
      }, []);

      setAttendees(uniqueAttendees);
    } catch (err) {
      toast.error("Error fetching event details");
      console.error(err);
    } finally {
      setDetailsLoading(false);
      setTableLoading(false); // Clear table loading state
      setLoading(false);
    }
  };

  // Handle QR scanning
  const handleScan = async (result) => {
    if (!attendanceType) {
      toast.error("Please select Time In or Time Out first");
      return;
    }

    try {
      const res = await fetch(
        `${import.meta.env.VITE_LARAVEL_API}/attendance/scan`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token()}`,
          },
          body: JSON.stringify({
            event_id: selectedEvent.id,
            qr_code: result.data,
            type: attendanceType,
          }),
        }
      );

      const data = await res.json();
      if (res.ok) {
        setAttendees((prev) => [...prev, data.attendance]);
        toast.success(data.message);
      } else {
        toast.error(data.message || "Error recording attendance");
      }
    } catch (err) {
      toast.error("Error processing QR code");
      console.error(err);
    }
  };

  const handleManualAttendance = async () => {
    if (!edpNumber.trim()) {
      toast.error("Please enter EDP number");
      return;
    }

    if (!attendanceType) {
      toast.error("Please select Time In or Time Out first");
      return;
    }

    try {
      const MySwal = getCustomSwal();
      const confirmResult = await MySwal.fire({
        title: "Confirm Attendance",
        text: `Are you sure you want to record ${
          attendanceType === "time_in" ? "Time In" : "Time Out"
        } for EDP ${edpNumber}?`,
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Yes, record it!",
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
        return;
      }

      // Show loading state
      MySwal.fire({
        title: "Recording Attendance...",
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

      const formData = new FormData();
      formData.append("event_id", selectedEvent.id);
      formData.append("edp_number", edpNumber.trim());
      formData.append("type", attendanceType);

      if (excuseFile) formData.append("excuse_file", excuseFile);
      if (excuseReason) formData.append("excuse_reason", excuseReason);

      const res = await fetch(
        `${import.meta.env.VITE_LARAVEL_API}/attendance/manual`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token()}`,
          },
          body: formData,
        }
      );

      const data = await res.json();

      if (res.ok) {
        await fetchEventDetails(selectedEvent.id);
        setEdpNumber("");
        setExcuseFile(null);
        setExcuseReason("");
        toast.success(data.message);
        Swal.close();

        // setTimeout(() => {
        //   edpInputRef.current?.focus();
        // }, 100);
      } else {
        throw new Error(data.message || "Error recording attendance");
        Swal.close();
      }
    } catch (err) {
      toast.error(err.message || "Error recording attendance");
      console.error(err);
      Swal.close();
    }
  };

  // Remove attendance
  const removeAttendance = async (attendanceId) => {
    try {
      const MySwal = getCustomSwal();
      const confirmResult = await MySwal.fire({
        title: "Confirm Removal",
        text: "Are you sure you want to remove this attendance record?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, remove it!",
        cancelButtonText: "Cancel",
        iconColor: colors.warning,
        backdrop: true,
        didOpen: () => {
          document.body.style.overflow = "auto";
        },
        willClose: () => {
          document.body.style.overflow = "";
        },
      });

      if (!confirmResult.isConfirmed) {
        return;
      }

      // Show loading state
      MySwal.fire({
        title: "Removing Attendance...",
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

      const res = await fetch(
        `${import.meta.env.VITE_LARAVEL_API}/attendance/${attendanceId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token()}`,
          },
        }
      );

      const data = await res.json();
      if (res.ok) {
        setAttendees((prev) => prev.filter((a) => a.id !== attendanceId));
        toast.success(data.message);
        Swal.close();
      } else {
        throw new Error(data.message || "Error removing attendance");
        Swal.close();
      }
    } catch (err) {
      toast.error(err.message || "Error removing attendance");
      console.error(err);
      Swal.close();
    }
  };

  // Save all attendance
  const saveAttendance = async () => {
    if (attendees.length === 0) {
      toast.error("No attendance records to save");
      return;
    }

    try {
      const res = await fetch(
        `${import.meta.env.VITE_LARAVEL_API}/attendance/bulk`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token()}`,
          },
          body: JSON.stringify({
            event_id: selectedEvent.id,
            attendees: attendees.map((a) => ({
              edp_number: a.edp_number,
              time_in: a.time_in,
              time_out: a.time_out,
              present: a.present,
            })),
          }),
        }
      );

      const data = await res.json();
      if (res.ok) {
        toast.success(data.message);
      } else {
        toast.error(data.message || "Error saving attendance");
      }
    } catch (err) {
      toast.error("Error saving attendance");
      console.error(err);
    }
  };

  // Clear all attendance
  const clearAttendance = () => {
    setAttendees([]);
  };

  // Toggle QR scanner
  const toggleScanner = () => {
    if (scanning) {
      scannerRef.current?.stop();
      setScanning(false);
    } else {
      if (!selectedEvent) {
        toast.error("Please select an event first");
        return;
      }

      if (!attendanceType) {
        toast.error("Please select Time In or Time Out first");
        return;
      }

      const scanner = new QrScanner(
        videoRef.current,
        (result) => handleScan(result),
        {
          highlightScanRegion: true,
          highlightCodeOutline: true,
        }
      );

      scanner.start();
      scannerRef.current = scanner;
      setScanning(true);
    }
  };

  // Handle file upload for excuse
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        // 5MB limit
        toast.error("File size should be less than 5MB");
        return;
      }
      setExcuseFile(file);
    }
  };

  // Clean up scanner on unmount
  useEffect(() => {
    return () => {
      if (scannerRef.current) {
        scannerRef.current.stop();
        scannerRef.current = null;
      }
    };
  }, []);

  // Format time
  const formatTime = (timeString) => {
    const date = new Date(timeString);
    return date.toLocaleTimeString("en-PH", {
      // Philippines locale
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
      timeZone: "Asia/Manila",
    });
  };

  const formatDateTime = (dateTimeString) => {
    if (!dateTimeString) return "--";

    const date = new Date(dateTimeString);
    return date.toLocaleString("en-PH", {
      // Philippines locale
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
      timeZone: "Asia/Manila",
    });
  };

  const handleTimeInClick = () => {
    if (tableLoading) {
      toast.info("Please wait while we load attendance data...");
      return;
    }
    setAttendanceType("time_in");

    // Focus on EDP input field
    setTimeout(() => {
      edpInputRef.current?.focus();
    }, 100);
  };

  // Handle Time Out button click
  const handleTimeOutClick = () => {
    if (tableLoading) {
      toast.info("Please wait while we load attendance data...");
      return;
    }

    const hasTimeInWithoutTimeOut = attendees.some(
      (a) => a.time_in && !a.time_out
    );
    if (!hasTimeInWithoutTimeOut) {
      toast.error(
        "Cannot activate Time Out - No students have recorded Time In yet"
      );
      return;
    }

    setAttendanceType("time_out");

    // Focus on EDP input field
    setTimeout(() => {
      edpInputRef.current?.focus();
    }, 100);
  };

  // Handle Add button click
  const handleAddClick = async () => {
    if (!edpNumber.trim()) {
      toast.error("Please enter an EDP number before adding");
      return;
    }
    await handleManualAttendance();

    // Focus back on EDP input after saving
    setTimeout(() => {
      edpInputRef.current?.focus();
    }, 100);
  };

  return (
    <div
      className="min-h-screen flex overflow-hidden"
      style={{ backgroundColor: colors.lightBg }}
    >
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main Content */}
      <main className="flex-1 overflow-x-hidden overflow-y-auto h-screen min-w-0">
        <div className="px-4 py-3 md:px-3">
          <div className="max-w-7xl mx-auto">
            <div className="w-full">
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
                    style={{ borderBottom: `1px solid ${colors.border}` }}
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
                            Take Attendance
                          </h4>
                          <p
                            className="text-sm mt-1"
                            style={{ color: colors.lightBg }}
                          >
                            Record student attendance for events
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Loading State */}
                  {loading && (
                    <div className="flex justify-center items-center py-12">
                      <div className="flex flex-col items-center">
                        <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin mb-4"></div>
                        <p className="text-gray-600 font-semibold">
                          Loading attendance data...
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                          Please wait while we fetch the records
                        </p>
                      </div>
                    </div>
                  )}

                  {!loading && (
                    <>
                      {/* Event Selection */}
                      <div
                        className="rounded-xl p-4 mb-5 shadow-sm"
                        style={{
                          backgroundColor: "#D3D3D3",
                          border: `1px solid ${colors.border}`,
                        }}
                      >
                        <div className="grid grid-cols-1 gap-4 mb-3">
                          <div className="flex flex-col">
                            <label className="text-lg font-semibold mb-1 text-gray-700">
                              Select Event
                            </label>
                            {eventsLoading ? (
                              <Skeleton height={40} />
                            ) : (
                              <div className="relative">
                                <Select
                                  className="basic-single"
                                  classNamePrefix="select"
                                  isLoading={detailsLoading}
                                  isDisabled={detailsLoading}
                                  options={events.map((event) => ({
                                    value: event.id,
                                    label: `${event.title}`,
                                  }))}
                                  value={
                                    selectedEvent
                                      ? {
                                          value: selectedEvent.id,
                                          label: `${selectedEvent.title}`,
                                        }
                                      : null
                                  }
                                  onChange={(selectedOption) => {
                                    if (detailsLoading) return;
                                    const event = events.find(
                                      (ev) => ev.id === selectedOption.value
                                    );
                                    setSelectedEvent(event);
                                    setAttendees([]);
                                    setAttendanceType(null);
                                    if (event) fetchEventDetails(event.id);
                                  }}
                                  placeholder="-- Select an event --"
                                  styles={{
                                    control: (base, { isDisabled }) => ({
                                      ...base,
                                      border: `1px solid ${colors.border}`,
                                      minHeight: "40px",
                                      cursor: isDisabled
                                        ? "not-allowed"
                                        : "pointer",
                                      opacity: isDisabled ? 0.75 : 1,
                                      fontWeight: "bold",
                                    }),
                                    menuList: (base) => ({
                                      ...base,
                                      maxHeight: "200px",
                                      fontWeight: "bold",
                                    }),
                                    option: (base, { isDisabled }) => ({
                                      ...base,
                                      cursor: isDisabled
                                        ? "not-allowed"
                                        : "pointer",
                                    }),
                                  }}
                                />
                              </div>
                            )}
                          </div>

                          {/* Event Details */}
                          {detailsLoading ? (
                            <div className="">
                              <label className="text-lg font-semibold mb-1 text-gray-700">
                                Event Details
                              </label>
                              <div
                                className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 rounded-lg"
                                style={{
                                  backgroundColor: "white",
                                  border: `1px solid ${colors.border}`,
                                }}
                              >
                                {[1, 2, 3].map((i) => (
                                  <div key={i}>
                                    <Skeleton width={80} height={20} />
                                    <Skeleton width={120} height={24} />
                                  </div>
                                ))}
                              </div>
                            </div>
                          ) : (
                            selectedEvent && (
                              <div className="">
                                <label className="text-lg font-semibold mb-1 text-gray-700">
                                  Event Details
                                </label>
                                <div
                                  className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 rounded-lg mt-1"
                                  style={{
                                    backgroundColor: "white",
                                    border: `1px solid ${colors.border}`,
                                  }}
                                >
                                  <div>
                                    <h4 className="font-semibold">Title</h4>
                                    <p>{selectedEvent.title}</p>
                                  </div>
                                  <div>
                                    <h4 className="font-semibold">Location</h4>
                                    <p>{selectedEvent.location}</p>
                                  </div>
                                  <div>
                                    <h4 className="font-semibold">
                                      Date & Time
                                    </h4>
                                    <p>
                                      {new Date(
                                        selectedEvent.event_date
                                      ).toLocaleDateString()}{" "}
                                      • {formatTime(selectedEvent.start_time)} -{" "}
                                      {formatTime(selectedEvent.end_time)}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            )
                          )}

                          {/* Attendance Type Selection */}
                          {selectedEvent && (
                            <div className="flex flex-col">
                              <label className="text-lg font-semibold mb-1 text-gray-700">
                                Attendance Type
                              </label>
                              <div className="flex gap-4">
                                <button
                                  onClick={handleTimeInClick}
                                  //   disabled={tableLoading}
                                  className={`cursor-pointer px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${
                                    attendanceType === "time_in"
                                      ? "bg-red-600 text-white hover:bg-red-800"
                                      : tableLoading
                                      ? "bg-gray-300 text-gray-500"
                                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                  }`}
                                >
                                  Time In
                                </button>
                                <button
                                  onClick={handleTimeOutClick}
                                  //   disabled={
                                  //     tableLoading ||
                                  //     !attendees.some(
                                  //       (a) => a.time_in && !a.time_out
                                  //     )
                                  //   }
                                  className={`cursor-pointer px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${
                                    attendanceType === "time_out"
                                      ? "bg-red-600 text-white hover:bg-red-800"
                                      : tableLoading ||
                                        !attendees.some(
                                          (a) => a.time_in && !a.time_out
                                        )
                                      ? "bg-gray-300 text-gray-500 "
                                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                  }`}
                                >
                                  Time Out
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Attendance Recording Section */}
                      {selectedEvent && attendanceType && (
                        <div
                          className="rounded-xl p-4 mb-5 shadow-sm"
                          style={{
                            backgroundColor: "#D3D3D3",
                            border: `1px solid ${colors.border}`,
                          }}
                        >
                          <h3 className="text-lg font-semibold mb-4 text-gray-700">
                            Record Attendance
                          </h3>

                          {/* Manual Entry */}
                          <div className="mb-3">
                            <h4 className="font-semibold mb-2 text-black">
                              Enter EDP Number
                            </h4>
                            <div className="flex flex-col gap-4">
                              <div className="flex flex-col md:flex-row gap-2">
                                <input
                                  ref={edpInputRef}
                                  type="text"
                                  placeholder="Enter EDP number"
                                  className="flex-1 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 shadow-sm font-semibold"
                                  style={{
                                    border: `1px solid ${colors.border}`,
                                    backgroundColor: "white",
                                    focusRing: colors.primary,
                                  }}
                                  value={edpNumber}
                                  onChange={(e) => setEdpNumber(e.target.value)}
                                  onKeyPress={(e) =>
                                    e.key === "Enter" &&
                                    handleManualAttendance()
                                  }
                                />
                                <button
                                  onClick={handleAddClick}
                                  //   disabled={!edpNumber.trim()}
                                  className=" group relative flex items-center justify-center px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 overflow-hidden"
                                  style={{
                                    backgroundColor: !edpNumber.trim()
                                      ? colors.border
                                      : colors.primary,
                                    color: "white",
                                    boxShadow: `0 2px 4px ${colors.primary}20`,
                                    cursor: "pointer",
                                  }}
                                >
                                  <span className="relative z-10 flex items-center gap-2">
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
                                      <>
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
                                        Add
                                      </>
                                    )}
                                  </span>
                                  <span className="absolute inset-0 transition-all duration-300 bg-black bg-opacity-0 group-hover:bg-opacity-10"></span>
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Attendance List */}
                      <div
                        className="rounded-xl p-4 mb-1 pb-7 shadow-sm"
                        style={{
                          backgroundColor: "#D3D3D3",
                          border: `1px solid ${colors.border}`,
                        }}
                      >
                        <div className="flex justify-between items-center mb-2">
                          <h3 className="text-lg font-semibold text-gray-700">
                            Attendance List
                          </h3>
                          {selectedEvent && (
                            <div className="text-gray-700 font-semibold">
                              {attendees.length}{" "}
                              {attendees.length === 1 ? "student" : "students"}{" "}
                              recorded
                            </div>
                          )}
                        </div>

                        {tableLoading ? (
                          <div
                            className="overflow-x-auto rounded-xl shadow-sm"
                            style={{ border: `1px solid ${colors.border}` }}
                          >
                            <table className="min-w-full divide-y divide-gray-200">
                              <thead style={{ backgroundColor: colors.dark }}>
                                <tr>
                                  {[
                                    "EDP Number",
                                    "Name",
                                    "Course",
                                    "Year",
                                    "Time In",
                                    "Time Out",
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
                                <tr>
                                  <td
                                    colSpan="8"
                                    className="px-6 py-12 text-center"
                                  >
                                    <div className="flex flex-col items-center justify-center">
                                      <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin mb-4"></div>
                                      <p className="text-gray-600 font-medium">
                                        Loading attendance data...
                                      </p>
                                      <p className="text-sm text-gray-500 mt-1">
                                        Please wait while we fetch the records
                                      </p>
                                    </div>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        ) : !selectedEvent ? (
                          <div
                            className="text-center py-8 bg-white rounded-lg"
                            style={{ border: `1px solid ${colors.border}` }}
                          >
                            <svg
                              className="w-16 h-16 text-gray-400 mb-3 mx-auto"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="1.5"
                                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                              />
                            </svg>
                            <h3 className="text-lg font-semibold text-gray-700 mb-1">
                              No Event Selected
                            </h3>
                            <p className="text-gray-500 ">
                              Please select an event from the dropdown above to
                              view and record attendance
                            </p>
                          </div>
                        ) : attendees.length > 0 ? (
                          <div
                            className="overflow-x-auto rounded-xl shadow-sm"
                            style={{ border: `1px solid ${colors.border}` }}
                          >
                            <table className="min-w-full divide-y divide-gray-200">
                              <thead style={{ backgroundColor: colors.dark }}>
                                <tr>
                                  {[
                                    "EDP Number",
                                    "Name",
                                    "Course",
                                    "Year",
                                    "Time In",
                                    "Time Out",
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
                                {attendees.map((attendee) => (
                                  <tr
                                    key={attendee.id}
                                    className="hover:bg-gray-50 transition"
                                  >
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-700 font-semibold">
                                      {attendee.edp_number}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 ">
                                      {attendee.fullname}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                      {attendee.course}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                      {attendee.year_level}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-semibold">
                                      {formatDateTime(attendee.time_in)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-semibold">
                                      {formatDateTime(attendee.time_out)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                      {attendee.present ? (
                                        <span className="px-2 py-2 bg-green-100 text-green-800 rounded-full text-xs font-semibold">
                                          Present
                                        </span>
                                      ) : (
                                        <span className="px-2 py-2 bg-red-100 text-red-800 rounded-full text-xs font-semibold">
                                          Absent
                                        </span>
                                      )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                      <button
                                        onClick={() =>
                                          removeAttendance(attendee.id)
                                        }
                                        className="inline-flex items-center px-3 py-1 rounded-md text-xs font-semibold bg-red-50 text-red-700 hover:bg-red-100 border border-red-200 cursor-pointer"
                                      >
                                        Remove
                                      </button>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        ) : (
                          <div
                            className="text-center py-8 bg-white rounded-lg"
                            style={{ border: `1px solid ${colors.border}` }}
                          >
                            <svg
                              className="w-16 h-16 text-gray-400 mb-3 mx-auto"
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
                              No Attendance Records Yet
                            </h3>
                            <p className="text-gray-500">
                              Start recording attendance by entering EDP numbers
                              above
                            </p>
                          </div>
                        )}
                      </div>
                    </>
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

export default TakeAttendance;
