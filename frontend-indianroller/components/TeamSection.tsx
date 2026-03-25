"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence, Variants } from "framer-motion";

/* ─── Data ─── */
const factoryData = [
  {
    id: "01",
    name: "Sahibabad Plant",
    location: "Gaziabad Uttar Pradesh",
    tag: "Uttar Pradesh",
    region: "UP",
    address: "Plot No. 62/2/1&2, Site IV, Industrial Area, Sahibabad-201010 UP.",
    image: "/team-img/shahibabad.JPG",
    featured: true,
  },
  {
    id: "02",
    name: "Jamshedpur Plant",
    location: "Ghamaria, Jharkhand",
    tag: "Jharkhand",
    region: "JH",
    address: "Shed no.1, Plot No-743, Ghamaria, Jamshedpur, Jharkhand - 832108",
    image: "/team-img/jamshedpur-team.JPG",
    featured: false,
  },
  {
    id: "03",
    name: "Ahmedabad Plant",
    location: "Gopalcharan Industrial Park, Gujarat",
    tag: "Gujarat",
    region: "GJ",
    address: "Plot No. 226 to 229, Gopalcharan-2, Industrial Park, Ahmedabad, 382433",
    image: "/team-img/ahmdabad.JPG",
    featured: false,
  },
  {
    id: "04",
    name: "Ballari Plant",
    location: "Sandur, Karnataka",
    tag: "Karnataka",
    region: "KA",
    address: "Property No-5331481412, Kurekuppa Village, Sandur, Ballari, Karnataka - 583119",
    image: "/team-img/kanatka2.JPG",
    featured: false,
  },
  {
    id: "05",
    name: "Bangladesh Plant",
    location: "South Kashimpur, Feni, Bangladesh",
    tag: "International",
    region: "BD",
    address: "South Kashimpur Panchagachia, Mohipal Feni, Bangladesh",
    image: "/about-img/about-bg.jpg",
    featured: false,
  },
];

type Factory = (typeof factoryData)[0];

/* ─── Animation Variants ─── */
const slideFromLeft: Variants = {
  hidden: { opacity: 0, x: -100 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: "easeOut" } }
};

const slideFromRight: Variants = {
  hidden: { opacity: 0, x: 100 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: "easeOut" } }
};

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 60 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

/* ─── Stat Cell ─── */
const StatCell = ({ num, label }: { num: string; label: string }) => (
  <div className="group relative flex-1 border-r border-gray-100 last:border-r-0 px-6 py-8 min-w-[150px]">
    <span className="absolute top-0 left-0 h-[3px] w-0 bg-orange-500 transition-all duration-500 group-hover:w-full" />
    <div className="text-4xl font-black text-black leading-none uppercase">
      {num}
    </div>
    <div className="mt-2 text-orange-500 text-[10px] uppercase tracking-widest font-bold">
      {label}
    </div>
  </div>
);

/* ─── Unit Card ─── */
const UnitCard = ({ factory, onClick }: { factory: Factory; onClick: () => void; }) => (
  <motion.div
    variants={fadeInUp}
    initial="hidden"
    whileInView="visible"
    viewport={{ once: false, amount: 0.2 }}
    onClick={onClick}
    className={`group relative cursor-pointer overflow-hidden bg-white border border-gray-50 transition-all duration-300 hover:shadow-2xl ${
      factory.featured ? "md:col-span-2" : "col-span-1"
    }`}
  >
    <div className={`relative w-full overflow-hidden ${factory.featured ? "h-[320px]" : "h-[220px]"}`}>
      <Image
        src={factory.image}
        alt={factory.name}
        fill
        className="object-cover transition-transform duration-700 group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-60" />
      <div className="absolute left-4 top-4 bg-orange-500 px-3 py-1 text-xs font-black text-white uppercase tracking-widest">
        {factory.id}
      </div>
      <div className="absolute right-4 top-4 bg-white/90 px-3 py-1 text-[9px] font-bold text-black uppercase tracking-widest">
        {factory.tag}
      </div>
    </div>
    <div className="p-6">
      <h3 className="text-2xl font-black text-black uppercase leading-tight group-hover:text-orange-500 transition-colors">
        {factory.name}
      </h3>
      <p className="mt-2 text-gray-400 text-[11px] uppercase tracking-[2px] font-medium">
        {factory.location}
      </p>
    </div>
    <div className="absolute bottom-6 right-6 h-10 w-10 flex items-center justify-center bg-black text-white transition-all duration-300 group-hover:bg-orange-500 group-hover:-translate-y-1">
      →
    </div>
  </motion.div>
);

