import React, { useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import JoditEditor from "jodit-react";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { token } from "../../../utils/GetToken";
import { motion } from "framer-motion";

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

function hexToRgb(hex) {
  // Remove # if present
  hex = hex.replace("#", "");

  // Parse r, g, b values
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  return `${r}, ${g}, ${b}`;
}

const CreateSlider = ({ onClose, onSuccess, placeholder }) => {
  const [loading, setLoading] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [imageId, setImageID] = useState(null);

  const titleRef = useRef(null);

  const config = useMemo(
    () => ({
      readonly: false,
      placeholder: placeholder || "Content",
    }),
    [placeholder]
  );

  const {
    register,
    handleSubmit,
    watch,
    trigger,
    setFocus,
    formState: { errors },
    setError,
    clearErrors,
  } = useForm();

  const editor = useRef(null);
  const [content, setContent] = useState("");
  const imageFile = watch("image");

  useEffect(() => {
    setFocus("title");
  }, [setFocus]);

  const getCustomSwal = () => {
    return Swal.mixin({
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

  const onSubmit = async (data) => {
    let hasError = false;
    const plainContent = stripHtml(content);

    if (!plainContent || plainContent.trim() === "") {
      setError("content", {
        type: "manual",
        message: "The content field is required.",
      });
      hasError = true;
    } else {
      clearErrors("content");
    }

    if (!imageFile || imageFile.length === 0) {
      setError("image", {
        type: "manual",
        message: "The image field is required.",
      });
      hasError = true;
    } else {
      clearErrors("image");
    }

    const valid = await trigger(["title", "description"]);
    if (hasError || !valid) return;

    setLoading(true);

    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("description", data.description);
    formData.append("content", content);
    formData.append("image", imageFile[0]);
    if (imageId) formData.append("imageId", imageId);

    try {
      const MySwal = getCustomSwal();
      const confirmResult = await MySwal.fire({
        title: "Are you sure?",
        text: "Do you want to save this hero slider content?",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Yes, save it!",
        cancelButtonText: "Cancel",
        iconColor: colors.info,
        backdrop: true,
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

      if (!confirmResult.isConfirmed) {
        setLoading(false);
        return;
      }

      MySwal.fire({
        title: "Saving...",
        allowOutsideClick: false,
        showConfirmButton: false,
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

      const res = await fetch(
        `${import.meta.env.VITE_LARAVEL_API}/heroslider`,
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token()}`,
          },
          body: formData,
        }
      );

      const result = await res.json();
      Swal.close();
      setLoading(false);

      if (result.status === true) {
        toast.success(result.message);
        onSuccess(); // This will close the modal and refresh the sliders list
      } else {
        if (result.errors) {
          Object.entries(result.errors).forEach(([field, messages]) => {
            toast.error(`${field}: ${messages[0]}`);
          });
        } else {
          toast.error(result.message || "Failed to save slider.");
        }
      }
    } catch (error) {
      Swal.close();
      setLoading(false);
      toast.error("Error occurred while saving slider.");
      console.error(error);
    }
  };

  const onInvalid = (errors) => {
    const plainContent = stripHtml(content);

    if (!plainContent || plainContent.trim() === "") {
      setError("content", {
        type: "manual",
        message: "The content field is required.",
      });
    }

    if (!imageFile || imageFile.length === 0) {
      setError("image", {
        type: "manual",
        message: "The image field is required.",
      });
    }
  };

  useEffect(() => {
    const subscription = watch((value, { name }) => {
      if (name === "image" && value.image?.length) {
        clearErrors("image");
      }
    });
    return () => subscription.unsubscribe();
  }, [watch, clearErrors]);

  const handleFile = async (e) => {
    setImageLoading(true);
    const formData = new FormData();
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

    setPreviewUrl(URL.createObjectURL(file));

    formData.append("image", file);

    try {
      const res = await fetch(
        `${import.meta.env.VITE_LARAVEL_API}/hero-slider-image`,
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token()}`,
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
      }
    } catch (error) {
      toast.error("Failed to upload image.");
      setPreviewUrl(null);
      console.error(error);
    } finally {
      setImageLoading(false);
    }
  };

  const stripHtml = (html) => {
    const tmp = document.createElement("DIV");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  };

  return (
    <div className="p-6">
      <div
        className="top-0 z-10 p-4 shadow-sm mb-6 rounded-xl"
        style={{
          backgroundColor: colors.dark,
          borderBottom: `1px solid ${colors.border}`,
        }}
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center">
            <div className="hidden md:block mr-3">
              <div
                className="w-2 h-8 rounded-full"
                style={{ backgroundColor: colors.primary }}
              ></div>
            </div>
            <div>
              <h4
                className="text-xl md:text-2xl font-bold tracking-tight"
                style={{ color: colors.lightBg }}
              >
                Create New Slider
              </h4>
              <p className="text-sm mt-1" style={{ color: colors.lightBg }}>
                Fill in the details to create a new slider
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            disabled={loading || imageLoading}
            className="group relative flex items-center justify-center px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 overflow-hidden"
            style={{
              backgroundColor:
                loading || imageLoading ? colors.border : colors.primary,
              color: "white",
              boxShadow: `0 2px 4px ${colors.primary}20`,
              maxWidth: "120px",
              opacity: loading || imageLoading ? 0.7 : 1,
              cursor: loading || imageLoading ? "not-allowed" : "pointer",
            }}
          >
            <span className="relative z-10 flex items-center gap-2">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
              Close
            </span>
            {!(loading || imageLoading) && (
              <span
                className="absolute inset-0 transition-all duration-300"
                style={{
                  backgroundColor: "rgba(0,0,0,0)",
                }}
              ></span>
            )}
          </button>
        </div>
      </div>

      <hr className="my-4" style={{ borderColor: colors.border }} />

      <form
        onSubmit={handleSubmit(onSubmit, onInvalid)}
        className={`${
          loading || imageLoading ? "pointer-events-none opacity-50" : ""
        }`}
      >
        {/* Title */}
        <div className="mb-4">
          <label
            htmlFor="title"
            className="cursor-pointer block text-sm font-semibold mb-1 text-gray-700"
          >
            Title *
          </label>
          <input
            {...register("title", {
              required: "The title field is required.",
            })}
            id="title"
            type="text"
            className={`w-full px-4 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 ${
              errors.title
                ? "border-red-500 focus:ring-red-500"
                : `border-gray-300 focus:ring-${colors.primary}`
            }`}
            placeholder="Title"
          />
          {errors.title && (
            <p className="text-sm text-red-600 mt-1">{errors.title?.message}</p>
          )}
        </div>

        {/* Description */}
        <div className="mb-4">
          <label
            className="cursor-pointer block text-sm font-semibold mb-1 text-gray-700"
            htmlFor="description"
          >
            Description *
          </label>
          <input
            {...register("description", {
              required: "The description field is required.",
            })}
            id="description"
            type="text"
            className={`w-full px-4 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 ${
              errors.description
                ? "border-red-500 focus:ring-red-500"
                : `border-gray-300 focus:ring-${colors.primary}`
            }`}
            placeholder="Description"
          />
          {errors.description && (
            <p className="text-sm text-red-600 mt-1">
              {errors.description?.message}
            </p>
          )}
        </div>

        {/* Content */}
        <div className="mb-4">
          <label
            htmlFor="content"
            className="block text-sm font-semibold mb-1 text-gray-700"
          >
            Content *
          </label>
          <JoditEditor
            id="content"
            ref={editor}
            value={content}
            config={config}
            tabIndex={1}
            onChange={(newContent) => {
              setContent(newContent);
              const plainText = stripHtml(newContent);
              if (plainText.trim() !== "") {
                clearErrors("content");
              }
            }}
          />
          {errors.content && (
            <p className="text-sm text-red-600 mt-1">
              {errors.content.message}
            </p>
          )}
        </div>

        {/* Image */}
        <div className="mb-6">
          <label
            htmlFor="image"
            className="block text-sm font-semibold mb-1 text-gray-700"
          >
            Image *
          </label>
          <div
            className={`hover:bg-red-100 relative border-2 border-dashed rounded-lg text-center transition-all hover:border-${
              colors.primary
            } hover:bg-${colors.primary}10 ${
              errors.image ? "border-red-500" : `border-${colors.border}`
            }`}
            style={{
              width: "250px",
              height: "250px",
              position: "relative",
              overflow: "hidden",
              borderColor: errors.image ? colors.danger : colors.border,
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
                fileInput.dispatchEvent(new Event("change", { bubbles: true }));
              }
            }}
          >
            <input
              id="image"
              type="file"
              accept="image/png, image/jpeg, image/jpg, image/gif"
              {...register("image", {
                onChange: handleFile,
              })}
              className={`absolute inset-0 opacity-0 w-full h-full z-10 ${
                imageLoading ? "cursor-not-allowed" : "cursor-pointer"
              }`}
              disabled={imageLoading}
            />

            <div
              className="flex flex-col items-center justify-center  w-full h-full p-4 z-0"
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
          {errors.image && (
            <p className="text-sm text-red-600 mt-2">{errors.image.message}</p>
          )}
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            {/* Help text/status message - left aligned */}
            <div className="text-sm text-gray-500 flex items-center w-full md:w-auto font-semibold">
              <svg
                className="w-4 h-4 mr-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              {errors && Object.keys(errors).length > 0 ? (
                <span className="text-red-500">
                  Please fix the {Object.keys(errors).length} error(s) above
                </span>
              ) : (
                "All fields marked with * are required"
              )}
            </div>

            {/* Action buttons - always right aligned */}
            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto justify-end">
              <button
                type="button"
                onClick={onClose}
                disabled={loading || imageLoading}
                className={`
          px-4 py-2 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 
          transition-all duration-200 border
          ${
            loading || imageLoading
              ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
              : "bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200 hover:shadow-sm cursor-pointer"
          }
        `}
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={loading || imageLoading}
                className={`
    px-4 py-2 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 
    transition-all duration-200 shadow-md
    ${
      loading || imageLoading
        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
        : `bg-${colors.primary} text-white hover:shadow-lg cursor-pointer`
    }
  `}
                style={{
                  backgroundColor:
                    loading || imageLoading ? undefined : colors.primary,
                  boxShadow:
                    loading || imageLoading
                      ? "none"
                      : `0 4px 6px -1px rgba(${hexToRgb(
                          colors.primary
                        )}, 0.2), 0 2px 4px -1px rgba(${hexToRgb(
                          colors.primary
                        )}, 0.1)`,
                  "--hover-color": `color-mix(in srgb, ${colors.primary} 80%, #64748b 20%)`,
                }}
                onMouseEnter={(e) => {
                  if (!loading && !imageLoading) {
                    e.currentTarget.style.backgroundColor = `var(--hover-color)`;
                  }
                }}
                onMouseLeave={(e) => {
                  if (!loading && !imageLoading) {
                    e.currentTarget.style.backgroundColor = colors.primary;
                  }
                }}
              >
                {loading || imageLoading ? (
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
                    {imageLoading ? "Uploading..." : "Processing..."}
                  </>
                ) : (
                  <>Create Slider</>
                )}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreateSlider;
