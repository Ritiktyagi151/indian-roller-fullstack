"use client";
import React, { useRef } from "react";
import { motion, Variants, useScroll, useTransform } from "framer-motion";
import { FaIndustry, FaCogs, FaVial, FaRocket, FaCloudUploadAlt, FaChevronRight, FaArrowRight } from "react-icons/fa";

// Diverse & Smooth Slide Animations
const slideLeft: Variants = {
  hidden: { opacity: 0, x: -100 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: "easeOut" } }
};

const slideRight: Variants = {
  hidden: { opacity: 0, x: 100 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: "easeOut" } }
};

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.2 } }
};

const float3D: Variants = {
  initial: { y: 0, rotateX: 0, rotateY: 0 },
  animate: { 
    y: [-20, 20, -20],
    rotateX: [0, 10, 0],
    rotateY: [0, 10, 0],
    transition: { 
      duration: 6, 
      repeat: Infinity, 
      ease: "easeInOut" 
    }
  }
};

const jobRoles = [
  { id: "01", role: "Senior Rubber Technologist", location: "Sahibabad Unit", type: "Full-Time" },
  { id: "02", role: "CNC Roller Operator", location: "Jamshedpur Unit", type: "On-Site" },
  { id: "03", role: "PU Casting Engineer", location: "Ahmedabad Unit", type: "Full-Time" },
  { id: "04", role: "Production Supervisor", location: "Sahibabad Unit", type: "Shift-Basis" }
];

