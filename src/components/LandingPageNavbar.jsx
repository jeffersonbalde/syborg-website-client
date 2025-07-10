import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { BsFacebook } from "react-icons/bs";
import { motion, AnimatePresence } from "framer-motion";
import syborg_logo from "../assets/images/syborg_logo.png";
import ccs_logo from "../assets/images/ccs_logo.png";
import scc_logo from "../assets/images/scc_logo.png";

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

const Navbar = () => {
  const [openMenu, setOpenMenu] = useState(false);
  const location = useLocation();

  const handleClick = () => {
    setOpenMenu(!openMenu);
  };

  const links = [
    { title: "Home", path: "/" },
    { title: "About us", path: "/about" },
    { title: "Courses", path: "/courses" },
    { title: "Achievements", path: "/achievements" },
    { title: "Members", path: "/members" },
    { title: "Officers", path: "/officers" },
    { title: "Contact us", path: "/contact us" },
  ];

  const NavLink = ({ item }) => {
    const isActive = location.pathname === item.path;
    return (
      <Link
        to={item.path}
        className={`${
          isActive
            ? `text-${colors.primary} font-bold`
            : `font-semibold text-${colors.text}`
        } hover:text-${colors.primary} transition-colors`}
        style={{
          color: isActive ? colors.primary : colors.text,
        }}
      >
        {item.title}
      </Link>
    );
  };

  return (
    <div className="w-full fixed top-0 z-50">
      {/* Announcement Banner */}
      <div className="w-full">
        <div
          className="w-full text-center text-xs font-medium py-2 px-4 lg:px-16 backdrop-blur-md shadow-sm border-b"
          style={{
            backgroundColor: `${colors.primary}20`,
            color: colors.dark,
            borderColor: colors.border,
          }}
        >
          Welcome to the official <strong>SYBORG</strong> website — currently in{" "}
          <strong>beta testing</strong>. You may log in using{" "}
          <span className="font-semibold">admin@admin.com</span> and password{" "}
          <span className="font-semibold">123456</span> to explore content
          management features. Students may register using their{" "}
          <span className="font-semibold">sccpag.edu.ph</span> email to access
          QR codes, attendance logs, and upcoming events. If you have
          feedback, encounter issues, or spot a bug, please feel free to contact
          the developer, <span className="font-semibold">Jefferson Balde</span>,
          for assistance and improvements. Your input helps us enhance the
          platform.
        </div>
      </div>

      {/* Main Navbar */}
      <div
        className="w-full bg-white backdrop-blur-md border-b"
        style={{ borderColor: colors.border }}
      >
        <motion.div
          className="hidden lg:flex justify-between px-6 md:px-14 py-2 items-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{
            opacity: 1,
            y: 0,
            transition: { delay: 0.1, duration: 0.5 },
          }}
        >
          <Link to="/" className="flex items-center gap-4">
            <motion.img
              src={syborg_logo}
              alt="SYBORG LOGO"
              width={70}
              height={70}
              className="drop-shadow-[0_0_10px_rgba(211,2,3,0.4)]"
              initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 0.9, ease: "easeOut" }}
            />
            <div>
              <h1
                className="text-2xl md:text-3xl font-extrabold drop-shadow-[2px_2px_2px_rgba(0,0,0,0.2)]"
                style={{ color: colors.primary }}
              >
                SYBORG
              </h1>
              <p className="text-md" style={{ color: colors.primary }}>
                SCC System Builders Organization
              </p>
            </div>
          </Link>

          <div className="flex items-center gap-4">
            <div className="relative group transition-all duration-300">
              <input
                type="text"
                placeholder="Search"
                className="pl-10 pr-4 py-2 w-96 border rounded-md shadow-sm focus:outline-none focus:ring-2 placeholder:text-gray-500 transition-all duration-300 group-hover:shadow-md"
                style={{
                  backgroundColor: colors.lightBg,
                  borderColor: colors.border,
                  focusRing: colors.primary,
                }}
              />
              <svg
                className="absolute left-3 top-1/2 transform -translate-y-1/2 group-focus-within:text-[var(--color-primary)]"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                width="20"
                height="20"
                style={{ color: colors.lightText }}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1116.65 6.65a7.5 7.5 0 010 10.6z"
                />
              </svg>
            </div>

            <Link
              to="/login"
              className="px-5 py-2 rounded-md font-semibold shadow-sm hover:shadow-md transition duration-200"
              style={{
                backgroundColor: colors.primary,
                color: "white",
                hoverBackground: `${colors.primary}90`,
              }}
            >
              Login
            </Link>

            <img
              src={scc_logo}
              alt="SCC"
              className="w-20 h-20 object-contain"
            />
            <img
              src={ccs_logo}
              alt="BYTE"
              className="w-20 h-20 object-contain"
            />
          </div>
        </motion.div>
      </div>

      {/* Bottom Panel - NavLinks */}
      <div
        className="hidden lg:flex w-full border-b px-6 md:px-14 py-3 uppercase text-sm"
        style={{
          backgroundColor: colors.lightBg,
          borderColor: colors.border,
        }}
      >
        <motion.div
          className="flex gap-8"
          initial={{ opacity: 0, y: 9 }}
          whileInView={{
            opacity: 1,
            y: 0,
            transition: { delay: 0.1, duration: 0.6 },
          }}
        >
          {links.map((link) => (
            <NavLink item={link} key={link.title} className="" />
          ))}
        </motion.div>
      </div>

      {/* Mobile Nav */}
      <div
        className="flex lg:hidden justify-between items-center px-4 py-2 bg-white/90 backdrop-blur-md border-b"
        style={{ borderColor: colors.border }}
      >
        <Link to="/" className="flex items-center gap-3">
          <motion.img
            src={syborg_logo}
            alt="SYBORG Logo"
            width={50}
            height={50}
            className="mr-1 drop-shadow-[0_0_10px_rgba(211,2,3,0.4)]"
            initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          />
          <div>
            <h1
              className="text-xl font-extrabold drop-shadow-[2px_2px_2px_rgba(0,0,0,0.2)]"
              style={{ color: colors.primary }}
            >
              SYBORG
            </h1>
            <h1
              className="font-normal text-sm md:text-lg drop-shadow-[1px_1px_1px_rgba(0,0,0,0.2)]"
              style={{ color: colors.primary }}
            >
              SCC System Builders Organization
            </h1>
          </div>
        </Link>

        <motion.div
          className="lg:hidden z-50 cursor-pointer"
          onClick={handleClick}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{
            opacity: 1,
            y: 0,
            transition: { delay: 0.1, duration: 0.5 },
          }}
          viewport={{ once: true }}
        >
          <div className="flex flex-col justify-center items-end gap-[6px] w-8 h-8">
            <motion.span
              animate={{
                rotate: openMenu ? 45 : 0,
                y: openMenu ? 8 : 0,
              }}
              className="w-8 h-[3px] rounded origin-left"
              style={{ backgroundColor: colors.primary }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
            />
            <motion.span
              animate={{
                opacity: openMenu ? 0 : 1,
              }}
              className="w-8 h-[3px] rounded"
              style={{ backgroundColor: colors.primary }}
              transition={{ duration: 0.2 }}
            />
            <motion.span
              animate={{
                rotate: openMenu ? -45 : 0,
                y: openMenu ? -8 : 0,
              }}
              className="w-8 h-[3px] rounded origin-left"
              style={{ backgroundColor: colors.primary }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
            />
          </div>
        </motion.div>
      </div>

      {/* Mobile Menu Panel */}
      <AnimatePresence>
        {openMenu && (
          <motion.div
            key="mobile-menu"
            initial={{ x: "100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "100%", opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="fixed right-0 top-0 w-[65%] h-screen p-10 z-50 shadow-lg"
            style={{ backgroundColor: colors.lightBg }}
          >
            <div className="flex w-full items-center justify-end">
              <motion.div
                onClick={handleClick}
                className="cursor-pointer flex flex-col gap-[4px] justify-center items-center w-8 h-8 hover:scale-110 transition-transform"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <motion.span
                  initial={{ rotate: 0 }}
                  animate={{ rotate: 45 }}
                  className="w-7 h-[3px] rounded origin-center"
                  style={{ backgroundColor: colors.primary }}
                  transition={{ type: "spring", stiffness: 300 }}
                />
                <motion.span
                  initial={{ rotate: 0 }}
                  animate={{ rotate: -45 }}
                  className="w-7 h-[3px] rounded origin-center -mt-[3px]"
                  style={{ backgroundColor: colors.primary }}
                  transition={{ type: "spring", stiffness: 300 }}
                />
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="flex flex-col py-14 items-center justify-center"
            >
              <ul>
                {links.map((link) => (
                  <motion.li
                    key={link.title}
                    className="py-5 uppercase font-medium"
                    style={{ color: colors.text }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleClick}
                  >
                    <Link to={link.path}>{link.title}</Link>
                  </motion.li>
                ))}
                <motion.li
                  className="mt-5 px-3 py-2 rounded-sm"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleClick}
                >
                  <Link
                    to="/login"
                    className="px-7 py-4 rounded-md font-semibold shadow-sm transition duration-200"
                    style={{
                      backgroundColor: colors.primary,
                      color: "white",
                    }}
                  >
                    Login
                  </Link>
                </motion.li>
              </ul>
            </motion.div>

            <motion.div
              className="flex justify-center pt-10 items-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <a href="https://web.facebook.com/SyBorgSCC">
                <BsFacebook size={30} style={{ color: colors.primary }} />
              </a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Navbar;
