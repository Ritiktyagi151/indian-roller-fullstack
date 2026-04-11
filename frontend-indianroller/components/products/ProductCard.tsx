"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

type ProductCardData = {
  slug?: string;
  name: string;
  image?: string;
  industry?: string;
  shortDescription?: string;
  shortDesc?: string;
  category?: { name?: string } | null;
};

export default function ProductCard({ product }: { product: ProductCardData }) {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '');
  const displayImage = product.image?.startsWith('/') && !product.image.startsWith('/images') 
    ? `${baseUrl}${product.image}` 
    : product.image;
  const shortText = product.shortDescription || product.shortDesc || "Precision engineered industrial roller solution.";

  return (
    // 🔥 Clean URL: /products- hatakar ab seedha slug use hoga
    <Link href={`/${product.slug}`}> 
      <motion.div 
        whileHover={{ y: -10 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="group relative bg-zinc-900/40 border border-white/5 rounded-[2.5rem] overflow-hidden backdrop-blur-md hover:border-orange-500/40 transition-all duration-500"
      >
        <div className="relative h-72 overflow-hidden p-5">
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0b] via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity z-10" />
          <img 
            src={displayImage || "/placeholder-product.jpg"} 
            alt={product.name}
            className="w-full h-full object-fill rounded-[2rem] group-hover:scale-110 transition-transform duration-1000"
            onError={(e) => { e.currentTarget.src = 'https://placehold.co/600x600/111/orange?text=INDIAN+ROLLER'; }}
          />
          <div className="absolute top-10 left-10 bg-orange-600 text-white text-[9px] font-black px-4 py-1.5 rounded-full z-20 uppercase tracking-[0.2em] shadow-2xl italic border border-white/10">
            {product.industry || (product.category?.name || "Industrial")}
          </div>
        </div>

        <div className="p-8 pt-2 space-y-4">
          <div className="space-y-2">
            <h3 className="text-2xl font-black text-white group-hover:text-orange-500 transition-colors uppercase italic tracking-tighter leading-none">
              {product.name}
            </h3>
            <p className="text-gray-500 text-xs line-clamp-2 font-bold uppercase tracking-wider leading-relaxed">
              {shortText}
            </p>
          </div>

          <div className="pt-4 border-t border-white/5 flex items-center justify-between">
            <span className="text-orange-500 font-black text-[10px] tracking-[0.2em] uppercase italic group-hover:pl-2 transition-all">
              View Specifications
            </span>
            <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center group-hover:bg-orange-600 group-hover:text-black transition-all duration-500 group-hover:rotate-12">
              <ArrowUpRight size={20} strokeWidth={3} />
            </div>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
