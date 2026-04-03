"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

const testimonials = [
  {
    text: "IRI provides the most durable rubber rollers we have ever used. Their quality is truly world-class and consistent.",
    author: "Rajesh Kumar, Textile Industry",
  },
  {
    text: "The precision of their Polyurethane products helped us reduce downtime by 30%. Highly recommended for engineering.",
    author: "Amit Sharma, Steel Plant Manager",
  },
  {
    text: "Professional team and excellent delivery time. The ISO certification reflects in their product consistency since 1990.",
    author: "Sanjay Gupta, Packaging Solutions",
  },
  {
    text: "Indian Roller is our trusted partner. Their philosophy of quality service and honest manufacturing is unmatched.",
    author: "Vikas, Industrial Consultant",
  }
];

export default function AdvantagesSection() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative w-full bg-white overflow-hidden">
      {/* --- TOP SECTION: Cards --- */}
      {/* Desktop style wahi rakha hai (inset-y classes ke sath), Mobile ke liye stack kiya hai */}
      <div className="max-w-7xl mx-auto px-6 pb-12 grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-4 relative z-20">
        
        {/* Left Card */}
        <motion.div 
          initial={{ opacity: 0, x: -100 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: false, amount: 0.2 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative h-[450px] md:inset-y-64 rounded-2xl group overflow-hidden"
        >
          <Image src="/industry-img/Pickup.jpeg" alt="Architecture" fill className="object-cover transition-transform duration-500 group-hover:scale-110" />
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
             {/* <h3 className="text-white font-bold tracking-[3px] uppercase">Architecture</h3> */}
          </div>
        </motion.div>

        {/* Middle Card */}
        <motion.div 
          initial={{ opacity: 0, y: 100 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.2 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
          className="relative h-[450px] md:inset-y-44 rounded-2xl group overflow-hidden"
        >
          <Image src="/team-img/ahmdabad.JPG" alt="Engineering" fill className="object-cover transition-transform duration-500 group-hover:scale-110" />
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
             {/* <h3 className="text-white font-bold tracking-[3px] uppercase">Engineering</h3> */}
          </div>
        </motion.div>

        {/* Right Card */}
        <motion.div 
          initial={{ opacity: 0, x: 100 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: false, amount: 0.2 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          className="relative h-[450px] group rounded-2xl md:inset-y-28 overflow-hidden"
        >
          <Image src="/team-img/KH2_2663.JPG" alt="Interior" fill className="object-cover transition-transform duration-500 group-hover:scale-110" />
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
             {/* <h3 className="text-white font-bold tracking-[3px] uppercase">Interior Design</h3> */}
          </div>
        </motion.div>
      </div>

      {/* --- MIDDLE SECTION: Testimonials --- */}
      <div className="relative w-full min-h-[500px] lg:h-[600px] pt-24 flex justify-center lg:justify-end items-center overflow-hidden">
        <motion.div 
          initial={{ scale: 1.2, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: false }}
          transition={{ duration: 1.5 }}
          className="absolute inset-0 z-0"
        >
          <Image src="/homepage-img/factory-area.JPG" alt="bg" fill className="object-cover" />
          <div className="absolute inset-0 bg-orange-500/60 mix-blend-multiply"></div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: false }}     
          transition={{ duration: 0.8, delay: 0.3 }}
          className="relative z-10 w-full lg:w-1/2 p-8 md:p-12 lg:p-24 text-white"
        >
          <span className="text-8xl font-serif opacity-30 leading-none">“</span>
          <p className="text-[15px] uppercase font-bold tracking-[4px] mb-4 -mt-6">Testimonials</p>
          <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tighter mb-8 leading-tight">
            What Our <br /> Clients Say
          </h2>
          
          <div className="min-h-[160px]"> 
            <AnimatePresence mode="wait">
              <motion.div
                key={current}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.5 }}
              >
                <p className="italic text-lg leading-relaxed mb-6 opacity-90 max-w-md">
                  "{testimonials[current].text}"
                </p>
                <p className="font-bold text-sm uppercase tracking-widest text-white/80">
                  — {testimonials[current].author}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="flex gap-2 mt-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrent(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${current === index ? "bg-white w-8" : "bg-white/40"}`}
              />
            ))}
          </div>
        </motion.div>
      </div>

      {/* --- BOTTOM SECTION: Black Overlap --- */}
      <motion.div 
        initial={{ opacity: 0, y: 100 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.3 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-30 bg-black text-white w-full lg:w-[52%] py-24 px-8 md:px-12 lg:pl-32 mt-[-50px] lg:mt-[-250px]"
      >
        <p className="text-gray-500 font-bold text-[10px] tracking-[4px] uppercase mb-4">Advantages</p>
        <h2 className="text-3xl lg:text-5xl font-black uppercase tracking-tighter mb-8 leading-tight">
          Working on <br /> Exclusive Projects
        </h2>
        
        <motion.div 
          initial={{ width: 0 }}
          whileInView={{ width: 64 }}
          viewport={{ once: false }}
          transition={{ duration: 1, delay: 0.5 }}
          className="h-1 bg-orange-500 mb-8"
        ></motion.div>
        
        <p className="text-gray-500 text-xs leading-6 max-w-sm mb-12">
          Designing sustainable, high-performance buildings requires an integration of architectural and engineered systems into a balanced design.
        </p>
      </motion.div>
    </section>
  );
}