"use client";
import React, { useRef } from "react";
import { motion, Variants, useScroll, useTransform } from "framer-motion";

/* ─────────────────────────────────────────────
   DATA
───────────────────────────────────────────── */
const milestones = [
  {
    year: "1990",
    title: "The Beginning",
    desc: "Founded in Sahibabad, Delhi NCR by a dedicated team of young & energetic professionals with a singular mission — honest products, sincerely served.",
  },
  {
    year: "1998",
    title: "Factory Expansion",
    desc: "Expanded operations to a 36,000 sq. ft. state-of-the-art manufacturing facility equipped with advanced rubber & PU casting infrastructure.",
  },
  {
    year: "2005",
    title: "Technical Tie-Up",
    desc: "Forged a strategic technical collaboration with Baule Machine (France), bringing global engineering excellence to every roller we produce.",
  },
  {
    year: "2010",
    title: "ISO 9001:2008",
    desc: "Achieved prestigious ISO 9001:2008 certification — a formal recognition of our unwavering commitment to international quality standards.",
  },
  {
    year: "2024",
    title: "35+ Years of Legacy",
    desc: "Trusted by hundreds of global clients, IRI continues to evolve, innovate and lead the rubber roller & polyurethane manufacturing industry.",
  },
];

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
   ANIMATION VARIANTS (matching existing file)
───────────────────────────────────────────── */
const slideFromLeft: Variants = {
  hidden: { opacity: 0, x: -80 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: "easeOut" } },
};
const slideFromRight: Variants = {
  hidden: { opacity: 0, x: 80 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: "easeOut" } },
};
const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut", delay: i * 0.12 },
  }),
};

