"use client";
import React from "react";
import { motion } from "framer-motion";
import { FaGraduationCap, FaCogs, FaAward, FaMicrochip, FaSmile } from "react-icons/fa";

const features = [
  {
    title: "Unparalleled Expertise",
    desc: "With over 35 years of industry experience, our team of professionals delivers deep technical knowledge in roller manufacturing.",
    icon: <FaGraduationCap />,
    delay: 0.1
  },
  {
    title: "Reliable Performance",
    desc: "Our products are engineered for high-durability and consistent performance under extreme industrial conditions.",
    icon: <FaCogs />,
    delay: 0.2
  },
  {
    title: "Superior Quality",
    desc: "ISO 9001:2008 certified manufacturing processes ensure every product meets international quality standards.",
    icon: <FaAward />,
    delay: 0.3
  },
  {
    title: "Cutting-Edge Technology",
    desc: "We utilize advanced Polyurethane and Rubber coating technologies to stay ahead in the manufacturing sector.",
    icon: <FaMicrochip />,
    delay: 0.4
  },
  {
    title: "Customer Satisfaction",
    desc: "Our simple philosophy of sincere service has earned us a loyal global clientele since 1990.",
    icon: <FaSmile />,
    delay: 0.5
  }
];

const WhyChooseUs = () => {
  return (
    <section className="py-24 bg-black text-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row items-end justify-between mb-20 gap-8">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false }}
            transition={{ duration: 0.8 }}
            className="lg:w-1/2"
          >
            <p className="text-orange-500 font-bold text-[10px] tracking-[4px] uppercase mb-4">Core Values</p>
            <h2 className="text-5xl md:text-6xl font-black uppercase tracking-tighter leading-none">
              Why <span className="text-orange-500">Choose</span> Us?
            </h2>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: false }}
            className="hidden lg:block w-24 h-24 border-b-2 border-r-2 border-orange-500 opacity-30"
          />
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {features.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false }}
              transition={{ duration: 0.6, delay: item.delay }}
              className="group relative p-10 bg-[#111] border border-white/5 hover:border-orange-500/50 transition-all duration-500"
            >
              {/* Animated Icon Container */}
              <div className="w-16 h-16 bg-[#1a1a1a] flex items-center justify-center text-orange-500 text-3xl mb-8 group-hover:bg-orange-500 group-hover:text-white transition-all duration-500 transform group-hover:rotate-[360deg]">
                {item.icon}
              </div>

              <h3 className="text-xl font-black uppercase tracking-tight mb-4 group-hover:text-orange-500 transition-colors">
                {item.title}
              </h3>
              
              <p className="text-gray-500 text-sm leading-relaxed group-hover:text-gray-300 transition-colors">
                {item.desc}
              </p>

              {/* Decorative Corner Element */}
              <div className="absolute top-0 right-0 w-0 h-0 border-t-2 border-r-2 border-orange-500 opacity-0 group-hover:opacity-100 group-hover:w-8 group-hover:h-8 transition-all duration-500" />
            </motion.div>
          ))}
          
          {/* Static CTA Box */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: false }}
            className="flex flex-col items-center justify-center p-10 bg-orange-500 text-center"
          >
            <h3 className="text-2xl font-black uppercase tracking-tight mb-4 text-white">
              Ready to <br /> Start?
            </h3>
            <p className="text-white/80 text-xs mb-8">Get in touch for custom industrial roller solutions.</p>
            <button className="bg-white text-black px-8 py-3 text-[10px] font-black uppercase tracking-widest hover:bg-black hover:text-white transition-all">
              Contact Now
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;