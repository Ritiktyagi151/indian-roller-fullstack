"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";

/* ─── TAILWIND CONFIG ADDITIONS ───────────────────────────────────────────────
   Add these to tailwind.config.js → theme.extend:

   keyframes: {
     "slide-left":     { "0%": { opacity:"0", transform:"translateX(-80px)" }, "100%": { opacity:"1", transform:"translateX(0)" } },
     "slide-right":    { "0%": { opacity:"0", transform:"translateX(80px)" },  "100%": { opacity:"1", transform:"translateX(0)" } },
     "slide-up":       { "0%": { opacity:"0", transform:"translateY(60px)" },  "100%": { opacity:"1", transform:"translateY(0)" } },
     "slide-up-modal": { "0%": { opacity:"0", transform:"translateY(100%)" },  "100%": { opacity:"1", transform:"translateY(0)" } },
     "slide-dn-modal": { "0%": { opacity:"1", transform:"translateY(0)" },     "100%": { opacity:"0", transform:"translateY(100%)" } },
     "fade-in":        { "0%": { opacity:"0" },                                "100%": { opacity:"1" } },
     "fade-out":       { "0%": { opacity:"1" },                                "100%": { opacity:"0" } },
     "card-in":        { "0%": { opacity:"0", transform:"translateY(30px)" },  "100%": { opacity:"1", transform:"translateY(0)" } },
     "width-grow":     { "0%": { width:"0px" },                                "100%": { width:"80px" } },
     "slide-next":     { "0%": { transform:"translateX(100%)",  opacity:"0" }, "100%": { transform:"translateX(0)",    opacity:"1" } },
     "slide-prev":     { "0%": { transform:"translateX(-100%)", opacity:"0" }, "100%": { transform:"translateX(0)",    opacity:"1" } },
     "exit-next":      { "0%": { transform:"translateX(0)",     opacity:"1" }, "100%": { transform:"translateX(-100%)",opacity:"0" } },
     "exit-prev":      { "0%": { transform:"translateX(0)",     opacity:"1" }, "100%": { transform:"translateX(100%)", opacity:"0" } },
   },
   animation: {
     "slide-left":     "slide-left 0.8s ease-out both",
     "slide-right":    "slide-right 0.8s ease-out both",
     "slide-up":       "slide-up 0.8s cubic-bezier(0.22,1,0.36,1) both",
     "slide-up-modal": "slide-up-modal 0.35s cubic-bezier(0.22,1,0.36,1) both",
     "slide-dn-modal": "slide-dn-modal 0.35s cubic-bezier(0.22,1,0.36,1) both",
     "fade-in":        "fade-in 0.3s ease-out both",
     "fade-out":       "fade-out 0.3s ease-out both",
     "card-in":        "card-in 0.5s ease-out both",
     "width-grow":     "width-grow 1s ease-out 0.5s both",
     "slide-next":     "slide-next 0.45s cubic-bezier(0.32,0.72,0,1) both",
     "slide-prev":     "slide-prev 0.45s cubic-bezier(0.32,0.72,0,1) both",
   },
────────────────────────────────────────────────────────────────────────────── */

