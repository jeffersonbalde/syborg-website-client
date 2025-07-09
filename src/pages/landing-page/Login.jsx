import React, { useEffect, useState, useContext } from "react";
import { useForm } from "react-hook-form";
import {
  HiOutlineMail,
  HiOutlineLockClosed,
  HiEye,
  HiEyeOff,
} from "react-icons/hi";
import { Link, useNavigate } from "react-router-dom";
import syborg_logo from "../../assets/images/syborg_logo.png";
import { toast } from "react-toastify";
import { AuthContext } from "../../context/AuthContext";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import "animate.css";

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

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const [showPassword, setShowPassword] = useState(false);
  const togglePassword = () => setShowPassword(!showPassword);

  const getCustomSwal = () => {
    return withReactContent(Swal).mixin({
      background: colors.lightBg,
      color: colors.text,
      confirmButtonColor: colors.primary,
      cancelButtonColor: colors.lightText,
      customClass: {
        confirmButton: "custom-confirm-btn",
        cancelButton: "custom-cancel-btn",
        title: "custom-title",
        content: "custom-content",
        popup: "custom-popup",
      },
    });
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const MySwal = getCustomSwal();
      MySwal.fire({
        title: "Authenticating...",
        text: "Please wait while we verify your session.",
        allowOutsideClick: false,
        allowEscapeKey: false,
        didOpen: () => {
          Swal.showLoading();
          document.body.style.overflow = "auto";
        },
        willClose: () => {
          document.body.style.overflow = "";
        },
      });

      fetch(`${import.meta.env.VITE_LARAVEL_API}/user`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => res.json())
        .then((result) => {
          if (result && result.role) {
            login({
              user: result.user,
              role: result.role,
              token: token,
            });

            Swal.close();
            navigate(
              result.role === "admin"
                ? "/admin/dashboard"
                : "/student/dashboard"
            );
          } else {
            Swal.close();
          }
        })
        .catch(() => {
          Swal.close();
          toast.error("Session expired. Please login again.");
        });
    }
  }, []);

  const onSubmit = async (data) => {
    const MySwal = getCustomSwal();
    MySwal.fire({
      title: "Logging in...",
      text: "Please wait while we authenticate you.",
      allowOutsideClick: false,
      allowEscapeKey: false,
      didOpen: () => {
        Swal.showLoading();
        document.body.style.overflow = "auto";
      },
      willClose: () => {
        document.body.style.overflow = "";
      },
    });

    try {
      // CSRF first (Laravel Sanctum)
      await fetch(
        `${import.meta.env.VITE_LARAVEL_API_SANCTUM}/sanctum/csrf-cookie`,
        {
          credentials: "include",
        }
      );

      const res = await fetch(
        `${import.meta.env.VITE_LARAVEL_API_SANCTUM}/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          credentials: "include",
          body: JSON.stringify(data),
        }
      );

      const result = await res.json();

      Swal.close();

      if (!result.status) {
        toast.error(result.message);
      } else {
        login({
          user: result.user,
          role: result.role,
          token: result.token,
        });
        localStorage.setItem("token", result.token);

        navigate(
          result.role === "admin" ? "/admin/dashboard" : "/student/dashboard"
        );
      }
    } catch (error) {
      Swal.close();
      toast.error("Login failed. Try again.");
      console.error(error);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ backgroundColor: colors.lightBg }}
    >
      {/* Login card */}
      <div
        className="w-full max-w-md p-8 rounded-xl shadow-lg animate__animated animate__fadeIn"
        style={{
          backgroundColor: "white",
          border: `1px solid ${colors.border}`,
        }}
      >
        <div className="flex flex-col items-center">
          <img src={syborg_logo} alt="SYBORG" className="w-20 h-20 mb-2" />
          <h2
            className="text-2xl font-bold mb-1"
            style={{ color: colors.dark }}
          >
            Welcome Back
          </h2>
          <p className="text-sm" style={{ color: colors.lightText }}>
            Login to continue to SYBORG Portal
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 mt-6">
          {/* Email */}
          <div>
            <label
              className="block mb-1 text-sm font-medium"
              style={{ color: colors.text }}
            >
              Email
            </label>
            <div className="relative">
              <HiOutlineMail
                className="absolute left-3 top-1/2 transform -translate-y-1/2"
                style={{ color: colors.lightText }}
              />
              <input
                {...register("email", {
                  required: "The email field is required.",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Please enter a valid email address.",
                  },
                })}
                type="email"
                className={`w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                  errors.email
                    ? "border-red-500 focus:ring-red-500"
                    : `border-${colors.border} focus:ring-${colors.primary}`
                }`}
                placeholder="Email"
                autoFocus
                style={{
                  borderColor: errors.email ? colors.danger : colors.border,
                }}
              />
            </div>
            {errors.email && (
              <p className="text-sm mt-1" style={{ color: colors.danger }}>
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <label
              className="block mb-1 text-sm font-medium"
              style={{ color: colors.text }}
            >
              Password
            </label>
            <div className="relative">
              <HiOutlineLockClosed
                className="absolute left-3 top-1/2 transform -translate-y-1/2"
                style={{ color: colors.lightText }}
              />
              <input
                {...register("password", {
                  required: "The password field is required.",
                })}
                type={showPassword ? "text" : "password"}
                className={`w-full pl-10 pr-10 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                  errors.password
                    ? "border-red-500 focus:ring-red-500"
                    : `border-${colors.border} focus:ring-${colors.primary}`
                }`}
                placeholder="Password"
                style={{
                  borderColor: errors.password ? colors.danger : colors.border,
                }}
              />
              <div
                className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
                style={{ color: colors.lightText }}
                onClick={togglePassword}
              >
                {showPassword ? <HiEyeOff /> : <HiEye />}
              </div>
            </div>
            {errors.password && (
              <p className="text-sm mt-1" style={{ color: colors.danger }}>
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-2 rounded-md font-semibold transition-all duration-300 shadow ${
              isSubmitting
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : `bg-${colors.primary} text-white hover:brightness-90 cursor-pointer`
            }`}
            style={{
              backgroundColor: isSubmitting
                ? colors.border
                : colors.primary,
            }}
          >
            {isSubmitting ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* Register Redirect */}
        <div className="text-center pt-4">
          <p className="text-sm" style={{ color: colors.lightText }}>
            Don't have an account?{" "}
            <Link
              to="/register"
              className="font-semibold hover:underline"
              style={{ color: colors.primary }}
            >
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;