"use client";

import { useState } from "react"; // Added this
import Image from "next/image";
import { Lightbox } from "../../components/Lightbox";

const exhibitions = [
  {
    title: "Print & Pack Expo 2026",
    location: "New Delhi, India",
    description: "Our largest showcase of high-speed rubber rollers and custom industrial coatings.",
    images: [
      "/gallery-img/delhi-ex/WhatsApp Image 2025-02-20 at 1.36.58 PM (1).jpeg", 
      "/gallery-img/delhi-ex/WhatsApp Image 2025-02-20 at 1.36.58 PM (2).jpeg",
      "/gallery-img/delhi-ex/WhatsApp Image 2025-02-21 at 11.52.44 AM.jpeg"
    ],
  },
  {
    title: "The 19th International Textile and Garment Exhibition",
    location: "Dhaka, Bangladesh",
    description: "Highlighting our international expansion and export-grade manufacturing standards.",
    images: [
      "/gallery-img/dhaka-ex/WhatsApp Image 2025-02-20 at 4.57.26 PM.jpeg",
      "/gallery-img/dhaka-ex/WhatsApp Image 2025-02-20 at 4.57.27 PM.jpeg",
      "/gallery-img/dhaka-ex/WhatsApp Image 2025-02-20 at 4.57.28 PM.jpeg",
    ],
  },
  {
    title: "Global Steel Summit 2025",
    location: "Dubai, UAE",
    description: "Highlighting our international expansion and export-grade manufacturing standards.",
    images: [
      "/gallery-img/global-steel/globalsteel2.jpeg",
      "/gallery-img/global-steel/globalsteel4.jpeg",
      "/gallery-img/global-steel/global-steel.jpeg",
      "/gallery-img/global-steel/globalsteel5.jpeg",
      "/gallery-img/global-steel/globalsteel6.jpeg",
      "/gallery-img/global-steel/globalsteel7.jpeg",
      "/gallery-img/global-steel/globalsteel8.jpeg",
    ],
  },
  {
    title: "Metal Expo 2025",
    location: "Saint Petersburg, Russia",
    description: "Highlighting our international expansion and export-grade manufacturing standards.",
    images: [
      "/gallery-img/metal-expo/metal-expo1.jpeg",
      "/gallery-img/metal-expo/metal-expo.jpeg",
      "/gallery-img/metal-expo/metal-expo2.jpeg",
      "/gallery-img/metal-expo/metal-expo3.jpeg",
      "/gallery-img/metal-expo/metal-expo4.jpeg",
      "/gallery-img/metal-expo/metal-expo5.jpeg",
      "/gallery-img/metal-expo/metal-expo7.jpeg",
    ],
  },
];

export function ExhibitionShowcase() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const openLightbox = (imageSrc: string) => {
    setSelectedImage(imageSrc);
    document.body.style.overflow = "hidden";
  };

  const closeLightbox = () => {
    setSelectedImage(null);
    document.body.style.overflow = "unset";
  };

  return (
    <>
      <section className="bg-[#050505] px-6 py-20 border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16">
            <p className="text-[10px] uppercase tracking-[0.4em] text-orange-400 font-black mb-4">
              Event Archives
            </p>
            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight text-white">
              Exhibitions & <br /> Global Presence.
            </h2>
          </div>

          <div className="space-y-24">
            {exhibitions.map((expo, index) => (
              <div key={index} className="border-l border-white/10 pl-6 md:pl-10">
                <div className="mb-8">
                  <div className="flex items-center gap-4 mb-2">
                    <span className="h-[1px] w-8 bg-orange-500"></span>
                    <p className="text-orange-400 text-[10px] font-bold uppercase tracking-[0.2em]">
                      {expo.location}
                    </p>
                  </div>
                  <h3 className="text-xl md:text-2xl font-black uppercase text-white tracking-wide">
                    {expo.title}
                  </h3>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-3">
                  {expo.images.map((img, imgIdx) => (
                    <button
                      key={imgIdx}
                      onClick={() => openLightbox(img)}
                      className="relative group aspect-square overflow-hidden bg-white/5 border border-white/5 hover:border-orange-500/50 transition-colors duration-300 cursor-zoom-in"
                    >
                      <Image
                        src={img}
                        alt={`${expo.title} image ${imgIdx + 1}`}
                        fill
                        sizes="(max-width: 768px) 50vw, 15vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-110 opacity-80 group-hover:opacity-100"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-3">
                        <span className="text-[9px] font-bold text-white uppercase tracking-wider bg-black/60 px-2 py-1 backdrop-blur-sm rounded">
                          View
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Lightbox src={selectedImage} onClose={closeLightbox} />
    </>
  );
}