const productData = [
  {
    id: 1,
    name: "Steel Industry Roller",
    cat: "industries",
    desc: "Heavy-duty rollers for steel rolling mills, coil handling, and strip processing lines — built for extreme loads.",
    images: ["/product-img/Bridle-Roller.png", "/product-img/Applicator-Roller.png"],
    tags: ["Steel Mill", "Heavy Duty"],
    specs: [{ val: "Bridle Rollers, Applicator Rollers", lbl: "Material" }, { val: "High Load", lbl: "Capacity" }],
    isNew: true,
  },
  {
    id: 2,
    name: "Textile Industry",
    cat: "industries",
    desc: "FDA-compliant food-grade rollers for bakery, confectionery, and dairy processing lines. Non-toxic, easy-clean silicone formulations.",
    images: ["/product-img/mangle-squeeze-roller.png", "/product-img/merceriser-roller.png"],
    tags: ["Textile Mills"],
    specs: [{ val: "Mangle Squeeze Roller, Merceriser Roller", lbl: "Material" }, { val: "White", lbl: "Colour" }],
    isNew: true,
  },
  {
    id: 3,
    name: "Paper And Packaging Industry",
    cat: "industries",
    desc: "Heavy-duty press rollers and glue-spreader rollers for plywood and MDF manufacturing units.",
    images: ["/product-img/breast-roller.png", "/product-img/couch-roller.png"],
    tags: ["Press Roller", "Glue Spreader"],
    specs: [{ val: "Breast Rollers, Couch Rollers", lbl: "Material" }, { val: "Custom", lbl: "Size" }],
    isNew: false,
  },
  {
    id: 4,
    name: "Food Industry Rollers",
    cat: "industries",
    desc: "FDA-compliant food-grade rollers for bakery, confectionery, and dairy processing lines. Non-toxic, easy-clean silicone formulations.",
    images: ["/product-img/printing-roller.png", "/product-img/food-grade.png"],
    tags: ["FDA Grade", "Food Safe"],
    specs: [{ val: "Printing Rubber Rollers", lbl: "Material" }, { val: "White", lbl: "Colour" }],
    isNew: true,
  },
  {
    id: 5,
    name: "Turnkey Project",
    cat: "special",
    desc: "Complete turnkey roller solutions from design, fabrication, rubber bonding, grinding, and installation.",
    images: ["/product-img/world-data-locator-map-russia.webp", "/product-img/tanzania.jpg"],
    tags: ["Design", "Install"],
    specs: [{ val: "Full Line", lbl: "Scope" }, { val: "ISO 9001", lbl: "Quality" }],
    isNew: true,
  },
  {
    id: 6,
    name: "Miscellaneous Roller",
    cat: "rubber-rollers",
    desc: "General-purpose industrial rubber rollers for conveyor systems, printing, lamination, and guiding applications.",
    images: ["/product-img/woven-sacks-industries.jpg", "/product-img/tin-printing.jpg"],
    tags: ["Conveyor", "Lamination"],
    specs: [{ val: "NR/SBR", lbl: "Material" }, { val: "Custom", lbl: "Dimensions" }],
    isNew: false,
  },
  {
    id: 7,
    name: "Natural Rubber Roller",
    cat: "rubber-rollers",
    desc: "Classic natural rubber (NR) rollers offering excellent resilience, high tensile strength, and low heat build-up.",
    images: ["/product-img/natural-rubber.png"],
    tags: ["NR", "High Tensile"],
    specs: [{ val: "40–90 Shore", lbl: "Hardness" }, { val: "Natural", lbl: "Compound" }],
    isNew: false,
  },
  {
    id: 8,
    name: "Silicon Rubber Roller",
    cat: "rubber-rollers",
    desc: "Industrial silicone rollers with extreme heat resistance up to 250°C. Ideal for textile, food, and printing industries.",
    images: ["/product-img/silicon-white-roller.png"],
    tags: ["250°C Rated", "Non-Stick"],
    specs: [{ val: "Silicone", lbl: "Material" }, { val: "Up to 250°C", lbl: "Heat Resist." }],
    isNew: true,
  },
  {
    id: 10,
    name: "EPDM Rubber Roller",
    cat: "rubber-rollers",
    desc: "EPDM rollers offering excellent weather, ozone, and UV resistance. Widely used in outdoor and chemical-exposure environments.",
    images: ["/product-img/EPDM.png"],
    tags: ["EPDM", "UV Resistant"],
    specs: [{ val: "EPDM", lbl: "Material" }, { val: "Black", lbl: "Colour" }],
    isNew: false,
  },
];

const FILTERS = [
  { key: "all", label: "All Products" },
  { key: "rubber-rollers", label: "Rubber Rollers" },
  { key: "industries", label: "Industries" },
  { key: "special", label: "Special Projects" },
];

type Product = (typeof productData)[0];

/* ─── useInView ──────────────────────────────────────────────────────────────
   Lightweight IntersectionObserver hook. Fires once, then disconnects.
   Replaces framer-motion's useInView + whileInView.
────────────────────────────────────────────────────────────────────────────── */
function useInView(margin = "-50px"): [React.RefObject<HTMLDivElement>, boolean] {
  const ref = useRef<HTMLDivElement>(null!);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) { setInView(true); obs.disconnect(); }
      },
      { rootMargin: margin }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [margin]);
  return [ref, inView];
}

