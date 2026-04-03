"use client";
import React, { useEffect, useRef, useState } from "react";
import { motion, Variants } from "framer-motion";

/* ─────────────────────────────────────────────
   DATA
───────────────────────────────────────────── */
const milestones = [
  {
    year: "1990",
    title: "Foundation in Shahdara",
    desc: "The journey began with the establishment of the company's first unit in Shahdara, laying a strong foundation for future growth.",
  },
  {
    year: "2008",
    title: "Expansion to Sahibabad",
    desc: "The company expanded operations to Sahibabad, enhancing production capacity and benefiting from proximity to the NCR industrial belt for improved logistics.",
  },
  {
    year: "2017",
    title: "Operations in Jamshedpur",
    desc: "A strategic move into Jamshedpur enabled the company to tap into the growing industrial markets of Jharkhand and eastern India.",
  },
  {
    year: "2021",
    title: "Entry into Bangladesh",
    desc: "Indian Roller Industries marked its first international expansion by entering the Bangladesh market, establishing its presence in South Asia.",
  },
  {
    year: "2022",
    title: "Facility in Ahmedabad",
    desc: "The launch of a manufacturing unit in Ahmedabad strengthened the company's footprint in western India and boosted regional supply capabilities.",
  },
  {
    year: "2025",
    title: "Expansion to Bellary, Karnataka",
    desc: "Operations in Bellary marked the company's entry into South India, enabling efficient service to southern markets.",
  },
  {
    year: "Soon™",
    title: "Tanzania, Africa",
    desc: "The planned launch of a unit in Tanzania represents a significant milestone as the company ventures into Africa for the first time, tapping into emerging markets.",
    upcoming: true,
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
   VERTICAL TIMELINE  — mobile & tablet
───────────────────────────────────────────── */
const VerticalTimeline = () => (
  <div className="relative pl-8 sm:pl-12">
    {/* Vertical spine */}
    <div className="absolute left-[11px] sm:left-[19px] top-0 bottom-0 w-px bg-white/10" />

    {milestones.map((m, i) => (
      <motion.div
        key={m.year}
        custom={i}
        variants={fadeInUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, amount: 0.25 }}
        className="relative mb-10 last:mb-0"
      >
        {/* Dot */}
        <div
          className={`absolute -left-[21px] sm:-left-[27px] top-1.5 w-3 h-3 rounded-full z-10 ring-4 ring-black ${
            (m as any).upcoming
              ? "border-2 border-dashed border-orange-500 bg-black"
              : "bg-orange-500"
          }`}
        />

        <span
          className={`font-black text-2xl sm:text-3xl tracking-tighter leading-none block mb-1 ${
            (m as any).upcoming ? "text-orange-500/50" : "text-orange-500"
          }`}
        >
          {m.year}
        </span>
        <h3
          className={`font-black uppercase text-sm tracking-tight mb-1 ${
            (m as any).upcoming ? "text-white/40" : "text-white"
          }`}
        >
          {m.title}
        </h3>
        <p
          className={`text-[13px] leading-5 font-medium ${
            (m as any).upcoming ? "text-gray-700" : "text-gray-400"
          }`}
        >
          {m.desc}
        </p>
        {(m as any).upcoming && (
          <span className="inline-block mt-2 px-2 py-0.5 border border-orange-500/40 text-orange-500/60 text-[9px] uppercase tracking-widest font-bold rounded-sm">
            Upcoming
          </span>
        )}
      </motion.div>
    ))}
  </div>
);

/* ─────────────────────────────────────────────
   HORIZONTAL TIMELINE — desktop (lg+)
───────────────────────────────────────────── */
const HorizontalTimeline = () => {
  const timelineRef = useRef<HTMLDivElement>(null);
  const [lineWidth, setLineWidth] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!timelineRef.current) return;
      const rect = timelineRef.current.getBoundingClientRect();
      const totalHeight = timelineRef.current.offsetHeight;
      const scrolled = Math.max(0, window.innerHeight - rect.top);
      const progress = Math.min(scrolled / (totalHeight + window.innerHeight), 1);
      setLineWidth(progress * timelineRef.current.offsetWidth);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div ref={timelineRef} className="relative">
      {/* Track */}
      <div className="absolute left-0 right-0 top-[7px] h-px bg-white/10" />
      {/* Animated fill */}
      <div
        className="absolute left-0 top-[7px] h-px bg-orange-500"
        style={{ width: lineWidth }}
      />

      <div className="flex items-start justify-between gap-3 xl:gap-4">
        {milestones.map((m, i) => (
          <div
            key={m.year}
            className="relative flex flex-col items-center flex-1 min-w-0"
          >
            {/* Dot */}
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: false }}
              transition={{ duration: 0.35, delay: i * 0.08 }}
              className={`w-[14px] h-[14px] rounded-full z-10 mb-5 flex-shrink-0 ${
                (m as any).upcoming
                  ? "border-2 border-dashed border-orange-500 bg-black ring-4 ring-black"
                  : "bg-orange-500 ring-4 ring-black"
              }`}
            />

            <motion.div
              custom={i}
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false, amount: 0.3 }}
              className="text-center w-full"
            >
              <span
                className={`font-black text-lg xl:text-2xl tracking-tighter leading-none block mb-1.5 ${
                  (m as any).upcoming ? "text-orange-500/50" : "text-orange-500"
                }`}
              >
                {m.year}
              </span>
              <h3
                className={`font-black uppercase text-[9px] xl:text-[11px] tracking-tight mb-1 leading-tight ${
                  (m as any).upcoming ? "text-white/40" : "text-white"
                }`}
              >
                {m.title}
              </h3>
              {/* desc only on xl */}
              <p
                className={`text-[10px] leading-4 font-medium hidden xl:block ${
                  (m as any).upcoming ? "text-gray-700" : "text-gray-400"
                }`}
              >
                {m.desc}
              </p>
              {(m as any).upcoming && (
                <span className="inline-block mt-1.5 px-1.5 py-0.5 border border-orange-500/40 text-orange-500/60 text-[8px] uppercase tracking-widest font-bold rounded-sm">
                  Upcoming
                </span>
              )}
            </motion.div>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────
   MAIN EXPORT
