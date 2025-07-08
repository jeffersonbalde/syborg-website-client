import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { AuthProvider } from "./context/AuthContext";
import PrivateRoute from "./routes/auth/PrivateRoute";

import LandingPageNavbar from "./layout/LandingPageNavbar";
import AdminPageNavbar from "./layout/AdminPageNavbar";

import About from "./pages/landing-page/About";
import Login from "./pages/landing-page/Login";
import Register from "./pages/landing-page/Register";
import LandingPage from "./pages/landing-page/LandingPage";
import Courses from "./pages/landing-page/Courses";
import Achievements from "./pages/landing-page/Achievements";
import Members from "./pages/landing-page/Members";
import Officers from "./pages/landing-page/Officers";
import ContactUs from "./pages/landing-page/ContactUs";

import AdminDashboard from "./pages/admins/AdminDashboard";
import StudentDashboard from "./pages/students/StudentDashboard";

import "animate.css";
import ShowSlider from "./pages/admins/HeroSlider/ShowSlider";
import CreateSlider from "./pages/admins/HeroSlider/CreateSlider";
import AboutUs from "./pages/admins/AboutUs";
import NotFound from "./NotFound";
import ShowStudents from "./pages/admins/Students/ShowStudents";

const App = () => {
  return (
    <>
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* Public Routes */}
            <Route element={<LandingPageNavbar />}>
              <Route path="/" element={<LandingPage />} />
              <Route path="/about" element={<About />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/courses" element={<Courses />} />
              <Route path="/achievements" element={<Achievements />} />
              <Route path="/members" element={<Members />} />
              <Route path="/officers" element={<Officers />} />
              <Route path="/contact us" element={<ContactUs />} />
            </Route>

            <Route
              path="/admin/dashboard"
              element={
                <PrivateRoute allowedRoles={["admin"]}>
                  <AdminPageNavbar>
                    <AdminDashboard />
                  </AdminPageNavbar>
                </PrivateRoute>
              }
            />

            <Route
              path="/admin/hero"
              element={
                <PrivateRoute allowedRoles={["admin"]}>
                  <AdminPageNavbar>
                    <ShowSlider />
                  </AdminPageNavbar>
                </PrivateRoute>
              }
            />

            <Route
              path="/admin/create-hero-slider"
              element={
                <PrivateRoute allowedRoles={["admin"]}>
                  <AdminPageNavbar>
                    <CreateSlider />
                  </AdminPageNavbar>
                </PrivateRoute>
              }
            />

            <Route
              path="/admin/students"
              element={
                <PrivateRoute allowedRoles={["admin"]}>
                  <AdminPageNavbar>
                    <ShowStudents />
                  </AdminPageNavbar>
                </PrivateRoute>
              }
            />

            <Route
              path="/admin/about us"
              element={
                <PrivateRoute allowedRoles={["admin"]}>
                  <AdminPageNavbar>
                    <AboutUs />
                  </AdminPageNavbar>
                </PrivateRoute>
              }
            />

            <Route
              path="/student/dashboard"
              element={
                <PrivateRoute allowedRoles={["student"]}>
                  <AdminPageNavbar>
                    <StudentDashboard />
                  </AdminPageNavbar>
                </PrivateRoute>
              }
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>

      <ToastContainer position="top-center" />
    </>
  );
};

export default App;