/* ─── IMAGE SLIDER ───────────────────────────────────────────────────────────
   Pure CSS slide transition via inline animation styles.
   animationend event unmounts the exiting slide cleanly.
────────────────────────────────────────────────────────────────────────────── */
const SLIDE_DURATION = "0.45s cubic-bezier(0.32,0.72,0,1)";

const ImageSlider = ({
  images,
  alt,
  className = "",
  autoPlay = false,
  interval = 3500,
  showArrowsAlways = false,
}: {
  images: string[];
  alt: string;
  className?: string;
  autoPlay?: boolean;
  interval?: number;
  showArrowsAlways?: boolean;
}) => {
  const [current, setCurrent] = useState(0);
  const [exitIdx, setExitIdx] = useState<number | null>(null);
  const [direction, setDirection] = useState<"next" | "prev">("next");
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const total = images.length;

  const go = useCallback(
    (idx: number, dir: "next" | "prev") => {
      setExitIdx(current);
      setDirection(dir);
      setCurrent((idx + total) % total);
    },
    [current, total]
  );

  const goNext = useCallback((e?: React.MouseEvent) => { e?.stopPropagation(); go(current + 1, "next"); }, [current, go]);
  const goPrev = useCallback((e?: React.MouseEvent) => { e?.stopPropagation(); go(current - 1, "prev"); }, [current, go]);

  useEffect(() => {
    if (!autoPlay || total <= 1) return;
    timerRef.current = setTimeout(goNext, interval);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [current, autoPlay, interval, goNext, total]);

  const touchStart = useRef<number | null>(null);
  const onTouchStart = (e: React.TouchEvent) => { touchStart.current = e.touches[0].clientX; };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStart.current === null) return;
    const diff = touchStart.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) diff > 0 ? goNext() : goPrev();
    touchStart.current = null;
  };

  if (total === 0) return null;

  const enterStyle: React.CSSProperties = exitIdx !== null
    ? { animation: `${direction === "next" ? "slide-next" : "slide-prev"} ${SLIDE_DURATION} both` }
    : {};

  const exitStyle: React.CSSProperties = {
    animation: `${direction === "next" ? "exit-next" : "exit-prev"} ${SLIDE_DURATION} both`,
  };

  const arrowCls = showArrowsAlways ? "opacity-100" : "opacity-0 group-hover:opacity-100";

  return (
    <div
      className={`relative w-full h-full overflow-hidden select-none ${className}`}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {/* Exiting slide */}
      {exitIdx !== null && (
        <div
          className="absolute inset-0"
          style={exitStyle}
          onAnimationEnd={() => setExitIdx(null)}
        >
          <Image
            src={images[exitIdx]}
            alt={`${alt} — ${exitIdx + 1}`}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover"
          />
        </div>
      )}

      {/* Current / entering slide */}
      <div key={current} className="absolute inset-0" style={enterStyle}>
        <Image
          src={images[current]}
          alt={`${alt} — ${current + 1}`}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover"
          priority={current === 0}
        />
      </div>

      {total > 1 && (
        <>
          <button
            onClick={goPrev}
            aria-label="Previous image"
            className={`absolute left-2 top-1/2 -translate-y-1/2 z-10 w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center bg-white/80 hover:bg-white text-black transition-all duration-200 ${arrowCls} hover:scale-110 shadow-md`}
            style={{ backdropFilter: "blur(4px)" }}
          >
            <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
              <path d="M9 2L4 7l5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <button
            onClick={goNext}
            aria-label="Next image"
            className={`absolute right-2 top-1/2 -translate-y-1/2 z-10 w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center bg-white/80 hover:bg-white text-black transition-all duration-200 ${arrowCls} hover:scale-110 shadow-md`}
            style={{ backdropFilter: "blur(4px)" }}
          >
            <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
              <path d="M5 2l5 5-5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-10 flex gap-1 sm:gap-1.5">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={(e) => { e.stopPropagation(); go(i, i > current ? "next" : "prev"); }}
                aria-label={`Go to image ${i + 1}`}
                className={`rounded-full transition-all duration-300 ${
                  i === current ? "w-4 sm:w-5 h-1.5 bg-white" : "w-1.5 h-1.5 bg-white/50 hover:bg-white/80"
                }`}
              />
            ))}
          </div>

          <div
            className="absolute top-2 right-2 z-10 bg-black/50 text-white text-[8px] sm:text-[9px] font-mono px-1.5 sm:px-2 py-0.5 rounded-full"
            style={{ backdropFilter: "blur(4px)" }}
          >
            {current + 1}/{total}
          </div>
        </>
      )}
    </div>
  );
};

