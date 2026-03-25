'use client';
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion"; // Variants import kiya

export default function Insights() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      title: "Modern Extension to Brick House",
      date: "January 4, 2024",
      desc: "The $2.5 million two-story 4,000-square-foot addition to the existing hospital will provide expanded Interventional Radiology services on the second floor with a new interventional imaging room.",
    },
    {
      title: "The Future of Sustainable Manufacturing",
      date: "February 12, 2024",
      desc: "Industrial sectors are rapidly shifting towards eco-friendly materials. Our new line of recyclable rubber rollers is setting a new benchmark for green production in 2024.",
    },
    {
      title: "Digital Transformation in Logistics",
      date: "March 20, 2024",
      desc: "Automation and AI are no longer optional. How modern roller technology is enhancing the efficiency of automated conveyor systems across the globe.",
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length]);

  // Yahan Types define kar diye hain taaki build fail na ho
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.3 }
    }
  };

  const fadeInUp: Variants = {
    hidden: { opacity: 0, y: 60 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.8, ease: "easeOut" } 
    }
  };

  const slideInRight: Variants = {
    hidden: { opacity: 0, x: 100 },
    visible: { 
      opacity: 1, 
      x: 0, 
      transition: { duration: 0.8, ease: "easeOut" } 
    }
  };

  return (
    <section className="relative w-full bg-white flex flex-col lg:flex-row items-stretch overflow-hidden">
      
      {/* LEFT SECTION: BLACK AREA */}
      <motion.div 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, amount: 0.2 }}
        variants={containerVariants}
        className="w-full lg:w-[60%] bg-black text-white py-16 px-6 md:py-24 md:px-16 lg:pl-32 flex flex-col justify-center relative z-0"
      >
        <div className="max-w-xl">
          <motion.p variants={fadeInUp} className="text-[10px] font-bold tracking-[4px] uppercase mb-4 text-gray-400">
            Latest News
          </motion.p>
          
          <motion.h2 variants={fadeInUp} className="text-3xl md:text-5xl font-black uppercase tracking-tighter mb-8 leading-[1.1]">
            Top Insights on the <br className="hidden md:block" /> Current Industry
          </motion.h2>
          
          <motion.div variants={fadeInUp} className="w-14 h-[4px] bg-orange-500 mb-12"></motion.div>

          <motion.div variants={fadeInUp} className="relative min-h-[200px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.5 }}
                className="space-y-4"
              >
                <h3 className="text-xl md:text-2xl font-bold uppercase tracking-tight text-white">
                  {slides[currentSlide].title}
                </h3>
                <p className="text-[11px] text-gray-500 uppercase tracking-[2px]">
                  Posted by admin &nbsp; | &nbsp; {slides[currentSlide].date}
                </p>
                <p className="text-gray-400 text-sm md:text-base leading-relaxed font-light">
                  {slides[currentSlide].desc}
                </p>
              </motion.div>
            </AnimatePresence>
          </motion.div>

          {/* Pagination Dots */}
          <motion.div variants={fadeInUp} className="flex gap-4 mt-12">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`h-2 rounded-full transition-all duration-500 ${
                  currentSlide === index ? "w-8 bg-orange-500" : "w-2 bg-gray-600"
                }`}
              />
            ))}
          </motion.div>
        </div>
      </motion.div>

      {/* RIGHT SECTION: ORANGE NEWSLETTER BOX */}
      <div className="w-full lg:w-[40%] flex items-center justify-center lg:justify-start px-6 py-12 lg:py-24 bg-white lg:bg-transparent">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.4 }}
          variants={slideInRight}
          className="bg-orange-400 w-full max-w-max lg:-ml-20 p-10 md:p-16 shadow-[0_20px_50px_rgba(0,0,0,0.3)] z-10 relative"
        >
          <p className="text-[10px] font-bold tracking-[3px] uppercase mb-4 text-white/80">
            Subscribe
          </p>
          <h2 className="text-4xl font-black uppercase tracking-tighter mb-6 text-white leading-none">
            Join Our <br /> Newsletter
          </h2>
          <p className="text-white/90 text-sm mb-10 font-medium">
            Good news & event details as well straight to your incoming mail!
          </p>

          <form className="relative flex items-center border-b border-white/50 pb-2 group focus-within:border-white transition-all">
            <input
              type="email"
              required
              placeholder="Enter Your E-mail"
              className="bg-transparent border-none outline-none text-white placeholder:text-white/60 text-sm w-full py-2 italic"
            />
            <button type="submit" className="text-white p-2">
              <svg className="w-6 h-6 transform rotate-[-45deg]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </form>
        </motion.div>
      </div>
    </section>
  );
}