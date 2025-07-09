import React, { useState } from "react";
import { useForm } from "react-hook-form";
import {
  HiOutlineMail,
  HiOutlineLockClosed,
  HiOutlineUser,
  HiEye,
  HiEyeOff,
} from "react-icons/hi";
import syborg_logo from "../../assets/images/syborg_logo.png";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
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

const Register = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ mode: "onChange" });

  const [showPassword, setShowPassword] = useState(false);
  const [imageFile, setImageFile] = useState([]);
  const [loading, setLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [imageLoading, setImageLoading] = useState(false);
  const [imageId, setImageID] = useState(null);

  const togglePassword = () => setShowPassword(!showPassword);
  const navigate = useNavigate();

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

  const handleFile = async (e) => {
    setImageLoading(true);
    const file = e.target.files[0];

    if (!file) {
      toast.error("No file selected.");
      setImageLoading(false);
      return;
    }

    const allowedTypes = ["image/png", "image/jpeg", "image/jpg", "image/gif"];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Only PNG, JPG, JPEG, and GIF files are allowed.");
      e.target.value = "";
      setImageLoading(false);
      return;
    }

    setImageFile([file]);
    setPreviewUrl(URL.createObjectURL(file));

    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await fetch(
        `${import.meta.env.VITE_LARAVEL_API}/student-profile-picture`,
        {
          method: "POST",
          headers: {
            Accept: "application/json",
          },
          body: formData,
        }
      );

      const result = await res.json();

      if (result.status === true && result.data && result.data.id) {
        setImageID(result.data.id);
      } else {
        toast.error(
          result?.errors?.image?.[0] || result.message || "Upload failed."
        );
        setPreviewUrl(null);
        setImageFile([]);
      }
    } catch (error) {
      toast.error("Failed to upload image.");
      console.error(error);
      setPreviewUrl(null);
      setImageFile([]);
    } finally {
      setImageLoading(false);
    }
  };

  const onSubmit = async (data) => {
    setLoading(true);

    const formData = new FormData();
    formData.append("edp_number", data.edp);
    formData.append("firstname", data.firstname);
    formData.append("middlename", data.middlename);
    formData.append("lastname", data.lastname);
    formData.append("course", data.course);
    formData.append("year_level", data.year);
    formData.append("status", data.status);
    formData.append("gender", data.gender);
    formData.append("age", data.age);
    formData.append("birthday", data.birthday);
    formData.append("contact_number", data.contact);
    formData.append("email", data.email);
    formData.append("password", data.password);
    formData.append("profilepicture", imageFile[0]);
    if (imageId) formData.append("imageId", imageId);

    const MySwal = withReactContent(Swal);

    try {
      const confirm = await MySwal.fire({
        title: "Are you sure?",
        text: "Do you want to submit your registration?",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Yes, approve",
        cancelButtonText: "Cancel",
        backdrop: true,
        background: colors.lightBg,
        color: colors.text,
        confirmButtonColor: colors.primary,
        cancelButtonColor: colors.lightText,
        backdrop: `
      rgba(0,0,0,0.7)
      url("/images/loading.gif")
      center top
      no-repeat
    `,
        didOpen: () => {
          document.body.style.overflow = "auto";
        },
        willClose: () => {
          document.body.style.overflow = "";
        },
      });

      if (!confirm.isConfirmed) {
        setLoading(false);
        return;
      }

      MySwal.fire({
        title: "Submitting...",
        allowOutsideClick: false,
        allowEscapeKey: false,
        backdrop: true,
        background: colors.lightBg,
        color: colors.text,
        confirmButtonColor: colors.primary,
        cancelButtonColor: colors.lightText,
        backdrop: `
      rgba(0,0,0,0.7)
      url("/images/loading.gif")
      center top
      no-repeat
    `,
        didOpen: () => {
          Swal.showLoading();
          document.body.style.overflow = "auto";
        },
        willClose: () => {
          document.body.style.overflow = "";
        },
      });

      const res = await fetch(`${import.meta.env.VITE_LARAVEL_API}/register`, {
        method: "POST",
        headers: {
          Accept: "application/json",
        },
        body: formData,
      });

      const result = await res.json();
      Swal.close();

      if (result.status === true || res.ok) {
        await MySwal.fire({
          title: "Registration Submitted!",
          text: "Please wait for admin approval. A confirmation email will be sent to your SCCPAG address.",
          icon: "success",
          iconColor: colors.success,
          confirmButtonColor: colors.primary,
          cancelButtonColor: colors.lightText,
          backdrop: `
                rgba(0,0,0,0.7)
                url("/images/loading.gif")
                center top
                no-repeat
              `,
          didOpen: () => {
            // Swal.showLoading();
            document.body.style.overflow = "auto";
          },
          // willClose: () => {
          //   document.body.style.overflow = "";
          // },
        });
        navigate("/login");
      } else {
        if (result.errors) {
          Object.entries(result.errors).forEach(([field, messages]) => {
            MySwal.fire({
              icon: "error",
              title: "Validation Error",
              text: `${field}: ${messages[0]}`,
              iconColor: colors.danger,
            });
          });
          setLoading(false);
          return;
        } else {
          MySwal.fire({
            icon: "error",
            title: "Registration Failed",
            text: result.message || "Something went wrong.",
            iconColor: colors.danger,
          });
          setLoading(false);
          return;
        }
      }
    } catch (error) {
      Swal.close();
      MySwal.fire({
        icon: "error",
        title: "Server Error",
        text: "An error occurred. Please try again.",
        iconColor: colors.danger,
      });
      console.error(error);
    }
  };

  const isStrongPassword = (password) =>
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/.test(password) ||
    "Password must contain uppercase, lowercase, number, and special character.";

  const isValidSCCPAGEmail = (email) =>
    /^[a-z]+\.[a-z]+@sccpag\.edu\.ph$/.test(email) ||
    "Use your institutional email (e.g., name.lastname@sccpag.edu.ph).";

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-8"
      style={{ backgroundColor: colors.lightBg }}
    >
      <div
        className="w-full max-w-2xl p-8 rounded-xl shadow-lg animate__animated animate__fadeIn"
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
            Create Account
          </h2>
          <p className="text-sm" style={{ color: colors.lightText }}>
            Join SYBORG using your SCCPAG email
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 mt-6">
          {/* EDP Number */}
          <div>
            <label
              htmlFor="edp"
              className="block mb-1 text-sm font-medium"
              style={{ color: colors.text }}
            >
              EDP Number <span style={{ color: colors.danger }}>*</span>
            </label>
            <input
              id="edp"
              autoFocus
              {...register("edp", {
                required: "EDP Number is required.",
              })}
              type="number"
              placeholder="EDP Number"
              className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                errors.edp
                  ? "border-red-500 focus:ring-red-500"
                  : `border-${colors.border} focus:ring-${colors.primary}`
              }`}
              style={{
                borderColor: errors.edp ? colors.danger : colors.border,
              }}
            />
            {errors.edp && (
              <p className="text-sm mt-1" style={{ color: colors.danger }}>
                {errors.edp.message}
              </p>
            )}
          </div>

          {/* Name Fields */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* First Name */}
            <div>
              <label
                htmlFor="firstname"
                className="block mb-1 text-sm font-medium"
                style={{ color: colors.text }}
              >
                First Name <span style={{ color: colors.danger }}>*</span>
              </label>
              <input
                {...register("firstname", {
                  required: "First Name is required.",
                })}
                id="firstname"
                type="text"
                placeholder="First Name"
                className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                  errors.firstname
                    ? "border-red-500 focus:ring-red-500"
                    : `border-${colors.border} focus:ring-${colors.primary}`
                }`}
                style={{
                  borderColor: errors.firstname ? colors.danger : colors.border,
                }}
              />
              {errors.firstname && (
                <p className="text-sm mt-1" style={{ color: colors.danger }}>
                  {errors.firstname.message}
                </p>
              )}
            </div>

            {/* Middle Name */}
            <div>
              <label
                htmlFor="middlename"
                className="block mb-1 text-sm font-medium"
                style={{ color: colors.text }}
              >
                Middle Name <span style={{ color: colors.danger }}>*</span>
              </label>
              <input
                {...register("middlename", {
                  required: "Middle Name is required.",
                })}
                id="middlename"
                type="text"
                placeholder="Middle Name"
                className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                  errors.middlename
                    ? "border-red-500 focus:ring-red-500"
                    : `border-${colors.border} focus:ring-${colors.primary}`
                }`}
                style={{
                  borderColor: errors.middlename
                    ? colors.danger
                    : colors.border,
                }}
              />
              {errors.middlename && (
                <p className="text-sm mt-1" style={{ color: colors.danger }}>
                  {errors.middlename.message}
                </p>
              )}
            </div>

            {/* Last Name */}
            <div>
              <label
                htmlFor="lastname"
                className="block mb-1 text-sm font-medium"
                style={{ color: colors.text }}
              >
                Last Name <span style={{ color: colors.danger }}>*</span>
              </label>
              <input
                id="lastname"
                {...register("lastname", {
                  required: "Last Name is required.",
                })}
                type="text"
                placeholder="Last Name"
                className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                  errors.lastname
                    ? "border-red-500 focus:ring-red-500"
                    : `border-${colors.border} focus:ring-${colors.primary}`
                }`}
                style={{
                  borderColor: errors.lastname ? colors.danger : colors.border,
                }}
              />
              {errors.lastname && (
                <p className="text-sm mt-1" style={{ color: colors.danger }}>
                  {errors.lastname.message}
                </p>
              )}
            </div>
          </div>

          {/* Course, Year, Status */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Course */}
            <div>
              <label
                htmlFor="course"
                className="block mb-1 text-sm font-medium"
                style={{ color: colors.text }}
              >
                Course <span style={{ color: colors.danger }}>*</span>
              </label>
              <select
                id="course"
                {...register("course", { required: "Course is required." })}
                className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                  errors.course
                    ? "border-red-500 focus:ring-red-500"
                    : `border-${colors.border} focus:ring-${colors.primary}`
                }`}
                style={{
                  borderColor: errors.course ? colors.danger : colors.border,
                }}
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
                <p className="text-sm mt-1" style={{ color: colors.danger }}>
                  {errors.course.message}
                </p>
              )}
            </div>

            {/* Year Level */}
            <div>
              <label
                htmlFor="year"
                className="block mb-1 text-sm font-medium"
                style={{ color: colors.text }}
              >
                Year Level <span style={{ color: colors.danger }}>*</span>
              </label>
              <select
                id="year"
                {...register("year", { required: "Year level is required." })}
                className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                  errors.year
                    ? "border-red-500 focus:ring-red-500"
                    : `border-${colors.border} focus:ring-${colors.primary}`
                }`}
                style={{
                  borderColor: errors.year ? colors.danger : colors.border,
                }}
              >
                <option value="">-- Select your year level --</option>
                <option value="1st Year">1st Year</option>
                <option value="2nd Year">2nd Year</option>
                <option value="3rd Year">3rd Year</option>
                <option value="4th Year">4th Year</option>
              </select>
              {errors.year && (
                <p className="text-sm mt-1" style={{ color: colors.danger }}>
                  {errors.year.message}
                </p>
              )}
            </div>

            {/* Status */}
            <div>
              <label
                htmlFor="status"
                className="block mb-1 text-sm font-medium"
                style={{ color: colors.text }}
              >
                Status <span style={{ color: colors.danger }}>*</span>
              </label>
              <select
                id="status"
                {...register("status", { required: "Status is required." })}
                className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                  errors.status
                    ? "border-red-500 focus:ring-red-500"
                    : `border-${colors.border} focus:ring-${colors.primary}`
                }`}
                style={{
                  borderColor: errors.status ? colors.danger : colors.border,
                }}
              >
                <option value="">-- Select your status --</option>
                <option value="Regular Student">Regular Student</option>
                <option value="Irregular Student">Irregular Student</option>
              </select>
              {errors.status && (
                <p className="text-sm mt-1" style={{ color: colors.danger }}>
                  {errors.status.message}
                </p>
              )}
            </div>
          </div>

          {/* Personal Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Gender */}
            <div>
              <label
                htmlFor="gender"
                className="block mb-1 text-sm font-medium"
                style={{ color: colors.text }}
              >
                Gender <span style={{ color: colors.danger }}>*</span>
              </label>
              <select
                id="gender"
                {...register("gender", { required: "Gender is required." })}
                className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                  errors.gender
                    ? "border-red-500 focus:ring-red-500"
                    : `border-${colors.border} focus:ring-${colors.primary}`
                }`}
                style={{
                  borderColor: errors.gender ? colors.danger : colors.border,
                }}
              >
                <option value="">-- Select your gender --</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Prefer not to say">Prefer not to say</option>
              </select>
              {errors.gender && (
                <p className="text-sm mt-1" style={{ color: colors.danger }}>
                  {errors.gender.message}
                </p>
              )}
            </div>

            {/* Age */}
            <div>
              <label
                htmlFor="age"
                className="block mb-1 text-sm font-medium"
                style={{ color: colors.text }}
              >
                Age <span style={{ color: colors.danger }}>*</span>
              </label>
              <input
                id="age"
                {...register("age", {
                  required: "Age is required.",
                  min: { value: 1, message: "Age must be at least 1." },
                })}
                type="number"
                placeholder="Age"
                className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                  errors.age
                    ? "border-red-500 focus:ring-red-500"
                    : `border-${colors.border} focus:ring-${colors.primary}`
                }`}
                style={{
                  borderColor: errors.age ? colors.danger : colors.border,
                }}
              />
              {errors.age && (
                <p className="text-sm mt-1" style={{ color: colors.danger }}>
                  {errors.age.message}
                </p>
              )}
            </div>

            {/* Birthday */}
            <div>
              <label
                htmlFor="birth"
                className="block mb-1 text-sm font-medium"
                style={{ color: colors.text }}
              >
                Birthday <span style={{ color: colors.danger }}>*</span>
              </label>
              <input
                id="birth"
                type="date"
                max="9999-12-31"
                min="1900-01-01"
                {...register("birthday", {
                  required: "Birthday is required.",
                })}
                className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                  errors.birthday
                    ? "border-red-500 focus:ring-red-500"
                    : `border-${colors.border} focus:ring-${colors.primary}`
                }`}
                style={{
                  borderColor: errors.birthday ? colors.danger : colors.border,
                }}
              />
              {errors.birthday && (
                <p className="text-sm mt-1" style={{ color: colors.danger }}>
                  {errors.birthday.message}
                </p>
              )}
            </div>
          </div>

          {/* Contact and Email */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Contact Number */}
            <div>
              <label
                htmlFor="contact"
                className="block mb-1 text-sm font-medium"
                style={{ color: colors.text }}
              >
                Contact Number <span style={{ color: colors.danger }}>*</span>
              </label>
              <input
                id="contact"
                {...register("contact", {
                  required: "Contact number is required.",
                  pattern: {
                    value: /^09\d{9}$/,
                    message: "Enter a valid PH number (e.g. 09123456789)",
                  },
                })}
                type="number"
                placeholder="Contact Number"
                className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                  errors.contact
                    ? "border-red-500 focus:ring-red-500"
                    : `border-${colors.border} focus:ring-${colors.primary}`
                }`}
                style={{
                  borderColor: errors.contact ? colors.danger : colors.border,
                }}
              />
              {errors.contact && (
                <p className="text-sm mt-1" style={{ color: colors.danger }}>
                  {errors.contact.message}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block mb-1 text-sm font-medium"
                style={{ color: colors.text }}
              >
                SCCPAG Email <span style={{ color: colors.danger }}>*</span>
              </label>
              <div className="relative">
                <HiOutlineMail
                  className="absolute left-3 top-1/2 transform -translate-y-1/2"
                  style={{ color: colors.lightText }}
                />
                <input
                  id="email"
                  {...register("email", {
                    required: "Email is required.",
                    validate: isValidSCCPAGEmail,
                  })}
                  type="email"
                  className={`w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                    errors.email
                      ? "border-red-500 focus:ring-red-500"
                      : `border-${colors.border} focus:ring-${colors.primary}`
                  }`}
                  placeholder="SCCPAG Email"
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
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="block mb-1 text-sm font-medium"
              style={{ color: colors.text }}
            >
              Password <span style={{ color: colors.danger }}>*</span>
            </label>
            <div className="relative">
              <HiOutlineLockClosed
                className="absolute left-3 top-1/2 transform -translate-y-1/2"
                style={{ color: colors.lightText }}
              />
              <input
                id="password"
                {...register("password", {
                  required: "Password is required.",
                  validate: isStrongPassword,
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

          {/* Profile Picture */}
          <div>
            <label
              htmlFor="image"
              className="block mb-1 text-sm font-medium"
              style={{ color: colors.text }}
            >
              Profile Picture <span style={{ color: colors.danger }}>*</span>
            </label>
            <div
              className={`relative border-2 border-dashed rounded-lg text-center transition-all ${
                errors.profilepicture
                  ? "border-red-500"
                  : `border-${colors.border} hover:bg-red-100`
              }`}
              style={{
                width: "250px",
                height: "250px",
                position: "relative",
                overflow: "hidden",
                borderColor: errors.profilepicture
                  ? colors.danger
                  : colors.border,
              }}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                const droppedFile = e.dataTransfer.files[0];
                if (droppedFile) {
                  const fileInput = document.getElementById("image");
                  const dataTransfer = new DataTransfer();
                  dataTransfer.items.add(droppedFile);
                  fileInput.files = dataTransfer.files;
                  fileInput.dispatchEvent(
                    new Event("change", { bubbles: true })
                  );
                }
              }}
            >
              <input
                id="image"
                type="file"
                accept="image/png, image/jpeg, image/jpg, image/gif"
                {...register("profilepicture", {
                  required: "Profile picture is required.",
                  onChange: handleFile,
                })}
                className={`absolute inset-0 opacity-0 w-full h-full z-10 ${
                  imageLoading ? "cursor-not-allowed" : "cursor-pointer"
                }`}
                disabled={imageLoading}
              />

              <div
                className="flex flex-col items-center justify-center w-full h-full p-4 z-0"
                style={{ color: colors.lightText }}
              >
                {imageFile && imageFile.length > 0 ? (
                  <img
                    src={URL.createObjectURL(imageFile[0])}
                    alt="Preview"
                    className="object-cover w-full h-full rounded-lg"
                  />
                ) : (
                  <>
                    <svg
                      className="w-10 h-10 mb-2"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      viewBox="0 0 24 24"
                      style={{ color: colors.primary }}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3 16l4-4a3 3 0 014 0l4 4M13 12l4-4a3 3 0 014 0l1 1m-6 13H6a2 2 0 01-2-2V5a2 2 0 012-2h9a2 2 0 012 2v1"
                      />
                    </svg>
                    <p className="text-sm">
                      Click or drag file to upload <br />
                      <span
                        className="text-xs"
                        style={{ color: colors.lightText }}
                      >
                        (JPG, PNG, or GIF)
                      </span>
                    </p>
                  </>
                )}
              </div>
            </div>
            {errors.profilepicture && (
              <p className="text-sm mt-2" style={{ color: colors.danger }}>
                {errors.profilepicture.message}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className={`w-full py-2 rounded-md font-semibold transition-all duration-300 shadow ${
              loading || imageLoading || isSubmitting
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : `bg-${colors.primary} text-white hover:brightness-90 cursor-pointer`
            }`}
            disabled={loading || imageLoading || isSubmitting}
            style={{
              backgroundColor:
                loading || imageLoading || isSubmitting
                  ? colors.border
                  : colors.primary,
            }}
          >
            {loading || imageLoading || isSubmitting ? (
              <>
                <svg
                  className="animate-spin h-4 w-4 text-white inline-block mr-2"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8H4z"
                  ></path>
                </svg>
                {imageLoading
                  ? "Uploading Image..."
                  : isSubmitting || loading
                  ? "Submitting..."
                  : "Loading..."}
              </>
            ) : (
              "Register"
            )}
          </button>
        </form>

        <div className="text-center pt-4">
          <p className="text-sm" style={{ color: colors.lightText }}>
            Already have an account?{" "}
            {loading || imageLoading || isSubmitting ? (
              <span
                className="font-semibold text-gray-400 cursor-not-allowed"
                style={{ pointerEvents: "none" }}
              >
                Login
              </span>
            ) : (
              <Link
                to="/login"
                className="font-semibold hover:underline"
                style={{ color: colors.primary }}
              >
                Login
              </Link>
            )}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