export default function CareerClient() {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, 300]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <main className="bg-white overflow-hidden text-sm md:text-base">
      
      {/* 1. HERO SECTION: 3D Parallax Effect */}
      <section ref={heroRef} className="relative py-24  md:pt-44 bg-gradient-to-br from-black via-gray-900 to-black text-white overflow-hidden">
        {/* 3D Floating Geometric Shapes */}
        <motion.div 
          className="absolute top-20 right-10 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl"
          variants={float3D}
          initial="initial"
          animate="animate"
          style={{ 
            transformStyle: "preserve-3d",
            perspective: "1000px"
          }}
        />
        
        <motion.div 
          className="absolute bottom-20 left-10 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl"
          variants={float3D}
          initial="initial"
          animate="animate"
          transition={{ delay: 1 }}
          style={{ 
            transformStyle: "preserve-3d",
            perspective: "1000px"
          }}
        />

        {/* 3D Rotating Cubes */}
        <motion.div
          className="absolute top-1/2 left-1/4 w-32 h-32 border-2 border-orange-500/20"
          animate={{
            rotateX: [0, 360],
            rotateY: [0, 360],
            rotateZ: [0, 360],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          style={{
            transformStyle: "preserve-3d",
            perspective: "1000px"
          }}
        />

        <motion.div
          className="absolute bottom-1/4 right-1/4 w-24 h-24 border-2 border-blue-500/20"
          animate={{
            rotateX: [360, 0],
            rotateY: [360, 0],
            rotateZ: [360, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "linear"
          }}
          style={{
            transformStyle: "preserve-3d",
            perspective: "1000px"
          }}
        />

        {/* Parallax Content */}
        <motion.div 
          className="max-w-6xl mx-auto px-6 relative z-10"
          style={{ y, opacity }}
        >
          <motion.div initial="hidden" animate="visible" variants={slideLeft}>
            <p className="text-orange-500 font-bold text-[10px] tracking-[5px] uppercase mb-4 underline underline-offset-8">Careers at IRI</p>
            <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-tight mb-6">
              Engineering <br /> 
              <motion.span 
                className="text-orange-500 inline-block"
                animate={{
                  textShadow: [
                    "0 0 20px rgba(249, 115, 22, 0.5)",
                    "0 0 40px rgba(249, 115, 22, 0.8)",
                    "0 0 20px rgba(249, 115, 22, 0.5)",
                  ]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                Excellence
              </motion.span> Together
            </h1>
            <p className="max-w-xl text-gray-400 font-medium leading-relaxed italic border-l-4 border-orange-500 pl-6">
              Join an ISO 9001:2008 Certified leader since 1990. We create high-quality Rubber and Polyurethane rollers with sincere service.
            </p>
          </motion.div>
        </motion.div>

        {/* 3D Grid Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="grid grid-cols-12 h-full">
            {[...Array(144)].map((_, i) => (
              <motion.div
                key={i}
                className="border border-white/10"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0.1, 0.3, 0.1] }}
                transition={{
                  duration: 3,
                  delay: i * 0.01,
                  repeat: Infinity,
                }}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 2. WHY IRI: 3D Card Flip Effect */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
        {/* 3D Background Elements */}
        <motion.div
          className="absolute top-0 left-0 w-96 h-96 bg-orange-100 rounded-full blur-3xl opacity-20"
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 50, 0],
            y: [0, 30, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />

        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <motion.div 
            variants={staggerContainer} 
            initial="hidden" 
            whileInView="visible" 
            viewport={{ once: false, amount: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {[
              { title: "Baule Tech", icon: <FaCogs />, desc: "Advanced French PU Casting technology." },
              { title: "36,000 Sq. Ft", icon: <FaIndustry />, desc: "Massive state-of-the-art facility in Sahibabad." },
              { title: "R&D Center", icon: <FaVial />, desc: "Modern lab for roller innovation & testing." },
              { title: "IRI Standards", icon: <FaRocket />, desc: "Maintaining global quality since 1990." }
            ].map((item, i) => (
              <motion.div 
                key={i} 
                variants={fadeInUp} 
                whileHover={{ 
                  y: -15,
                  rotateY: 10,
                  rotateX: 5,
                  scale: 1.05,
                  boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)"
                }}
                className="bg-white p-8 shadow-lg border-t-4 border-black hover:border-orange-500 transition-all group relative"
                style={{
                  transformStyle: "preserve-3d",
                  perspective: "1000px"
                }}
              >
                {/* 3D Icon Container */}
                <motion.div 
                  className="text-orange-500 text-3xl mb-4 relative"
                  animate={{
                    rotateY: [0, 360],
                  }}
                  transition={{
                    duration: 10,
                    repeat: Infinity,
                    ease: "linear",
                    delay: i * 0.5
                  }}
                  style={{
                    transformStyle: "preserve-3d",
                  }}
                >
                  {item.icon}
                </motion.div>
                
                <h3 className="text-lg font-black uppercase mb-3 text-black">{item.title}</h3>
                <p className="text-gray-500 text-xs leading-relaxed font-medium">{item.desc}</p>

                {/* 3D Shine Effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                  initial={{ x: "-100%" }}
                  whileHover={{ x: "100%" }}
                  transition={{ duration: 0.6 }}
                />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* 3. VACANCIES & FORM: 3D Depth & Layers */}
      <section className="py-20 bg-gradient-to-br from-white via-gray-50 to-white relative overflow-hidden">
        {/* 3D Layered Background */}
        <motion.div
          className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-gradient-to-br from-orange-500/10 to-transparent rounded-full blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
        />

        <div className="max-w-6xl mx-auto px-6 flex flex-col lg:flex-row gap-12 relative z-10">
          
          {/* Left Side: 3D List Animation */}
          <motion.div 
            className="lg:w-1/2"
            variants={slideLeft} 
            initial="hidden" 
            whileInView="visible" 
            viewport={{ once: false }}
          >
            <h2 className="text-3xl font-black uppercase text-black mb-10">
              Current <span className="text-orange-500">Openings</span>
            </h2>
            <div className="space-y-4">
              {jobRoles.map((job, index) => (
                <motion.div 
                  key={job.id} 
                  className="group flex items-center justify-between p-5 bg-gray-50 border border-gray-100 hover:bg-black hover:text-white transition-all cursor-pointer rounded-sm relative overflow-hidden"
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: false }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{
                    scale: 1.02,
                    rotateX: 2,
                    rotateY: -2,
                    boxShadow: "0 20px 40px -10px rgba(0, 0, 0, 0.3)"
                  }}
                  style={{
                    transformStyle: "preserve-3d",
                    perspective: "1000px"
                  }}
                >
                  {/* 3D Hover Gradient */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-orange-500/0 via-orange-500/20 to-orange-500/0"
                    initial={{ x: "-100%" }}
                    whileHover={{ x: "100%" }}
                    transition={{ duration: 0.8 }}
                  />

                  <div className="relative z-10">
                    <span className="text-[9px] font-bold text-orange-500 uppercase tracking-widest">{job.location} • {job.type}</span>
                    <h4 className="text-base font-black uppercase tracking-tight group-hover:text-white">{job.role}</h4>
                  </div>
                  <FaArrowRight className="text-orange-500 opacity-0 group-hover:opacity-100 group-hover:translate-x-2 transition-all relative z-10" />
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right Side: 3D Form with Depth */}
          <motion.div 
            className="lg:w-1/2 bg-black p-10 text-white shadow-2xl relative rounded-sm"
            variants={slideRight} 
            initial="hidden" 
            whileInView="visible" 
            viewport={{ once: false }}
            whileHover={{
              rotateY: 3,
              rotateX: -3,
              scale: 1.02,
            }}
            style={{
              transformStyle: "preserve-3d",
              perspective: "1000px"
            }}
          >
            {/* 3D Top Bar */}
            <motion.div 
              className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600"
              animate={{
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "linear"
              }}
              style={{
                backgroundSize: "200% 200%"
              }}
            />

            {/* 3D Corner Accent */}
            <div className="absolute -top-3 -right-3 w-20 h-20 border-t-4 border-r-4 border-orange-500 opacity-30" />
            <div className="absolute -bottom-3 -left-3 w-20 h-20 border-b-4 border-l-4 border-orange-500 opacity-30" />

            <h3 className="text-2xl font-black uppercase mb-2">Apply Now</h3>
            <p className="text-gray-500 text-[10px] uppercase tracking-widest mb-8">Join the leader in roller technology</p>
            
            <form className="space-y-5 relative z-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <motion.input 
                  type="text" 
                  placeholder="Full Name" 
                  className="bg-transparent border-b border-white/20 p-3 outline-none focus:border-orange-500 text-xs uppercase font-bold transition-all" 
                  required 
                  whileFocus={{ scale: 1.02, borderColor: "#f97316" }}
                />
                <motion.input 
                  type="tel" 
                  placeholder="Phone Number" 
                  className="bg-transparent border-b border-white/20 p-3 outline-none focus:border-orange-500 text-xs uppercase font-bold transition-all" 
                  required 
                  whileFocus={{ scale: 1.02, borderColor: "#f97316" }}
                />
              </div>
              
              <motion.select 
                className="w-full bg-transparent border-b border-white/20 p-3 outline-none focus:border-orange-500 text-xs uppercase font-bold transition-all appearance-none cursor-pointer"
                whileFocus={{ scale: 1.02 }}
              >
                <option className="bg-black">Select Position</option>
                {jobRoles.map(j => <option key={j.id} className="bg-black">{j.role}</option>)}
              </motion.select>

              <motion.div 
                className="border-2 border-dashed border-white/10 p-6 text-center hover:border-orange-500 transition-all cursor-pointer group relative"
                whileHover={{ scale: 1.02, borderColor: "#f97316" }}
              >
                <motion.div
                  animate={{
                    y: [0, -10, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <FaCloudUploadAlt className="text-3xl mx-auto mb-2 text-gray-600 group-hover:text-orange-500" />
                </motion.div>
                <p className="text-[9px] font-black uppercase tracking-widest text-gray-500 group-hover:text-white">Upload PDF Resume</p>
                <input type="file" className="hidden" accept=".pdf" />
              </motion.div>
              
              <motion.button 
                className="w-full bg-orange-500 py-4 font-black uppercase tracking-[3px] text-xs hover:bg-white hover:text-black transition-all flex items-center justify-center gap-2 relative overflow-hidden"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                  initial={{ x: "-100%" }}
                  animate={{ x: "100%" }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                />
                <span className="relative z-10">Submit Application</span>
                <FaChevronRight size={10} className="relative z-10" />
              </motion.button>
            </form>
          </motion.div>
        </div>
      </section>
    </main>
  );
}