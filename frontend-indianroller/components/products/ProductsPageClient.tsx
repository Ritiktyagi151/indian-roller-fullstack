"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Factory, Layers, FlaskConical } from "lucide-react";

const categories = [
  { name: "Steel Industry", slug: "steel-industry", icon: <Factory size={20} /> },
  { name: "Textile Industry", slug: "textile-industry", icon: <Layers size={20} /> },
  { name: "Silicone Rubber", slug: "silicone-rubber", icon: <FlaskConical size={20} /> },
];

export default function ProductsPageClient() {
  return (
    <div className="bg-[#0a0a0b] min-h-screen pt-32 pb-20 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-4">
        {categories.map((cat) => (
          <Link key={cat.slug} href={`/products-${cat.slug}`}>
            <motion.div
              whileHover={{ scale: 1.02, backgroundColor: "rgba(255,255,255,0.05)" }}
              className="bg-zinc-900/50 border border-white/5 p-6 rounded-xl flex items-center gap-4 cursor-pointer group transition-all"
            >
              <div className="text-orange-500 group-hover:scale-110 transition-transform">
                {cat.icon}
              </div>
              <span className="text-white font-bold uppercase text-xs tracking-wider">
                {cat.name}
              </span>
            </motion.div>
          </Link>
        ))}
      </div>
    </div>
  );
}
