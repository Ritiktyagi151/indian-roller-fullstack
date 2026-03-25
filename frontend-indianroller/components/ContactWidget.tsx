'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Phone, Mail } from 'lucide-react';

const ContactWidget = () => {
  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { x: 50, opacity: 0 },
    visible: { x: 0, opacity: 1 }
  };

  return (
    <motion.div 
      className="fixed bottom-6 right-4 md:right-8 z-50 flex flex-col gap-3 items-end"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* WhatsApp - Official Icon Style */}
      <motion.a
        variants={itemVariants}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        href="https://wa.me/918744885000"
        target="_blank"
        rel="noopener noreferrer"
        className="group flex items-center bg-[#25D366] text-white p-3 md:p-4 rounded-full shadow-[0_10px_20px_rgba(37,211,102,0.4)] transition-all overflow-hidden"
      >
        <span className="max-w-0 overflow-hidden group-hover:max-w-xs group-hover:pr-3 transition-all duration-500 ease-in-out whitespace-nowrap font-medium text-sm hidden md:inline-block">
          Chat with us
        </span>
        <svg 
          viewBox="0 0 24 24" 
          width="28" 
          height="28" 
          fill="currentColor" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.885-9.896 9.885z"/>
        </svg>
      </motion.a>

      {/* Phone */}
      <motion.a
        variants={itemVariants}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        href="tel:+919811885000"
        className="flex items-center justify-center w-12 h-12 md:w-14 md:h-14 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-colors"
      >
        <Phone size={24} />
      </motion.a>

      {/* Email */}
      <motion.a
        variants={itemVariants}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        href="mailto:info@indianroller.com"
        className="flex items-center justify-center w-12 h-12 md:w-14 md:h-14 bg-gray-800 text-white rounded-full shadow-lg hover:bg-black transition-colors"
      >
        <Mail size={24} />
      </motion.a>
    </motion.div>
  );
};

export default ContactWidget;