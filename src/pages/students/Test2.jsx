import React, { useEffect, useState } from "react";
import StudentSidebar from "../../components/StudentSidebar";
import "animate.css";
import { useAuth } from "../../context/AuthContext";
import html2canvas from "html2canvas";
import { FaDownload, FaPrint, FaIdCard, FaUserGraduate, FaQrcode } from "react-icons/fa";

const colors = {
  primary: "#763D3D", // Muted slate-red
  secondary: "#8B5A5A", // Lighter slate-red
  accent: "#A07878", // Soft red accent
  dark: "#2A2A2A",
  lightBg: "#FAFAFA",
  text: "#333333",
  lightText: "#6C757D",
  border: "#E0E0E0",
  cardBg: "linear-gradient(145deg, #5E3D3D 0%, #763D3D 50%, #5E3D3D 100%)",
  cardHighlight: "rgba(255, 255, 255, 0.08)"
};

const StudentDashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);

  const downloadCard = (id) => {
    const el = document.getElementById(id);
    html2canvas(el, {
      scale: 3, // Higher quality
      logging: false,
      useCORS: true,
      backgroundColor: null // Transparent background
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
      <header className="shadow-sm py-4 sticky top-0 z-10" style={{ backgroundColor: colors.dark }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <h1 className="text-xl md:text-2xl font-bold tracking-wide text-white flex items-center">
            <FaIdCard className="mr-2" /> SYBORG Portal
          </h1>
          <span className="text-sm md:text-base text-gray-300">
            Welcome, <span className="font-medium">{user?.firstname}</span>
          </span>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 py-6 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Sidebar */}
            <div className="hidden lg:block lg:w-1/4">
              <StudentSidebar />
            </div>

            {/* Dashboard Content */}
            <div className="w-full lg:w-3/4 animate__animated animate__fadeIn">
              {/* ID Card Section */}
              <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100">
                <div className="p-5 border-b border-gray-100">
                  <h3 className="text-lg font-bold flex items-center">
                    <FaIdCard className="mr-2" style={{ color: colors.primary }} />
                    Your SYBORG ID Card
                  </h3>
                </div>
                <div className="p-5">
                  <div className="flex flex-col items-center space-y-6">
                    {/* Cards Container */}
                    <div className="flex flex-col lg:flex-row items-center justify-center gap-6 w-full">
                      {/* FRONT CARD - Enhanced Design */}
                      <div
                        className="card relative rounded-xl overflow-hidden w-full max-w-sm h-96 lg:h-[480px]"
                        id="front-card"
                        style={{
                          background: `
                            linear-gradient(145deg, #4A2E2E 0%, #5E3D3D 50%, #4A2E2E 100%)
                          `,
                          color: "white",
                          boxShadow: "0 8px 24px rgba(118, 61, 61, 0.2)"
                        }}
                      >
                        {/* Subtle texture overlay */}
                        <div className="absolute inset-0 opacity-10" style={{
                          backgroundImage: "radial-gradient(circle at center, white 1px, transparent 1px)",
                          backgroundSize: "10px 10px"
                        }}></div>
                        
                        {/* Card content */}
                        <div className="relative z-10 h-full flex flex-col p-5">
                          {/* Header section */}
                          <div className="top text-center pt-4">
                            <img
                              src="https://syborg-server-wlpe4.ondigitalocean.app/uploads/Syborg_Logo/syborg_logo.png"
                              className="logo w-14 mx-auto mb-3 filter brightness-0 invert opacity-90"
                              alt="Logo"
                            />
                            <div className="org-title text-lg font-bold tracking-wide mb-1" style={{ color: "#F8F8F8" }}>
                              SYSTEM BUILDERS ORGANIZATION
                            </div>
                            <div className="course text-xs tracking-wider opacity-70" style={{ color: "#D9D9D9" }}>
                              BACHELOR OF SCIENCE IN COMPUTER SCIENCE
                            </div>
                          </div>

                          {/* Center content */}
                          <div className="center flex flex-col items-center justify-center flex-grow">
                            {/* QR Code with elegant border */}
                            <div className="qr mb-5 p-3 rounded-lg" style={{ 
                              backgroundColor: "white",
                              boxShadow: "0 4px 12px rgba(0,0,0,0.15)"
                            }}>
                              {user?.qr_code ? (
                                <img
                                  src={`${import.meta.env.VITE_LARAVEL_FILE_API}/${user.qr_code}`}
                                  alt="QR Code"
                                  className="w-32 h-32"
                                />
                              ) : (
                                <div className="w-32 h-32 bg-gray-100 flex items-center justify-center">
                                  <FaQrcode className="text-gray-400 text-2xl" />
                                </div>
                              )}
                            </div>

                            {/* Student name with subtle background */}
                            <div className="student-name text-lg font-bold mt-3 text-center px-5 py-2 rounded-lg" style={{ 
                              backgroundColor: "rgba(255, 255, 255, 0.1)",
                              backdropFilter: "blur(4px)",
                              border: "1px solid rgba(255, 255, 255, 0.1)"
                            }}>
                              {user?.firstname && user?.lastname
                                ? `${user.firstname.toUpperCase()} ${user.lastname.toUpperCase()}`
                                : "STUDENT NAME"}
                            </div>
                          </div>

                          {/* Footer signature */}
                          <div className="signature text-center text-xs pb-2" style={{ color: "#E0E0E0" }}>
                            <div className="line border-t border-white w-32 mx-auto my-2 opacity-30"></div>
                            <div className="font-bold tracking-wide">DR. PHILIPCRIS C. ENCARNACION</div>
                            <div className="opacity-80 tracking-wider">CCS DEAN</div>
                          </div>
                        </div>
                      </div>

                      {/* BACK CARD - Enhanced Design */}
                      <div
                        className="card relative rounded-xl overflow-hidden w-full max-w-sm h-96 lg:h-[480px]"
                        id="back-card"
                        style={{
                          background: `
                            linear-gradient(145deg, #4A2E2E 0%, #5E3D3D 50%, #4A2E2E 100%)
                          `,
                          color: "white",
                          boxShadow: "0 8px 24px rgba(118, 61, 61, 0.2)"
                        }}
                      >
                        {/* Subtle diagonal pattern */}
                        <div className="absolute inset-0 opacity-10" style={{
                          backgroundImage: "linear-gradient(45deg, #3A2323 25%, transparent 25%, transparent 75%, #3A2323 75%, #3A2323), linear-gradient(45deg, #3A2323 25%, transparent 25%, transparent 75%, #3A2323 75%, #3A2323)",
                          backgroundSize: "20px 20px",
                          backgroundPosition: "0 0, 10px 10px"
                        }}></div>
                        
                        <div className="relative z-10 h-full flex flex-col p-5">
                          {/* Main content */}
                          <div className="flex-grow flex flex-col items-center justify-center">
                            {/* Organization logo */}
                            <img
                              src="/storage/syborg_logo.png"
                              className="logo-large w-24 mx-auto mb-6 filter brightness-0 invert opacity-80"
                              alt="SYBORG Logo"
                            />

                            {/* Slogan with elegant border */}
                            <div className="slogan text-sm italic text-center px-6 py-4 rounded-lg mb-8" style={{ 
                              backgroundColor: "rgba(255, 255, 255, 0.1)",
                              backdropFilter: "blur(4px)",
                              border: "1px solid rgba(255, 255, 255, 0.1)"
                            }}>
                              "Where code, knowledge, and innovation converge."
                            </div>

                            {/* ID card notice */}
                            <div className="text-center text-xs tracking-wider" style={{ color: "#D9D9D9" }}>
                              <div className="mb-1 font-medium">OFFICIAL ID CARD</div>
                              <div className="text-xxs opacity-70">Property of Saint Columban College</div>
                            </div>
                          </div>

                          {/* Footer links */}
                          <div className="links text-xxs text-center opacity-70 pb-2" style={{ color: "#D9D9D9" }}>
                            <div className="mb-1">https://facebook.com/SyBorgSCC</div>
                            <div>https://facebook.com/ccs.saintcolumban</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons - Enhanced */}
                    <div className="flex flex-wrap justify-center gap-3 w-full">
                      <button
                        onClick={() => downloadCard("front-card")}
                        className="btn flex items-center justify-center px-4 py-2 rounded-lg font-medium transition-all hover:shadow-md"
                        style={{ 
                          backgroundColor: colors.primary,
                          color: "white",
                          minWidth: "180px"
                        }}
                      >
                        <FaDownload className="mr-2" /> Download Front
                      </button>
                      <button
                        onClick={() => downloadCard("back-card")}
                        className="btn flex items-center justify-center px-4 py-2 rounded-lg font-medium transition-all hover:shadow-md"
                        style={{ 
                          backgroundColor: colors.secondary,
                          color: "white",
                          minWidth: "180px"
                        }}
                      >
                        <FaDownload className="mr-2" /> Download Back
                      </button>
                      <button
                        onClick={() => window.print()}
                        className="btn flex items-center justify-center px-4 py-2 rounded-lg font-medium transition-all hover:shadow-md"
                        style={{ 
                          backgroundColor: colors.dark,
                          color: "white",
                          minWidth: "180px"
                        }}
                      >
                        <FaPrint className="mr-2" /> Print Both
                      </button>
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

export default StudentDashboard;