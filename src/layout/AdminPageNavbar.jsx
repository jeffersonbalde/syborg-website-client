// components/Layout.jsx or Layout.tsx
import React from "react";
import Navbar from "../components/AdminPageNavbar";

const Layout = ({ children }) => {
  return (
    <>
      <Navbar />
      <main className="mt-[68px] lg:mt-[141px]">
        {children}
      </main>
    </>
  );
};

export default Layout;
