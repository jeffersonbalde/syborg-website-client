// components/Layout.jsx or Layout.tsx
import React from "react";
import Navbar from "../components/Navbar";
import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <>
      <Navbar />
      <main className="pt-[100px] md:pt-[160px] px-4">
        <Outlet />
      </main>
    </>
  );
};

export default Layout;
