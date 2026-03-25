"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import api from "@/lib/axios";

type SidebarBlog = {
  _id: string;
  slug?: string;
  title: string;
  image?: string;
  customDate?: string;
  createdAt?: string;
};

export default function Sidebar({ currentBlog }: { currentBlog: SidebarBlog | null }) {
  const [recentPosts, setRecentPosts] = useState<SidebarBlog[]>([]);
  const currentId = currentBlog?._id || "";
  const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '');

  useEffect(() => {
    const fetchRecent = async () => {
      try {
        const res = await api.get("/blogs");
        const filtered = res.data
          .filter((post: SidebarBlog) => post._id !== currentId)
          .slice(0, 3);
        setRecentPosts(filtered);
      } catch (err) {
        console.error("Sidebar fetch error:", err);
      }
    };
    fetchRecent();
  }, [currentId]);

  const categories = ["Industrial", "Maintenance", "Textile", "Printing", "Packaging"];

  return (
    <div className="sticky top-28 space-y-10">
      <div className="bg-zinc-900/50 border border-white/5 p-6 rounded-[2rem] backdrop-blur-md">
        <h4 className="text-white font-bold mb-4 flex items-center gap-2 text-sm uppercase tracking-widest">
          <span className="w-2 h-2 bg-orange-500 rounded-full"></span> Search Insights
        </h4>
        <div className="relative">
          <input 
            type="text" 
            placeholder="Search blogs..." 
            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-gray-300 focus:outline-none focus:border-orange-500/50 transition-all font-medium" 
          />
        </div>
      </div>

      <div className="bg-zinc-900/50 border border-white/5 p-8 rounded-[2.5rem] backdrop-blur-md">
        <h4 className="text-white font-black uppercase tracking-widest text-sm mb-6 border-b border-white/5 pb-4">
          Recent Articles
        </h4>
        <div className="space-y-6">
          {recentPosts.map((post) => {
            const postIdentifier = post.slug || post._id;
            const postImage = post.image?.startsWith('/') ? `${baseUrl}${post.image}` : post.image;
            const displayDate = post.customDate || post.createdAt;
            
            return (
              <motion.div key={post._id} whileHover={{ x: 5 }} className="group">
                <Link href={`/blogs-${postIdentifier}`} className="flex gap-4 items-center">
                  <div className="w-16 h-16 rounded-xl overflow-hidden bg-zinc-800 flex-shrink-0 border border-white/5 shadow-inner">
                    <img src={postImage} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt={post.title} />
                  </div>
                  <div>
                    <h5 className="text-gray-200 text-sm font-bold group-hover:text-orange-500 transition-colors line-clamp-2 leading-snug">
                      {post.title}
                    </h5>
                    <span className="text-[10px] text-gray-500 uppercase mt-1 block tracking-tighter">
                      {displayDate ? new Date(displayDate).toLocaleDateString() : ""}
                    </span>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>

      <div className="bg-zinc-900/50 border border-white/5 p-8 rounded-[2.5rem] backdrop-blur-md relative overflow-hidden">
        <h4 className="text-white font-black uppercase tracking-widest text-sm mb-6 border-b border-white/5 pb-4">
          Categories
        </h4>
        <div className="flex flex-wrap gap-3">
          {categories.map((cat) => (
            <Link 
              key={cat} 
              href={`/category/${cat.toLowerCase()}`}
              className="px-4 py-2 bg-white/5 border border-white/5 rounded-full text-xs text-gray-400 hover:bg-orange-500 hover:text-black hover:border-orange-500 transition-all font-bold"
            >
              {cat}
            </Link>
          ))}
        </div>
      </div>

      <div className="bg-gradient-to-br from-orange-600 to-amber-700 p-8 rounded-[2.5rem] text-black shadow-xl">
        <h4 className="font-black text-2xl mb-2 italic tracking-tighter">Need Help?</h4>
        <p className="text-sm font-medium opacity-90 mb-6 leading-tight">Contact our technical experts for custom roller solutions.</p>
        <button className="w-full bg-black text-white py-3.5 rounded-xl font-black text-xs uppercase tracking-widest hover:scale-[1.02] transition-transform shadow-xl">
          Get Quote
        </button>
      </div>
    </div>
  );
}
