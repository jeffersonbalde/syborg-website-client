import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/pagination";

const ImageWithSkeleton = ({ src, alt, className }) => {
  const [imgLoaded, setImgLoaded] = useState(false);

  return (
    <div className="w-full h-full bg-gray-300 relative overflow-hidden">
      {!imgLoaded && (
        <div className="absolute inset-0 animate-pulse bg-gray-300">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
        </div>
      )}
      <img
        src={src}
        alt={alt}
        onLoad={() => setImgLoaded(true)}
        className={`absolute inset-0 w-full h-full object-cover transform transition-all duration-[2000ms] scale-105 ${
          imgLoaded ? "opacity-100" : "opacity-0"
        } ${className}`}
      />
    </div>
  );
};

const HeroSlider = () => {
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchHeroSlides = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_LARAVEL_API}/get-hero-slider`
      );
      const data = await res.json();
      setSlides(data);
    } catch (err) {
      console.error("Failed to fetch hero slides", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHeroSlides();
  }, []);

  const SkeletonSlide = () => (
    <div className="w-full h-[70vh] relative bg-gray-300 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
      <div className="absolute inset-0 bg-blue-950/70" />
      <div className="relative z-10 text-white flex flex-col items-center justify-center h-full px-4 text-center">
        <div className="w-3/4 h-10 bg-white/40 rounded-lg mb-4" />
        <div className="w-1/2 h-6 bg-white/30 rounded-lg" />
        <div className="mt-6 w-40 h-12 bg-white/20 rounded-full" />
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="w-full h-[70vh]">
        <SkeletonSlide />
      </div>
    );
  }

  return (
    <div className="w-full h-[70vh] group relative">
      <Swiper
        modules={[Autoplay, Pagination, Navigation]}
        loop={true}
        autoplay={{ delay: 4000 }}
        pagination={{
          clickable: true,
          el: ".custom-pagination",
        }}
        className="w-full h-full"
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={index}>
            <div className="relative w-full h-[70vh] flex items-center justify-center">
              <ImageWithSkeleton
                src={`${
                  import.meta.env.VITE_LARAVEL_FILE_API
                }/uploads/Hero_Slider_Image/${slide.image}`}
                alt={slide.title}
              />

              {/* Dark blue overlay with subtle gradient */}
              <div className="absolute inset-0 bg-gradient-to-b from-blue-950/70 to-blue-900/60 z-10" />

              {/* Text Content */}
              <div className="absolute z-20 text-center px-4 text-white">
                <h1 className="text-3xl md:text-5xl font-extrabold drop-shadow-xl leading-tight">
                  {slide.title}
                </h1>
                <p className="mt-4 text-base md:text-lg text-white/90 drop-shadow">
                  {slide.description}
                </p>
                <button className="mt-6 px-6 py-3 bg-blue-700 hover:bg-blue-800 transition rounded-full text-white font-semibold shadow-md">
                  Learn More
                </button>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Custom Pagination Dots */}
      <div className="custom-pagination-wrapper absolute bottom-6 left-1/2 transform -translate-x-1/2 z-30">
        <div className="custom-pagination flex items-center gap-3 bg-blue-700/70 px-6 py-3 rounded-full shadow-xl border border-white/20" />
      </div>
    </div>
  );
};

export default HeroSlider;