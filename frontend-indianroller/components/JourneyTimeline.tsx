"use client";
import React from "react";
import { motion, type Variants } from "framer-motion";
import { 
  Factory, 
  Expand, 
  MapPin, 
  Globe, 
  Building2, 
  Navigation, 
  PlaneTakeoff 
} from "lucide-react";

const milestones = [
  { year: "1990", title: "Shahdara Foundation", desc: "The journey began with the first unit, laying the foundation.", icon: <Factory size={24} /> },
  { year: "2008", title: "Sahibabad Expansion", desc: "Enhanced production and logistics in the NCR industrial belt.", icon: <Expand size={24} /> },
  { year: "2017", title: "Jamshedpur Unit", desc: "Tapping into the industrial markets of Jharkhand and Eastern India.", icon: <MapPin size={24} /> },
  { year: "2021", title: "Bangladesh Entry", desc: "Marking our first international footprint in South Asia.", icon: <Globe size={24} /> },
  { year: "2022", title: "Ahmedabad Facility", desc: "Strengthening our presence in the Western Indian manufacturing hub.", icon: <Building2 size={24} /> },
  { year: "2025", title: "Bellary, Karnataka", desc: "Expansion into South India for faster regional supply.", icon: <Navigation size={24} /> },
  { year: "Soon™", title: "Tanzania, Africa", desc: "Global leap into the emerging African industrial markets.", icon: <PlaneTakeoff size={24} />, upcoming: true },
];

// --- Animations ---
const cardFadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.5 + (i * 0.2), duration: 0.6, ease: "easeOut" as const }
  })
};

const lineFlow: Variants = {
  hidden: { pathLength: 0 },
  visible: { 
    pathLength: 1, 
    transition: { duration: 2.5, ease: "easeInOut" as const } 
  }
};

/* ─── MOBILE VIEW ─── */
const VerticalTimeline = () => (
  <div className="relative space-y-12">
    <div className="absolute left-6 top-0 bottom-0 w-1 bg-gradient-to-b from-orange-500 to-transparent" />
    {milestones.map((m, i) => (
      <motion.div
        key={i}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={cardFadeUp}
        custom={i}
        className="relative pl-16"
      >
        <div className={`absolute left-0 w-12 h-12 rounded-full border-4 border-black flex items-center justify-center z-10 ${m.upcoming ? "bg-gray-800 text-orange-400" : "bg-orange-500 text-white"}`}>
          {m.icon}
        </div>
        <div className="bg-white/5 border border-white/10 p-5 rounded-2xl">
          <span className="text-orange-500 font-black text-2xl block mb-1">{m.year}</span>
          <h3 className="text-white font-bold text-lg uppercase tracking-tight">{m.title}</h3>
          <p className="text-gray-400 text-sm mt-2 leading-relaxed">{m.desc}</p>
        </div>
      </motion.div>
    ))}
  </div>
);

/* ─── DESKTOP VIEW ─── */
const DesktopTimeline = () => {
  const pathData = "M 0 150 Q 150 50 300 150 T 600 150 T 900 150";

  return (
    <div className="relative w-full min-h-[500px] flex items-center py-20">
      {/* Auto-flowing SVG Path */}
      <svg className="absolute w-full h-full overflow-visible" viewBox="0 0 900 300" fill="none">
        <path d={pathData} stroke="rgba(255,255,255,0.05)" strokeWidth="6" />
        <motion.path
          d={pathData}
          stroke="#f97316"
          strokeWidth="4"
          variants={lineFlow}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        />
      </svg>

      <div className="relative w-full grid grid-cols-7 gap-6">
        {milestones.map((m, i) => (
          <motion.div
            key={i}
            custom={i}
            variants={cardFadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className={`flex flex-col items-center ${i % 2 === 0 ? "-translate-y-28" : "translate-y-28"}`}
          >
            {/* Year & Icon Bubble */}
            <div className={`w-16 h-16 rounded-full flex items-center justify-center border-4 border-[#050505] shadow-2xl z-20 transition-transform hover:scale-110 duration-300 ${m.upcoming ? "bg-gray-900 text-orange-400 border-dashed border-orange-500/50" : "bg-orange-500 text-white"}`}>
              {m.icon}
            </div>
            
            {/* Large Text Content */}
            <div className="mt-6 text-center w-48 p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl hover:bg-white/10 transition-colors">
              <span className="text-orange-500 font-black text-2xl leading-none">{m.year}</span>
              <h4 className="text-white font-bold text-sm uppercase mt-2 tracking-tighter leading-tight">{m.title}</h4>
              <p className="text-gray-400 text-xs mt-2 font-medium leading-relaxed">{m.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

/* ─── MAIN COMPONENT ─── */
const JourneyTimeline = () => {
  return (
    <section className="relative py-12 bg-[#050505] text-white overflow-hidden">
      {/* Background Ambient Glow */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-orange-600/20 blur-[120px] rounded-full" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-orange-600/10 blur-[120px] rounded-full" />

      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
          <div className="max-w-xl">
            <motion.p 
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="text-orange-500 font-bold tracking-[6px] uppercase text-sm mb-4"
            >
              Our History
            </motion.p>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="text-5xl md:text-6xl font-black tracking-tighter leading-[0.85]"
            >
              35 YEARS <br /> OF <span className="text-orange-500">GROWTH</span>
            </motion.h2>
          </div>
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="md:w-1/3 text-gray-400 text-lg border-l-4 border-orange-500 pl-6 py-2"
          >
            Evolution from a local unit to a global powerhouse.
          </motion.div>
        </div>

        {/* Dynamic Views */}
        <div className="lg:hidden">
          <VerticalTimeline />
        </div>
        <div className="hidden lg:block">
          <DesktopTimeline />
        </div>
      </div>
    </section>
  );
};

export default JourneyTimeline;
