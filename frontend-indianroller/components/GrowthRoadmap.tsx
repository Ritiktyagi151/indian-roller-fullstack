"use client";
import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Factory, Warehouse, Truck, Globe, MapPin, Construction, Milestone } from "lucide-react";

const milestones = [
  {
    year: "1990",
    title: "Shahdara Foundation",
    desc: "Company established in Shahdara, India.",
    icon: <Factory size={22} />,
  },
  {
    year: "2008",
    title: "Sahibabad Expansion",
    desc: "Operations expanded to Sahibabad unit.",
    icon: <Warehouse size={22} />,
  },
  {
    year: "2017",
    title: "Jamshedpur Entry",
    desc: "Strategic move into Jharkhand market.",
    icon: <Truck size={22} />,
  },
  {
    year: "2021",
    title: "Bangladesh Entry",
    desc: "First international expansion milestone.",
    icon: <Globe size={22} />,
  },
  {
    year: "2022",
    title: "Ahmedabad Facility",
    desc: "Manufacturing unit launched in Gujarat.",
    icon: <MapPin size={22} />,
  },
  {
    year: "2025",
    title: "Bellary Expansion",
    desc: "Entry into the South Indian markets.",
    icon: <Construction size={22} />,
  },
  {
    year: "Soon",
    title: "Tanzania Expansion",
    desc: "Planned unit to tap African markets.",
    icon: <Milestone size={22} />,
    upcoming: true,
  },
];

export default function OrangeRoadmap() {
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, amount: 0.1 });

  return (
    <section className="bg-[#FFFBF7] py-24 px-6 font-sans overflow-hidden" ref={containerRef}>
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="text-center mb-32">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            className="inline-block px-4 py-1.5 mb-4 rounded-full bg-orange-100 text-orange-600 text-xs font-bold tracking-widest uppercase"
          >
            Our Legacy
          </motion.div>
          <motion.h2 
            initial={{ y: 30, opacity: 0 }}
            animate={isInView ? { y: 0, opacity: 1 } : {}}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-4xl md:text-6xl font-black text-slate-900 mt-3"
          >
            Growth & <span className="text-orange-500">Expansion</span>
          </motion.h2>
        </div>

        {/* Desktop View */}
        <div className="hidden lg:block relative mt-40">
          {/* Animated Main Line */}
          <div className="absolute top-1/2 left-0 w-full h-[3px] bg-orange-100 -translate-y-1/2" />
          <motion.div 
            initial={{ width: 0 }}
            animate={isInView ? { width: "100%" } : {}}
            transition={{ duration: 2, ease: "easeInOut" }}
            className="absolute top-1/2 left-0 h-[3px] bg-gradient-to-r from-orange-400 to-orange-600 -translate-y-1/2 z-0"
          />
          
          <div className="relative flex justify-between">
            {milestones.map((item, idx) => {
              const isEven = idx % 2 === 0;
              return (
                <div key={idx} className="relative flex flex-col items-center flex-1">
                  
                  {/* Info Card */}
                  <motion.div
                    initial={{ opacity: 0, y: isEven ? -50 : 50, scale: 0.9 }}
                    animate={isInView ? { opacity: 1, y: isEven ? -140 : 80, scale: 1 } : {}}
                    transition={{ delay: idx * 0.2, duration: 0.6, type: "spring" }}
                    className="absolute w-48 p-6 rounded-3xl bg-white shadow-[0_10px_30px_rgba(249,115,22,0.08)] border border-orange-50 text-center z-20"
                  >
                    <div className="text-orange-500 font-black text-xl mb-1">{item.year}</div>
                    <h3 className="text-sm font-bold text-slate-800 leading-tight uppercase mb-2">
                      {item.title}
                    </h3>
                    <p className="text-[11px] text-slate-500 leading-relaxed italic">
                      {item.desc}
                    </p>
                    {/* Arrow Pointer */}
                    <div className={`absolute left-1/2 -translate-x-1/2 w-3 h-3 bg-white rotate-45 border-orange-50 ${isEven ? 'bottom-[-7px] border-b border-r' : 'top-[-7px] border-t border-l'}`} />
                  </motion.div>

                  {/* Circle Node */}
                  <motion.div
                    initial={{ scale: 0, rotate: -45 }}
                    animate={isInView ? { scale: 1, rotate: 0 } : {}}
                    transition={{ delay: idx * 0.2, type: "spring", stiffness: 150 }}
                    whileHover={{ scale: 1.2, rotate: 5 }}
                    className={`z-10 w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg cursor-pointer border-4 border-white ${
                      item.upcoming ? 'bg-slate-800 text-white' : 'bg-gradient-to-br from-orange-400 to-orange-600 text-white shadow-orange-200'
                    }`}
                  >
                    {item.icon}
                  </motion.div>

                  {/* Vertical Connector Line */}
                  <motion.div 
                    initial={{ height: 0 }}
                    animate={isInView ? { height: 60 } : {}}
                    transition={{ delay: idx * 0.2 + 0.3, duration: 0.4 }}
                    className={`absolute w-[2px] bg-orange-200 ${isEven ? 'bottom-1/2 mb-8' : 'top-1/2 mt-8'}`}
                  />
                </div>
              );
            })}
          </div>
        </div>

        {/* Mobile View */}
        <div className="lg:hidden space-y-12 relative">
          <div className="absolute left-8 top-0 bottom-0 w-[2px] bg-orange-100" />
          
          {milestones.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="flex items-start gap-6 relative"
            >
              <div className={`z-10 w-16 h-16 rounded-2xl shrink-0 flex items-center justify-center shadow-md border-4 border-white ${
                item.upcoming ? 'bg-slate-800 text-white' : 'bg-orange-500 text-white'
              }`}>
                {item.icon}
              </div>
              <div className="bg-white p-6 rounded-3xl shadow-sm border border-orange-50 flex-1">
                <span className="text-orange-500 font-black text-lg">{item.year}</span>
                <h3 className="font-extrabold text-slate-800 text-md uppercase mt-1">{item.title}</h3>
                <p className="text-slate-500 text-xs mt-2 leading-relaxed">{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}