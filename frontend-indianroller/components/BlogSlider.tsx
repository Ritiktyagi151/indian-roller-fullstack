"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { FaArrowRight, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import api from "@/lib/axios"; //

// Swiper Imports
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const BlogSlider = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '');

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await api.get("/blogs"); //
        // Latest 6 blogs slider mein dikhane ke liye
        setBlogs(res.data.slice(0, 6));
        setLoading(false);
      } catch (err) {
        console.error("Slider Fetch Error:", err);
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  if (loading) return null; // Loading state (Optional: add skeleton loader)

  return (
    <section className="py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false }}
            transition={{ duration: 0.8 }}
          >
            <p className="text-orange-500 font-bold text-[10px] tracking-[4px] uppercase mb-4">Industry News</p>
            <h2 className="text-4xl md:text-6xl font-black uppercase text-black leading-[0.9] tracking-tighter">
              Latest <span className="text-orange-500">Insights</span>
            </h2>
          </motion.div>

          {/* Custom Navigation Buttons */}
          <div className="flex gap-4">
            <button className="blog-prev bg-black text-white p-4 hover:bg-orange-500 transition-colors">
              <FaChevronLeft />
            </button>
            <button className="blog-next bg-black text-white p-4 hover:bg-orange-500 transition-colors">
              <FaChevronRight />
            </button>
          </div>
        </div>

        {/* Swiper Slider */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false }}
          transition={{ duration: 0.8 }}
        >
          <Swiper
            modules={[Navigation, Autoplay, Pagination]}
            spaceBetween={30}
            slidesPerView={1}
            loop={blogs.length > 3} // Loop only if enough data exists
            autoplay={{ delay: 5000, disableOnInteraction: false }}
            navigation={{
              nextEl: ".blog-next",
              prevEl: ".blog-prev",
            }}
            pagination={{ clickable: true, dynamicBullets: true }}
            breakpoints={{
              640: { slidesPerView: 1 },
              768: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
            className="pb-16"
          >
            {blogs.map((post: any) => {
              const identifier = post.slug || post._id; //
              const displayImage = post.image?.startsWith('/') ? `${baseUrl}${post.image}` : post.image;

              return (
                <SwiperSlide key={post._id}>
                  <div className="group bg-gray-50 border border-gray-100 hover:border-orange-500 transition-all duration-500 h-[550px] flex flex-col">
                    {/* Image Part */}
                    <div className="relative h-[280px] overflow-hidden">
                      <img 
                        src={displayImage || "/placeholder.jpg"} 
                        alt={post.title} 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute bottom-0 left-0 bg-orange-500 text-white text-[10px] font-bold px-4 py-2 uppercase tracking-widest">
                        {new Date(post.customDate || post.createdAt).toLocaleDateString()}
                      </div>
                    </div>

                    {/* Content Part */}
                    <div className="p-8 flex flex-col flex-grow">
                      <span className="text-orange-500 text-[9px] font-black uppercase tracking-widest mb-2">
                        {post.category}
                      </span>
                      <h3 className="text-xl font-black uppercase tracking-tight text-black mb-4 group-hover:text-orange-500 transition-colors line-clamp-2">
                        {post.title}
                      </h3>
                      <p className="text-gray-500 text-sm leading-relaxed mb-6 line-clamp-3 font-medium">
                        {post.metaDescription || post.description?.replace(/<[^>]*>?/gm, '').slice(0, 120)}
                      </p>
                      <div className="mt-auto">
                        <Link 
                          href={`/blogs-${identifier}`} // logic sync with your DynamicPage
                          className="inline-flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-black group-hover:text-orange-500 transition-all"
                        >
                          Read More <FaArrowRight className="transition-transform group-hover:translate-x-2" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              );
            })}
          </Swiper>
        </motion.div>
      </div>

      <style jsx global>{`
        .swiper-pagination-bullet-active {
          background: #f97316 !important;
        }
      `}</style>
    </section>
  );
};

export default BlogSlider;