───────────────────────────────────────────── */
const JourneyMissionVision = () => {
  return (
    <>
      {/* ══════════════════════
          DIRECTOR'S MESSAGE
      ══════════════════════ */}
      <section className="pt-12 sm:pt-16 lg:pt-20 pb-0 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start mb-12 lg:mb-16">

            {/* Left heading */}
            <div className="w-full lg:w-1/3">
              <motion.p
                variants={slideFromLeft}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: false, amount: 0.6 }}
                className="text-orange-500 font-bold text-xs tracking-[3px] uppercase mb-3"
              >
                About Us
              </motion.p>
              <motion.h2
                variants={slideFromLeft}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: false, amount: 0.6 }}
                className="text-3xl sm:text-4xl lg:text-5xl font-black uppercase leading-tight tracking-tighter text-black"
              >
                Director's <br /> Message
                <span className="block text-orange-500 text-xl sm:text-2xl lg:text-3xl mt-2 normal-case font-black italic">
                  "To Evolve is to Last Forever"
                </span>
              </motion.h2>
              <motion.div
                className="h-1 bg-orange-500 mt-5"
                initial={{ width: 0 }}
                whileInView={{ width: 80 }}
                viewport={{ once: false }}
                transition={{ duration: 1, delay: 0.4 }}
              />
            </div>

            {/* Right body */}
            <motion.div
              className="w-full lg:w-2/3"
              variants={slideFromRight}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false, amount: 0.4 }}
            >
              <p className="text-gray-500 font-bold text-xs sm:text-sm leading-relaxed mb-5 uppercase tracking-wider italic border-l-4 border-orange-500 pl-4">
                Since our inception in 1990, the journey of Indian Roller (IRI) has been guided by a singular, simple philosophy: to create products that are honestly made and sincerely served.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-gray-400 text-[13px] leading-7 font-medium mb-6">
                <p>
                  What began as a vision by a dedicated team of energetic professionals has today grown into a premier ISO 9001:2008 certified manufacturing hub, spanning 36,000 sq. feet in the industrial heart of Sahibabad, Delhi NCR.
                </p>
                <p>
                  Our state-of-the-art facility — equipped with a Dust-Proof Chamber for PU Casting and a strategic tie-up with Baule Machine (France) — reflects our dedication to global excellence. Our R&D lab ensures every product meets the most stringent quality benchmarks.
                </p>
              </div>
              {/* Signature */}
              <div className="border-t border-gray-100 pt-5 flex flex-wrap items-center gap-6">
                <div>
                  <p className="text-[11px] text-gray-400 uppercase tracking-widest font-bold mb-1">Warm Regards,</p>
                  <p className="text-black font-black text-base sm:text-lg uppercase tracking-tight">Director</p>
                  <p className="text-orange-500 text-[11px] font-bold uppercase tracking-widest">Indian Roller (IRI)</p>
                  <p className="text-gray-400 text-[10px] uppercase tracking-widest mt-0.5">ISO 9001:2008 Certified</p>
                </div>
                <div className="ml-auto flex gap-5 sm:gap-8 text-center">
                  {[["1990","Est."],["36K","Sq. Ft."],["35+","Yrs Legacy"]].map(([val, lbl]) => (
                    <div key={lbl}>
                      <p className="text-xl sm:text-2xl font-black text-black">{val}</p>
                      <p className="text-orange-500 text-[10px] uppercase tracking-widest font-bold">{lbl}</p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ══════════════════════
          JOURNEY / TIMELINE
      ══════════════════════ */}
      <section className="py-12 sm:py-16 lg:py-20 bg-black overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Heading row */}
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-end mb-10 lg:mb-16">
            <div className="w-full lg:w-1/3">
              <motion.p
                variants={slideFromLeft}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: false, amount: 0.6 }}
                className="text-orange-500 font-bold text-xs tracking-[3px] uppercase mb-3"
              >
                Our Journey
              </motion.p>
              <motion.h2
                variants={slideFromLeft}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: false, amount: 0.6 }}
                className="text-3xl sm:text-4xl lg:text-5xl font-black uppercase leading-tight tracking-tighter text-white"
              >
                35 Years <br /> Of Precision <br />
                <span className="text-orange-500">& Pride.</span>
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
              className="w-full lg:w-2/3 text-gray-400 text-[13px] leading-7 font-medium border-l-4 border-orange-500 pl-4 italic"
            >
              From a humble first unit in Shahdara in 1990 to a globally expanding manufacturer with a footprint across India, South Asia and now Africa — every milestone reflects our uncompromising commitment to quality, innovation and honest service.
            </motion.p>
          </div>

          {/* Vertical on mobile/tablet, horizontal on desktop */}
          <div className="block lg:hidden">
            <VerticalTimeline />
          </div>
          <div className="hidden lg:block">
            <HorizontalTimeline />
          </div>

        </div>
      </section>

      {/* ══════════════════════
          MISSION & VISION
      ══════════════════════ */}
      <section className="pt-12 sm:pt-16 lg:pt-20 pb-12 sm:pb-16 lg:pb-20 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Heading */}
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start mb-10 lg:mb-16">
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
    </>
  );
};

export default JourneyMissionVision;