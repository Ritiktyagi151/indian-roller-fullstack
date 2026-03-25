"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import api from "@/lib/axios"; // API import kiya
import { 
  FaFacebookF, FaYoutube, FaLinkedinIn, FaTwitter, FaInstagram,
  FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaChevronRight 
} from "react-icons/fa";

// 1. Interface add kiya taaki TypeScript ko pata chale 'item' mein kya hai
interface Category {
  _id: string;
  slug: string;
  name: string;
}

const Footer = () => {
  // 2. State ko Category type diya
  const [categories, setCategories] = useState<Category[]>([]); 

  // Navbar ki tarah data fetch karne ka logic
  useEffect(() => {
    const fetchFooterCategories = async () => {
      try {
        const res = await api.get("/categories");
        setCategories(res.data);
      } catch (err) {
        console.error("Footer API Error:", err);
      }
    };
    fetchFooterCategories();
  }, []);

  return (
    <footer className="bg-[#242424] text-white pt-16 font-sans border-t border-white/50">
      {/* --- TOP FOOTER SECTION --- */}
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 pb-16">
        
        {/* Section 1: About Us */}
        <div className="flex flex-col space-y-6">
          <h3 className="text-xl font-bold uppercase tracking-widest border-l-4 border-orange-500 pl-3">
            About Us
          </h3>
          <p className="text-gray-300 text-sm leading-relaxed text-pretty">
            Founded in 1990, Indian Roller Industries (IRI) is an ISO 9001:2008 Certified Company 
            specializing in high-quality rubber rollers and polyurethane products.
          </p>
          <div className="flex gap-4">
            <Link href="https://www.facebook.com/indianrollerspvtltd/?show_switched_toast=0&show_invite_to_follow=0&show_switched_tooltip=0&show_podcast_settings=0&show_community_review_changes=0&show_community_rollback=0&show_follower_visibility_disclosure=0" target="_blank" className="bg-[#1877F2] p-3 rounded-sm hover:opacity-80 transition-all text-white"><FaFacebookF size={14}/></Link>
            <Link href="https://www.linkedin.com/company/indian-roller-pvt-ltd/" target="_blank" className="bg-[#0A66C2] p-3 rounded-sm hover:opacity-80 transition-all text-white"><FaLinkedinIn size={14}/></Link>
            <Link href="https://www.youtube.com/channel/UC45R-UyW2EaimlwLGIVWl-Q" target="_blank" className="bg-[#FF0000] p-3 rounded-sm hover:opacity-80 transition-all text-white"><FaYoutube size={14}/></Link>
          </div>
        </div>

        {/* Section 2: Useful Links (Tag Cloud) */}
        <div className="flex flex-col space-y-6">
          <h3 className="text-xl font-bold uppercase tracking-widest border-l-4 border-orange-500 pl-3">
            Useful Links
          </h3>
          <div className="flex flex-wrap gap-2">
            {['Home', 'About', 'Product', 'Blog', 'Career','Contact', 'Admin'].map((tag) => (
              <Link 
                key={tag} 
                href={tag === 'Home' ? '/' : `/${tag.toLowerCase()}`} 
                target={tag === 'Admin' ? '_blank' : '_self'}
                className="border border-gray-700 px-4 py-2 text-[11px] font-bold uppercase tracking-wider hover:bg-orange-500 hover:border-orange-500 transition-all"
              >
                {tag}
              </Link>
            ))}
          </div>
        </div>

        {/* Section 3: Industry Products (DYNAMIC FETCH) */}
        <div className="flex flex-col space-y-6">
          <h3 className="text-xl font-bold uppercase tracking-widest border-l-4 border-orange-500 pl-3">
            Our Products
          </h3>
          <ul className="space-y-3">
            {categories.slice(0, 6).map((item) => ( 
              <li key={item._id || item.slug} className="group">
                <Link 
                  href={`/products-${item.slug}`} 
                  className="text-gray-400 hover:text-orange-500 flex items-center gap-2 text-[13px] transition-all uppercase font-semibold tracking-tight"
                >
                  <FaChevronRight size={10} className="text-orange-500 group-hover:translate-x-1 transition-transform"/>
                  {item.name}
                </Link>
              </li>
            ))}
            {categories.length === 0 && (
              <p className="text-gray-600 text-[11px]">Loading products...</p>
            )}
          </ul>
        </div>

        {/* Section 4: Contact Detail */}
        <div className="flex flex-col space-y-6">
          <h3 className="text-xl font-bold uppercase tracking-widest border-l-4 border-orange-500 pl-3">
            Contact Detail
          </h3>
          <div className="space-y-4 text-sm text-gray-400">
            <div className="flex items-start gap-3">
              <FaPhoneAlt className="text-orange-500 mt-1 flex-shrink-0" />
              <div>
                <Link href="tel:+919811885000" className="hover:text-orange-500 block">+91-9811885000</Link>
                <Link href="tel:+918744885000" className="hover:text-orange-500 block">+91-8744885000</Link>
                <p className="text-[10px] uppercase text-gray-600">Customer Support</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <FaEnvelope className="text-orange-500 mt-1 flex-shrink-0" />
              <div>
                <Link href="mailto:info@indianroller.com" className="hover:text-orange-500 block">info@indianroller.com</Link>
                <p className="text-[10px] uppercase text-gray-600">Email for query</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <FaMapMarkerAlt className="text-orange-500 mt-1 flex-shrink-0" />
              <p className="leading-snug">Plot No. 62/2/1, Sahibabad, Ghaziabad, UP India</p>
            </div>
          </div>
        </div>
      </div>

      {/* --- BOTTOM BAR --- */}
      <div className="bg-black py-4 px-6">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row justify-between items-center gap-8 text-center lg:text-left">
          
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <Link href="/" className="hover:opacity-80 transition-opacity">
              <Image 
                src="/logo1.png" 
                alt="Indian Roller Logo" 
                width={200} 
                height={200} 
                className="object-contain w-auto h-10 "
              />
            </Link>
            <span className="text-gray-400 text-[11px] border-gray-800 sm:border-l sm:pl-6 py-1">
              © 2026. All rights reserved.
            </span>
          </div>

          <div className="flex gap-6 ">
            <Link href="https://www.facebook.com/indianrollerspvtltd/?show_switched_toast=0&show_invite_to_follow=0&show_switched_tooltip=0&show_podcast_settings=0&show_community_review_changes=0&show_community_rollback=0&show_follower_visibility_disclosure=0" className="text-[#1877F2] transition-colors"><FaFacebookF size={19}/></Link>
            <Link href="https://www.linkedin.com/company/indian-roller-pvt-ltd/" className="text-[#0A66C2] transition-colors"><FaLinkedinIn size={19}/></Link>
            <Link href="https://www.youtube.com/channel/UC45R-UyW2EaimlwLGIVWl-Q" className="text-[#FF0000] transition-colors"><FaYoutube size={19}/></Link>
          </div>
          
          <div className="text-[11px] text-gray-500 uppercase tracking-widest">
            Developed By <Link href="https://jaikvik.com" target="_blank" className="text-blue-500 hover:underline">Jaikvik Technology India Pvt Ltd</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;