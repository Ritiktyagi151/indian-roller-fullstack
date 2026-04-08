"use client";
import React, { useState, useEffect } from "react";
import ProductCard from "./ProductCard";
import { motion } from "framer-motion";

type CategoryBannerData = {
  name?: string;
  image?: string;
  banner?: {
    desktop?: string;
    mobile?: string;
    height?: string;
  };
} | null;

function resolveAssetUrl(value?: string) {
  if (!value) {
    return "";
  }

  const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace("/api", "") || "";
  return value.startsWith("/") ? `${baseUrl}${value}` : value;
}

export default function ProductListingClient({
  categorySlug,
  initialProducts = [],
  category,
}: {
  categorySlug: string;
  initialProducts: any[];
  category?: CategoryBannerData;
}) {
  const [mounted, setMounted] = useState(false);
  const categoryName = category?.name || categorySlug.replace(/-/g, " ");
  const desktopBanner =
    resolveAssetUrl(category?.banner?.desktop) ||
    resolveAssetUrl(category?.image) ||
    "/banners/productpage-banner.webp";
  const mobileBanner =
    resolveAssetUrl(category?.banner?.mobile) ||
    resolveAssetUrl(category?.banner?.desktop) ||
    resolveAssetUrl(category?.image) ||
    "/banners/productpage-banner.webp";
  const bannerHeight = category?.banner?.height?.trim() || "450px";

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div className="min-h-screen bg-white" />;

  return (
    <main className="min-h-screen   pb-20  selection:bg-orange-500/30">
      <div className="w-full relative overflow-hidden" style={{ height: bannerHeight }}>
        <picture>
          <source media="(max-width: 767px)" srcSet={mobileBanner} />
          <img
            className="w-full h-full object-cover"
            src={desktopBanner}
            alt={`${categoryName} banner`}
          />
        </picture>
        <div className="absolute inset-0 bg-black/45" />

        {/* Text Overlay */}
        <div className="absolute inset-0 flex items-center justify-center">

          <header className=" border-l-4 px-6 border-orange-500 pl-8">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <p className="text-orange-500 font-black tracking-[0.4em] uppercase text-[10px] mb-2 italic">
                Premium Solutions
              </p>
              <h1 className="text-5xl md:text-8xl font-black text-white uppercase italic tracking-tighter leading-[0.8]">
                {categoryName} <br />

              </h1>
            </motion.div>
          </header>
        </div>
      </div>
      <div className="max-w-7xl mx-auto">

        {/* <header className="mb-16 mt-6 border-l-4 px-6 border-orange-500 pl-8">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-orange-500 font-black tracking-[0.4em] uppercase text-[10px] mb-2 italic">
              Premium Solutions
            </p>
            <h1 className="text-5xl md:text-8xl font-black text-white uppercase italic tracking-tighter leading-[0.8]">
              {categoryName} <br />
             
            </h1>
          </motion.div>
        </header> */}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {initialProducts.length > 0 ? (
            initialProducts.map((item, index) => (
              <motion.div
                key={item._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <ProductCard product={item} />
              </motion.div>
            ))
          ) : (
            <div className="py-32 text-center col-span-full bg-white/5 border border-white/10 rounded-[3rem] backdrop-blur-sm">
              <p className="text-gray-600 uppercase font-black tracking-[0.2em] italic text-xl">
                No products found in <span className="text-orange-500">{categoryName}</span>
              </p>
              <p className="text-gray-700 mt-2 text-sm font-bold uppercase">
                WE ARE UPDATING OUR INVENTORY. PLEASE CONTACT US FOR CUSTOM REQUIREMENTS.
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
