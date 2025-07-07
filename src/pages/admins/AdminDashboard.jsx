import React from "react";
import AdminSidebar from "../../components/AdminSidebar";

const AdminDashboard = () => {
  return (
    <div>
      <main className="px-4 py-8 md:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Sidebar */}
            <div className="md:w-1/4">
              <h1>Admin Dashboard</h1>
              <AdminSidebar />
            </div>

            {/* Dashboard Content */}
            <div className="md:w-3/4">
              <div className="bg-white shadow rounded-lg p-6 flex items-center justify-center">
                <h4 className="text-xl font-semibold">Dashboard</h4>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
