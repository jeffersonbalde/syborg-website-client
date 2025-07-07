// components/Layout.jsx or Layout.tsx
import React from "react";
import Navbar from "../components/LandingPageNavbar";
import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <>
      <Navbar />
      <main className="mt-[68px] lg:mt-[141px]">
        <Outlet />
      </main>
    </>
  );
};

export default Layout;
