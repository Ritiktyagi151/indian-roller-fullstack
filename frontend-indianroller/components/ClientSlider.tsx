"use client";
import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";

const ClientSlider = () => {
  // 12 Client Logos ki list
  const clientLogos = [
    "/c1.png", "/c2.png", "/c3.png", "/c4.png", 
    "/c5.png", "/c6.png", "/c7.png", "/c8.png",
    "/c9.png", "/c10.png", "/c11.png", "/c12.png"
  ];

  // Infinite loop ke liye array ko duplicate karenge
  const duplicatedLogos = [...clientLogos, ...clientLogos];

  return (
    <section className="py-20 bg-gray-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 mb-12 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-orange-500 font-bold text-[10px] tracking-[4px] uppercase mb-2">Trusted By</p>
          <h2 className="text-4xl font-black uppercase tracking-tighter text-black">
            Our Valuable <span className="text-orange-500">Clients</span>
          </h2>
          <div className="w-16 h-1 bg-orange-500 mt-4 mx-auto"></div>
        </motion.div>
      </div>

      {/* --- INFINITE SLIDER CONTAINER --- */}
      <div className="relative flex overflow-hidden group">
        <motion.div
          className="flex whitespace-nowrap"
          animate={{ x: ["0%", "-50%"] }} // Left slide effect
          transition={{
            ease: "linear",
            duration: 25, // Speed adjust kar sakte hain
            repeat: Infinity,
          }}
        >
          {duplicatedLogos.map((logo, index) => (
            <div 
              key={index} 
              className="flex-shrink-0 w-[200px] h-[120px] mx-8 flex items-center justify-center bg-white shadow-sm border border-gray-100 rounded-sm grayscale hover:grayscale-0 transition-all duration-500 p-6"
            >
              <Image
                src={logo}
                alt={`Client ${index}`}
                width={140}
                height={80}
                className="object-contain"
              />
            </div>
          ))}
        </motion.div>
      </div>

      {/* Decorative Gradients for Sides (SEO friendly overlay) */}
      <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-gray-50 to-transparent z-10 pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-gray-50 to-transparent z-10 pointer-events-none" />
    </section>
  );
};

export default ClientSlider;