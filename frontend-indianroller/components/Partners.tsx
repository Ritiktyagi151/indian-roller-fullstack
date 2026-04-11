"use client";
import Image from "next/image";
import { motion } from "framer-motion";

const logos = [
  "/clients-imgs/client12.png",
  "/clients-imgs/client5.png",
  "/clients-imgs/client6.png",
  "/clients-imgs/client2.png",
  "/clients-imgs/client7.png",
  "/clients-imgs/client8.png",
  "/clients-imgs/client9.png",
  "/clients-imgs/client10.png",
  "/clients-imgs/client11.png",
  "/clients-imgs/client12.png",
  "/clients-imgs/client13.png",
  "/clients-imgs/client14.png",
  "/clients-imgs/client15.png",
  "/clients-imgs/client16.png",
  "/clients-imgs/client17.png",
  "/clients-imgs/client18.png",
  "/clients-imgs/client19.png",
  "/clients-imgs/client20.png",
  "/clients-imgs/client21.png",
  "/clients-imgs/client22.png",
  "/clients-imgs/client23.png",
  "/logo/client24-new.png",

  "/clients-imgs/client25.png",
  "/clients-imgs/client26.png",
  "/clients-imgs/client27.png",



  
  
  
];

const rows = [
  { offset: 0,  direction: "left",  duration: 50, tilt: "-4deg" },
  { offset: 7,  direction: "right", duration: 60, tilt: "3deg"  },
  { offset: 14, direction: "left",  duration: 45, tilt: "-5deg" },
];

type MarqueeRowProps = {
  logos: string[];
  direction: "left" | "right";
  duration: number;
  tilt: string;
};

const MarqueeRow = ({ logos, direction, duration, tilt }: MarqueeRowProps) => {
  const doubled = [...logos, ...logos];

  return (
    <div className="overflow-hidden w-full">
      <div
        className="flex gap-4 w-max"
        style={{
          animation: `marquee-${direction} ${duration}s linear infinite`,
        }}
      >
        {doubled.map((src, i) => (
          <div
            key={i}
            className="group relative flex items-center justify-center flex-shrink-0 overflow-hidden cursor-default bg-white border border-gray-100 transition-all duration-300 hover:border-orange-400 hover:shadow-lg hover:shadow-orange-500/10"
            style={{
              width: "160px",
              height: "90px",
              borderRadius: "20px",
              transform: tilt,
              transition: "transform 0.3s ease, border-color 0.3s, box-shadow 0.3s",
            }}
            onMouseEnter={e => (e.currentTarget.style.transform = "rotate(0deg) scale(1.06)")}
            onMouseLeave={e => (e.currentTarget.style.transform = tilt)}
          >
            <div className="absolute inset-0 bg-orange-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <Image
              src={src}
              alt={`Partner ${i + 1}`}
              width={110}
              height={60}
              className="object-fill relative z-10 opacity-80 group-hover:opacity-100 transition-opacity duration-300"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default function Partners() {
  return (
    <section
      className="py-10 overflow-hidden relative"
      style={{
        backgroundImage: "url('/about-img/factory-img.jpg')",
        backgroundAttachment: "fixed",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@700;900&display=swap');
        @keyframes marquee-left  { from { transform: translateX(0) }    to { transform: translateX(-50%) } }
        @keyframes marquee-right { from { transform: translateX(-50%) } to { transform: translateX(0) } }
      `}</style>

      {/* Blur overlay */}
      <div
        className="absolute inset-0 z-0"
        style={{ backdropFilter: "blur(2px)", backgroundColor: "rgba(0,0,0,0.45)" }}
      />

      {/* Decorative blobs */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-orange-100 rounded-full blur-3xl opacity-20 z-0" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-100 rounded-full blur-3xl opacity-20 z-0" />

      <div className="relative z-10">
        {/* Header */}
        <div className="text-center px-6 mb-12">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: false }}
            transition={{ duration: 0.6 }}
            className="text-orange-500 font-bold text-[11px] tracking-[5px] uppercase mb-3"
            // style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
          >
            Trusted By Industry Leaders
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: -24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.4 }}
            transition={{ duration: 0.7 }}
            className="text-[clamp(36px,6vw,64px)] font-black uppercase leading-[0.9] tracking-[-2px] text-white"
            // style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
          >
            Our Clients &<br />
            <span className="text-orange-500">Partners</span>
          </motion.h2>
          <motion.div
            className="h-1 bg-orange-500 mx-auto mt-4"
            initial={{ width: 0 }}
            whileInView={{ width: 64 }}
            viewport={{ once: false }}
            transition={{ delay: 0.4, duration: 0.8 }}
          />
        </div>

        {/* 3 Marquee Rows */}
        <div className="flex flex-col gap-5 py-2">
          {rows.map((row, i) => {
            const sliced = [
              ...logos.slice(row.offset),
              ...logos.slice(0, row.offset),
            ];
            return (
              <MarqueeRow
                key={i}
                logos={sliced}
                direction={row.direction as "left" | "right"}
                duration={row.duration}
                tilt={row.tilt}
              />
            );
          })}
        </div>

        {/* Bottom text */}
        <motion.div
          className="text-center mt-10 px-6"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.5 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <p className="text-gray-300 text-sm tracking-wide">
            Join <span className="text-orange-500 font-bold">500+</span> companies who trust us to deliver excellence
          </p>
        </motion.div>
      </div>
    </section>
  );
}