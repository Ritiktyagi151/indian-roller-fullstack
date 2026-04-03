"use client";
import React, { useEffect, useRef, useState } from "react";
import { motion, type Variants } from "framer-motion";

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

const slideFromLeft: Variants = {
  hidden: { opacity: 0, x: -60 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.7, ease: "easeOut" as const },
  },
};
const slideFromRight: Variants = {
  hidden: { opacity: 0, x: 60 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.7, ease: "easeOut" as const },
  },
};
const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.55,
      ease: "easeOut" as const,
      delay: i * 0.1,
    },
  }),
};

/* ─── VERTICAL (mobile) ─── */
const VerticalTimeline = () => (
  <div className="relative pl-8 sm:pl-12">
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
        <div
          className={`absolute -left-[21px] sm:-left-[27px] top-1.5 w-3 h-3 rounded-full z-10 ring-4 ring-black ${
            m.upcoming
              ? "border-2 border-dashed border-orange-500 bg-black"
              : "bg-orange-500"
          }`}
        />
        <span className={`font-black text-2xl sm:text-3xl tracking-tighter leading-none block mb-1 ${m.upcoming ? "text-orange-500/50" : "text-orange-500"}`}>
          {m.year}
        </span>
        <h3 className={`font-black uppercase text-sm tracking-tight mb-1 ${m.upcoming ? "text-white/40" : "text-white"}`}>
          {m.title}
        </h3>
        <p className={`text-[13px] leading-5 font-medium ${m.upcoming ? "text-gray-700" : "text-gray-400"}`}>
          {m.desc}
        </p>
        {m.upcoming && (
          <span className="inline-block mt-2 px-2 py-0.5 border border-orange-500/40 text-orange-500/60 text-[9px] uppercase tracking-widest font-bold rounded-sm">
            Upcoming
          </span>
        )}
      </motion.div>
    ))}
  </div>
);

/* ─── S-CURVE HORIZONTAL (desktop) ─── */
const VW = 1000, VH = 320;
const topY = 80, botY = 240;

const pts = [
  { x: 60,  y: topY },
  { x: 200, y: topY + (botY - topY) * 0.5 },
  { x: 340, y: botY },
  { x: 500, y: (topY + botY) / 2 },
  { x: 660, y: topY },
  { x: 820, y: topY + (botY - topY) * 0.5 },
  { x: 940, y: botY },
];

function catmullToBezier(points: { x: number; y: number }[]) {
  let d = `M ${points[0].x} ${points[0].y}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[Math.max(i - 1, 0)];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[Math.min(i + 2, points.length - 1)];
    const cp1x = p1.x + (p2.x - p0.x) / 6;
    const cp1y = p1.y + (p2.y - p0.y) / 6;
    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = p2.y - (p3.y - p1.y) / 6;
    d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
  }
  return d;
}

const sPath = catmullToBezier(pts);

type CardData = {
  year: string;
  title: string;
  desc: string;
  upcoming?: boolean;
  screenX: number;
  screenY: number;
  isAbove: boolean;
  i: number;
};

const SCurveTimeline = () => {
  const stageRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const progressRef = useRef<SVGPathElement>(null);
  const [cards, setCards] = useState<CardData[]>([]);
  const [dashLen, setDashLen] = useState("0 2000");

  const placeCards = () => {
    if (!stageRef.current || !svgRef.current) return;
    const stageRect = stageRef.current.getBoundingClientRect();
    const svgRect = svgRef.current.getBoundingClientRect();
    const scaleX = svgRect.width / VW;
    const scaleY = svgRect.height / VH;

    const placed: CardData[] = pts.map((p, i) => {
      const m = milestones[i];
      const isAbove = p.y <= (topY + botY) / 2;
      return {
        ...m,
        screenX: svgRect.left - stageRect.left + p.x * scaleX,
        screenY: svgRect.top - stageRect.top + p.y * scaleY,
        isAbove,
        i,
      };
    });
    setCards(placed);
  };

  const animateLine = () => {
    const el = progressRef.current;
    if (!el) return;
    const totalLen = el.getTotalLength?.() ?? 1200;
    let start: number | null = null;
    const dur = 2200;
    const step = (ts: number) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / dur, 1);
      setDashLen(`${p * totalLen} ${totalLen}`);
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      placeCards();
      animateLine();
    }, 150);
    window.addEventListener("resize", placeCards);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", placeCards);
    };
  }, []);

  return (
    <div className="relative" ref={stageRef} style={{ height: 480 }}>
      <svg
        ref={svgRef}
        viewBox={`0 0 ${VW} ${VH}`}
        preserveAspectRatio="xMidYMid meet"
        className="w-full"
        style={{ overflow: "visible" }}
      >
        {/* Ghost path */}
        <path d={sPath} fill="none" stroke="rgba(249,115,22,0.2)" strokeWidth="1.5" strokeDasharray="5 4" />
        {/* Animated progress */}
        <path ref={progressRef} d={sPath} fill="none" stroke="#f97316" strokeWidth="2" strokeDasharray={dashLen} />
        {/* Dots */}
        {pts.map((p, i) => {
          const m = milestones[i];
          return m?.upcoming ? (
            <circle key={i} cx={p.x} cy={p.y} r="7"
              fill="#000" stroke="#f97316" strokeWidth="1.5" strokeDasharray="3 2" />
          ) : (
            <g key={i}>
              <circle cx={p.x} cy={p.y} r="12"
                fill="none" stroke="rgba(249,115,22,0.15)" strokeWidth="2" />
              <circle cx={p.x} cy={p.y} r="7" fill="#f97316" />
            </g>
          );
        })}
      </svg>

      {/* Cards */}
      {cards.map((c) => (
        <motion.div
          key={c.i}
          custom={c.i}
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.2 }}
          className="absolute w-[130px] xl:w-[150px]"
          style={{
            left: c.screenX,
            top: c.isAbove ? c.screenY - 18 : c.screenY + 18,
            transform: c.isAbove ? "translate(-50%, -100%)" : "translateX(-50%)",
          }}
        >
          <p className={`font-black text-2xl xl:text-3xl leading-none tracking-tight text-center ${c.upcoming ? "text-orange-500/30" : "text-orange-500"}`}>
            {c.year}
          </p>
          <h3 className={`font-black uppercase text-[9px] xl:text-[10px] tracking-widest text-center mt-1 leading-tight ${c.upcoming ? "text-white/25" : "text-white"}`}>
            {c.title}
          </h3>
          <p className={`text-[10px] leading-relaxed text-center mt-1 hidden xl:block ${c.upcoming ? "text-gray-800" : "text-gray-500"}`}>
            {c.desc}
          </p>
          {c.upcoming && (
            <span className="block text-center mt-1.5 px-1.5 py-0.5 border border-orange-500/40 text-orange-500/60 text-[8px] uppercase tracking-widest font-bold rounded-sm">
              Upcoming
            </span>
          )}
        </motion.div>
      ))}
    </div>
  );
};

/* ─── MAIN EXPORT ─── */
const JourneyTimeline = () => {
  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-black overflow-hidden">
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;700;900&family=Barlow:wght@400;500&display=swap');`}</style>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Heading */}
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-end mb-10 lg:mb-0">
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

        {/* Mobile: vertical | Desktop: S-curve */}
        <div className="block lg:hidden">
          <VerticalTimeline />
        </div>
        <div className="hidden lg:block">
          <SCurveTimeline />
        </div>

      </div>
    </section>
  );
};

export default JourneyTimeline;
