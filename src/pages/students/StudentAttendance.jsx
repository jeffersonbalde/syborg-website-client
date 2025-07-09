import React, { useEffect, useState } from "react";
import StudentSidebar from "../../components/StudentSidebar";
import "animate.css";
import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";
import { FaSpinner } from "react-icons/fa";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

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

const StudentAttendance = () => {
  const { user } = useAuth();

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
            Welcome back, {user?.firstname}!
          </span>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 py-8 md:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Sidebar */}
            <div className="md:w-1/4">
              <StudentSidebar />
            </div>

            {/* Dashboard Content */}
            <div className="md:w-3/4 w-full animate__animated animate__fadeIn">
              <div
                className="shadow-lg rounded-xl overflow-hidden animate__animated animate__fadeIn"
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
                      Attendance Records
                    </h4>
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

export default StudentAttendance;
