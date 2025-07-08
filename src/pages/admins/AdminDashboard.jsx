import React from "react";
import AdminSidebar from "../../components/AdminSidebar";

const AdminDashboard = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      {/* Header */}
      <header className="bg-sky-600 text-white shadow-md py-5 animate__animated animate__fadeInDown">
        <div className="max-w-7xl mx-auto px-4 md:px-8 flex items-center justify-between">
          <h1 className="text-2xl md:text-3xl font-bold tracking-wide">
            SYBORG Portal
          </h1>
          <span className="text-sm italic opacity-80 hidden md:block">
            Welcome back, Administrator!
          </span>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 py-8 md:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Sidebar */}
            <div className="md:w-1/4 animate__animated animate__fadeInLeft">
              <AdminSidebar />
            </div>

            {/* Dashboard Content */}
            <div className="md:w-3/4 animate__animated animate__fadeInUp">
              <div className="bg-white shadow-lg rounded-2xl p-8 hover:shadow-xl transition-all duration-300">
                <h4 className="text-2xl font-semibold text-sky-700 mb-2">
                  Dashboard Overview
                </h4>
                <p className="text-gray-600">
                  Manage your website content and track student registrations here.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;