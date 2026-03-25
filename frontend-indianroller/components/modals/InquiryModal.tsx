"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaTimes, FaUser, FaEnvelope, FaPhoneAlt,
  FaCommentAlt, FaBuilding, FaBoxes, FaCheckCircle,
} from "react-icons/fa";

interface InquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const InquiryModal = ({ isOpen, onClose }: InquiryModalProps) => {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const handleClose = () => {
    onClose();
    setTimeout(() => setSubmitted(false), 400);
  };

  const inp =
    "w-full bg-white/5 border border-white/10 p-4 pl-12 rounded-2xl outline-none focus:border-orange-500 text-white font-bold transition-all placeholder:text-white/20 text-sm";
  const lbl =
    "text-[10px] text-gray-500 font-black uppercase tracking-widest ml-1 block mb-1.5";

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={handleClose}
            className="absolute inset-0 bg-black/90 backdrop-blur-md"
          />

          <motion.div
            initial={{ scale: 0.92, opacity: 0, y: 24 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.92, opacity: 0, y: 24 }}
            transition={{ type: "spring", stiffness: 300, damping: 28 }}
            className="relative w-full max-w-xl bg-[#111] border border-white/10 rounded-[2.5rem] shadow-2xl overflow-hidden"
          >
            <div className="h-1 w-full bg-gradient-to-r from-orange-600 via-orange-400 to-transparent" />

            <AnimatePresence mode="wait">
              {submitted ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                  className="flex flex-col items-center justify-center py-16 px-8 text-center gap-5"
                >
                  <div className="w-20 h-20 rounded-full bg-orange-500/10 border border-orange-500/30 flex items-center justify-center">
                    <FaCheckCircle className="text-orange-500" size={34} />
                  </div>
                  <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter">
                    Inquiry <span className="text-orange-500">Sent!</span>
                  </h2>
                  <p className="text-gray-400 text-sm max-w-sm leading-relaxed">
                    Our team will respond within{" "}
                    <span className="text-orange-400 font-bold">24 hours</span>.
                  </p>
                  <button
                    onClick={handleClose}
                    className="mt-4 px-10 py-4 bg-orange-600 hover:bg-white hover:text-black rounded-2xl font-black text-xs uppercase tracking-[4px] transition-all"
                  >
                    Close
                  </button>
                </motion.div>
              ) : (
                <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  {/* Header */}
                  <div className="flex justify-between items-start p-8 md:p-10 pb-6">
                    <div>
                      <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter">
                        Get In <span className="text-orange-500">Touch</span>
                      </h2>
                      <p className="text-gray-500 text-[10px] mt-1 font-bold uppercase tracking-widest">
                        Inquiry for Industrial Rollers
                      </p>
                    </div>
                    <button onClick={handleClose} className="p-3 bg-white/5 hover:bg-orange-600 text-white rounded-full transition-all">
                      <FaTimes size={16} />
                    </button>
                  </div>

                  <form onSubmit={handleSubmit} className="px-8 md:px-10 pb-10 space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <label className={lbl}>Full Name</label>
                        <div className="relative">
                          <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-orange-500" size={13} />
                          <input required type="text" placeholder="Your Name" className={inp} />
                        </div>
                      </div>
                      <div>
                        <label className={lbl}>Company</label>
                        <div className="relative">
                          <FaBuilding className="absolute left-4 top-1/2 -translate-y-1/2 text-orange-500" size={13} />
                          <input required type="text" placeholder="Your Company" className={inp} />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <label className={lbl}>Email</label>
                        <div className="relative">
                          <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-orange-500" size={13} />
                          <input required type="email" placeholder="info@company.com" className={inp} />
                        </div>
                      </div>
                      <div>
                        <label className={lbl}>Phone Number</label>
                        <div className="relative">
                          <FaPhoneAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-orange-500" size={13} />
                          <input required type="tel" placeholder="+91 00000 00000" className={inp} />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className={lbl}>Product / Roller Type</label>
                      <div className="relative">
                        <FaBoxes className="absolute left-4 top-1/2 -translate-y-1/2 text-orange-500 z-10" size={13} />
                        <select required className="w-full bg-[#1a1a1a] border border-white/10 p-4 pl-12 rounded-2xl outline-none focus:border-orange-500 text-white font-bold transition-all text-sm appearance-none cursor-pointer">
                          <option value="" disabled>Select product / industry</option>
                          <optgroup label="── Industries ──">
                            <option>Steel Industry</option>
                            <option>Textile Industry</option>
                            <option>Paper and Packaging Industry</option>
                            <option>Food Industry</option>
                            <option>Plywood Industry</option>
                            <option>Rexene Industry</option>
                          </optgroup>
                          <optgroup label="── Roller Types ──">
                            <option>Miscellaneous Roller</option>
                            <option>Bridle Roller</option>
                            <option>Applicator Roller</option>
                            <option>Squeeze Roller</option>
                            <option>Ebonite Rubber Roller</option>
                            <option>Accumulator Roller</option>
                            <option>Hypalon Rubber Roller</option>
                            <option>EPDM Rubber Roller</option>
                          </optgroup>
                          <optgroup label="── Rubber Materials ──">
                            <option>Natural Rubber</option>
                            <option>Polyurethane Rubber</option>
                            <option>Silicone Rubber</option>
                            <option>NBR</option>
                            <option>HNBR</option>
                          </optgroup>
                          <optgroup label="── Projects ──">
                            <option>Turnkey Project</option>
                          </optgroup>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className={lbl}>Message</label>
                      <div className="relative">
                        <FaCommentAlt className="absolute left-4 top-5 text-orange-500" size={13} />
                        <textarea
                          rows={4}
                          placeholder="Your requirements, quantity, dimensions, etc."
                          className="w-full bg-white/5 border border-white/10 p-4 pl-12 rounded-2xl outline-none focus:border-orange-500 text-white font-bold transition-all resize-none placeholder:text-white/20 text-sm"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-orange-600 hover:bg-white hover:text-black py-5 rounded-2xl font-black text-xs uppercase tracking-[4px] transition-all"
                    >
                      Send Inquiry Now
                    </button>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default InquiryModal;