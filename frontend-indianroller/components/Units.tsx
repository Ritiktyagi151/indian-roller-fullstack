"use client";
import React from "react";
import { motion } from "framer-motion";
import { FaPhoneAlt, FaMapMarkerAlt } from "react-icons/fa";

const units = [
  { id: "01", name: "Sahibabad Unit (H.O)", address: "Plot No. 62/2/1&2, Site IV, Industrial Area, Sahibabad-201010 UP", phone: "+91-9540408844", mapLink: "https://goo.gl/maps/example1" },
  { id: "02", name: "Jamshedpur Unit", address: "Shed no.1, Plot No-743, Shree Rampur P.O, Ghamaria, Distt Seraikela, Jharkhand - 832108", phone: "+91-8744885000", mapLink: "https://goo.gl/maps/example2" },
  { id: "03", name: "Ahmedabad Unit", address: "Plot No. 226 to 229, Gopalcharan-2, Industrial Park, Road No. 7, Bakrol, Ahmedabad-382433", phone: "+91-9376921082", mapLink: "https://goo.gl/maps/example3" },
  { id: "04", name: "Bangladesh Unit", address: "South Kashimpur Panchagachia, Mohipal Feni, Bangladesh", phone: "+880-01741064260", mapLink: "https://goo.gl/maps/example4" },
  { id: "05", name: "Karnataka Unit", address: "Property No-5331481412, Kurekuppa Village, Sandur, Ballari, Karnataka - 583119", phone: "+91-9540404842", mapLink: "https://goo.gl/maps/example5" }
];

const UnitsSection = () => {
  return (
    <section className="py-24 bg-white font-sans overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Modern Minimal Header */}
        <div className="flex flex-col mb-16 border-l-4 border-orange-500 pl-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-5xl md:text-6xl font-black uppercase leading-tight tracking-tighter text-black">
              Our <span className="text-orange-500">Global</span> <br /> Presence
            </h2>
            <p className="mt-4 text-gray-400 font-bold tracking-[4px] uppercase text-[10px]">
              Manufacturing across 5 strategic locations
            </p>
          </motion.div>
        </div>

        {/* Industrial Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0 border-t border-l border-gray-100">
          {units.map((unit, index) => (
            <motion.div
              key={unit.id}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: false }}
              transition={{ delay: index * 0.1 }}
              className="relative group h-[400px] border-r border-b border-gray-100 overflow-hidden"
            >
              {/* Overlay Sweep Effect */}
              <div className="absolute inset-0 bg-black translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[0.77,0,0.175,1]" />

              {/* Background ID */}
              <span className="absolute -bottom-6 -right-2 text-[10rem] font-black text-gray-50 group-hover:text-white/5 transition-colors duration-500 leading-none pointer-events-none select-none">
                {unit.id}
              </span>

              <div className="relative h-full p-10 flex flex-col justify-between z-10">
                <div className="space-y-6">
                  {/* Map Pin Icon - Top Left */}
                  <div className="flex justify-between items-start">
                    <div className="w-10 h-10 bg-orange-500 flex items-center justify-center rounded-sm group-hover:bg-white transition-colors duration-500">
                      <FaMapMarkerAlt className="text-white group-hover:text-orange-500" />
                    </div>
                    {/* Hover indicator arrow */}
                    <a href={unit.mapLink} target="_blank" className="opacity-0 group-hover:opacity-100 transition-opacity translate-x-4 group-hover:translate-x-0 duration-500">
                       <span className="text-white text-xs font-bold tracking-widest uppercase flex items-center gap-2">
                         Open Map ↗
                       </span>
                    </a>
                  </div>

                  <h3 className="text-2xl font-bold uppercase tracking-tight transition-colors duration-500 text-black group-hover:text-white leading-tight">
                    {unit.name}
                  </h3>
                  <p className="text-gray-500 group-hover:text-gray-400 text-sm leading-relaxed transition-colors duration-500 font-medium">
                    {unit.address}
                  </p>
                </div>

                {/* Direct Phone Link */}
                <a 
                  href={`tel:${unit.phone}`}
                  className="flex items-center gap-4 text-sm font-black tracking-widest uppercase transition-colors duration-500 text-black group-hover:text-orange-500 group/link"
                >
                  <div className="w-8 h-[1px] bg-orange-500 group-hover:w-12 transition-all duration-500"></div>
                  <span>{unit.phone}</span>
                </a>
              </div>

              {/* Top accent line */}
              <div className="absolute top-0 left-0 w-0 h-[2px] bg-orange-500 group-hover:w-full transition-all duration-700" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default UnitsSection;