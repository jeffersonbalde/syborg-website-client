import React, { useEffect, useState } from "react";
import StudentSidebar from "../../components/StudentSidebar";
import "animate.css";
import { useAuth } from "../../context/AuthContext";
import html2canvas from "html2canvas";
import { FaDownload, FaPrint, FaIdCard, FaUserGraduate, FaQrcode } from "react-icons/fa";

const colors = {
  primary: "#8B0000", // Darker red (slate-like)
  secondary: "#A52A2A", // Brownish red
  dark: "#1A1A1A",
  lightBg: "#F8F9FA",
  text: "#333333",
  lightText: "#6C757D",
  border: "#E0E0E0",
  success: "#28A745",
  warning: "#FFC107",
  danger: "#DC3545",
  info: "#17A2B8",
  cardBg: "linear-gradient(145deg, #6B0000 0%, #8B0000 50%, #6B0000 100%)",
  cardHighlight: "rgba(255, 255, 255, 0.1)"
};

const StudentDashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    current_courses: 0,
    average_grade: 0,
    upcoming_assignments: 0,
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setStats({
        current_courses: 5,
        average_grade: 87.5,
        upcoming_assignments: 3,
      });
      setLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const downloadCard = (id) => {
    const el = document.getElementById(id);
    html2canvas(el, {
      scale: 2,
      logging: false,
      useCORS: true
    }).then((canvas) => {
      const link = document.createElement("a");
      link.download = `${user?.firstname}_${id}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    });
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: colors.lightBg }}>
      {/* Header */}
      <header className="shadow-md py-4 sticky top-0 z-10" style={{ backgroundColor: colors.dark }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <h1 className="text-xl md:text-2xl font-bold tracking-wide text-white flex items-center">
            <FaIdCard className="mr-2" /> SYBORG Portal
          </h1>
          <span className="text-sm md:text-base italic text-gray-300">
            Welcome, <span className="font-medium">{user?.firstname}</span>!
          </span>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 py-6 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Sidebar - Hidden on mobile unless in drawer */}
            <div className="hidden lg:block lg:w-1/4">
              <StudentSidebar />
            </div>

            {/* Dashboard Content */}
            <div className="w-full lg:w-3/4 animate__animated animate__fadeIn">
              {loading ? (
                <div className="flex flex-col items-center justify-center h-96">
                  <div className="w-12 h-12 border-4 border-red-800 border-t-transparent rounded-full animate-spin mb-4"></div>
                  <p className="text-gray-600 font-medium">Loading your information...</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Quick Stats */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                      <div className="flex items-center">
                        <div className="p-3 rounded-full mr-4" style={{ backgroundColor: `${colors.primary}20` }}>
                          <FaUserGraduate className="text-lg" style={{ color: colors.primary }} />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Current Courses</p>
                          <p className="text-xl font-bold">{stats.current_courses}</p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                      <div className="flex items-center">
                        <div className="p-3 rounded-full mr-4" style={{ backgroundColor: `${colors.success}20` }}>
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: colors.success }}>
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Average Grade</p>
                          <p className="text-xl font-bold">{stats.average_grade}%</p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                      <div className="flex items-center">
                        <div className="p-3 rounded-full mr-4" style={{ backgroundColor: `${colors.warning}20` }}>
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: colors.warning }}>
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Upcoming Assignments</p>
                          <p className="text-xl font-bold">{stats.upcoming_assignments}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Student Information Section */}
                  <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
                    <div className="p-5 border-b border-gray-100">
                      <h3 className="text-lg font-bold flex items-center">
                        <FaUserGraduate className="mr-2" style={{ color: colors.primary }} />
                        Student Information
                      </h3>
                    </div>
                    <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-500 mb-1">EDP Number</label>
                        <p className="text-md font-medium">{user?.edp_number || 'N/A'}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-500 mb-1">Full Name</label>
                        <p className="text-md font-medium">
                          {user?.firstname} {user?.middlename} {user?.lastname}
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-500 mb-1">Email</label>
                        <p className="text-md font-medium">{user?.email || 'N/A'}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-500 mb-1">Program</label>
                        <p className="text-md font-medium">BSCS</p>
                      </div>
                    </div>
                  </div>

                  {/* ID Card Section */}
                  <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
                    <div className="p-5 border-b border-gray-100">
                      <h3 className="text-lg font-bold flex items-center">
                        <FaIdCard className="mr-2" style={{ color: colors.primary }} />
                        Your SYBORG ID Card
                      </h3>
                    </div>
                    <div className="p-5">
                      <div className="flex flex-col items-center space-y-6">
                        {/* Cards Container - Stacked on mobile, side by side on larger screens */}
                        <div className="flex flex-col lg:flex-row items-center justify-center gap-6 w-full">
                          {/* FRONT CARD */}
                          <div
                            className="card relative rounded-xl shadow-lg overflow-hidden w-full max-w-sm h-96 lg:h-[480px]"
                            id="front-card"
                            style={{
                              background: colors.cardBg,
                              color: "white",
                              border: `1px solid ${colors.cardHighlight}`,
                              boxShadow: `0 10px 30px -5px ${colors.primary}40`
                            }}
                          >
                            <div className="absolute inset-0" style={{
                              background: `radial-gradient(circle at 20% 30%, ${colors.cardHighlight} 0%, transparent 40%)`,
                            }}></div>
                            <div className="relative z-10 h-full flex flex-col p-5">
                              <div className="top text-center">
                                <img
                                  src="https://syborg-server-wlpe4.ondigitalocean.app/uploads/Syborg_Logo/syborg_logo.png"
                                  className="logo w-12 mx-auto mb-2"
                                  alt="Logo"
                                />
                                <div className="org-title text-lg font-bold tracking-wide">
                                  SYSTEM BUILDERS ORGANIZATION
                                </div>
                                <div className="course text-xs mt-1 opacity-80">BACHELOR OF SCIENCE IN COMPUTER SCIENCE</div>
                              </div>
                              <div className="center flex flex-col items-center justify-center flex-grow">
                                <div className="qr mb-4">
                                  {user?.qr_code ? (
                                    <div className="p-2 bg-white rounded-lg">
                                      <img
                                        src={`${import.meta.env.VITE_LARAVEL_FILE_API}/${user.qr_code}`}
                                        alt="QR Code"
                                        className="w-32 h-32"
                                      />
                                    </div>
                                  ) : (
                                    <div className="w-32 h-32 bg-gray-200 flex items-center justify-center rounded-lg">
                                      <p className="text-xs text-gray-500">No QR Code</p>
                                    </div>
                                  )}
                                </div>
                                <div className="student-name text-lg font-bold mt-2 text-center px-4 py-2 rounded-lg" style={{ backgroundColor: colors.cardHighlight }}>
                                  {user?.firstname && user?.lastname
                                    ? `${user.firstname.toUpperCase()} ${user.lastname.toUpperCase()}`
                                    : "STUDENT NAME"}
                                </div>
                              </div>
                              <div className="signature text-center text-xs">
                                <div className="line border-t border-white w-32 mx-auto my-1 opacity-60"></div>
                                <div className="font-bold">DR. PHILIPCRIS C. ENCARNACION</div>
                                <div className="opacity-80">CCS DEAN</div>
                              </div>
                            </div>
                          </div>

                          {/* BACK CARD */}
                          <div
                            className="card relative rounded-xl shadow-lg overflow-hidden w-full max-w-sm h-96 lg:h-[480px]"
                            id="back-card"
                            style={{
                              background: colors.cardBg,
                              color: "white",
                              border: `1px solid ${colors.cardHighlight}`,
                              boxShadow: `0 10px 30px -5px ${colors.primary}40`
                            }}
                          >
                            <div className="absolute inset-0" style={{
                              background: `radial-gradient(circle at 80% 70%, ${colors.cardHighlight} 0%, transparent 40%)`,
                            }}></div>
                            <div className="relative z-10 h-full flex flex-col p-5">
                              <div className="flex-grow flex flex-col items-center justify-center">
                                <img
                                  src="/storage/syborg_logo.png"
                                  className="logo-large w-20 mx-auto mb-6"
                                  alt="SYBORG Logo"
                                />
                                <div className="slogan text-sm italic text-center px-6 py-4 rounded-lg" style={{ backgroundColor: colors.cardHighlight }}>
                                  "Where code, knowledge, and innovation converge."
                                </div>
                                <div className="mt-8 text-center text-xs">
                                  <div className="mb-2">OFFICIAL ID CARD</div>
                                  <div className="text-xxs opacity-70">Property of Saint Columban College</div>
                                </div>
                              </div>
                              <div className="links text-xxs text-center opacity-70">
                                <div className="mb-1">https://facebook.com/SyBorgSCC</div>
                                <div>https://facebook.com/ccs.saintcolumban</div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-wrap justify-center gap-3 w-full">
                          <button
                            onClick={() => downloadCard("front-card")}
                            className="btn flex items-center justify-center px-4 py-2 rounded-lg font-medium"
                            style={{ backgroundColor: colors.primary, color: "white" }}
                          >
                            <FaDownload className="mr-2" /> Download Front
                          </button>
                          <button
                            onClick={() => downloadCard("back-card")}
                            className="btn flex items-center justify-center px-4 py-2 rounded-lg font-medium"
                            style={{ backgroundColor: colors.secondary, color: "white" }}
                          >
                            <FaDownload className="mr-2" /> Download Back
                          </button>
                          <button
                            onClick={() => window.print()}
                            className="btn flex items-center justify-center px-4 py-2 rounded-lg font-medium bg-gray-700 text-white"
                          >
                            <FaPrint className="mr-2" /> Print Both
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default StudentDashboard;