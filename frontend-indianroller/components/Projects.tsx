"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, Variants } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

const projects = [
  { id: 7, title: "Steel Industry",               img: "/industry-img/steel.webp",      colSpan: "lg:col-span-3", height: "h-[420px]", href: "/products-steel-industry" },
  { id: 6, title: "Textile Industry",             img: "/industry-img/textiles.webp",   colSpan: "lg:col-span-3", height: "h-[420px]", href: "/products-textile-industry" },
  { id: 4, title: "Paper And Packaging Industry", img: "/industry-img/paper.webp",      colSpan: "lg:col-span-4", height: "h-[380px]", href: "/products-paper-and-packaging-industry" },
  { id: 1, title: "Food Industry",                img: "/industry-img/industry1.webp",  colSpan: "lg:col-span-2", height: "h-[380px]", href: "/products-food-industry" },
  { id: 5, title: "Plywood Industry",             img: "/industry-img/plywood.webp",    colSpan: "lg:col-span-2", height: "h-[400px]", href: "/products-plywood-industry" },
  { id: 2, title: "Turnkey Project",              img: "/industry-img/mislinious.jpg",  colSpan: "lg:col-span-2", height: "h-[400px]", highlight: true, href: "/products-turnkey-project" },
  { id: 3, title: "Miscellaneous Roller",         img: "/industry-img/mislinious.webp", colSpan: "lg:col-span-2", height: "h-[400px]", href: "/products-miscellaneous-roller" },
  { id: 8, title: "Rexene Industry",              img: "/industry-img/rexene.webp",     colSpan: "lg:col-span-6", height: "h-[260px]", href: "/products-rexene-industry" },
];

const Projects = () => {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.12, delayChildren: 0.2 },
    },
  };

  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
    },
  };

  return (
    <section className="py-24 bg-gradient-to-b from-white via-gray-50 to-white relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute top-20 left-0 w-72 h-72 bg-orange-100 rounded-full blur-3xl opacity-30" />
      <div className="absolute bottom-20 right-0 w-96 h-96 bg-blue-50 rounded-full blur-3xl opacity-40" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* --- SECTION HEADER --- */}
        <div className="flex flex-col lg:flex-row gap-12 items-start mb-16">
          <motion.div
            className="lg:w-2/5"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <motion.p
              className="text-orange-500 font-semibold text-xs tracking-[3px] uppercase mb-3"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: false }}
              transition={{ delay: 0.2 }}
            >
              Portfolio
            </motion.p>
            <h2 className="text-5xl md:text-6xl font-black uppercase tracking-tight text-gray-900 leading-[1.1]">
              Our Latest<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-orange-600">
                Serving Industries
              </span>
            </h2>
            <motion.div
              className="h-1.5 bg-gradient-to-r from-orange-400 to-orange-600 mt-6 rounded-full"
              initial={{ width: 0 }}
              whileInView={{ width: 96 }}
              viewport={{ once: false }}
              transition={{ delay: 0.4, duration: 0.8 }}
            />
          </motion.div>

          <motion.div
            className="lg:w-3/5 space-y-4"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
          >
            <p className="text-gray-600 text-base leading-relaxed">
              World-class manufacturing backed industrial rollers designed to deliver{" "}
              <span className="font-semibold text-gray-800">durability, precision,</span> and consistent
              performance across diverse industrial applications with reliable quality standards.
            </p>
            <p className="text-gray-600 text-base leading-relaxed">
              We serve{" "}
              <span className="font-semibold text-orange-500">
                steel, textile, paper, packaging, food, plywood, rexene,
              </span>{" "}
              and turnkey projects by providing customized roller solutions that enhance productivity and
              ensure long-term operational efficiency.
            </p>
          </motion.div>
        </div>

        {/* --- BENTO GRID --- */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.1 }}
        >
          {projects.map((project) => (
            <motion.div
              key={project.id}
              variants={cardVariants}
              whileHover={{ y: -6, scale: 1.01 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className={`
                ${project.colSpan} ${project.height}
                col-span-1 md:col-span-1
              `}
            >
              <Link
                href={project.href}
                className="relative block w-full h-full rounded-2xl group overflow-hidden cursor-pointer
                  ring-1 ring-white/10
                  hover:ring-2 hover:ring-orange-400
                  shadow-md hover:shadow-orange-200/60 hover:shadow-2xl
                  transition-all duration-500"
              >
                {/* Image */}
                <Image
                  src={project.img}
                  alt={project.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />

                {/* Base gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent transition-opacity duration-500" />

                {/* Hover orange tint */}
                <div className="absolute inset-0 bg-gradient-to-t from-orange-900/65 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                {/* Featured badge */}
                {project.highlight && (
                  <div className="absolute top-4 right-4 bg-orange-500 text-white text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wide shadow-lg z-10">
                    Featured
                  </div>
                )}

                {/* Bottom content */}
                <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                  <h3 className="text-white text-xl font-bold uppercase tracking-wide mb-3">
                    {project.title}
                  </h3>

                  {/* CTA row */}
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-75">
                    <span className="text-orange-300 text-xs font-semibold uppercase tracking-[2px]">
                      View Industry
                    </span>
                    <div className="flex items-center justify-center w-7 h-7 rounded-full bg-orange-500 shadow-lg">
                      <ArrowUpRight className="w-4 h-4 text-white" />
                    </div>
                  </div>
                </div>

                {/* Top-left corner accent lines */}
                <div className="absolute top-0 left-0 w-0 h-[3px] bg-orange-400 rounded-tr-full group-hover:w-1/2 transition-all duration-500 ease-out" />
                <div className="absolute top-0 left-0 w-[3px] h-0 bg-orange-400 rounded-br-full group-hover:h-1/3 transition-all duration-500 ease-out delay-100" />
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Projects;