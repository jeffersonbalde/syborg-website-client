import React from "react";
import AdminSidebar from "../../components/AdminSidebar";
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

const AboutUs = () => {
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
            className="text-sm italic hidden md:block"
            style={{ color: "rgba(255,255,255,0.7)" }}
          >
            Learn more about SYBORG System
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
                      About Us
                    </h4>
                  </div>

                  <div className="space-y-6">
                    {/* About Section */}
                    {/* <div
                      className="rounded-xl p-6 shadow-sm"
                      style={{
                        backgroundColor: "#F9F9F9",
                        border: `1px solid ${colors.border}`,
                      }}
                    >
                      <h5
                        className="text-lg font-semibold mb-4"
                        style={{ color: colors.text }}
                      >
                        About SYBORG System
                      </h5>
                      <p style={{ color: colors.text }}>
                        The SYBORG (SYstem for Biometric Online Registration and 
                        Governance) is a comprehensive student management system 
                        designed to streamline student registration, attendance 
                        tracking, and campus governance.
                      </p>
                    </div> */}

                    {/* Mission Section */}
                    {/* <div
                      className="rounded-xl p-6 shadow-sm"
                      style={{
                        backgroundColor: "#F9F9F9",
                        border: `1px solid ${colors.border}`,
                      }}
                    >
                      <h5
                        className="text-lg font-semibold mb-4"
                        style={{ color: colors.text }}
                      >
                        Our Mission
                      </h5>
                      <p style={{ color: colors.text }}>
                        To provide an efficient, secure, and user-friendly platform 
                        that enhances the student experience while reducing 
                        administrative workload through innovative technology 
                        solutions.
                      </p>
                    </div> */}

                    {/* Features Section */}
                    {/* <div
                      className="rounded-xl p-6 shadow-sm"
                      style={{
                        backgroundColor: "#F9F9F9",
                        border: `1px solid ${colors.border}`,
                      }}
                    >
                      <h5
                        className="text-lg font-semibold mb-4"
                        style={{ color: colors.text }}
                      >
                        Key Features
                      </h5>
                      <ul className="space-y-3" style={{ color: colors.text }}>
                        <li className="flex items-start">
                          <span
                            className="inline-block mr-2 mt-1"
                            style={{ color: colors.primary }}
                          >
                            •
                          </span>
                          Biometric student identification and verification
                        </li>
                        <li className="flex items-start">
                          <span
                            className="inline-block mr-2 mt-1"
                            style={{ color: colors.primary }}
                          >
                            •
                          </span>
                          QR code-based attendance system
                        </li>
                        <li className="flex items-start">
                          <span
                            className="inline-block mr-2 mt-1"
                            style={{ color: colors.primary }}
                          >
                            •
                          </span>
                          Real-time student data management
                        </li>
                        <li className="flex items-start">
                          <span
                            className="inline-block mr-2 mt-1"
                            style={{ color: colors.primary }}
                          >
                            •
                          </span>
                          Comprehensive reporting and analytics
                        </li>
                        <li className="flex items-start">
                          <span
                            className="inline-block mr-2 mt-1"
                            style={{ color: colors.primary }}
                          >
                            •
                          </span>
                          Secure role-based access control
                        </li>
                      </ul>
                    </div> */}

                    {/* Team Section */}
                    {/* <div
                      className="rounded-xl p-6 shadow-sm"
                      style={{
                        backgroundColor: "#F9F9F9",
                        border: `1px solid ${colors.border}`,
                      }}
                    >
                      <h5
                        className="text-lg font-semibold mb-4"
                        style={{ color: colors.text }}
                      >
                        Development Team
                      </h5>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[
                          {
                            name: "John Doe",
                            role: "Lead Developer",
                            description: "Specializes in biometric systems integration"
                          },
                          {
                            name: "Jane Smith",
                            role: "UI/UX Designer",
                            description: "Creates intuitive user experiences"
                          },
                          {
                            name: "Mike Johnson",
                            role: "Backend Engineer",
                            description: "Database architecture and API development"
                          },
                          {
                            name: "Sarah Williams",
                            role: "Project Manager",
                            description: "Ensures timely delivery of features"
                          }
                        ].map((member, index) => (
                          <div 
                            key={index}
                            className="p-4 rounded-lg"
                            style={{
                              backgroundColor: "white",
                              border: `1px solid ${colors.border}`,
                            }}
                          >
                            <h6 className="font-semibold" style={{ color: colors.primary }}>
                              {member.name}
                            </h6>
                            <p className="text-sm mb-2" style={{ color: colors.text }}>
                              {member.role}
                            </p>
                            <p className="text-xs" style={{ color: colors.lightText }}>
                              {member.description}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div> */}
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

export default AboutUs;