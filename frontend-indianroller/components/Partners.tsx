"use client";
import Image from "next/image";
import { motion, Variants, TargetAndTransition } from "framer-motion";

export default function Partners() {
  const logos = [
    "/clients-imgs/client12.png",
    "/clients-imgs/client5.png",
    "/clients-imgs/client6.png",
    "/clients-imgs/client2.png",
    "/clients-imgs/client7.png",
    // "/clients-imgs/client3.png",
    // "/clients-imgs/client4.png",
    "/clients-imgs/client8.png",
    "/clients-imgs/client9.png",
    "/clients-imgs/client10.png",
    "/clients-imgs/client11.png",
    "/clients-imgs/client13.jpeg",
    "/clients-imgs/client14.jpeg",
    "/clients-imgs/client15.jpeg",
    "/clients-imgs/client16.jpeg",
    "/clients-imgs/client17.jpeg",
    "/clients-imgs/client18.jpeg",
    "/clients-imgs/client19.jpeg",
    "/clients-imgs/client20.jpeg",
    "/clients-imgs/client21.jpeg",
    "/clients-imgs/client22.jpeg",
    "/clients-imgs/client23.jpeg",
    "/clients-imgs/client24.jpeg",
    "/clients-imgs/client25.jpeg",
    // "/clients-imgs/client26.png",
  ];

  const fadeInUp: Variants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
    },
  };

  const staggerContainer: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.2,
      },
    },
  };

  const scaleOnHover: TargetAndTransition = {
    scale: 1.05,
    transition: { duration: 0.3, ease: "easeOut" },
  };

  return (
    <section
      className="py-20 overflow-hidden relative"
      style={{
        backgroundImage: "url('/about-img/factory-img.jpg')", // 👈 apna image path yahan
        backgroundAttachment: "fixed", // Fixed/parallax effect
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Blur Overlay */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backdropFilter: "blur(2px)",
          // backgroundColor: "rgba(255, 255, 255, 0.55)", // light white tint
        }}
      ></div>

      {/* Background Decorative Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-orange-100 rounded-full blur-3xl opacity-20 z-0"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-100 rounded-full blur-3xl opacity-20 z-0"></div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">

        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <motion.p
            className="text-orange-500 font-semibold text-xs tracking-[3px] uppercase mb-3"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: false }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            Trusted By Industry Leaders
          </motion.p>
          <h2 className="text-5xl md:text-6xl font-black uppercase tracking-tight text-gray-200 leading-tight">
            Our Clients &<br className="md:hidden" /> Partners
          </h2>
          <motion.div
            className="w-24 h-1.5 bg-gradient-to-r from-orange-400 to-orange-600 mx-auto mt-6 rounded-full"
            initial={{ width: 0 }}
            whileInView={{ width: 96 }}
            viewport={{ once: false }}
            transition={{ delay: 0.4, duration: 0.8, ease: "easeOut" }}
          ></motion.div>
        </motion.div>

        {/* Logos Grid */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.15 }}
        >
          {logos.map((logo, i) => (
            <motion.div
              key={i}
              variants={fadeInUp}
              whileHover={scaleOnHover}
              className="group relative bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 p-8 flex justify-center items-center border border-gray-100 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-orange-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <Image
                src={logo}
                alt={`Partner ${i + 1}`}
                width={140}
                height={70}
                className="object-contain transition-all duration-500 relative z-10 opacity-70 group-hover:opacity-100"
              />
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.5 }}
          transition={{ delay: 0.5, duration: 0.7 }}
        >
          <p className="text-gray-200 text-sm md:text-base max-w-2xl mx-auto">
            Join <span className="font-bold text-orange-500">500+</span> companies who trust us to deliver excellence
          </p>
        </motion.div>

      </div>
    </section>
  );
}