import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import syborg_logo from "../assets/images/syborg_logo.png";

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

const AdminPageNavbar = () => {
  return (
    <div className="w-full fixed top-0 z-50">
      {/* Desktop Navigation */}
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
        </motion.div>
      </div>

      {/* Mobile Navigation */}
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
      </div>
    </div>
  );
};

export default AdminPageNavbar;