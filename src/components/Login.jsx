import React, { useState } from "react";
import { useForm } from "react-hook-form";
import {
  HiOutlineMail,
  HiOutlineLockClosed,
  HiEye,
  HiEyeOff,
} from "react-icons/hi";
import { Link } from "react-router-dom";
import syborg_logo from "../assets/images/syborg_logo.png";

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const [showPassword, setShowPassword] = useState(false);
  const togglePassword = () => setShowPassword(!showPassword);

  const onSubmit = async (data) => {
    console.log(data);
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center flex items-center justify-center relative px-4 "
      style={{
        backgroundImage: `url('https://u7.uidownload.com/vector/234/182/vector-light-blue-abstract-background-eps.jpg')`,
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />

      {/* Login card */}
      <div className="relative z-10 w-full max-w-md bg-white/80 backdrop-blur-xl p-8 rounded-xl shadow-2xl space-y-6 animate__animated animate__fadeIn">
        <div className="flex flex-col items-center">
          <img src={syborg_logo} alt="SYBORG" className="w-20 h-20 mb-2" />
          <h2 className="text-2xl font-bold text-gray-800">Welcome Back</h2>
          <p className="text-gray-600 text-sm">
            Login to continue to Syborg Portal
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Email */}
          <div>
            <label className="block text-gray-700 mb-1">Email</label>
            <div className="relative">
              <HiOutlineMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                {...register("email", {
                  required: "The email field is required.",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Please enter a valid email address.",
                  },
                })}
                type="email"
                className={`w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.email ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Email"
                autoFocus
              />
            </div>
            {errors.email && (
              <p className="text-sm text-red-600 mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-gray-700 mb-1">Password</label>
            <div className="relative">
              <HiOutlineLockClosed className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                {...register("password", {
                  required: "The password field is required.",
                })}
                type={showPassword ? "text" : "password"}
                className={`w-full pl-10 pr-10 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.password ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Password"
              />
              <div
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer"
                onClick={togglePassword}
              >
                {showPassword ? <HiEyeOff /> : <HiEye />}
              </div>
            </div>
            {errors.password && (
              <p className="text-sm text-red-600 mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="cursor-pointer w-full bg-blue-600 text-white py-2 rounded-md font-semibold transition-all duration-300 hover:bg-blue-700 hover:shadow-lg disabled:opacity-60"
          >
            {isSubmitting ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* Register Redirect */}
        <div className="text-center pt-4">
          <p className="text-sm text-gray-700">
            Don’t have an account?
            <Link
              to="/register"
              className="ml-1 text-blue-600 font-medium hover:underline"
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