import React, { useEffect, useState } from "react";
import AdminSidebar from "../../../components/AdminSidebar";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { toast } from "react-toastify";
import { token } from "../../../utils/GetToken";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useNavigate } from "react-router-dom";

const ImagePlaceholder = () => (
  <div className="relative w-12 h-12 bg-gray-300 rounded overflow-hidden animate-pulse">
    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent animate-shimmer" />
  </div>
);

const ShowSlider = () => {
  const [heroSlider, setHeroSlider] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);

  const navigate = useNavigate();

  const fetchHeroSlider = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_LARAVEL_API}/heroslider`,
        {
          method: "GET",
          headers: {
            "Content-type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${token()}`,
          },
        }
      );

      const result = await res.json();
      setHeroSlider(result.data);
    } catch (error) {
      console.error("Error fetching services:", error);
    } finally {
      setLoading(false);
    }
  };

  const deleteHeroSlider = async (id) => {
    if (deleting) return;

    const confirmResult = await MySwal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      //   allowOutsideClick: false,
      //   allowEscapeKey: false,
      backdrop: true,
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
      didOpen: () => {
        // Swal.showLoading();
        document.body.style.overflow = "auto";
      },
      willClose: () => {
        document.body.style.overflow = "";
      },
    });

    if (confirmResult.isConfirmed) {
      setDeleting(true);

      Swal.fire({
        title: "Deleting...",
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

      try {
        const res = await fetch(
          `${import.meta.env.VITE_LARAVEL_API}/heroslider/${id}`,
          {
            method: "DELETE",
            headers: {
              "Content-type": "application/json",
              Accept: "application/json",
              Authorization: `Bearer ${token()}`,
            },
          }
        );

        const result = await res.json();
        Swal.close();

        if (result.status === true) {
          toast.success(result.message);
          await fetchHeroSlider();
        } else {
          toast.error(result.message);
        }
      } catch (error) {
        Swal.close();
        toast.error("An error occurred. Please try again.");
      } finally {
        setDeleting(false);
      }
    }
  };

  useEffect(() => {
    fetchHeroSlider();
  }, []);

  const MySwal = withReactContent(Swal);

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
                  <h4 className="text-lg font-semibold">Hero Slider</h4>
                  {/* <Link
                    to="/admin/create"
                    className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded transition"
                  >
                    + Create
                  </Link> */}

                  <button
                    onClick={() => {
                      if (loading) return;

                      if (heroSlider.length >= 4) {
                        MySwal.fire({
                          icon: "warning",
                          title: "Limit Reached",
                          text: "You can only add up to 4 hero slider items. Please delete an existing one to proceed.",
                          confirmButtonColor: "#3085d6",
                          backdrop: true,
                          didOpen: () => {
                            // Swal.showLoading();
                            document.body.style.overflow = "auto";
                          },
                          willClose: () => {
                            document.body.style.overflow = "";
                          },
                        });
                      } else {
                        navigate("/admin/create");
                      }
                    }}
                    disabled={loading}
                    className={`cursor-pointer text-white text-sm px-4 py-2 rounded transition ${
                      loading
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-blue-600 hover:bg-blue-700"
                    }`}
                  >
                    {loading ? (
                      <div className="flex items-center gap-2">
                        {/* <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> */}
                        Loading...
                      </div>
                    ) : (
                      "+ Create"
                    )}
                  </button>
                </div>
                <hr className="my-4" />

                <div className="overflow-x-auto">
                  <table className="w-full table-auto border-collapse text-sm">
                    <thead className="bg-gray-200 text-gray-700">
                      <tr>
                        <th className="px-4 py-2 text-left">ID</th>
                        <th className="px-4 py-2 text-left">Image</th>
                        <th className="px-4 py-2 text-left">Title</th>
                        <th className="px-4 py-2 text-left">Description</th>
                        <th className="px-4 py-2 text-left">Content</th>
                        <th className="px-4 py-2 text-left">Action</th>
                      </tr>
                    </thead>

                    <tbody>
                      {loading ? (
                        <tr>
                          <td colSpan="5" className="py-10 text-center">
                            <div className="flex flex-col items-center">
                              <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-3"></div>
                              <p className="text-gray-500 font-semibold">
                                Fetching hero slider, please wait...
                              </p>
                            </div>
                          </td>
                        </tr>
                      ) : heroSlider.length === 0 ? (
                        <tr>
                          <td colSpan="5" className="text-center py-5">
                            No hero slider content found.
                          </td>
                        </tr>
                      ) : (
                        heroSlider.map((heroslider) => (
                          <tr
                            key={`service-${heroslider.id}`}
                            className="border-b hover:bg-gray-50"
                          >
                            <td className="px-4 py-2">{heroslider.id}</td>
                            <td className="px-4 py-2 flex items-center gap-2">
                              {heroslider.image ? (
                                <>
                                  {!imgLoaded && <ImagePlaceholder />}
                                  <img
                                    src={`${
                                      import.meta.env.VITE_LARAVEL_FILE_API
                                    }/uploads/Hero_Slider_Image/${
                                      heroslider.image
                                    }`}
                                    alt="hero"
                                    className={`w-12 h-12 object-cover rounded transition-opacity duration-500 ${
                                      imgLoaded
                                        ? "opacity-100"
                                        : "opacity-0 absolute"
                                    }`}
                                    onLoad={() => setImgLoaded(true)}
                                  />
                                </>
                              ) : (
                                <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center text-xs text-gray-500">
                                  N/A
                                </div>
                              )}
                            </td>

                            <td className="px-4 py-2">{heroslider.title}</td>
                            <td className="px-4 py-2">
                              {heroslider.description}
                            </td>
                            <td className="px-4 py-2">{heroslider.content}</td>
                            {/* <td className="px-4 py-2">
                              <span
                                className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                  service.status == 1
                                    ? "bg-green-100 text-green-700"
                                    : "bg-red-100 text-red-700"
                                }`}
                              >
                                {service.status == 1 ? "Active" : "Inactive"}
                              </span>
                            </td> */}
                            <td className="px-4 py-2">
                              <div className="flex gap-2">
                                <Link
                                  //   to={`/admin/services/edit/${service.id}`}
                                  className="text-blue-600 hover:text-blue-800 text-sm font-medium border border-blue-500 px-3 py-1 rounded-md transition"
                                >
                                  Edit
                                </Link>
                                <button
                                  onClick={() =>
                                    deleteHeroSlider(heroslider.id)
                                  }
                                  className="cursor-pointer text-red-600 hover:text-red-800 text-sm font-medium border border-red-500 px-3 py-1 rounded-md transition"
                                >
                                  Delete
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ShowSlider;
