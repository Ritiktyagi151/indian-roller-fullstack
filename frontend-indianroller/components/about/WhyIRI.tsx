"use client";
import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { FaCheckCircle } from "react-icons/fa";

const whyPoints = [
  "An ISO 9001:2008 Certified Co.",
  "Indian Roller products are known for their quality, reliability, and technology",
  "State of art manufacturing facilities and machinery",
  "Maintain Dust Proof Chamber of PU Casting.",
  "R&D Lab equipped with latest instruments Supported by highly experienced, qualified Engineers & Technicians.",
  "Maintain Minimum inventory label.",
  "Technological Tie-up with Baule Machine (France).",
  "Efficient Technical Support for use of IRI products.",
  "Strict delivery as per the timelines of the client."
];

const WhyIRI = () => {
  return (
    <section className="py-24 bg-gray-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col lg:flex-row-reverse items-center gap-16">
          
          {/* Right Side: Showcase Image */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: false }}
            transition={{ duration: 0.8 }}
            className="lg:w-1/2"
          >
            <div className="relative rounded-sm overflow-hidden shadow-2xl">
              <Image 
                src="/about-img/whyindia.jpg" // image_032f96.png wali image
                alt="IRI Team Showcase" 
                width={600}
                height={700}
                className="object-cover w-full h-auto"
              />
            </div>
          </motion.div>

          {/* Left Side: Animated List */}
          <div className="lg:w-1/2">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: false }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center gap-2 mb-4">
                 <div className="w-8 h-[2px] bg-green-500" />
                 <span className="text-orange-500 font-bold text-xs tracking-widest uppercase">
                   To Evolve is to Last Forever
                 </span>
              </div>
              <h2 className="text-4xl font-black text-black uppercase mb-4 tracking-tighter">
                Why Indian Roller
              </h2>
              <p className="text-gray-800 font-bold text-lg mb-8">
                Due To All Below Facilities Under One Roof We Have Biggest List Of Valuable Clients.
              </p>
            </motion.div>

            <div className="space-y-4">
              {whyPoints.map((point, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: false }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start gap-3 group"
                >
                  <FaCheckCircle className="text-orange-500 mt-1 shrink-0 group-hover:scale-125 transition-transform" />
                  <p className="text-gray-600 font-medium text-sm leading-relaxed">{point}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyIRI;