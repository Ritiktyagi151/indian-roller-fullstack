"use client";
import React, { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform, Variants, useInView } from "framer-motion";

/* ─────────────────────────────────────────────────────────────
    HELPER: Word-by-Word Text Animation
───────────────────────────────────────────────────────────── */
const AnimatedText = ({ text, className }: { text: string; className: string }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });
  const words = text.split(" ");

  const wordVariants: Variants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.33, 1, 0.68, 1] } },
  };

  return (
    <motion.p
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      transition={{ staggerChildren: 0.015 }}
      className={className}
    >
      {words.map((word, i) => (
        <motion.span key={i} variants={wordVariants} className="inline-block mr-1.5">
          {word}
        </motion.span>
      ))}
    </motion.p>
  );
};

/* ─────────────────────────────────────────────────────────────
    HELPER: Floating Floating Images Animation
───────────────────────────────────────────────────────────── */
const FloatInViewImage = ({ src, alt, className, parallaxSpeed }: any) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [150, -150 * parallaxSpeed]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  return (
    <motion.div
      ref={ref}
      style={{ y, opacity }}
      className={`relative ${className}`}
    >
      <Image src={src} alt={alt} fill className="object-cover" priority />
    </motion.div>
  );
};

/* ─────────────────────────────────────────────────────────────
    DATA
───────────────────────────────────────────────────────────── */
const industryList = ["Steel", "Textile", "Paper & Packaging", "Food", "Plywood"];
const materialsList = ["Natural Rubber", "Polyurethane", "Silicon", "EPDM", "Hypalon", "NBR", "HNBR"];

/* ─────────────────────────────────────────────────────────────
    MAIN SECTION COMPONENT
───────────────────────────────────────────────────────────── */
const IndustrialSourcesSection = () => {
  return (
    <section className="bg-white py-12 lg:py-14  overflow-hidden">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-12">
        
        {/* GRID LAYOUT: Staggered Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-16">
          
          {/* COLUMN 1: Heading & List (3 cols desktop) */}
          <div className="md:col-span-1 lg:col-span-3 space-y-12">
            <motion.div
              initial={{ opacity: 0, x: -60 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
              viewport={{ once: true, amount: 0.8 }}
            >
              <span className="font-mono text-[9px] tracking-[4px] uppercase text-orange-500 mb-2 block">Premium Solutions</span>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold uppercase leading-[0.9] tracking-tighter text-black">
                OUR UNIQUE<br /> INDUSTRIAL<br />
                <span className="text-orange-500">SOURCE</span>
              </h2>
              <div className="w-16 h-1 bg-orange-500 mt-6" />
            </motion.div>

            {/* FLOATING LIST overlay */}
            <motion.div
                initial={{opacity: 0}}
                whileInView={{opacity:1}}
                viewport={{once:true}}
                className="bg-gray-50 p-6 shadow-xl border border-gray-100 space-y-3"
            >
                <h4 className="font-bold text-xs uppercase tracking-widest text-black mb-3">Targeted Industries:</h4>
                {industryList.map((ind, i) => (
                    <motion.div
                        key={ind}
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: i * 0.15, ease: "easeOut" }}
                        className="flex items-center gap-3 text-sm text-gray-500"
                    >
                        <span className="w-4 h-4 rounded-full border border-orange-200 flex items-center justify-center text-orange-500 text-[9px] font-bold">
                            {i+1}
                        </span>
                        {ind}
                    </motion.div>
                ))}
            </motion.div>
          </div>

        {/* COLUMN 2: Single High-Impact Parallax Image (4 cols desktop) */}
<div className="md:col-span-1 lg:col-span-4 relative flex items-center justify-center py-12">
  
  {/* Decorative Background Element (Orange Border Effect from your Screenshot) */}
  <motion.div 
    initial={{ opacity: 0, scale: 0.8 }}
    whileInView={{ opacity: 1, scale: 1 }}
    transition={{ duration: 1, delay: 0.5 }}
    className="absolute -bottom-4 -left-4 w-32 h-32 border-l-8 border-b-8 border-orange-500 z-0 hidden md:block"
  />

  {/* The Single Floating Image */}
  <div className="relative w-full aspect-[4/5] md:aspect-[3/4] overflow-hidden shadow-2xl z-10">
    <FloatInViewImage
      src="/product-img/sources-img.png" // Aapki main single image
      alt="Premium Industrial Roller"
      className="h-full w-full object-cover"
      parallaxSpeed={0.5} // Light parallax for a premium feel
    />
  </div>

  {/* Decorative Top Element */}
  <motion.div 
    initial={{ opacity: 0, x: 20 }}
    whileInView={{ opacity: 1, x: 0 }}
    transition={{ duration: 1, delay: 0.7 }}
    className="absolute -top-6 -right-2 bg-orange-500 text-white p-4 font-mono text-[10px] tracking-widest uppercase z-20 hidden lg:block"
  >
    Precision Engineering
  </motion.div>
</div>

          {/* COLUMN 3: Paragraphs & Materials (5 cols desktop) */}
          <div className="md:col-span-2 lg:col-span-5 md:pl-12 lg:pl-16 md:mt-10 lg:mt-0 space-y-12">
            <div className="border-l-4 border-orange-500 pl-8 space-y-6">
                <AnimatedText
                    text="Indian Roller is a premier source for industrial roller supplies, providing top-tier solutions to industries such as steel, textile, paper, packaging, food, plywood, and rexene."
                    className="text-gray-900 text-lg md:text-xl font-medium leading-tight"
                />
                <AnimatedText
                    text="With decades of experience, we offer a diverse range of rollers crafted from high-performance rubber compounds. These materials are selected for their superior durability, resistance, and adaptability to various industrial environments."
                    className="text-gray-500 text-sm md:text-base leading-relaxed"
                />
            </div>

            {/* Materials List Box */}
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{once:true, amount:0.8}}
                className="bg-[#111] p-8 space-y-6"
            >
                <div className="flex justify-between items-center border-b border-gray-700 pb-4">
                    <h3 className="font-['Bebas_Neue'] text-3xl text-orange-500 tracking-wider">PREMIUM COMPOUNDS</h3>
                    <span className="font-mono text-[9px] text-gray-400">DECISION DRIVEN</span>
                </div>
                <p className="text-gray-300 text-xs md:text-sm leading-relaxed">
                   Natural Rubber, Polyurethane, Silicon Rubber, EPDM, Hypalon, NBR, HNBR, and Ebonite.
                </p>
                <p className="text-orange-300 text-[10px] font-mono tracking-[2px] uppercase pt-3">precision engineered reliability</p>
            </motion.div>

             {/* <motion.p
              initial={{opacity: 0, y: 30}}
              whileInView={{opacity:1, y: 0}}
              transition={{duration: 0.8}}
              className="text-gray-400 text-xs md:text-sm leading-relaxed max-w-2xl"
             >
              Our rollers are meticulously engineered to ensure precision and meet the rigorous demands of modern manufacturing and processing. We specialized in delivering customized solutions and turnkey projects, tailoring our products to enhance efficiency, reduce downtime, and improve overall productivity.
            </motion.p> */}
          </div>

        </div>
      </div>
    </section>
    
  );
};

export default IndustrialSourcesSection;