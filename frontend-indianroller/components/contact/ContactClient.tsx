"use client";
import React, { useState } from "react";
import { motion, Variants } from "framer-motion";
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaIndustry, FaPaperPlane, FaBuilding, FaGlobe } from "react-icons/fa";
import Image from "next/image";
import api from "@/lib/axios";

// --- EXISTING ANIMATIONS ---
const slideFromLeft: Variants = {
  hidden: { opacity: 0, x: -100, rotate: -5 },
  visible: { opacity: 1, x: 0, rotate: 0, transition: { duration: 0.8, ease: "easeOut" } }
};

const slideFromRight: Variants = {
  hidden: { opacity: 0, x: 100, rotate: 5 },
  visible: { opacity: 1, x: 0, rotate: 0, transition: { duration: 0.8, ease: "easeOut" } }
};

const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.8, y: 50, rotateX: -15 },
  visible: { 
    opacity: 1, 
    scale: 1, 
    y: 0, 
    rotateX: 0, 
    transition: { type: "spring", stiffness: 100, damping: 12, duration: 0.8 } 
  }
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.2 } }
};

const plants = [
  { id: "01", name: "Unit - 1 (Sahibabad)", address: "Plot No. 62/2/1&2, Site IV, Industrial Area, Sahibabad-201010 UP", phone: "+91-9540408844", img: "/team-img/shahibabad.JPG" },
  { id: "02", name: "Unit - 2 (Jamshedpur)", address: "Shed no.1, Plot No-743, Ghamaria, Jamshedpur, Jharkhand - 832108", phone: "+91-8744885000", img: "/team-img/jamshedpur-team.JPG" },
  { id: "03", name: "Unit - 3 (Ahmedabad)", address: "Plot No. 226 to 229, Gopalcharan-2, Industrial Park, Ahmedabad-382433", phone: "+91-9376921082", img: "/team-img/ahmdabad.JPG" },
  { id: "04", name: "Unit - 4 (Ballari)", address: "Property No-5331481412, Kurekuppa Village, Sandur, Ballari, Karnataka - 583119", phone: "+91-9540404842", img: "/team-img/kanatka2.JPG" },
  { id: "05", name: "Unit - 5 (Bangladesh)", address: "South Kashimpur Panchagachia, Mohipal Feni, Bangladesh", phone: "+880-01741064260", img: "/about-img/about-bg.jpg" },
];

