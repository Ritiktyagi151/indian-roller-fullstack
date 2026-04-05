"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence, Variants } from "framer-motion";
import InquiryModal from "../modals/InquiryModal";
import api from "@/lib/axios";
import {
  FaPhoneAlt,
  FaEnvelope,
  FaFacebookF,
  FaBars,
  FaTimes,
  FaChevronDown,
  FaLinkedinIn,
  FaYoutube,
  FaIndustry,
  FaCogs,
  FaBoxOpen,
  FaUtensils,
  FaTools,
  FaLayerGroup,
  FaFlask,
  FaFillDrip,
} from "react-icons/fa";
import { GiGearStickPattern, GiRolledCloth, GiWaterRecycling } from "react-icons/gi";

type DropdownItem = {
  type: "category" | "product";
  refId: string;
  name: string;
  slug: string;
  order: number;
  enabled: boolean;
  icon?: string;
  categoryReference?: string;
  href: string;
};

type DropdownSection = {
  key: string;
  title: string;
  displayType: "category" | "product";
  items: DropdownItem[];
};

const normalizeProductHref = (href: string, slug: string) => {
  if (!href) {
    return `/${slug}`;
  }

  return href.startsWith("/") ? href : `/${href}`;
};

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showProducts, setShowProducts] = useState(false);
  const [mobileProductOpen, setMobileProductOpen] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [dropdownSections, setDropdownSections] = useState<DropdownSection[]>([]);

  const getIcon = (slug: string, iconKey?: string): React.ReactNode => {
    const iconMap: { [key: string]: React.ReactNode } = {
      industry: <FaIndustry />,
      steel: <FaIndustry />,
      "steel-industry": <FaIndustry />,
      textile: <GiRolledCloth />,
      "textile-industry": <GiRolledCloth />,
      paper: <FaBoxOpen />,
      packaging: <FaBoxOpen />,
      "paper-and-packaging-industry": <FaBoxOpen />,
      product: <FaBoxOpen />,
      box: <FaBoxOpen />,
      food: <FaUtensils />,
      "food-industry": <FaUtensils />,
      plywood: <FaLayerGroup />,
      "plywood-industry": <FaLayerGroup />,
      rexene: <FaTools />,
      tool: <FaTools />,
      "rexene-industry": <FaTools />,
      natural: <GiGearStickPattern />,
      rubber: <GiGearStickPattern />,
      "natural-rubber": <GiGearStickPattern />,
      polyurethane: <FaFlask />,
      chemical: <FaFlask />,
      "polyurethane-rubber": <FaFlask />,
      silicone: <FaFillDrip />,
      fluid: <FaFillDrip />,
      "silicone-rubber": <FaFillDrip />,
      epdm: <GiWaterRecycling />,
      water: <GiWaterRecycling />,
      "epdm-rubber-roller": <GiWaterRecycling />,
      cement: <FaCogs />,
      turnkey: <FaCogs />,
      gear: <FaCogs />,
    };

    const normalizedKey = String(iconKey || "").trim().toLowerCase();
    return iconMap[normalizedKey] || iconMap[slug] || <FaCogs />;
  };

  useEffect(() => {
    const fetchNavbarData = async () => {
      try {
        const response = await api.get("/navbar/products-dropdown");
        const sections = Array.isArray(response.data?.sections) ? response.data.sections : [];
        setDropdownSections(
          sections
            .map((section: DropdownSection) => ({
              ...section,
              items: Array.isArray(section.items)
                ? [...section.items].sort((a, b) => Number(a.order || 0) - Number(b.order || 0))
                : [],
            }))
            .filter((section: DropdownSection) => section.items.length > 0),
        );
      } catch (err) {
        console.error("Navbar API Error:", err);
      }
    };

    void fetchNavbarData();

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const megaMenuVars: Variants = {
    initial: { opacity: 0, y: 20, rotateX: -15 },
    animate: { opacity: 1, y: 0, rotateX: 0, transition: { duration: 0.5, ease: "easeOut" } },
    exit: { opacity: 0, y: 15, rotateX: -10, transition: { duration: 0.3 } },
  };

  const closeMenus = () => {
    setShowProducts(false);
    setIsMenuOpen(false);
    setMobileProductOpen(false);
  };

  return (
    <header className="w-full fixed top-0 left-0 z-[100] font-sans">
      <div className={`bg-black/60 text-white px-6 hidden lg:block border-b border-white/10 transition-all duration-500 ease-in-out overflow-hidden ${
        isScrolled ? "h-0 opacity-0 border-none" : "h-[45px] py-3 opacity-100"
      }`}>
        <div className="max-w-7xl mx-auto flex justify-between items-center text-[12px] opacity-80 uppercase tracking-widest font-bold">
          <div className="flex gap-8 ml-10">
            <Link href="tel:+911234567890" className="flex items-center gap-2 hover:text-orange-500 transition"><FaPhoneAlt className="text-orange-500" />+91-9811885000</Link>
            <Link href="mailto:info@indianroller.com" className="flex items-center gap-2 hover:text-orange-500 transition"><FaEnvelope className="text-orange-500" /> info@indianroller.com</Link>
          </div>
          <div className="flex gap-5 text-lg">
            <Link href="https://www.facebook.com/indianrollerspvtltd/" target="_blank"><FaFacebookF className="text-[#1877F2] hover:opacity-80 transition-opacity cursor-pointer" /></Link>
            <Link href="https://www.linkedin.com/company/indian-roller-pvt-ltd/" target="_blank"><FaLinkedinIn className="text-[#0A66C2] hover:opacity-80 transition-opacity cursor-pointer" /></Link>
            <Link href="https://www.youtube.com/channel/UC45R-UyW2EaimlwLGIVWl-Q" target="_blank"><FaYoutube className="text-[#FF0000] hover:opacity-80 transition-opacity cursor-pointer" /></Link>
          </div>
        </div>
      </div>

      <nav
        onMouseLeave={() => setShowProducts(false)}
        className={`transition-all duration-500 px-6 w-full ${
          isScrolled ? "bg-black/90 backdrop-blur-md shadow-2xl" : " backdrop-blur-[4px]"
        }`}
      >
        <div className={`max-w-[1400px] mx-auto flex justify-between items-center transition-all duration-500 ${
          isScrolled ? "h-[75px]" : "h-[80px] md:h-[100px]"
        }`}>
          <motion.div
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="relative z-[110]"
          >
            <Link href="/" onClick={closeMenus}>
              <Image
                src="/logo1.png"
                alt="Indian Roller Logo"
                width={180}
                height={50}
                className={`transition-all inset-12 duration-500 w-auto ${isScrolled ? "h-10 md:h-17" : "h-10 md:h-36"}`}
              />
            </Link>
          </motion.div>

          <div className="hidden lg:flex gap-10 items-center font-black text-[14px] tracking-[2px] text-white">
            <Link href="/" className="hover:text-orange-500 transition-colors">HOME</Link>
            <Link href="/about" className="hover:text-orange-500 transition-colors">ABOUT</Link>
            <div onMouseEnter={() => setShowProducts(true)} className="flex items-center gap-1 cursor-pointer hover:text-orange-500 transition-colors py-2 uppercase">
              Products <FaChevronDown className={`text-[10px] transition-transform duration-300 ${showProducts ? "rotate-180" : ""}`} />
            </div>
            <Link href="/blogs" className="hover:text-orange-500 transition-colors">BLOG</Link>
            <Link href="/gallery" className="hover:text-orange-500 transition-colors">GALLERY</Link>
            <Link href="/contact" className="hover:text-orange-500 transition-colors">CONTACT</Link>

            <motion.button
              animate={{ rotate: [0, -12, 12, -12, 12, 0] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
              whileHover={{ scale: 1.1, rotate: 0, transition: { duration: 0.2 } }}
              onClick={() => setIsPopupOpen(true)}
              className="relative overflow-hidden bg-orange-600 hover:bg-white text-[11px] hover:text-black px-8 py-3.5 transition-all duration-300 rounded-sm font-black uppercase tracking-widest shadow-[0_0_15px_rgba(234,88,12,0.3)] group"
            >
              <motion.span
                initial={{ left: "-100%" }}
                animate={{ left: "100%" }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "linear", repeatDelay: 0.5 }}
                className="absolute top-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-[-25deg] pointer-events-none"
              />
              <span className="relative z-10">GET IN TOUCH</span>
            </motion.button>
          </div>

          <button className="lg:hidden text-white text-2xl relative z-[110]" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <FaTimes className="text-orange-500" /> : <FaBars />}
          </button>
        </div>

        <AnimatePresence>
          {showProducts && dropdownSections.length > 0 && (
            <motion.div
              variants={megaMenuVars}
              initial="initial"
              animate="animate"
              exit="exit"
              onMouseEnter={() => setShowProducts(true)}
              onMouseLeave={() => setShowProducts(false)}
              className="absolute left-0 top-full w-full bg-[#0a0a0b] border-t-2 border-orange-600 shadow-2xl hidden lg:block"
            >
              <div className="max-w-[1400px] mx-auto p-10 grid gap-10 xl:grid-cols-2">
                {dropdownSections.map((section) => (
                  <div key={section.key} className="min-w-0">
                    <div className="flex items-center gap-2 mb-5">
                      <span className="w-3 h-3 bg-orange-500 rounded-sm inline-block shrink-0"></span>
                      <h3 className="text-orange-500 text-[11px] font-black uppercase tracking-[3px]">{section.title}</h3>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      {section.items.map((item) => (
                        <motion.div key={`${section.key}-${item.type}-${item.refId}`} whileHover={{ x: 5 }}>
                          <Link
                            href={normalizeProductHref(item.href, item.slug)}
                            onClick={closeMenus}
                            className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5 hover:border-orange-500/50 hover:bg-orange-600/5 transition-all group"
                          >
                            <div className="text-lg text-orange-500 group-hover:scale-110 transition-transform p-2 bg-orange-500/5 rounded-lg shrink-0">
                              {getIcon(item.slug, item.icon)}
                            </div>
                            <div className="min-w-0">
                              <span className="block text-[11px] font-black text-gray-300 group-hover:text-white uppercase leading-tight tracking-tight transition-colors">
                                {item.name}
                              </span>
                              {item.type === "product" && item.categoryReference ? (
                                <span className="block mt-1 text-[9px] font-bold text-gray-500 uppercase tracking-[0.18em]">
                                  {item.categoryReference}
                                </span>
                              ) : null}
                            </div>
                          </Link>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ x: "100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "100%", opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-0 bg-[#0a0a0b] z-[150] lg:hidden flex flex-col"
          >
            <div className="flex justify-between items-center px-6 py-5 border-b border-white/10 bg-[#111]">
              <Image src="/logo1.png" alt="Logo" width={140} height={40} className="w-auto h-8" />
              <button onClick={() => setIsMenuOpen(false)} className="text-orange-500 text-3xl transition-transform hover:rotate-90"><FaTimes /></button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-8 flex flex-col space-y-6">
              {["HOME", "ABOUT", "BLOG", "CONTACT"].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ x: 50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.1 * i }}
                >
                  <Link
                    href={item === "HOME" ? "/" : `/${item.toLowerCase()}`}
                    onClick={closeMenus}
                    className="text-5xl font-black text-white hover:text-orange-500 transition-colors italic uppercase tracking-tighter block"
                  >
                    {item}
                  </Link>
                </motion.div>
              ))}

              <motion.div
                initial={{ x: 50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="pt-6 border-t border-white/10"
              >
                <button
                  onClick={() => setMobileProductOpen(!mobileProductOpen)}
                  className="flex items-center justify-between w-full text-4xl font-black text-orange-500 italic uppercase tracking-tighter"
                >
                  PRODUCTS <FaChevronDown className={`transition-transform duration-300 ${mobileProductOpen ? "rotate-180" : ""}`} />
                </button>

                <AnimatePresence>
                  {mobileProductOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden mt-4"
                    >
                      {dropdownSections.map((section) => (
                        <div key={`mobile-${section.key}`} className="mb-5 last:mb-0">
                          <div className="flex items-center gap-2 mb-3 mt-2">
                            <span className="w-2.5 h-2.5 bg-orange-500 rounded-sm inline-block shrink-0"></span>
                            <span className="text-orange-500 text-[10px] font-black uppercase tracking-[3px]">{section.title}</span>
                          </div>
                          <div className="space-y-2">
                            {section.items.map((item) => (
                              <Link
                                key={`${section.key}-${item.type}-${item.refId}`}
                                href={normalizeProductHref(item.href, item.slug)}
                                onClick={closeMenus}
                                className="flex items-center gap-3 p-3 bg-white/5 rounded-lg text-gray-300 text-sm font-bold uppercase italic"
                              >
                                <span className="text-orange-500">{getIcon(item.slug, item.icon)}</span>
                                <span className="flex-1">{item.name}</span>
                              </Link>
                            ))}
                          </div>
                        </div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="p-6 bg-[#111]"
            >
              <button
                onClick={() => { setIsPopupOpen(true); setIsMenuOpen(false); }}
                className="w-full bg-orange-600 text-white font-black py-4 rounded-sm tracking-widest uppercase text-xs shadow-lg shadow-orange-600/20"
              >
                Get In Touch
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <InquiryModal isOpen={isPopupOpen} onClose={() => setIsPopupOpen(false)} />
    </header>
  );
};

export default Navbar;
