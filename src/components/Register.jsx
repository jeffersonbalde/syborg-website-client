import React, { useState } from "react";
import { useForm } from "react-hook-form";
import {
  HiOutlineMail,
  HiOutlineLockClosed,
  HiOutlineUser,
  HiEye,
  HiEyeOff,
} from "react-icons/hi";
import syborg_logo from "../assets/images/syborg_logo.png";
import Swal from "sweetalert2";
import { useNavigate, Link } from "react-router-dom";

const Register = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ mode: "onChange" });

  const [showPassword, setShowPassword] = useState(false);
  const togglePassword = () => setShowPassword(!showPassword);
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    await Swal.fire({
      title: "Registration Submitted!",
      text: "Please wait for admin approval. A confirmation email will be sent to your SCCPAG address.",
      icon: "success",
      confirmButtonColor: "#3b82f6",
    });

    navigate("/dashboard");
  };

  const isStrongPassword = (password) =>
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/.test(password) ||
    "Password must contain uppercase, lowercase, number, and special character.";

  const isValidSCCPAGEmail = (email) =>
    /^[a-z]+\.[a-z]+@sccpag\.edu\.ph$/.test(email) ||
    "Use your institutional email (e.g., name.lastname@sccpag.edu.ph).";

  return (
    <div
      className="min-h-screen bg-cover bg-center flex items-center justify-center relative px-4 py-8"
      style={{
        backgroundImage: `url('https://u7.uidownload.com/vector/234/182/vector-light-blue-abstract-background-eps.jpg')`,
      }}
    >
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />

      <div className="relative z-10 w-full max-w-2xl bg-white/80 backdrop-blur-xl p-8 rounded-xl shadow-2xl space-y-6 animate__animated animate__fadeIn">
        <div className="flex flex-col items-center">
          <img src={syborg_logo} alt="SYBORG" className="w-20 h-20 mb-2" />
          <h2 className="text-2xl font-bold text-gray-800">Create Account</h2>
          <p className="text-gray-600 text-sm">
            Join SYBORG using your SCCPAG email
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label className="block text-gray-700 mb-1">EDP Number</label>
            <input
              autoFocus
              {...register("edp", {
                required: "EDP Number is required.",
                pattern: {
                  value: /^\d{4}-\d{4}$/,
                  message: "EDP Number must be in numeric format.",
                },
              })}
              type="text"
              placeholder="EDP Number"
              className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.edp ? "border-red-500" : "border-gray-300"
              }`}
              onChange={(e) => {
                const val = e.target.value;
                if (/[^0-9-]/.test(val)) {
                  Swal.fire({
                    icon: "error",
                    title: "Invalid Character",
                    text: "Only numbers and a dash (-) are allowed in the EDP Number.",
                    confirmButtonColor: "#3b82f6",
                  });
                  e.target.value = val.replace(/[^0-9-]/g, "");
                }
              }}
            />
            {errors.edp && (
              <p className="text-sm text-red-600 mt-1">{errors.edp.message}</p>
            )}
          </div>

          <div>
            <label className="block text-gray-700 mb-1">First Name</label>
            <input
              {...register("firstname", {
                required: "First Name is required.",
              })}
              type="text"
              placeholder="First Name"
              className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.firstname ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.firstname && (
              <p className="text-sm text-red-600 mt-1">
                {errors.firstname.message}
              </p>
            )}
          </div>

          {/* Middle Name */}
          <div>
            <label className="block text-gray-700 mb-1">Middle Name</label>
            <input
              {...register("middlename", {
                required: "Middle Name is required.",
              })}
              type="text"
              placeholder="Middle Name"
              className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.middlename ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.middlename && (
              <p className="text-sm text-red-600 mt-1">
                {errors.middlename.message}
              </p>
            )}
          </div>

          {/* Last Name */}
          <div>
            <label className="block text-gray-700 mb-1">Last Name</label>
            <input
              {...register("lastname", { required: "Last Name is required." })}
              type="text"
              placeholder="Last Name"
              className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.lastname ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.lastname && (
              <p className="text-sm text-red-600 mt-1">
                {errors.lastname.message}
              </p>
            )}
          </div>

          {/* Course (ComboBox) */}
          <div>
            <label className="block text-gray-700 mb-1 cursor-pointer">
              Course
            </label>
            <select
              {...register("course", { required: "Course is required." })}
              className={`cursor-pointer w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.course ? "border-red-500" : "border-gray-300"
              }`}
            >
              <option value="">-- Select your course --</option>
              <option value="Bachelor of Science in Computer Science">
                BSCS - Bachelor of Science in Computer Science
              </option>
              <option value="Bachelor in Library and Information Science">
                BLIS - Bachelor in Library and Information Science
              </option>
              <option value="Bachelor of Science in Information Systems">
                BSIS - Bachelor of Science in Information Systems
              </option>
            </select>
            {errors.course && (
              <p className="text-sm text-red-600 mt-1">
                {errors.course.message}
              </p>
            )}
          </div>

          {/* Year Level (ComboBox) */}
          <div>
            <label className="block text-gray-700 mb-1 cursor-pointer">
              Year Level
            </label>
            <select
              {...register("year", { required: "Year level is required." })}
              className={`cursor-pointer w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.year ? "border-red-500" : "border-gray-300"
              }`}
            >
              <option value="">-- Select your year level --</option>
              <option value="1st Year">1st Year</option>
              <option value="2nd Year">2nd Year</option>
              <option value="3rd Year">3rd Year</option>
              <option value="4th Year">4th Year</option>
            </select>
            {errors.year && (
              <p className="text-sm text-red-600 mt-1">{errors.year.message}</p>
            )}
          </div>

          {/* Status (ComboBox) */}
          <div>
            <label className="block text-gray-700 mb-1 cursor-pointer">
              Status
            </label>
            <select
              {...register("status", { required: "Status is required." })}
              className={`cursor-pointer w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.status ? "border-red-500" : "border-gray-300"
              }`}
            >
              <option value="">-- Select your status --</option>
              <option value="Regular Student">Regular Student</option>
              <option value="Irregular Student">Irregular Student</option>
            </select>
            {errors.status && (
              <p className="text-sm text-red-600 mt-1">
                {errors.status.message}
              </p>
            )}
          </div>

          {/* Gender (ComboBox) */}
          <div>
            <label className="block text-gray-700 mb-1 cursor-pointer">
              Gender
            </label>
            <select
              {...register("gender", { required: "Gender is required." })}
              className={`cursor-pointer w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.gender ? "border-red-500" : "border-gray-300"
              }`}
            >
              <option value="">-- Select your gender --</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Prefer not to say">Prefer not to say</option>
            </select>
            {errors.gender && (
              <p className="text-sm text-red-600 mt-1">
                {errors.gender.message}
              </p>
            )}
          </div>

          {/* Age */}
          <div>
            <label className="block text-gray-700 mb-1">Age</label>
            <input
              {...register("age", {
                required: "Age is required.",
                min: { value: 1, message: "Age must be at least 1." },
              })}
              type="number"
              placeholder="Age"
              className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.age ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.age && (
              <p className="text-sm text-red-600 mt-1">{errors.age.message}</p>
            )}
          </div>

          {/* Birthday */}
          <div>
            <label className="block text-gray-700 mb-1">Birthday</label>
            <input
              {...register("birthday", {
                required: "Birthday is required.",
              })}
              type="date"
              className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.birthday ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.birthday && (
              <p className="text-sm text-red-600 mt-1">
                {errors.birthday.message}
              </p>
            )}
          </div>

          {/* Contact Number */}
          <div>
            <label className="block text-gray-700 mb-1">Contact Number</label>
            <input
              {...register("contact", {
                required: "Contact number is required.",
                pattern: {
                  value: /^09\d{9}$/,
                  message: "Enter a valid PH number (e.g. 09123456789)",
                },
              })}
              type="text"
              placeholder="Contact Number"
              className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.contact ? "border-red-500" : "border-gray-300"
              }`}
              onChange={(e) => {
                const val = e.target.value;
                if (/[^0-9]/.test(val)) {
                  Swal.fire({
                    icon: "error",
                    title: "Invalid Character",
                    text: "Only numeric values are allowed for Contact Number.",
                    confirmButtonColor: "#3b82f6",
                  });
                  e.target.value = val.replace(/[^0-9]/g, "");
                }
              }}
            />

            {errors.contact && (
              <p className="text-sm text-red-600 mt-1">
                {errors.contact.message}
              </p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-gray-700 mb-1">SCCPAG Email</label>
            <div className="relative">
              <HiOutlineMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                {...register("email", {
                  required: "Email is required.",
                  validate: (value) =>
                    /^[a-z]+\.[a-z]+@sccpag\.edu\.ph$/.test(value) ||
                    "Use your institutional email (e.g., name.lastname@sccpag.edu.ph).",
                })}
                type="email"
                className={`w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.email ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="SCCPAG Email"
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
                  required: "Password is required.",
                  validate: isStrongPassword,
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
          {/* Profile Picture */}
          <div>
            <label className="block text-gray-700 mb-1">Profile Picture</label>
            <input
              {...register("profilepicture", {
                required: "Profile picture is required.",
              })}
              type="file"
              accept="image/*"
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.profilepicture && (
              <p className="text-sm text-red-600 mt-1">
                {errors.profilepicture.message}
              </p>
            )}
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 text-white py-2 rounded-md font-semibold hover:bg-blue-700 transition-all duration-300 disabled:opacity-60"
          >
            {isSubmitting ? "Registering..." : "Register"}
          </button>
        </form>
        <div className="text-center pt-4">
          <p className="text-sm text-gray-700">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-blue-600 hover:underline font-semibold"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
