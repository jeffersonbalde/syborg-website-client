// components/Layout.jsx or Layout.tsx
import React from "react";
import Navbar from "../components/AdminPageNavbar";

const Layout = ({ children }) => {
  return (
    <>
      {/* <Navbar /> */}
      <main >
        {children}
      </main>
    </>
  );
};

export default Layout;
