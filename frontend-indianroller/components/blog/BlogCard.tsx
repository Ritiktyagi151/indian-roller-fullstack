"use client";
import { motion, useMotionValue, useTransform } from "framer-motion";
import Link from "next/link";

type BlogCardData = {
  _id: string;
  slug?: string;
  title: string;
  image?: string;
  featuredImage?: string;
  category?: string;
  customDate?: string;
  createdAt?: string;
  metaDescription?: string;
  description?: string;
};

export default function BlogCard({ blog }: { blog: BlogCardData }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const displayDate = blog.customDate || blog.createdAt;

  // Smooth 3D tilt effect values
  const rotateX = useTransform(y, [-100, 100], [15, -15]);
  const rotateY = useTransform(x, [-100, 100], [-15, 15]);

  // FIX: Agar backend mein slug nahi hai toh _id use karo
  const identifier = blog.slug || blog._id;
  const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '');
  const displayImage = blog.image?.startsWith('/') ? `${baseUrl}${blog.image}` : (blog.featuredImage || blog.image);

  return (
    <Link href={`/blogs-${identifier}`}>
      <motion.div
        style={{ perspective: 1000, rotateX, rotateY }}
        onMouseMove={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          x.set(e.clientX - rect.left - rect.width / 2);
          y.set(e.clientY - rect.top - rect.height / 2);
        }}
        onMouseLeave={() => {
          x.set(0);
          y.set(0);
        }}
        className="relative group cursor-pointer"
      >
        <div className="bg-zinc-900/80 backdrop-blur-sm border border-white/5 p-3 rounded-[2.5rem] overflow-hidden transition-all duration-500 group-hover:border-orange-500/50 group-hover:shadow-[0_20px_50px_rgba(249,115,22,0.15)]">
          
          <div className="h-64 overflow-hidden rounded-[2rem] relative">
            <div className="absolute inset-0 bg-orange-600/0 group-hover:bg-orange-600/10 transition-colors z-10" />
            <img 
              src={displayImage} 
              alt={blog.title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out" 
            />
            <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-md text-white text-[10px] px-3 py-1 rounded-full border border-white/10 z-20">
              {displayDate ? new Date(displayDate).toLocaleDateString() : ""}
            </div>
          </div>

          <div className="p-6">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
              <span className="text-orange-500 font-black tracking-widest text-[10px] uppercase">
                {blog.category}
              </span>
            </div>

            <h3 className="text-xl font-black text-white leading-tight group-hover:text-orange-400 transition-colors duration-300 line-clamp-2">
              {blog.title}
            </h3>

            <p className="text-gray-500 text-sm mt-4 line-clamp-2 leading-relaxed font-medium">
              {blog.metaDescription || blog.description?.replace(/<[^>]*>?/gm, '').slice(0, 120)}
            </p>

            <div className="mt-6 flex items-center gap-2 text-white font-bold text-xs group-hover:text-orange-500 transition-all">
              <span>EXPLORE CASE STUDY</span>
              <svg 
                className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" 
                fill="none" viewBox="0 0 24 24" stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </div>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
