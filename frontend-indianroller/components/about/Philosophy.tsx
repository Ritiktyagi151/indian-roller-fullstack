"use client";
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useInView, useMotionValue, useTransform, animate } from "framer-motion";
import Image from "next/image";

// Fix: count animation function change kiya gaya hai
const AnimatedNumber = ({ value }: { value: string }) => {
  const target = parseInt(value, 10);
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.round(latest));
  const ref = useRef(null);
  const inView = useInView(ref, { once: false, amount: 0.5 });

  useEffect(() => {
    if (inView) {
      // motion.animate ki jagah direct animate use karein
      const controls = animate(count, target, {
        duration: 2,
        ease: "easeOut",
      });
      return controls.stop;
    } else {
      count.set(0); // Reset jab screen se bahar jaye
    }
  }, [inView, count, target]);

  return <motion.span ref={ref}>{rounded}</motion.span>;
};

const stats = [
  { label: "Projects in Process", value: "358" },
  { label: "Design Awards", value: "28" },
  { label: "Happy Clients", value: "724" },
  { label: "Years Experience", value: "35" },
  { label: "Manufacturing Units", value: "05" },
  { label: "Global Partners", value: "18" },
];

const Philosophy = () => {
  const [activeTab, setActiveTab] = useState("mission");
  const [mounted, setMounted] = useState(false);

  // Hydration error se bachne ke liye mounting check
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <section className="relative w-full bg-white flex flex-col lg:flex-row items-center py-8 md:py-10 lg:py-20 overflow-hidden lg:overflow-visible">
      
      {/* --- Left Side: Black Philosophy Section --- */}
      <div className="w-full lg:w-[60%] bg-black text-white py-16 px-6 sm:px-12 md:px-16 lg:pl-32 min-h-[500px] lg:min-h-[700px] flex flex-col justify-center relative z-10">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: false }}
          transition={{ duration: 0.8 }}
          className="max-w-xl"
        >
          <p className="text-orange-500 font-bold text-[10px] tracking-[4px] uppercase mb-4">Philosophy</p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tighter mb-8 lg:mb-10 leading-tight">
            Our Core <br /> Philosophy
          </h2>
          <div className="w-16 h-1 bg-orange-500 mb-10 lg:mb-12"></div>

          <div className="space-y-8 lg:space-y-10">
            {/* Mission */}
            <div className="cursor-pointer group" onClick={() => setActiveTab("mission")}>
              <h3 className={`uppercase tracking-[2px] text-xs sm:text-sm font-black flex items-center gap-4 transition-colors ${activeTab === "mission" ? "text-orange-500" : "text-white/50 group-hover:text-white"}`}>
                <span className="text-lg">{activeTab === "mission" ? "—" : "+"}</span> Our Mission
              </h3>
              <AnimatePresence>
                {activeTab === "mission" && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }} 
                    animate={{ height: "auto", opacity: 1 }} 
                    exit={{ height: 0, opacity: 0 }} 
                    className="overflow-hidden"
                  >
                    <p className="text-gray-400 text-xs sm:text-sm leading-6 mt-4 pl-8 max-w-sm">
                      Designing sustainable, high-performance rollers requires an integration of engineering systems into a balanced design.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Vision */}
            <div className="cursor-pointer group" onClick={() => setActiveTab("vision")}>
              <h3 className={`uppercase tracking-[2px] text-xs sm:text-sm font-black flex items-center gap-4 transition-colors ${activeTab === "vision" ? "text-orange-500" : "text-white/50 group-hover:text-white"}`}>
                <span className="text-lg">{activeTab === "vision" ? "—" : "+"}</span> Our Vision
              </h3>
              <AnimatePresence>
                {activeTab === "vision" && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }} 
                    animate={{ height: "auto", opacity: 1 }} 
                    exit={{ height: 0, opacity: 0 }} 
                    className="overflow-hidden"
                  >
                    <p className="text-gray-400 text-xs sm:text-sm leading-6 mt-4 pl-8 max-w-sm">
                      To be the global leader in industrial roller technology, setting benchmarks for durability and innovation.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </div>

      {/* --- Right Side: Orange Counter Section (The Overlap) --- */}
      <motion.div 
        initial={{ opacity: 0, y: 50, x: 0 }}
        whileInView={{ opacity: 1, y: 0, x: 0 }}
        viewport={{ once: false }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="w-[90%] sm:w-[85%] lg:w-[45%] lg:-ml-24 z-20 relative -mt-12 sm:-mt-16 lg:mt-0 shadow-2xl"
      >
        <div className="relative overflow-hidden bg-orange-500 min-h-[450px] sm:min-h-[550px] lg:min-h-[600px] flex flex-col justify-center">
          {/* Background Image */}
          <div className="absolute inset-0 z-0">
            <Image 
              src="/building-structure.jpg" 
              alt="Industrial background" 
              fill 
              className="object-cover opacity-30 mix-blend-overlay scale-110" 
            />
          </div>

          <div className="relative z-10 p-8 sm:p-12 lg:p-20 text-white">
            <p className="text-[10px] uppercase font-black tracking-[4px] mb-4 text-white/80">Achievements</p>
            <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tighter mb-8 leading-none">
              What We Have <br /> Accomplished
            </h2>
            <div className="w-16 h-1 bg-white mb-10 lg:mb-12"></div>

            <div className="grid grid-cols-2 gap-y-10 sm:gap-y-12 gap-x-6 sm:gap-x-8">
              {stats.map((stat, index) => (
                <div key={index} className="flex flex-col">
                  <span className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tighter mb-1 leading-none">
                    <AnimatedNumber value={stat.value} />
                    {parseInt(stat.value) > 20 && "+"}
                  </span>
                  <span className="text-[8px] sm:text-[9px] uppercase font-bold tracking-[2px] text-white/70 leading-tight">
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

    </section>
  );
};

export default Philosophy;