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
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";

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
      console.log("Upload response (raw):", result);

      if (result.status === true && result.data && result.data.id) {
        setImageID(result.data.id);
        // toast.success("Profile picture uploaded successfully.");
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

    try {
      const confirm = await Swal.fire({
        title: "Are you sure?",
        text: "Do you want to submit your registration?",
        icon: "question",
        backdrop: true,
        showCancelButton: true,
        confirmButtonColor: "#3b82f6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, submit it!",
        didOpen: () => {
          // Swal.showLoading();
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

      Swal.fire({
        title: "Submitting...",
        allowOutsideClick: false,
        allowEscapeKey: false,
        backdrop: true,
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
        await Swal.fire({
          title: "Registration Submitted!",
          text: "Please wait for admin approval. A confirmation email will be sent to your SCCPAG address.",
          icon: "success",
          confirmButtonColor: "#3b82f6",
        });
        navigate("/login");
      } else {
        if (result.errors) {
          Object.entries(result.errors).forEach(([field, messages]) => {
            Swal.fire({
              icon: "error",
              title: "Validation Error",
              text: `${field}: ${messages[0]}`,
              confirmButtonColor: "#3b82f6",
            });
            // field.autoFocus();
          });
          setLoading(false);
          return;
        } else {
          Swal.fire({
            icon: "error",
            title: "Registration Failed",
            text: result.message || "Something went wrong.",
            confirmButtonColor: "#3b82f6",
          });
          setLoading(false);
          return;
        }
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Server Error",
        text: "An error occurred. Please try again.",
        confirmButtonColor: "#3b82f6",
      });
      console.error(error);
    }

    // await Swal.fire({
    //   title: "Registration Submitted!",
    //   text: "Please wait for admin approval. A confirmation email will be sent to your SCCPAG address.",
    //   icon: "success",
    //   confirmButtonColor: "#3b82f6",
    // });

    // navigate("/dashboard");
  };

  const isStrongPassword = (password) =>
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/.test(password) ||
    "Password must contain uppercase, lowercase, number, and special character.";

  const isValidSCCPAGEmail = (email) =>
    /^[a-z]+\.[a-z]+@sccpag\.edu\.ph$/.test(email) ||
    "Use your institutional email (e.g., name.lastname@sccpag.edu.ph).";

  return (
    <div
      className="min-h-screen bg-cover bg-center flex items-center justify-center relative px-4 py-8 "
      style={{
        backgroundImage: `url('https://u7.uidownload.com/vector/234/182/vector-light-blue-abstract-background-eps.jpg')`,
      }}
    >
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />

      <div className="relative z-10 w-full max-w-2xl bg-white/100 backdrop-blur-xl p-8 rounded-xl shadow-2xl space-y-6 animate__animated animate__fadeIn">
        <div className="flex flex-col items-center">
          <img src={syborg_logo} alt="SYBORG" className="w-20 h-20 mb-2" />
          <h2 className="text-2xl font-bold text-gray-800">Create Account</h2>
          <p className="text-gray-600 text-sm">
            Join SYBORG using your SCCPAG email
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label
              htmlFor="edp"
              className="cursor-pointer block text-gray-700 mb-1"
            >
              EDP Number <span className="text-red-500">*</span>
            </label>

            <input
              id="edp"
              autoFocus
              {...register("edp", {
                required: "EDP Number is required.",
                // pattern: {
                //   value: /^\d{4}-\d{4}$/,
                //   message: "EDP Number must be in numeric format.",
                // },
              })}
              type="number"
              placeholder="EDP Number"
              className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.edp ? "border-red-500" : "border-gray-300"
              }`}
              // onChange={(e) => {
              //   const val = e.target.value;
              //   if (/[^0-9-]/.test(val)) {
              //     Swal.fire({
              //       icon: "error",
              //       title: "Invalid Character",
              //       text: "Only numbers are allowed in the EDP Number.",
              //       confirmButtonColor: "#3b82f6",
              //     });
              //     e.target.value = val.replace(/[^0-9-]/g, "");
              //   }
              // }}
            />
            {errors.edp && (
              <p className="text-sm text-red-600 mt-1">{errors.edp.message}</p>
            )}
          </div>

          {/* First Name */}
          <div>
            <label
              htmlFor="firstname"
              className="cursor-pointer block text-gray-700 mb-1"
            >
              First Name <span className="text-red-500">*</span>
            </label>
            <input
              {...register("firstname", {
                required: "First Name is required.",
              })}
              id="firstname"
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
            <label
              htmlFor="middlename"
              className="cursor-pointer block text-gray-700 mb-1"
            >
              Middle Name <span className="text-red-500">*</span>
            </label>
            <input
              {...register("middlename", {
                required: "Middle Name is required.",
              })}
              id="middlename"
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
            <label
              htmlFor="lastname"
              className="cursor-pointer block text-gray-700 mb-1"
            >
              Last Name <span className="text-red-500">*</span>
            </label>
            <input
              id="lastname"
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
            <label
              htmlFor="course"
              className=" block text-gray-700 mb-1 cursor-pointer"
            >
              Course <span className="text-red-500">*</span>
            </label>
            <select
              id="course"
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
            <label
              htmlFor="year"
              className="block text-gray-700 mb-1 cursor-pointer"
            >
              Year Level <span className="text-red-500">*</span>
            </label>
            <select
              id="year"
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
            <label
              htmlFor="status"
              className="block text-gray-700 mb-1 cursor-pointer"
            >
              Status <span className="text-red-500">*</span>
            </label>
            <select
              id="status"
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
            <label
              htmlFor="gender"
              className="block text-gray-700 mb-1 cursor-pointer"
            >
              Gender <span className="text-red-500">*</span>
            </label>
            <select
              id="gender"
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
            <label
              htmlFor="age"
              className="cursor-pointer block text-gray-700 mb-1"
            >
              Age <span className="text-red-500">*</span>
            </label>
            <input
              id="age"
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
            <label
              htmlFor="birth"
              className="cursor-pointer block text-gray-700 mb-1"
            >
              Birthday <span className="text-red-500">*</span>
            </label>
            <input
              id="birth"
              type="date"
              max="9999-12-31"
              min="1900-01-01"
              {...register("birthday", {
                required: "Birthday is required.",
              })}
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
            <label
              htmlFor="contact"
              className="cursor-pointer block text-gray-700 mb-1"
            >
              Contact Number <span className="text-red-500">*</span>
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
              className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.contact ? "border-red-500" : "border-gray-300"
              }`}
              // onChange={(e) => {
              //   const val = e.target.value;
              //   if (/[^0-9]/.test(val)) {
              //     Swal.fire({
              //       icon: "error",
              //       title: "Invalid Character",
              //       text: "Only numeric values are allowed for Contact Number.",
              //       confirmButtonColor: "#3b82f6",
              //     });
              //     e.target.value = val.replace(/[^0-9]/g, "");
              //   }
              // }}
            />

            {errors.contact && (
              <p className="text-sm text-red-600 mt-1">
                {errors.contact.message}
              </p>
            )}
          </div>

          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="cursor-pointer block text-gray-700 mb-1"
            >
              SCCPAG Email <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <HiOutlineMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                id="email"
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
            <label
              htmlFor="password"
              className="cursor-pointer block text-gray-700 mb-1"
            >
              Password <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <HiOutlineLockClosed className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                id="password"
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
          <div className="mb-4">
            <label
              htmlFor="image"
              className="cursor-pointer block text-gray-700 mb-1"
            >
              Profile Picture <span className="text-red-500">*</span>
            </label>

            <div
              className={`relative border-2 border-dashed rounded-lg text-center transition-all hover:border-blue-400 hover:bg-blue-50 ${
                errors.profilepicture ? "border-red-500" : "border-gray-300"
              }`}
              style={{
                width: "250px",
                height: "250px",
                position: "relative",
                overflow: "hidden",
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
                  // onChange: (e) => setImageFile(e.target.files),
                  onChange: handleFile,
                })}
                className={`absolute inset-0 opacity-0 w-full h-full z-10 cursor-pointer`}
              />

              <div className="flex flex-col items-center justify-center text-gray-500 w-full h-full p-4 z-0">
                {imageFile && imageFile.length > 0 ? (
                  <img
                    src={URL.createObjectURL(imageFile[0])}
                    alt="Preview"
                    className="object-cover w-full h-full rounded-lg"
                  />
                ) : (
                  <>
                    <svg
                      className="w-10 h-10 mb-2 text-blue-400"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3 16l4-4a3 3 0 014 0l4 4M13 12l4-4a3 3 0 014 0l1 1m-6 13H6a2 2 0 01-2-2V5a2 2 0 012-2h9a2 2 0 012 2v1"
                      />
                    </svg>
                    <p className="text-sm">
                      Click or drag file to upload <br />
                      <span className="text-xs text-gray-400">
                        (JPG, PNG, or GIF)
                      </span>
                    </p>
                  </>
                )}
              </div>
            </div>

            {errors.profilepicture && (
              <p className="text-sm text-red-600 mt-2">
                {errors.profilepicture.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md text-sm font-semibold flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer w-full"
            disabled={loading || imageLoading || isSubmitting}
          >
            {loading || imageLoading || isSubmitting ? (
              <>
                <svg
                  className="animate-spin h-4 w-4 text-white"
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
