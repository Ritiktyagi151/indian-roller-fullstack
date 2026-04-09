"use client";
import React, { useState, useEffect, useRef } from "react";
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
   },
────────────────────────────────────────────────────────────────────────────── */

const productData = [
  {
    id: 1,
    name: "Steel Industry Roller",
    slug: "products-steel-industry",
    cat: "industries",
    desc: "Heavy-duty rollers for steel rolling mills, coil handling, and strip processing lines—engineered to withstand extreme loads and high temperatures.",
    image: "/industry-img/steel.webp",
    tags: ["Steel Mill", "Heavy Duty"],
    specs: [{ val: "Bridle & Applicator Rollers", lbl: "Material" }, { val: "High Load", lbl: "Capacity" }],
    isNew: true,
  },
  {
    id: 2,
    name: "Textile Industry",
    slug: "textile-industry",
    cat: "industries",
    desc: "Precision rollers for dyeing, printing, and finishing processes. Designed for chemical resistance and uniform pressure distribution across fabrics.",
    image: "/industry-img/textile-industry.png",
    tags: ["Textile Mills"],
    specs: [{ val: "Mangle Squeeze & Merceriser", lbl: "Type" }, { val: "Chemical Resistant", lbl: "Feature" }],
    isNew: true,
  },
  {
    id: 3,
    name: "Paper and Packaging Industry",
    slug: "paper-and-packaging-industry",
    cat: "industries",
    desc: "Durable press rollers and glue-spreader rollers designed for high-speed paper mills and plywood manufacturing units.",
    image: "/industry-img/paper.webp",
    tags: ["Press Roller", "Glue Spreader"],
    specs: [{ val: "Breast & Couch Rollers", lbl: "Material" }, { val: "Custom", lbl: "Size" }],
    isNew: false,
  },
  {
    id: 4,
    name: "Food Industry Rollers",
    slug: "food-industry",
    cat: "industries",
    desc: "FDA-compliant, food-grade rollers for bakery, confectionery, and dairy processing. Features non-toxic, easy-clean silicone formulations.",
    image: "/industry-img/food-industry2.png",
    tags: ["FDA Grade", "Food Safe"],
    specs: [{ val: "Food-Grade Rubber", lbl: "Material" }, { val: "White / Custom", lbl: "Colour" }],
    isNew: true,
  },
     {
  id: 5,
  name: "Cement Industry ",
  slug: "cement-industry",
  cat: "rubber-rollers",
  desc: "Heavy-duty rubber rollers designed for the cement industry, built to withstand abrasive materials, high loads, and harsh operating conditions. These rollers are widely used in conveyor systems, clinker handling, raw material transport, and grinding units, ensuring smooth operation, durability, and minimal maintenance in demanding environments.",
  image: "/industry-img/cement-industries.png",
  tags: ["Conveyor", "Clinker Handling", "Heavy Duty", "Abrasion Resistant"],
  specs: [
    { val: "NR / SBR / Nitrile / EPDM", lbl: "Material" },
    { val: "High Abrasion Resistant", lbl: "Surface Property" },
    { val: "Up to 120°C", lbl: "Temperature Resistance" },
    { val: "Custom (Bespoke)", lbl: "Dimensions" },
    { val: "High Load Bearing", lbl: "Capacity" }
  ],
  isNew: false,
},
  
  {
    id: 6,
    name: "Miscellaneous Rollers",
    slug: "miscellaneous-roller",
    cat: "rubber-rollers",
    desc: "General-purpose industrial rollers for conveyor systems, tin printing, lamination, and various guiding applications.",
    image: "/industry-img/miscellaneous-industry.png",
    tags: ["Conveyor", "Lamination"],
    specs: [{ val: "NR / SBR / Nitrile", lbl: "Material" }, { val: "Bespoke", lbl: "Dimensions" }],
    isNew: false,
  },
  {
    id: 7,
    name: "Turnkey Projects",
    slug: "turnkey-project",
    cat: "special",
    desc: "Comprehensive turnkey solutions covering design, fabrication, rubber bonding, precision grinding, and final installation.",
    image: "/industry-img/turnkey-project-new.jpg",
    tags: ["Design", "Installation"],
    specs: [{ val: "End-to-End", lbl: "Scope" }, { val: "ISO Certified", lbl: "Quality" }],
    isNew: true,
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

/* ─── MAIN COMPONENT ─────────────────────────────────────────────────────────── */
const ProductSection = () => {
  const [activeFilter, setActiveFilter] = useState("all");
  const [selected, setSelected] = useState<Product | null>(null);
  const [closing, setClosing] = useState(false);
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
                High-performance rubber rollers precision-engineered for industrial excellence and extreme durability.
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

          {/* ── PRODUCT GRID ── */}
          <div
            key={filterKey}
            className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-5 md:gap-6"
          >
            {filtered.map((p, i) => (
              <Link
                key={p.id}
                href={`/${p.slug}`}
                className="group relative cursor-pointer bg-white border border-gray-100 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 overflow-hidden rounded-sm block"
                style={{ animation: `card-in 0.5s ease-out ${i * 0.05}s both` }}
                onClick={(e) => {
                  const target = e.target as HTMLElement;
                  const isImageArea = target.closest("[data-image-area]");
                  if (isImageArea) {
                    e.preventDefault();
                    setSelected(p);
                  }
                }}
              >
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] group-hover:opacity-[0.05] transition-opacity" />
                <div className="absolute -inset-0.5 bg-gradient-to-br from-orange-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl" />

                {/* Image area — click opens modal */}
                <div
                  data-image-area="true"
                  className="relative w-full h-[200px] sm:h-[220px] md:h-[240px] overflow-hidden bg-gray-50 border-b border-gray-50"
                  onClick={(e) => { e.preventDefault(); setSelected(p); }}
                >
                  <Image
                    src={p.image}
                    alt={p.name}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    priority={i < 4}
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

                {/* Text content */}
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
                    <span className="text-[7px] sm:text-[9px] font-mono text-gray-400 group-hover:text-orange-500 transition-colors uppercase tracking-widest">
                      {p.cat.replace("-", " ")}
                    </span>
                    <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-gray-50 group-hover:bg-orange-500 group-hover:text-white flex items-center justify-center transition-all">
                      <span className="text-xs">→</span>
                    </div>
                  </div>
                </div>
              </Link>
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

          {/* Sheet */}
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
              <Image
                src={selected.image}
                alt={selected.name}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
                priority
              />
            </div>

            {/* Content */}
            <div className="p-5 sm:p-8 md:p-10 lg:p-12 flex-1 overflow-y-auto overscroll-contain">
              <span className="text-[#c85a1a] font-mono text-[9px] sm:text-[10px] tracking-[4px] uppercase mb-3 sm:mb-4 block">
                Premium Industrial Grade
              </span>

              <Link href={`/${selected.slug}`}>
                <h2
                  style={{ fontFamily: "'Bebas Neue', sans-serif" }}
                  className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-[#111] leading-none mb-3 sm:mb-6 hover:text-orange-500 transition-colors cursor-pointer"
                >
                  {selected.name}
                </h2>
              </Link>

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

              <Link href={`/${selected.slug}`}>
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
