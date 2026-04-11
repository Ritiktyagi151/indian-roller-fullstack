"use client";
import React from "react";
import { motion, Variants } from "framer-motion";

/* ─────────────────────────────────────────────
   DATA
───────────────────────────────────────────── */
const pillars = [
  {
    tag: "Our Mission",
    icon: (
      <svg viewBox="0 0 40 40" fill="none" className="w-8 h-8">
        <circle cx="20" cy="20" r="18" stroke="currentColor" strokeWidth="2.5" />
        <circle cx="20" cy="20" r="10" stroke="currentColor" strokeWidth="2.5" />
        <circle cx="20" cy="20" r="3" fill="currentColor" />
      </svg>
    ),
    heading: "Honestly Made.\nSincerely Served.",
    body: "To engineer rubber rollers and polyurethane products of exceptional quality — combining advanced technology, skilled craftsmanship and disciplined delivery — so that every client receives not just a product, but a promise fulfilled.",
  },
  {
    tag: "Our Vision",
    icon: (
      <svg viewBox="0 0 40 40" fill="none" className="w-8 h-8">
        <path
          d="M4 20C4 20 10 8 20 8C30 8 36 20 36 20C36 20 30 32 20 32C10 32 4 20 4 20Z"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
        <circle cx="20" cy="20" r="5" stroke="currentColor" strokeWidth="2.5" />
      </svg>
    ),
    heading: "To Evolve Is\nTo Last Forever.",
    body: "To remain the most trusted name in industrial roller solutions — continuously evolving through research, innovation and global partnerships, while staying rooted in the values that built us: integrity, precision and relentless excellence.",
  },
];

/* ─────────────────────────────────────────────
   ANIMATION VARIANTS
───────────────────────────────────────────── */
const slideFromLeft: Variants = {
  hidden: { opacity: 0, x: -60 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: "easeOut" } },
};
const slideFromRight: Variants = {
  hidden: { opacity: 0, x: 60 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: "easeOut" } },
};
const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: "easeOut", delay: i * 0.1 },
  }),
};

/* ─────────────────────────────────────────────
   MAIN EXPORT
───────────────────────────────────────────── */
const MissionVision = () => {
  return (
    <section className="pt-12 sm:pt-16 lg:pt-10 pb-12 sm:pb-16 lg:pb-10 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Heading */}
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start mb-10 lg:mb-8">
          <div className="w-full lg:w-1/3">
            <motion.p
              variants={slideFromLeft}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false, amount: 0.6 }}
              className="text-orange-500 font-bold text-xs tracking-[3px] uppercase mb-3"
            >
              Our Purpose
            </motion.p>
            <motion.h2
              variants={slideFromLeft}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false, amount: 0.6 }}
              className="text-3xl sm:text-4xl lg:text-5xl font-black uppercase leading-tight tracking-tighter text-black"
            >
              Mission <br /> & Vision
            </motion.h2>
            <motion.div
              className="h-1 bg-orange-500 mt-5"
              initial={{ width: 0 }}
              whileInView={{ width: 80 }}
              viewport={{ once: false }}
              transition={{ duration: 1, delay: 0.4 }}
            />
          </div>
          <motion.p
            variants={slideFromRight}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.4 }}
            className="w-full lg:w-2/3 text-gray-500 font-bold text-xs sm:text-sm leading-relaxed uppercase tracking-wider italic border-l-4 border-orange-500 pl-4 self-center"
          >
            The values and aspirations that have driven Indian Roller for over three decades — shaping every product, every partnership, and every promise we make to our clients.
          </motion.p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2">
          {pillars.map((p, i) => (
            <motion.div
              key={p.tag}
              custom={i}
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false, amount: 0.4 }}
              className={`relative flex flex-col justify-between p-8 sm:p-10 lg:p-14 overflow-hidden group ${
                i === 0 ? "bg-black" : "bg-orange-500"
              }`}
            >
              {/* Watermark */}
              <span
                className={`absolute top-4 right-4 text-[80px] sm:text-[120px] lg:text-[160px] font-black leading-none select-none pointer-events-none transition-opacity duration-500 ${
                  i === 0 ? "text-white/5 group-hover:text-white/10" : "text-black/10 group-hover:text-black/15"
                }`}
              >
                {String(i + 1).padStart(2, "0")}
              </span>

              <div>
                <p className={`font-bold text-[10px] tracking-[3px] uppercase mb-5 ${i === 0 ? "text-orange-500" : "text-black"}`}>
                  {p.tag}
                </p>
                <div className={`mb-6 ${i === 0 ? "text-orange-500" : "text-black"}`}>
                  {p.icon}
                </div>
                <h3 className={`text-2xl sm:text-3xl lg:text-4xl font-black uppercase leading-tight tracking-tighter mb-5 whitespace-pre-line ${i === 0 ? "text-white" : "text-black"}`}>
                  {p.heading}
                </h3>
                <div className={`w-10 h-1 mb-5 ${i === 0 ? "bg-orange-500" : "bg-black"}`} />
                <p className={`text-[13px] leading-7 font-medium ${i === 0 ? "text-gray-400" : "text-black/70"}`}>
                  {p.body}
                </p>
              </div>

              <div className={`mt-8 pt-5 border-t flex items-center justify-between ${i === 0 ? "border-white/10" : "border-black/20"}`}>
                <span className={`text-[10px] uppercase tracking-widest font-bold ${i === 0 ? "text-gray-600" : "text-black/50"}`}>
                  Indian Roller (IRI)
                </span>
                <span className={`text-[10px] uppercase tracking-widest font-bold ${i === 0 ? "text-orange-500" : "text-black"}`}>
                  Since 1990 →
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Quality strip */}
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="bg-gray-50 border-t-4 border-orange-500 grid grid-cols-2 lg:grid-cols-4 divide-x divide-gray-200"
        >
          {[
            ["Quality", "ISO 9001:2008 Certified"],
            ["Innovation", "R&D-Driven Engineering"],
            ["Reliability", "On-Time Delivery Discipline"],
            ["Trust", "Global Client Network"],
          ].map(([title, sub]) => (
            <div key={title} className="px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
              <h4 className="text-black font-black uppercase text-xs sm:text-sm tracking-tight mb-1">{title}</h4>
              <p className="text-gray-400 text-[10px] sm:text-[11px] uppercase tracking-wider font-bold leading-tight">{sub}</p>
            </div>
          ))}
        </motion.div>

      </div>
    </section>
  );
};

export default MissionVision;