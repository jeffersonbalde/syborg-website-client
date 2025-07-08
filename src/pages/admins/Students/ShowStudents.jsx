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

const ImagePlaceholder = () => (
  <div className="relative w-12 h-12 bg-gray-300 rounded overflow-hidden animate-pulse">
    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent animate-shimmer" />
  </div>
);

const ShowStudents = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [imgLoadedProfile, setImgLoadedProfile] = useState({});
  const [imgLoadedQr, setImgLoadedQr] = useState({});

  const navigate = useNavigate();

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_LARAVEL_API}/students`, {
        method: "GET",
        headers: {
          "Content-type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token()}`,
        },
      });

      const result = await res.json();
      setStudents(result.data);
    } catch (error) {
      toast.error("Error fetching students:", error);
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
    const MySwal = withReactContent(Swal);

    const confirmResult = await MySwal.fire({
      title: "Are you sure?",
      text: `You are about to permanently delete "${student.firstname} ${student.lastname}". This action cannot be undone.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete",
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
      title: "Deleting...",
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
        `${import.meta.env.VITE_LARAVEL_API}/students/${student.id}`,
        {
          method: "DELETE",
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
        toast.error(result.message || "Failed to delete student.");
      }
    } catch (err) {
      Swal.close();
      toast.error("Error occurred while deleting student.");
      console.error(err);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const MySwal = withReactContent(Swal);

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
              <div className="bg-white shadow rounded-lg p-6">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-lg font-semibold text-sky-700">
                    Registered Students List
                  </h4>
                  {/* <Link
                    // to="/admin/create-student"
                    className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded transition"
                  >
                    + Create
                  </Link> */}
                </div>

                <hr className="my-4" />

                <div className="overflow-x-auto">
                  <table className="w-full table-auto border-collapse text-sm">
                    <thead className="bg-gray-200 text-gray-700">
                      <tr>
                        <th className="px-4 py-2 text-left">ID</th>
                        <th className="px-4 py-2 text-left">Profile</th>
                        <th className="px-4 py-2 text-left">QR Code</th>
                        <th className="px-4 py-2 text-left">EDP</th>
                        <th className="px-4 py-2 text-left">First Name</th>
                        <th className="px-4 py-2 text-left">Middle Name</th>
                        <th className="px-4 py-2 text-left">Last Name</th>
                        <th className="px-4 py-2 text-left">Course</th>
                        <th className="px-4 py-2 text-left">Year</th>
                        <th className="px-4 py-2 text-left">Gender</th>
                        <th className="px-4 py-2 text-left">Age</th>
                        <th className="px-4 py-2 text-left">Birthday</th>
                        <th className="px-4 py-2 text-left">Contact</th>
                        <th className="px-4 py-2 text-left">Email</th>
                        <th className="px-4 py-2 text-left">Status</th>
                        <th className="px-4 py-2 text-center">Action</th>
                      </tr>
                    </thead>

                    <tbody>
                      {loading ? (
                        <tr>
                          <td colSpan="14" className="py-10 text-center">
                            <div className="flex flex-col items-center">
                              <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-3"></div>
                              <p className="text-gray-500 font-semibold">
                                Fetching students, please wait...
                              </p>
                            </div>
                          </td>
                        </tr>
                      ) : students.length === 0 ? (
                        <tr>
                          <td colSpan="14" className="text-center py-5">
                            No students found.
                          </td>
                        </tr>
                      ) : (
                        students.map((student) => (
                          <tr
                            key={`student-${student.id}`}
                            className="border-b hover:bg-gray-50"
                          >
                            <td className="px-4 py-2">{student.id}</td>
                            <td className="px-4 py-2">
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
                                    className={`w-12 h-12 object-cover rounded transition-opacity duration-500 ${
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
                                <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center text-xs text-gray-500">
                                  N/A
                                </div>
                              )}
                            </td>

                            <td className="px-4 py-2">
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
                                    className={`w-12 h-12 object-contain rounded transition-opacity duration-500 ${
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
                                <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center text-xs text-gray-500">
                                  N/A
                                </div>
                              )}
                            </td>

                            <td className="px-4 py-2">{student.edp_number}</td>
                            <td className="px-4 py-2">{student.firstname}</td>
                            <td className="px-4 py-2">{student.middlename}</td>
                            <td className="px-4 py-2">{student.lastname}</td>
                            <td className="px-4 py-2">{student.course}</td>
                            <td className="px-4 py-2">{student.year_level}</td>
                            <td className="px-4 py-2">{student.gender}</td>
                            <td className="px-4 py-2">{student.age}</td>
                            <td className="px-4 py-2">{student.birthday}</td>
                            <td className="px-4 py-2">
                              {student.contact_number}
                            </td>
                            <td className="px-4 py-2">{student.email}</td>
                            <td className="px-4 py-2">
                              {student.active_status === 1
                                ? "Approved"
                                : student.active_status === 2
                                ? "Pending"
                                : "Disapproved"}
                            </td>
                            <td className="px-4 py-2 text-center">
                              <div className="flex gap-2 justify-center">
                                <button
                                  onClick={() => handleApprove(student)}
                                  className="text-green-600 hover:text-white hover:bg-green-600 border border-green-500 px-3 py-1 rounded-md text-sm transition cursor-pointer"
                                >
                                  Approve
                                </button>
                                <button
                                  onClick={() => handleDisapprove(student)}
                                  className="text-yellow-600 hover:text-white hover:bg-yellow-500 border border-yellow-500 px-3 py-1 rounded-md text-sm transition cursor-pointer"
                                >
                                  Disapprove
                                </button>
                                <button
                                  onClick={() => handleDelete(student)}
                                  className="text-red-600 hover:text-white hover:bg-red-600 border border-red-500 px-3 py-1 rounded-md text-sm transition cursor-pointer"
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
      </main>
    </div>
  );
};

export default ShowStudents;
