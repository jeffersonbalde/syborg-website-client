import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/pagination";

import hero_bg from "../assets/images/hero_bg.jpg";

const slides = [
  {
    title: "Empowering the Digital Nation",
    description: "DICT leads the Philippines into digital transformation.",
    image: hero_bg,
  },
  {
    title: "Innovation in Every Click",
    description: "Connecting Filipinos through technology.",
    image: hero_bg,
  },
  {
    title: "Digital Future Begins Here",
    description: "Secure, inclusive, and forward-thinking.",
    image: hero_bg,
  },
  {
    title: "Building a Connected Society",
    description: "Bridging gaps with modern tech infrastructure.",
    image: hero_bg,
  },
];

const HeroSlider = () => {
  return (
    <div className="w-full h-[90vh] group relative">
      <Swiper
        modules={[Autoplay, EffectFade, Pagination]}
        effect="fade"
        loop={true}
        autoplay={{ delay: 5000 }}
        pagination={{
          clickable: true,
          el: ".custom-pagination",
        }}
        className="w-full h-full"
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={index}>
            <div
              className="w-full h-full bg-cover bg-center flex items-center justify-center relative"
              style={{ backgroundImage: `url(${slide.image})` }}
            >
              {/* Overlay */}
              <div className="absolute inset-0 bg-black/50" />

              {/* Text Content */}
              <div className="relative text-center px-4 z-10 text-white">
                <h1 className="text-4xl md:text-6xl font-bold drop-shadow-lg">
                  {slide.title}
                </h1>
                <p className="mt-4 text-lg md:text-xl drop-shadow-sm">
                  {slide.description}
                </p>
                <button className="mt-6 px-6 py-3 bg-blue-600 hover:bg-blue-700 transition rounded-full text-white font-semibold">
                  Learn More
                </button>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      <div className="custom-pagination-wrapper absolute bottom-6 left-1/2 transform -translate-x-1/2 z-10">
        <div className="custom-pagination flex items-center gap-4 bg-blue-600 px-6 py-3 rounded-full shadow-xl border border-white/30" />
      </div>
    </div>
  );
};

export default HeroSlider;
