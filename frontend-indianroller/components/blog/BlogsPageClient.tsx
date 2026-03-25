"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import BlogCard from "@/components/blog/BlogCard";
import api from "@/lib/axios";

type BlogListItem = {
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

export default function BlogsPageClient() {
  const [blogs, setBlogs] = useState<BlogListItem[]>([]);
  const containerRef = useRef(null);

  useEffect(() => {
  const fetchBlogs = async () => {
  try {
    const res = await api.get("/blogs");
    console.log("Blog data:", res.data); 
    setBlogs(res.data); 
  } catch (err) {
    console.error("Error fetching blogs:", err);
  }
};
    void fetchBlogs();
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const bannerY = useTransform(scrollYProgress, [0, 0.3], [0, -70]);
  const contentScale = useTransform(scrollYProgress, [0, 0.2], [1, 0.97]);

  return (
    <main ref={containerRef} className="min-h-screen  bg-[#313030] pb-24  relative overflow-hidden text-white">
      {/* <div className="absolute top-0 left-[-10%] w-[600px] h-[600px] bg-orange-600/5 blur-[140px] rounded-full -z-10" /> */}
      {/* <div className="absolute bottom-[20%] right-[-5%] w-[500px] h-[500px] bg-zinc-700/10 blur-[120px] rounded-full -z-10" /> */}

      <motion.section
  style={{ y: bannerY }}
  className="relative w-full h-[450px] flex items-center justify-center overflow-hidden"
>
  {/* Background Image */}
  <img
    className="absolute inset-0 w-full h-full object-cover"
    src="https://img.freepik.com/free-photo/glasses-lie-laptop-reflecting-light-from-screen-dark_169016-53596.jpg?semt=ais_hybrid&w=740&q=80"
    alt=""
  />

  {/* Overlay (optional for readability) */}
  <div className="absolute inset-0 bg-black/50"></div>

  {/* Heading Content */}
  <motion.div
    initial={{ y: 100, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    transition={{ duration: 0.8, ease: "easeOut" }}
    className="relative z-10 text-center px-4"
  >
    <h1 className="text-4xl md:text-6xl font-extrabold text-white uppercase tracking-wide">
      Blog
    </h1>

    <p className="text-gray-300 mt-3 text-sm md:text-lg">
      Latest Insights & Articles
    </p>
  </motion.div>
</motion.section>

      <section className="max-w-7xl mx-auto px-6 -mt-12 relative z-20">
        <motion.div style={{ scale: contentScale }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {blogs.map((blog, index: number) => (
            <motion.div key={blog._id} initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }}>
              <BlogCard blog={blog} />
            </motion.div>
          ))}
        </motion.div>
      </section>
    </main>
  );
}
