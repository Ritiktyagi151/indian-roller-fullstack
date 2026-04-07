"use client";
import React from "react";
import { motion, Variants } from "framer-motion";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut", delay: i * 0.12 },
  }),
};
const slideLeft: Variants = {
  hidden: { opacity: 0, x: -40 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: "easeOut" } },
};
const slideRight: Variants = {
  hidden: { opacity: 0, x: 40 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: "easeOut" } },
};

const DirectorMessageH = () => {
  return (
    <section className="relative py-10 sm:py-14 bg-white overflow-hidden">

      {/* Subtle background dot grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.04]"
        style={{
          backgroundImage: "radial-gradient(circle, #000 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      {/* Orange top accent bar */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-orange-500" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section label */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.8 }}
          className="flex items-center gap-3 mb-7"
        >
          <div className="h-px w-8 bg-orange-500" />
          <p className="text-orange-500 font-black text-[10px] tracking-[4px] uppercase">
            About Us
          </p>
        </motion.div>

        {/* ── 3-col: Founder | Content | Director ── */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.7fr_1fr] gap-6 lg:gap-8 items-center">

          {/* COL 1 — Founder */}
          <motion.div
            variants={slideLeft}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.3 }}
            className="relative group order-2 lg:order-1"
          >
            <div className="absolute -top-3 -left-3 w-full h-full border-2 border-orange-200 transition-transform duration-500 group-hover:translate-x-1 group-hover:translate-y-1" />
            <div className="relative overflow-hidden aspect-[3/4]">
              <img
                src="/team-img/satpal-sharma-sir.jpeg"
                alt="Founder"
                className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4">
                <span className="inline-block bg-orange-500 text-white text-[8px] font-black uppercase tracking-[2px] px-2 py-0.5 mb-1.5">
                  Est. 1990
                </span>
                <p className="text-white font-black text-sm uppercase tracking-tight leading-tight">
                   Mr. Satpal Sharma
                </p>
                <p className="text-orange-300 text-[10px] font-semibold uppercase tracking-widest mt-0.5">
                  Chairman
                </p>
              </div>
            </div>
          </motion.div>

          {/* COL 2 — Content */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.3 }}
            className="order-1 lg:order-2 flex flex-col"
          >
            <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-black uppercase leading-none tracking-tighter text-black">
              Director's <br /> Message
            </h2>
            <p className="text-orange-500 text-base font-black italic mt-2 mb-4 leading-snug">
              "To Evolve is to Last Forever"
            </p>
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: 64 }}
              viewport={{ once: false }}
              transition={{ duration: 0.9, delay: 0.3 }}
              className="h-0.5 bg-orange-500 mb-5"
            />

           <p className="text-gray-500 text-[13px] leading-relaxed border-l-2 border-orange-400 pl-4 mb-5 italic">
  “To Evolve is to Last Forever” — this belief defines our journey.
</p>

<p className="text-gray-400 text-[12px] sm:text-[13px] leading-6 mb-5">
  At IRI, we are driven by innovation, precision, and an unwavering commitment to quality.
  From a vision built on trust and integrity, we have grown into a globally trusted name
  in precision-engineered roller solutions.
</p>

<p className="text-gray-400 text-[12px] sm:text-[13px] leading-6">
  With advanced manufacturing, cutting-edge PU casting technology, and global collaborations,
  we deliver products that meet the highest international standards while creating lasting value
  for our clients.
</p>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-2 mb-6">
              {[
                ["1990", "Established"],
                ["6 Lakh", "Sq. Ft."],
                ["35+", "Yrs Legacy"],
              ].map(([val, lbl], i) => (
                <motion.div
                  key={lbl}
                  custom={i}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: false }}
                  className="bg-gray-50 border border-gray-100 py-3 px-2 text-center"
                >
                  <p className="text-xl sm:text-2xl font-black text-black leading-none">
                    {val}
                  </p>
                  <p className="text-orange-500 text-[9px] uppercase tracking-widest font-bold mt-1">
                    {lbl}
                  </p>
                </motion.div>
              ))}
            </div>

            {/* Signature */}
            {/* <div className="border-t border-gray-100 pt-4">
              <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold mb-0.5">
                Warm Regards,
              </p>
              <p className="text-black font-black text-sm uppercase tracking-tight">
                Director
              </p>
              <p className="text-orange-500 text-[10px] font-bold uppercase tracking-widest">
                Indian Roller (IRI)
              </p>
              <p className="text-gray-300 text-[9px] uppercase tracking-widest mt-0.5">
                ISO 9001:2008 Certified
              </p>
            </div> */}
          </motion.div>

          {/* COL 3 — Director */}
          <motion.div
            variants={slideRight}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.3 }}
            className="relative group order-3"
          >
            <div className="absolute -bottom-3 -right-3 w-full h-full border-2 border-orange-200 transition-transform duration-500 group-hover:-translate-x-1 group-hover:-translate-y-1" />
            <div className="relative overflow-hidden aspect-[3/4]">
              <img
                src="/team-img/sunny-sir.jpeg"
                alt="Director"
                className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4">
                <span className="inline-block bg-orange-500 text-white text-[8px] font-black uppercase tracking-[2px] px-2 py-0.5 mb-1.5">
                  Our Leadership
                </span>
                <p className="text-white font-black text-sm uppercase tracking-tight leading-tight">
                  MR. Sunny Sharma
                </p>
                <p className="text-orange-300 text-[10px] font-semibold uppercase tracking-widest mt-0.5">
                  Managing Director
                </p>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default DirectorMessageH;