/* ─────────────────────────────────────────────
   COMPONENT
───────────────────────────────────────────── */
const JourneyMissionVision = () => {
  const timelineRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: timelineRef,
    offset: ["start 80%", "end 20%"],
  });
  const lineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <>
      {/* ══════════════════════════════════
          DIRECTOR'S MESSAGE SECTION
      ══════════════════════════════════ */}
      <section className="pt-20 pb-0 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">

          {/* Section label + heading */}
          <div className="flex flex-col lg:flex-row gap-12 items-start mb-16">
            <div className="lg:w-1/3">
              <motion.p
                variants={slideFromLeft}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: false, amount: 0.8 }}
                className="text-orange-500 font-bold text-xs tracking-[3px] uppercase mb-4"
              >
                About Us
              </motion.p>
              <motion.h2
                variants={slideFromRight}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: false, amount: 0.8 }}
                className="text-4xl md:text-5xl font-black uppercase leading-tight tracking-tighter text-black"
              >
                Director's <br /> Message
                <span className="block text-orange-500 text-2xl md:text-3xl mt-2 normal-case font-black italic">
                  "To Evolve is to Last Forever"
                </span>
              </motion.h2>
              <motion.div
                className="w-20 h-1 bg-orange-500 mt-6"
                initial={{ width: 0 }}
                whileInView={{ width: 80 }}
                viewport={{ once: false }}
                transition={{ duration: 1, delay: 0.5 }}
              />
            </div>

            {/* Director message body */}
            <motion.div
              className="lg:w-2/3"
              variants={slideFromRight}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false, amount: 0.6 }}
            >
              <p className="text-gray-500 font-bold text-sm leading-relaxed mb-6 uppercase tracking-wider italic border-l-4 border-orange-500 pl-4">
                Since our inception in 1990, the journey of Indian Roller (IRI) has been guided by a singular, simple philosophy: to create products that are honestly made and sincerely served.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-gray-400 text-[13px] leading-7 font-medium mb-8">
                <p>
                  What began as a vision by a dedicated team of energetic professionals has today grown into a premier ISO 9001:2008 certified manufacturing hub, spanning 36,000 sq. feet in the industrial heart of Sahibabad, Delhi NCR. At IRI, we believe that quality is not just a standard but a commitment.
                </p>
                <p>
                  Our state-of-the-art manufacturing facility — equipped with a specialized Dust-Proof Chamber for PU Casting and our strategic technical tie-up with Baule Machine (France) — reflects our dedication to global excellence. With an R&D lab managed by highly experienced engineers, we ensure every product meets the most stringent quality benchmarks.
                </p>
              </div>
              {/* Signature block */}
              <div className="border-t border-gray-100 pt-6 flex items-center gap-6">
                <div>
                  <p className="text-[11px] text-gray-400 uppercase tracking-widest font-bold mb-1">Warm Regards,</p>
                  <p className="text-black font-black text-lg uppercase tracking-tight">Director</p>
                  <p className="text-orange-500 text-[11px] font-bold uppercase tracking-widest">Indian Roller (IRI)</p>
                  <p className="text-gray-400 text-[10px] uppercase tracking-widest mt-0.5">ISO 9001:2008 Certified</p>
                </div>
                <div className="ml-auto hidden sm:flex gap-8 text-center">
                  {[["1990","Est."],["36K","Sq. Ft."],["35+","Yrs Legacy"]].map(([val, lbl]) => (
                    <div key={lbl}>
                      <p className="text-2xl font-black text-black">{val}</p>
                      <p className="text-orange-500 text-[10px] uppercase tracking-widest font-bold">{lbl}</p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════
          JOURNEY / TIMELINE SECTION
      ══════════════════════════════════ */}
      <section className="py-20 bg-black overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">

          {/* Heading */}
          <div className="flex flex-col lg:flex-row gap-12 items-end mb-16">
            <div className="lg:w-1/3">
              <motion.p
                variants={slideFromLeft}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: false, amount: 0.8 }}
                className="text-orange-500 font-bold text-xs tracking-[3px] uppercase mb-4"
              >
                Our Journey
              </motion.p>
              <motion.h2
                variants={slideFromLeft}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: false, amount: 0.8 }}
                className="text-4xl md:text-5xl font-black uppercase leading-tight tracking-tighter text-white"
              >
                35 Years <br /> Of Precision <br />
                <span className="text-orange-500">& Pride.</span>
              </motion.h2>
              <motion.div
                className="w-20 h-1 bg-orange-500 mt-6"
                initial={{ width: 0 }}
                whileInView={{ width: 80 }}
                viewport={{ once: false }}
                transition={{ duration: 1, delay: 0.5 }}
              />
            </div>
            <motion.p
              variants={slideFromRight}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false, amount: 0.6 }}
              className="lg:w-2/3 text-gray-400 text-[13px] leading-7 font-medium border-l-4 border-orange-500 pl-4 italic"
            >
              From a small team with a bold dream in 1990 to a globally trusted ISO-certified manufacturer — every milestone in our journey reflects our uncompromising commitment to quality, innovation and honest service.
            </motion.p>
          </div>

          {/* Timeline */}
          <div ref={timelineRef} className="relative">

            {/* Vertical line track */}
            <div className="absolute left-[18px] md:left-1/2 top-0 bottom-0 w-px bg-white/10 -translate-x-px" />
            {/* Animated fill */}
            <motion.div
              className="absolute left-[18px] md:left-1/2 top-0 w-px bg-orange-500 -translate-x-px origin-top"
              style={{ height: lineHeight }}
            />

            <div className="space-y-12 md:space-y-0">
              {milestones.map((m, i) => {
                const isEven = i % 2 === 0;
                return (
                  <div
                    key={m.year}
                    className={`relative flex flex-col md:flex-row md:items-center gap-0 md:gap-0 ${
                      isEven ? "md:flex-row" : "md:flex-row-reverse"
                    }`}
                  >
                    {/* Content card */}
                    <motion.div
                      custom={i}
                      variants={isEven ? slideFromLeft : slideFromRight}
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: false, amount: 0.6 }}
                      className="md:w-[calc(50%-2rem)] pl-12 md:pl-0 md:pr-12 md:text-right"
                      style={isEven ? {} : { marginLeft: "auto", paddingRight: 0, paddingLeft: "3rem", textAlign: "left" }}
                    >
                      <div
                        className={`inline-block mb-3 ${isEven ? "md:ml-auto" : ""}`}
                        style={{ display: "block" }}
                      >
                        <span className="text-orange-500 font-black text-4xl tracking-tighter leading-none">
                          {m.year}
                        </span>
                      </div>
                      <h3 className="text-white font-black uppercase text-lg tracking-tight mb-2">
                        {m.title}
                      </h3>
                      <p className="text-gray-400 text-[13px] leading-6 font-medium">{m.desc}</p>
                    </motion.div>

                    {/* Dot */}
                    <div className="absolute left-[14px] md:left-1/2 md:-translate-x-1/2 top-1 md:top-auto flex-shrink-0 z-10">
                      <motion.div
                        initial={{ scale: 0 }}
                        whileInView={{ scale: 1 }}
                        viewport={{ once: false }}
                        transition={{ duration: 0.4, delay: i * 0.1 }}
                        className="w-[10px] h-[10px] rounded-full bg-orange-500 ring-4 ring-black ring-offset-0"
                      />
                    </div>

                    {/* Spacer for opposite side */}
                    <div className="hidden md:block md:w-[calc(50%-2rem)]" />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════
          MISSION & VISION SECTION
      ══════════════════════════════════ */}
      <section className="pt-20 pb-20 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">

          {/* Heading */}
          <div className="flex flex-col lg:flex-row gap-12 items-start mb-16">
            <div className="lg:w-1/3">
              <motion.p
                variants={slideFromLeft}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: false, amount: 0.8 }}
                className="text-orange-500 font-bold text-xs tracking-[3px] uppercase mb-4"
              >
                Our Purpose
              </motion.p>
              <motion.h2
                variants={slideFromLeft}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: false, amount: 0.8 }}
                className="text-4xl md:text-5xl font-black uppercase leading-tight tracking-tighter text-black"
              >
                Mission <br /> & Vision
              </motion.h2>
              <motion.div
                className="w-20 h-1 bg-orange-500 mt-6"
                initial={{ width: 0 }}
                whileInView={{ width: 80 }}
                viewport={{ once: false }}
                transition={{ duration: 1, delay: 0.5 }}
              />
            </div>
            <motion.p
              variants={slideFromRight}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false, amount: 0.6 }}
              className="lg:w-2/3 text-gray-500 font-bold text-sm leading-relaxed uppercase tracking-wider italic border-l-4 border-orange-500 pl-4 self-center"
            >
              The values and aspirations that have driven Indian Roller for over three decades — shaping every product, every partnership, and every promise we make to our clients.
            </motion.p>
          </div>

          {/* Mission + Vision Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
            {pillars.map((p, i) => (
              <motion.div
                key={p.tag}
                custom={i}
                variants={fadeInUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: false, amount: 0.5 }}
                className={`relative flex flex-col justify-between p-10 md:p-14 overflow-hidden group ${
                  i === 0 ? "bg-black" : "bg-orange-500"
                }`}
              >
                {/* Large watermark number */}
                <span
                  className={`absolute top-4 right-6 text-[120px] md:text-[160px] font-black leading-none select-none pointer-events-none transition-opacity duration-500 ${
                    i === 0 ? "text-white/5 group-hover:text-white/10" : "text-black/10 group-hover:text-black/15"
                  }`}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>

                {/* Tag */}
                <div>
                  <p
                    className={`font-bold text-[10px] tracking-[3px] uppercase mb-6 ${
                      i === 0 ? "text-orange-500" : "text-black"
                    }`}
                  >
                    {p.tag}
                  </p>

                  {/* Icon */}
                  <div
                    className={`mb-8 ${i === 0 ? "text-orange-500" : "text-black"}`}
                  >
                    {p.icon}
                  </div>

                  {/* Heading */}
                  <h3
                    className={`text-3xl md:text-4xl font-black uppercase leading-tight tracking-tighter mb-6 whitespace-pre-line ${
                      i === 0 ? "text-white" : "text-black"
                    }`}
                  >
                    {p.heading}
                  </h3>

                  {/* Divider */}
                  <div
                    className={`w-12 h-1 mb-6 ${i === 0 ? "bg-orange-500" : "bg-black"}`}
                  />

                  {/* Body */}
                  <p
                    className={`text-[13px] leading-7 font-medium ${
                      i === 0 ? "text-gray-400" : "text-black/70"
                    }`}
                  >
                    {p.body}
                  </p>
                </div>

                {/* Bottom CTA row */}
                <div
                  className={`mt-10 pt-6 border-t flex items-center justify-between ${
                    i === 0 ? "border-white/10" : "border-black/20"
                  }`}
                >
                  <span
                    className={`text-[10px] uppercase tracking-widest font-bold ${
                      i === 0 ? "text-gray-600" : "text-black/50"
                    }`}
                  >
                    Indian Roller (IRI)
                  </span>
                  <span
                    className={`text-[10px] uppercase tracking-widest font-bold ${
                      i === 0 ? "text-orange-500" : "text-black"
                    }`}
                  >
                    Since 1990 →
                  </span>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Bottom quality strip */}
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="mt-0 bg-gray-50 border-t-4 border-orange-500 grid grid-cols-2 md:grid-cols-4 divide-x divide-gray-200"
          >
            {[
              ["Quality", "ISO 9001:2008 Certified"],
              ["Innovation", "R&D-Driven Engineering"],
              ["Reliability", "On-Time Delivery Discipline"],
              ["Trust", "Global Client Network"],
            ].map(([title, sub]) => (
              <div key={title} className="px-8 py-8">
                <h4 className="text-black font-black uppercase text-sm tracking-tight mb-1">{title}</h4>
                <p className="text-gray-400 text-[11px] uppercase tracking-wider font-bold">{sub}</p>
              </div>
            ))}
          </motion.div>

        </div>
      </section>
    </>
  );
};

export default JourneyMissionVision;