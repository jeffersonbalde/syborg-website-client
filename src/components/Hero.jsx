import React from "react";
import { motion } from "framer-motion";
import hero_bg from "../assets/images/hero_bg.jpg";

const Hero = () => {
  return (
    <div
      className="relative h-screen w-full bg-cover bg-center bg-fixed text-white flex justify-center items-center"
      style={{ backgroundImage: `url(${hero_bg})` }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/65 z-0" />

      {/* Content */}
      <div className="relative z-10 max-w-[700px] mb-12 px-6 md:px-10 text-center flex flex-col items-center gap-6 mt-16 md:mt-28">
        <motion.h1
          className="font-normal text-xl lg:text-2xl"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{
            opacity: 1,
            y: 0,
            transition: { delay: 0.3, duration: 0.7 },
          }}
          viewport={{ once: true }}
        >
          Welcome to the Official Website of
        </motion.h1>

        <motion.h1
          className="font-black text-7xl md:text-8xl leading-snug italic drop-shadow-[0_4px_12px_rgba(17,15,134,0.6)]"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{
            opacity: 1,
            y: 0,
            transition: { delay: 0.4, duration: 0.8 },
          }}
          viewport={{ once: true }}
        >
          SYBORG
        </motion.h1>

        <motion.h1
          className="font-bold text-4xl md:text-5xl lg:text-6xl leading-snug italic drop-shadow-[0_4px_12px_rgba(17,15,134,0.6)]"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{
            opacity: 1,
            y: 0,
            transition: { delay: 0.5, duration: 1 },
          }}
          viewport={{ once: true }}
        >
          SCC System Builders Organization
        </motion.h1>
      </div>
    </div>
  );
};

export default Hero;