/* ─── MAIN COMPONENT ─────────────────────────────────────────────────────────── */
const ProductSection = () => {
  const [activeFilter, setActiveFilter] = useState("all");
  const [selected, setSelected] = useState<Product | null>(null);
  const [closing, setClosing] = useState(false);
  // Bump this key to re-trigger card-in animation when filter changes
  const [filterKey, setFilterKey] = useState(0);

  const filtered =
    activeFilter === "all" ? productData : productData.filter((p) => p.cat === activeFilter);

  const handleFilter = (key: string) => {
    setActiveFilter(key);
    setFilterKey((k) => k + 1);
  };

  useEffect(() => {
    document.body.style.overflow = selected ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [selected]);

  const closeModal = () => setClosing(true);
  const handleModalAnimEnd = (e: React.AnimationEvent<HTMLDivElement>) => {
    // Only act on the sheet's own animation, not bubbled ones from children
    if (e.currentTarget === e.target && closing) {
      setSelected(null);
      setClosing(false);
    }
  };

  // Scroll-triggered header animations
  const [labelRef,   labelInView]   = useInView();
  const [headingRef, headingInView] = useInView();
  const [barRef,     barInView]     = useInView();
  const [descRef,    descInView]    = useInView();
  const [filterRef,  filterInView]  = useInView();

  return (
    <>
      {/* ── KEYFRAME INJECTION ── */}
      <style>{`
        @keyframes slide-left     { from{opacity:0;transform:translateX(-80px)} to{opacity:1;transform:translateX(0)} }
        @keyframes slide-right    { from{opacity:0;transform:translateX(80px)}  to{opacity:1;transform:translateX(0)} }
        @keyframes slide-up       { from{opacity:0;transform:translateY(60px)}  to{opacity:1;transform:translateY(0)} }
        @keyframes slide-up-modal { from{opacity:0;transform:translateY(100%)}  to{opacity:1;transform:translateY(0)} }
        @keyframes slide-dn-modal { from{opacity:1;transform:translateY(0)}     to{opacity:0;transform:translateY(100%)} }
        @keyframes fade-in-bg     { from{opacity:0} to{opacity:1} }
        @keyframes fade-out-bg    { from{opacity:1} to{opacity:0} }
        @keyframes card-in        { from{opacity:0;transform:translateY(30px)}  to{opacity:1;transform:translateY(0)} }
        @keyframes width-grow     { from{width:0px} to{width:80px} }
        @keyframes slide-next     { from{transform:translateX(100%);opacity:0}  to{transform:translateX(0);opacity:1} }
        @keyframes slide-prev     { from{transform:translateX(-100%);opacity:0} to{transform:translateX(0);opacity:1} }
        @keyframes exit-next      { from{transform:translateX(0);opacity:1}     to{transform:translateX(-100%);opacity:0} }
        @keyframes exit-prev      { from{transform:translateX(0);opacity:1}     to{transform:translateX(100%);opacity:0} }
      `}</style>

      <section className="bg-[#fcfaf7] py-10 sm:py-12 md:py-16 font-['DM_Sans']">
        <div className="mx-auto md:max-w-7xl px-4 sm:px-6 lg:px-8">

          {/* ── HEADER ── */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 md:gap-8 mb-10 sm:mb-12 md:mb-16">
            <div className="lg:w-1/2">

              <p
                ref={labelRef}
                className="text-orange-500 font-bold text-[10px] sm:text-xs tracking-[3px] uppercase mb-3 sm:mb-4"
                style={labelInView
                  ? { animation: "slide-left 0.8s ease-out both" }
                  : { opacity: 0 }}
              >
                Catalogue 2026
              </p>

              <h2
                ref={headingRef}
                className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold uppercase leading-tight tracking-tighter text-black"
                style={headingInView
                  ? { animation: "slide-right 0.8s ease-out both" }
                  : { opacity: 0 }}
              >
                OUR PRODUCTS <br />
                <span className="text-orange-500 font-extrabold text-2xl sm:text-3xl md:text-4xl lg:text-5xl">
                  & SOLUTIONS
                </span>
              </h2>

              {/* Orange underbar — width animated from 0 → 80px */}
              <div
                ref={barRef}
                className="h-1 bg-orange-500 mt-4 sm:mt-6"
                style={barInView
                  ? { animation: "width-grow 1s ease-out 0.5s both" }
                  : { width: 0 }}
              />
            </div>

            <div className="max-w-xs">
              <p
                ref={descRef}
                className="text-gray-500 text-xs sm:text-sm leading-relaxed border-l-2 border-orange-500 pl-4 sm:pl-5"
                style={descInView
                  ? { animation: "slide-right 0.8s ease-out 0.2s both" }
                  : { opacity: 0 }}
              >
                Precision-engineered rubber rollers designed for high-end industrial performance and extreme durability.
              </p>
            </div>
          </div>

          {/* ── FILTER BAR ── */}
          <div
            ref={filterRef}
            className="overflow-x-auto pb-1 mb-8 sm:mb-10 md:mb-12 -mx-4 px-4 sm:mx-0 sm:px-0"
            style={filterInView
              ? { animation: "slide-up 0.8s cubic-bezier(0.22,1,0.36,1) 0.3s both" }
              : { opacity: 0 }}
          >
            <div className="flex gap-2 sm:gap-3 sm:flex-wrap min-w-max sm:min-w-0">
              {FILTERS.map((f) => (
                <button
                  key={f.key}
                  onClick={() => handleFilter(f.key)}
                  className={`px-4 sm:px-6 py-2 font-mono text-[8px] sm:text-[9px] tracking-widest uppercase transition-all duration-300 border whitespace-nowrap ${
                    activeFilter === f.key
                      ? "bg-[#111] text-white border-[#111]"
                      : "bg-white text-gray-400 border-gray-200 hover:border-orange-500 hover:text-orange-500"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* ── PRODUCT GRID ──
              key={filterKey} forces React to re-mount the grid so card-in
              animations replay on every filter change.
          */}
          <div
            key={filterKey}
            className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-5 md:gap-6"
          >
            {filtered.map((p, i) => (
              <div
                key={p.id}
                onClick={() => setSelected(p)}
                className="group relative cursor-pointer bg-white border border-gray-100 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 overflow-hidden rounded-sm"
                style={{ animation: `card-in 0.5s ease-out ${i * 0.05}s both` }}
              >
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] group-hover:opacity-[0.05] transition-opacity" />
                <div className="absolute -inset-0.5 bg-gradient-to-br from-orange-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl" />

                <div className="relative w-full h-[200px] sm:h-[220px] md:h-[240px] overflow-hidden bg-gray-50 border-b border-gray-50">
                  <ImageSlider
                    images={p.images}
                    alt={p.name}
                    autoPlay={true}
                    interval={3000 + i * 200}
                  />
                  {p.isNew && (
                    <span className="absolute top-2 left-2 sm:top-4 sm:left-4 z-20 bg-orange-500 text-white text-[7px] sm:text-[8px] px-1.5 sm:px-2 py-0.5 sm:py-1 uppercase tracking-widest font-bold shadow-sm">
                      New
                    </span>
                  )}
                  <div className="absolute inset-0 z-10 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 hidden sm:flex items-center justify-center pointer-events-none">
                    <span className="opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300 bg-white/95 text-black px-3 sm:px-4 py-1.5 sm:py-2 text-[9px] sm:text-[10px] font-mono tracking-tighter shadow-xl">
                      QUICK VIEW
                    </span>
                  </div>
                </div>

                <div className="relative z-10 p-3 sm:p-5 md:p-6 bg-white group-hover:bg-white/95 transition-colors">
                  <h3
                    style={{ fontFamily: "'Bebas Neue', sans-serif" }}
                    className="text-lg sm:text-2xl text-[#111] group-hover:text-orange-500 transition-colors leading-tight tracking-wide"
                  >
                    {p.name}
                  </h3>
                  <p className="text-xs text-gray-400 mt-1 sm:mt-2 line-clamp-3 leading-relaxed">
                    {p.desc}
                  </p>
                  <div className="mt-2 sm:mt-5 flex justify-between items-center border-t pt-2 sm:pt-4 border-gray-50">
                    <span className="text-[7px] sm:text-[9px] font-mono text-gray-400 group-hover:text-gray-600 transition-colors uppercase tracking-widest">
                      {p.cat.replace("-", " ")}
                    </span>
                    <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-gray-50 group-hover:bg-orange-500 group-hover:text-white flex items-center justify-center transition-all">
                      <span className="text-xs">→</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ── MODAL ── */}
      {selected && (
        <div className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center p-0 sm:p-4">

          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            style={{ animation: closing ? "fade-out-bg 0.3s ease-out both" : "fade-in-bg 0.3s ease-out both" }}
            onClick={closeModal}
          />

          {/* Sheet — plays exit animation before unmount via onAnimationEnd */}
          <div
            className="relative w-full sm:max-w-4xl bg-white shadow-2xl flex flex-col md:flex-row overflow-hidden"
            style={{
              maxHeight: "92dvh",
              animation: closing
                ? "slide-dn-modal 0.35s cubic-bezier(0.22,1,0.36,1) both"
                : "slide-up-modal 0.35s cubic-bezier(0.22,1,0.36,1) both",
            }}
            onAnimationEnd={handleModalAnimEnd}
          >
            {/* Close */}
            <button
              onClick={closeModal}
              className="absolute top-3 right-3 sm:top-4 sm:right-4 z-30 w-8 h-8 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded-full text-sm hover:rotate-90 transition-all"
            >
              ✕
            </button>

            {/* Mobile drag handle */}
            <div className="sm:hidden absolute top-2 left-1/2 -translate-x-1/2 w-10 h-1 bg-gray-300 rounded-full z-30" />

            {/* Image panel */}
            <div className="relative w-full h-[220px] sm:h-[280px] md:h-auto md:w-1/2 md:min-h-[440px] md:self-stretch flex-shrink-0 overflow-hidden">
              <ImageSlider
                images={selected.images}
                alt={selected.name}
                autoPlay={false}
                showArrowsAlways={true}
              />
            </div>

            {/* Content */}
            <div className="p-5 sm:p-8 md:p-10 lg:p-12 flex-1 overflow-y-auto overscroll-contain">
              <span className="text-[#c85a1a] font-mono text-[9px] sm:text-[10px] tracking-[4px] uppercase mb-3 sm:mb-4 block">
                Industrial Grade
              </span>
              <h2
                style={{ fontFamily: "'Bebas Neue', sans-serif" }}
                className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-[#111] leading-none mb-3 sm:mb-6"
              >
                {selected.name}
              </h2>
              <p className="text-gray-500 text-xs sm:text-sm leading-relaxed mb-4 sm:mb-8">
                {selected.desc}
              </p>

              <div className="grid grid-cols-2 gap-2 sm:gap-4 mb-4 sm:mb-8">
                {selected.specs.map((s) => (
                  <div key={s.lbl} className="bg-gray-50 p-2.5 sm:p-4 border-l-2 border-[#c85a1a]">
                    <div className="text-[#c85a1a] font-bold text-xs sm:text-lg leading-snug">{s.val}</div>
                    <div className="text-[7px] sm:text-[8px] uppercase tracking-widest text-gray-400 mt-1">{s.lbl}</div>
                  </div>
                ))}
              </div>

              <p className="text-[8px] sm:text-[9px] font-mono text-gray-300 uppercase tracking-widest mb-4 sm:mb-6">
                {selected.images.length} image{selected.images.length !== 1 ? "s" : ""} — swipe or use arrows to browse
              </p>

              <Link href="/contact">
                <button className="w-full bg-[#111] text-white py-3 sm:py-4 text-[9px] sm:text-[10px] font-mono tracking-[3px] sm:tracking-[4px] uppercase hover:text-orange-500 transition-colors">
                  Enquire Now →
                </button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProductSection;