"use client";
import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";

const AboutDetails = () => {
  return (
    <section className="py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          
          {/* Left Side: Image with Decorative Elements */}
          <motion.div 
            initial={{ opacity: 0, x: -100 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="lg:w-1/2 relative"
          >
            {/* Main Industrial Image */}
            <div className="relative z-10 rounded-sm overflow-hidden shadow-2xl border-b-8 border-orange-500">
              <Image 
                src="/about-img/about1.jpg" // Aapki di gayi image yahan rakhein
                alt="IRI Industrial Roller Manufacturing" 
                width={600}
                height={450}
                className="object-cover w-full h-auto"
              />
              
              {/* Logo Overlay like in your image */}
              <div className="absolute top-4 left-4 p-2 shadow-md rounded-sm">
                <Image 
                  src="/logo.png" 
                  alt="Indian Roller Logo" 
                  width={100} 
                  height={40} 
                  className="object-contain"
                />
              </div>
            </div>

            {/* Decorative Background Element */}
            <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-orange-500/10 -z-0" />
          </motion.div>

          {/* Right Side: Content Section */}
          <motion.div 
            initial={{ opacity: 0, x: 100 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            className="lg:w-1/2"
          >
            {/* Section Tag */}
            <div className="flex items-center gap-4 mb-6">
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((dot) => (
                  <div key={dot} className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                ))}
              </div>
              <span className="text-orange-500 font-bold text-xs tracking-[4px] uppercase">
                About Us
              </span>
            </div>

            {/* Main Heading */}
            <h2 className="text-3xl md:text-5xl font-black text-black uppercase tracking-tighter leading-tight mb-8">
              Greeting From All Of Us IRI Is An <span className="text-orange-500">ISO 9001 : 2008 Certified</span> Company
            </h2>

            {/* Description Text */}
            <div className="space-y-6 text-gray-500 text-base leading-relaxed font-medium">
              <p className="border-l-4 border-orange-500 pl-6 italic">
                With this simple philosophy, the brand Indian Roller was born in 1990, as a rubber roller and Polyurethane manufacturing company by a dedicated team of young & energetic professionals.
              </p>
              
              <p>
                Our unit is located in a 36,000 sq. Feet area in the industrial town of Sahibabad, Dist. Ghaziabad (Delhi & NCR).
              </p>
              
              <p className="font-bold text-black uppercase tracking-wider text-sm">
                The mission was to create a good product that is honestly made and sincerely served.
              </p>
            </div>

            {/* Action Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="mt-10 bg-black text-white px-10 py-4 text-[10px] font-black uppercase tracking-[2px] hover:bg-orange-500 transition-all duration-300 shadow-xl"
            >
              Contact Our Experts
            </motion.button>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default AboutDetails;