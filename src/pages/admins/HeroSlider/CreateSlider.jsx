import React, { useEffect, useMemo, useRef, useState } from "react";
import AdminSidebar from "../../../components/AdminSidebar";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import JoditEditor from "jodit-react";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { token } from "../../../utils/GetToken";

const stripHtml = (html) => {
  const tmp = document.createElement("DIV");
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || "";
};

const CreateSlider = ({ placeholder }) => {
  const [loading, setLoading] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [imageId, setImageID] = useState(null);

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
    formState: { errors },
    setError,
    clearErrors,
  } = useForm();

  const editor = useRef(null);
  const [content, setContent] = useState("");
  const imageFile = watch("image");

  const navigate = useNavigate();

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
      const confirmResult = await Swal.fire({
        title: "Are you sure?",
        text: "Do you want to save this hero slider content?",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Yes, save it!",
        cancelButtonText: "Cancel",
      });

      if (!confirmResult.isConfirmed) {
        setLoading(false);
        return;
      }

      Swal.fire({
        title: "Saving...",
        allowOutsideClick: false,
        allowEscapeKey: false,
        didOpen: () => Swal.showLoading(),
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
        navigate("/admin/hero");
      } else {
        if (result.errors) {
          Object.entries(result.errors).forEach(([field, messages]) => {
            toast.error(`${field}: ${messages[0]}`);
          });
        } else {
          toast.error(result.message || "Something went wrong.");
        }
      }
    } catch (error) {
      Swal.close();
      setLoading(false);
      toast.error("An error occurred. Please try again.");
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
      console.log("Upload response (raw):", result);

      // if (result.status === false) {
      //   toast.error(result.errors.image[0]);
      //   setPreviewUrl(null);
      // } else {
      //   // toast.success("Image uploaded successfully.");
      //   setImageID(result.data.id);
      // }

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

  return (
    <div>
      <main className="px-4 py-8 md:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Sidebar */}
            <div className="md:w-1/4">
              <h1>Admin Dashboard</h1>
              <AdminSidebar />
            </div>

            {/* Dashboard Content */}
            <div className="md:w-3/4 w-full">
              <div className="bg-white shadow rounded-lg p-6 animate-fade-in">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-lg font-semibold">
                    Hero Slider / Create
                  </h4>
                  <Link
                    to="/admin/hero"
                    className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded transition"
                  >
                    Back
                  </Link>
                </div>
                <hr className="my-4" />

                <form
                  onSubmit={handleSubmit(onSubmit, onInvalid)}
                  className={`${
                    loading ? "pointer-events-none opacity-50" : ""
                  }`}
                >
                  {/* Title */}
                  <div className="mb-4">
                    <label
                      htmlFor="title"
                      className="cursor-pointer block text-sm font-medium mb-1"
                    >
                      Title *
                    </label>
                    <input
                      {...register("title", {
                        required: "The title field is required.",
                      })}
                      autoFocus
                      id="title"
                      type="text"
                      className={`w-full px-4 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 ${
                        errors.title
                          ? "border-red-500 focus:ring-red-500"
                          : "border-gray-300 focus:ring-blue-500"
                      }`}
                      placeholder="Title"
                    />
                    {errors.title && (
                      <p className="text-sm text-red-600 mt-1">
                        {errors.title?.message}
                      </p>
                    )}
                  </div>
                  {/* Description */}
                  <div className="mb-4">
                    <label
                      className="cursor-pointer block text-sm font-medium mb-1"
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
                          : "border-gray-300 focus:ring-blue-500"
                      }`}
                      placeholder="Description"
                    />
                    {errors.description && (
                      <p className="text-sm text-red-600 mt-1">
                        {errors.title?.message}
                      </p>
                    )}
                  </div>
                  {/* Content */}
                  <div className="mb-4">
                    <label
                      htmlFor="content"
                      className="block text-sm font-medium mb-1"
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
                  <div className="mb-4">
                    <label
                      htmlFor="image"
                      className="block text-sm font-medium mb-1 text-gray-700"
                    >
                      Image *
                    </label>

                    <div
                      className={`relative border-2 border-dashed rounded-lg text-center transition-all hover:border-blue-400 hover:bg-blue-50 ${
                        errors.image ? "border-red-500" : "border-gray-300"
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
                        {...register("image", {
                          onChange: handleFile,
                        })}
                        className={`absolute inset-0 opacity-0 w-full h-full z-10 ${
                          imageLoading ? "cursor-not-allowed" : "cursor-pointer"
                        }`}
                        disabled={imageLoading}
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

                    {errors.image && (
                      <p className="text-sm text-red-600 mt-2">
                        {errors.image.message}
                      </p>
                    )}
                  </div>
                  <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md text-sm font-semibold flex items-center gap-2 disabled:opacity-60 cursor-pointer"
                    disabled={loading || imageLoading}
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
                        {imageLoading ? "Uploading Image..." : "Submitting..."}
                      </>
                    ) : (
                      "Submit"
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CreateSlider;
