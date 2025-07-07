// components/Layout.jsx or Layout.tsx
import React from "react";
import Navbar from "../components/LandingPageNavbar";
import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <>
      {/* <div className="fixed top-2 left-1/2 -translate-x-1/2 z-100 max-w-screen-md w-[90%] bg-blue-200/30 text-blue-900 text-center text-xs font-medium py-2 px-4 rounded-md backdrop-blur-md shadow-lg border border-blue-300">
        This is the official <strong>SYBORG</strong> website — currently in{" "}
        <strong>beta testing</strong>. You may log in using{" "}
        <span className="font-semibold">admin@admin.com</span> and password{" "}
        <span className="font-semibold">password</span>.
      </div> */}

      <Navbar />
      {/* <main className="mt-[68px] lg:mt-[141px]"> */}
      {/* <main className="mt-[116px] lg:mt-[174px]"> */}
      <main className="mt-[164px] lg:mt-[190px]">
        <Outlet />
      </main>
    </>
  );
};

export default Layout;