export default function ContactClient() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    company: "",
    location: "",
    interest: "",
    quantity: "",
    message: "",
  });
  const [submitState, setSubmitState] = useState<"idle" | "saving" | "success" | "error">("idle");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitState("saving");

    try {
      await api.post("/enquiries", {
        name: form.name,
        phone: form.phone,
        email: form.email,
        message: `Company: ${form.company} | Location: ${form.location} | Qty: ${form.quantity} | Note: ${form.message}`,
        sourceType: "contact",
        formName: "Detailed Inquiry",
        metadata: {
          interest: form.interest,
          company: form.company,
          location: form.location,
          quantity: form.quantity
        },
      });

      setForm({ name: "", phone: "", email: "", company: "", location: "", interest: "", quantity: "", message: "" });
      setSubmitState("success");
    } catch {
      setSubmitState("error");
    }
  }

  return (
    <main className="bg-white overflow-hidden text-sm md:text-base font-sans">
      
      {/* --- HERO SECTION WITH VIDEO --- */}
      <section className="relative h-[60vh] md:h-[80vh] flex items-center text-white overflow-hidden">
        <video 
          autoPlay 
          muted 
          loop 
          playsInline 
          className="absolute inset-0 w-full h-full object-cover grayscale-[40%]"
        >
          <source src="/videos/news-video.mp4" type="video/mp4" />
        </video>
        
        <div className="absolute inset-0 z-10 bg-black/60" /> 
        <div className="absolute inset-0 z-20 bg-orange-500/10 skew-y-3 origin-right transform scale-110" />

        <div className="max-w-6xl mx-auto px-6 relative z-30">
          <motion.div
            initial={{ opacity: 0, y: 50, skewX: -10 }}
            animate={{ opacity: 1, y: 0, skewX: 0 }}
            transition={{ duration: 1 }}
          >
            <p className="text-orange-500 font-bold text-[10px] tracking-[6px] uppercase mb-4 underline underline-offset-8">
              World Class Manufacturing
            </p>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black uppercase tracking-tighter leading-[0.9]">
              Get In <span className="text-orange-500">Touch</span>
            </h1>
          </motion.div>
        </div>
      </section>

      {/* --- SPLIT SECTION: Form vs Map --- */}
      <section className="grid grid-cols-1 lg:grid-cols-2">
        <motion.div 
          initial="hidden" 
          whileInView="visible" 
          viewport={{ once: false, amount: 0.2 }} 
          variants={slideFromLeft}
          className="bg-[#111] p-10 md:p-16 lg:p-20 text-white relative"
        >
          <div className="absolute top-0 left-0 w-full h-1.5 bg-orange-500" />
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-black uppercase mb-4 leading-tight">
            Detailed <span className="text-orange-500">Inquiry</span>
          </h2>
          <p className="text-gray-500 text-xs uppercase tracking-widest mb-8 font-bold">Provide your requirements for a precise quotation.</p>
          
          <form className="space-y-6 lg:space-y-8" onSubmit={handleSubmit}>
            {/* Row 1: Name & Phone */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
              <div className="relative group">
                <input type="text" value={form.name} onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))} className="w-full bg-transparent border-b border-white/20 p-3 outline-none focus:border-orange-500 transition-all peer" placeholder=" " required />
                <label className="absolute left-0 top-3 text-gray-400 transition-all peer-focus:-top-4 peer-focus:text-orange-500 peer-focus:text-[10px] uppercase font-bold tracking-widest">Your Name *</label>
              </div>
              <div className="relative group">
                <input type="tel" value={form.phone} onChange={(event) => setForm((current) => ({ ...current, phone: event.target.value }))} className="w-full bg-transparent border-b border-white/20 p-3 outline-none focus:border-orange-500 transition-all peer" placeholder=" " required />
                <label className="absolute left-0 top-3 text-gray-400 transition-all peer-focus:-top-4 peer-focus:text-orange-500 peer-focus:text-[10px] uppercase font-bold tracking-widest">Phone Number *</label>
              </div>
            </div>

            {/* Row 2: Email & Company */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
              <div className="relative group">
                <input type="email" value={form.email} onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))} className="w-full bg-transparent border-b border-white/20 p-3 outline-none focus:border-orange-500 transition-all peer" placeholder=" " required />
                <label className="absolute left-0 top-3 text-gray-400 transition-all peer-focus:-top-4 peer-focus:text-orange-500 peer-focus:text-[10px] uppercase font-bold tracking-widest">Email Address *</label>
              </div>
              <div className="relative group">
                <input type="text" value={form.company} onChange={(event) => setForm((current) => ({ ...current, company: event.target.value }))} className="w-full bg-transparent border-b border-white/20 p-3 outline-none focus:border-orange-500 transition-all peer" placeholder=" " />
                <label className="absolute left-0 top-3 text-gray-400 transition-all peer-focus:-top-4 peer-focus:text-orange-500 peer-focus:text-[10px] uppercase font-bold tracking-widest">Company Name</label>
              </div>
            </div>

            {/* Row 3: Product Interest & Quantity */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
                <div className="relative group">
                <select value={form.interest} onChange={(event) => setForm((current) => ({ ...current, interest: event.target.value }))} className="w-full bg-transparent border-b border-white/20 p-3 outline-none focus:border-orange-500 transition-all peer appearance-none text-gray-400 focus:text-white cursor-pointer" required>
                    <option value="" disabled className="bg-[#111]">Interested In?</option>
                    <option value="rubber-rollers" className="bg-[#111]">Rubber Rollers</option>
                    <option value="pu-rollers" className="bg-[#111]">Polyurethane Rollers</option>
                    <option value="maintenance" className="bg-[#111]">Maintenance & Service</option>
                    <option value="other" className="bg-[#111]">Other Products</option>
                </select>
                <div className="absolute right-2 top-4 pointer-events-none text-orange-500">▼</div>
                </div>
                <div className="relative group">
                <input type="text" value={form.quantity} onChange={(event) => setForm((current) => ({ ...current, quantity: event.target.value }))} className="w-full bg-transparent border-b border-white/20 p-3 outline-none focus:border-orange-500 transition-all peer" placeholder=" " />
                <label className="absolute left-0 top-3 text-gray-400 transition-all peer-focus:-top-4 peer-focus:text-orange-500 peer-focus:text-[10px] uppercase font-bold tracking-widest">Est. Quantity</label>
                </div>
            </div>

            {/* Row 4: Location */}
            <div className="relative group">
              <input type="text" value={form.location} onChange={(event) => setForm((current) => ({ ...current, location: event.target.value }))} className="w-full bg-transparent border-b border-white/20 p-3 outline-none focus:border-orange-500 transition-all peer" placeholder=" " />
              <label className="absolute left-0 top-3 text-gray-400 transition-all peer-focus:-top-4 peer-focus:text-orange-500 peer-focus:text-[10px] uppercase font-bold tracking-widest">City / State / Country</label>
            </div>

            <div className="relative group">
              <textarea rows={2} value={form.message} onChange={(event) => setForm((current) => ({ ...current, message: event.target.value }))} className="w-full bg-transparent border-b border-white/20 p-3 outline-none focus:border-orange-500 transition-all peer resize-none" placeholder=" " />
              <label className="absolute left-0 top-3 text-gray-400 transition-all peer-focus:-top-4 peer-focus:text-orange-500 peer-focus:text-[10px] uppercase font-bold tracking-widest">Specific Specifications or Notes</label>
            </div>

            <button type="submit" className="w-full py-4 md:py-5 bg-orange-500 font-black uppercase tracking-[3px] text-sm hover:bg-white hover:text-black transition-all duration-500 flex items-center justify-center gap-4 group">
              Send Detailed Request <FaPaperPlane className="group-hover:translate-x-2 transition-transform" />
            </button>
            {submitState === "success" ? (
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-400">
                Inquiry submitted successfully.
              </p>
            ) : null}
            {submitState === "error" ? (
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-rose-400">
                Submission failed. Please try again.
              </p>
            ) : null}
          </form>
        </motion.div>

        <motion.div 
          initial="hidden" 
          whileInView="visible" 
          viewport={{ once: false, amount: 0.2 }} 
          variants={slideFromRight}
          className="h-[400px] lg:h-auto bg-gray-900 relative"
        >
          <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3500.957591605664!2d77.33878797616644!3d28.661001183115497!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390cfb2e6178619d%3A0xc6657c9f6929e577!2sINDIAN%20ROLLER%20(I)%20PVT.%20LTD.!5e0!3m2!1sen!2sin!4v1710000000000!5m2!1sen!2sin" 
            className="w-full h-full border-0 grayscale invert opacity-70 contrast-125 hover:grayscale-0 hover:invert-0 hover:opacity-100 transition-all duration-1000"
            allowFullScreen={true}
            title="IRI Location Map"
          />
        </motion.div>
      </section>

      {/* --- FOOTPRINT SECTION WITH UNIT IMAGES --- */}
      <section className="py-16 md:py-24 bg-gray-50 relative">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: false }} variants={scaleIn}
            className="text-center mb-16 md:mb-20"
          >
            <h2 className="text-3xl md:text-5xl font-black uppercase text-black">Our Global Footprint</h2>
            <div className="w-24 h-1.5 bg-orange-500 mx-auto mt-3" />
          </motion.div>

          <div className="space-y-24 md:space-y-32">
            {plants.map((unit, i) => (
              <motion.div 
                key={unit.id}
                variants={i % 2 === 0 ? slideFromLeft : slideFromRight}
                initial="hidden" whileInView="visible" viewport={{ once: false, amount: 0.3 }}
                className={`flex flex-col lg:flex-row items-center gap-10 md:gap-16 ${i % 2 !== 0 ? "lg:flex-row-reverse" : ""}`}
              >
                <div className="lg:w-1/2 w-full h-[300px] md:h-[400px] relative group overflow-hidden shadow-2xl rounded-sm">
                    <Image 
                        src={unit.img} 
                        alt={unit.name} 
                        fill 
                        className="object-cover transition-transform duration-700 group-hover:scale-110 grayscale-[30%] group-hover:grayscale-0"
                    />
                    <div className="absolute inset-0 bg-orange-500/10 group-hover:bg-transparent transition-all duration-500" />
                </div>

                <div className="lg:w-1/2 group relative w-full">
                  <motion.div 
                    whileHover={{ y: -5 }}
                    className="bg-white p-8 md:p-10 shadow-[12px_12px_0px_0px_rgba(249,115,22,1)] border border-gray-100"
                  >
                    <span className="text-6xl md:text-7xl font-black text-gray-100 absolute -top-6 -right-3 z-0 select-none opacity-50 tracking-tighter">{unit.id}</span>
                    <div className="relative z-10">
                      <h3 className="text-xl md:text-2xl font-black uppercase mb-4 flex items-center gap-3 text-orange-500">
                        <FaIndustry /> {unit.name}
                      </h3>
                      <p className="text-gray-500 font-medium mb-5 leading-relaxed text-sm md:text-base italic">{unit.address}</p>
                      <a href={`tel:${unit.phone}`} className="inline-flex items-center gap-3 text-black font-black text-base hover:text-orange-500 transition-colors">
                        <div className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center group-hover:bg-orange-500 transition-colors">
                          <FaPhoneAlt size={14} />
                        </div>
                        {unit.phone}
                      </a>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* --- QUICK LINKS --- */}
      <motion.section 
        variants={staggerContainer} 
        initial="hidden" 
        whileInView="visible" 
        viewport={{ once: false, amount: 0.1 }}
        className="bg-[#050505] py-24 md:py-16 relative overflow-hidden"
      >
        <div className="absolute inset-0 z-0 bg-gradient-to-b from-black via-[#080808] to-black" />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 ">
            {[
              { label: "GET AN EMAIL", val: "info@indianroller.com", icon: <FaEnvelope />, color: "from-orange-500 to-red-600" },
              { label: "MAKE A CALL", val: "+91 120 4167923\n+971 588211690", icon: <FaPhoneAlt />, color: "from-cyan-400 to-blue-500" },
              { label: "SERVICE SUPPORT", val: "+91-9811885000\n+91-8744885000", icon: <FaPhoneAlt />, color: "from-orange-400 to-orange-600" },
              { label: "GO FOR LOCATION", val: "Sahibabad-201010, UP, India", icon: <FaMapMarkerAlt />, color: "from-cyan-400 to-blue-600" }
            ].map((item, i) => (
              <motion.div key={i} variants={scaleIn} className="relative group cursor-default">
                <div className="relative h-72 w-full bg-white/5 backdrop-blur-2xl border border-white/10 rounded-2xl p-8 flex flex-col items-center justify-center text-center transition-all duration-500 group-hover:border-orange-500/50 group-hover:bg-white/10 shadow-2xl z-20">
                  <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${item.color} flex items-center justify-center text-white text-2xl mb-6 shadow-[0_0_20px_rgba(0,0,0,0.3)]`}>
                    {item.icon}
                  </div>
                  <p className="text-orange-400 font-black text-[9px] tracking-[4px] mb-3 uppercase">{item.label}</p>
                  <div className="text-white font-bold text-sm leading-snug whitespace-pre-line tracking-tight">{item.val}</div>
                </div>
                <div 
                  className="absolute -bottom-[65%] left-0 w-full h-[60%] opacity-20 pointer-events-none select-none scale-y-[-1] blur-[3px] transition-all duration-500 group-hover:opacity-30"
                  style={{ maskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 80%)', WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 80%)' }}
                >
                  <div className="w-full h-full bg-white/5 border border-white/10 rounded-2xl p-8 flex flex-col items-center justify-center text-center" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>
    </main>
  );
}
