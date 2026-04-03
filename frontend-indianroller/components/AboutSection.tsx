"use client";
import React, { useState, useEffect, useCallback } from "react";
import { motion, Variants } from "framer-motion";

const carouselSlides = [
  { src: "/homepage-img/facyory-view.png", label: "Precision Engineering" },
  { src: "/homepage-img/factory-view3.JPG", label: "Precision Engineering" },
  { src: "/homepage-img/factory-view22.png", label: "Precision Engineering" },
  { src: "/homepage-img/factory-view4.JPG", label: "Precision Engineering" },
  { src: "/homepage-img/factory-view5.JPG", label: "Precision Engineering" },

  
];

const AboutSection = () => {
  const [current, setCurrent] = useState(0);

  const goTo = useCallback((n: number) => {
    setCurrent((n + carouselSlides.length) % carouselSlides.length);
  }, []);

  useEffect(() => {
    const t = setInterval(() => goTo(current + 1), 3200);
    return () => clearInterval(t);
  }, [current, goTo]);

  // Get 3 visible slides starting from current
  const visibleSlides = [0, 1, 2].map(
    (offset) => carouselSlides[(current + offset) % carouselSlides.length]
  );

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
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  return (
    <section className="pt-20 pb-20 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col lg:flex-row gap-12 items-start">

          {/* Left Side: Heading Section */}
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
              Greetings From <br /> All Of Us <br />
              <span className="text-orange-500 text-3xl md:text-4xl">IRI ISO 9001:2008 Certified</span>
            </motion.h2>

            <motion.div
              className="w-20 h-1 bg-orange-500 mt-6"
              initial={{ width: 0 }}
              whileInView={{ width: 80 }}
              viewport={{ once: false }}
              transition={{ duration: 1, delay: 0.5 }}
            />
          </div>

          {/* Right Side: Description Section */}
          <motion.div
            className="lg:w-2/3"
            variants={slideFromRight}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.8 }}
          >
            <p className="text-gray-500 font-bold text-sm leading-relaxed mb-6 uppercase tracking-wider italic border-l-4 border-orange-500 pl-4">
              Guided by a simple philosophy, the Indian Roller brand was established in 1990 as a rubber and polyurethane roller manufacturing company by a highly experienced and dedicated team of professionals.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-gray-400 text-[13px] leading-7 font-medium">
              <div className="space-y-4">
                <p>
                 Our facility is located across a 36,000 sq. ft. area in the industrial town of Sahibabad, Ghaziabad (Delhi NCR). Equipped with state-of-the-art machinery, we ensure every product meets international quality standards.
                </p>
              </div>
              <div className="space-y-4">
                <p>
                  Our mission was to create high-quality products, honestly made and sincerely served. Today, we are a leading name in the industry, trusted by hundreds of global clients.
                </p>
              </div>
            </div>

            {/* Stats Section */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mt-12 border-t border-gray-100 pt-8">
              <div>
                <h3 className="text-3xl font-black text-black">35+</h3>
                <p className="text-orange-500 text-[10px] uppercase tracking-widest font-bold">Years Experience</p>
              </div>
              <div>
                <h3 className="text-3xl font-black text-black">36K</h3>
                <p className="text-orange-500 text-[10px] uppercase tracking-widest font-bold">Sq. Ft. Factory</p>
              </div>
              <div className="col-span-2 md:col-span-1">
                <h3 className="text-3xl font-black text-black">100%</h3>
                <p className="text-orange-500 text-[10px] uppercase tracking-widest font-bold">Quality Assured</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Image Section */}
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mt-20 relative"
        >
          <div className="grid grid-cols-12 gap-4">

            {/* Main Large Image */}
            <div className="col-span-12 md:col-span-7 overflow-hidden h-[300px] md:h-[450px]">
              <img
                src="/homepage-img/indian-factoryview.png"
                alt="Manufacturing Unit"
                className="w-full h-full object-cover transition-all duration-700"
              />
            </div>

            {/* Orange Block */}
            <div className="col-span-12 md:col-span-5 bg-orange-500 flex flex-col justify-between h-[200px] md:h-[450px] p-5">

              {/* Carousel — 3 boxes side by side, sits at top */}
             <div className="flex flex-col gap-3">
  <div className="flex flex-col gap-2">
    {/* Row 1 */}
    <div className="flex gap-2">
      {visibleSlides.slice(0, Math.ceil(visibleSlides.length / 2)).map((slide, i) => (
        <div
          key={i}
          className="flex-1 overflow-hidden"
          style={{ height: "120px" }}
        >
          <img
            src={slide.src}
            alt={slide.label}
            className="w-full h-full object-cover"
          />
        </div>
      ))}
    </div>

    {/* Row 2 */}
    <div className="flex gap-2">
      {visibleSlides.slice(Math.ceil(visibleSlides.length / 2)).map((slide, i) => (
        <div
          key={i}
          className="flex-1 overflow-hidden"
          style={{ height: "160px" }}
        >
          <img
            src={slide.src}
            alt={slide.label}
            className="w-full h-full object-cover"
          />
        </div>
      ))}
    </div>
  </div>

  {/* Dot indicators */}
  {/* <div className="flex gap-2 justify-end">
    {carouselSlides.map((_, i) => (
      <button
        key={i}
        onClick={() => goTo(i)}
        className={`w-2 h-2 rounded-full border-none transition-all duration-300 ${
          i === current ? "bg-white scale-125" : "bg-white/40"
        }`}
        aria-label={`Go to slide ${i + 1}`}
      />
    ))}
  </div> */}
</div>

              {/* Footer Text — sits at bottom */}
              <div>
                <h4 className="text-white text-2xl font-black uppercase leading-tight">
                  Innovation <br /> In Every <br /> Roller.
                </h4>
                <div className="w-12 h-1 bg-white mt-3" />
              </div>

            </div>
          </div>

          {/* Floating Badge */}
          <div className="absolute -bottom-6 right-6 md:right-12 bg-black text-white p-6 hidden sm:block">
            <p className="text-xs tracking-widest uppercase mb-1">Established</p>
            <p className="text-2xl font-black text-orange-500">SINCE 1990</p>
          </div>
        </motion.div>

      </div>
    </section>
  );
};

export default AboutSection;