const TeamSection = () => {
  const [selected, setSelected] = useState<Factory | null>(null);

  useEffect(() => {
    document.body.style.overflow = selected ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [selected]);

  return (
    <section className="pt-12 pb-12 bg-[#fafafa] overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Heading Section */}
        <div className="flex flex-col lg:flex-row gap-8 items-start mb-16">
          <div className="lg:w-1/2">
            <motion.p 
              variants={slideFromLeft}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false, amount: 0.5 }}
              className="text-orange-500 font-bold text-xs tracking-[3px] uppercase mb-4"
            >
              Our Infrastructure
            </motion.p>

            <motion.h2 
              variants={slideFromLeft}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false, amount: 0.5 }}
              className="text-5xl md:text-7xl font-black uppercase leading-[0.9] tracking-tighter text-black"
            >
              5 Production <br /> 
              <span className="text-orange-500">Units Worldwide</span>
            </motion.h2>

            <motion.div 
              className="w-24 h-1.5 bg-orange-500 mt-8"
              initial={{ width: 0 }}
              whileInView={{ width: 96 }}
              viewport={{ once: false }}
              transition={{ duration: 1, delay: 0.2 }}
            />
          </div>

          <motion.div 
            className="lg:w-1/2 lg:pt-14"
            variants={slideFromRight}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.5 }}
          >
            <p className="text-gray-500 font-bold text-sm leading-relaxed uppercase tracking-wider italic border-l-4 border-orange-500 pl-6">
              Strategically located across India and international borders to ensure seamless delivery and world-class manufacturing standards.
            </p>
          </motion.div>
        </div>

        {/* Stats Row */}
        <motion.div 
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.1 }}
          className="flex flex-wrap border-t border-b border-gray-200 mb-20 bg-white shadow-sm"
        >
          <StatCell num="05" label="Global Units" />
          <StatCell num="04" label="Key Regions" />
          <StatCell num="24/7" label="Production" />
          <StatCell num="100%" label="Quality Check" />
        </motion.div>

        {/* Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {factoryData.map((f) => (
            <UnitCard key={f.id} factory={f} onClick={() => setSelected(f)} />
          ))}
        </div>

        {/* CTA Block */}
        <motion.div 
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.2 }}
          className="mt-20 bg-black p-10 md:p-16 relative overflow-hidden group"
        >
          <div className="absolute top-0 left-0 w-2 h-full bg-orange-500 transition-all duration-500 group-hover:w-4" />
          <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
            <h1 className="text-3xl md:text-5xl font-black text-white uppercase leading-tight">
              Want to visit our <br /> <span className="text-orange-500">facilities?</span>
            </h1>
            <Link href="/contact">
              <button className="bg-orange-500 text-white font-black uppercase tracking-widest px-10 py-5 text-sm hover:bg-white hover:text-black transition-all transform active:scale-95 shadow-xl">
                Schedule a Tour →
              </button>
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Modal Section (Code remains same as original) */}
      <AnimatePresence>
        {selected && (
            // ... Modal content code here
            <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
                 <motion.div 
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    onClick={() => setSelected(null)}
                    className="absolute inset-0 bg-black/95 backdrop-blur-sm" 
                    />
                    <motion.div 
                    initial={{ scale: 0.9, opacity: 0, y: 20 }} 
                    animate={{ scale: 1, opacity: 1, y: 0 }} 
                    exit={{ scale: 0.9, opacity: 0, y: 20 }}
                    className="relative w-full max-w-5xl bg-white overflow-hidden flex flex-col md:flex-row shadow-2xl"
                    >
                    <button onClick={() => setSelected(null)} className="absolute top-6 right-6 z-20 text-black hover:text-orange-500 text-2xl font-black">✕</button>
                    
                    <div className="md:w-1/2 h-[300px] md:h-auto relative">
                        <Image src={selected.image} alt={selected.name} fill className="object-cover" />
                    </div>

                    <div className="md:w-1/2 p-10 md:p-16 flex flex-col justify-center">
                        <p className="text-orange-500 font-bold text-xs tracking-widest uppercase mb-2">{selected.region} REGION</p>
                        <h2 className="text-4xl md:text-5xl font-black text-black uppercase mb-6 leading-tight">{selected.name}</h2>
                        <div className="w-16 h-1 bg-orange-500 mb-8" />
                        <p className="text-sm text-gray-600 font-medium leading-relaxed">{selected.address}</p>
                        <Link href="/contact">
                        <button className="mt-10 border-b-2 border-orange-500 text-orange-500 font-black uppercase text-xs tracking-widest pb-2 hover:text-black hover:border-black transition-all">
                            Inquire About This Unit →
                        </button>
                        </Link>
                    </div>
                </motion.div>
            </div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default TeamSection;