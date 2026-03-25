"use client";
import { motion } from "framer-motion";

interface GlassCardProps {
  title: string;
  count: string | number;
  icon?: React.ReactNode;
  color?: string; // Optional: glowing color (e.g., "blue", "purple", "emerald")
}

export default function GlassCard({ title, count, icon, color = "blue" }: GlassCardProps) {
  // Color mapping for the glow effect
  const glowColors: any = {
    blue: "group-hover:shadow-blue-500/20 border-blue-500/20",
    purple: "group-hover:shadow-purple-500/20 border-purple-500/20",
    emerald: "group-hover:shadow-emerald-500/20 border-emerald-500/20",
    rose: "group-hover:shadow-rose-500/20 border-rose-500/20",
  };

  return (
    <motion.div
      whileHover={{ y: -5, scale: 1.02 }}
      className={`group relative p-6 rounded-[2rem] bg-white/5 backdrop-blur-xl border border-white/10 transition-all duration-300 shadow-xl ${glowColors[color] || glowColors.blue}`}
    >
      {/* Background Gradient Glow */}
      <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-[2.5rem] bg-gradient-to-br from-white/5 to-transparent pointer-events-none`} />

      <div className="relative z-10 flex flex-col justify-between h-full">
        <div className="flex justify-between items-start mb-4">
          <div className="p-3 rounded-2xl bg-white/5 border border-white/10 text-slate-300">
            {icon || "📊"}
          </div>
          <span className="text-[10px] font-bold text-blue-400 tracking-widest uppercase opacity-70">Live Data</span>
        </div>

        <div>
          <h3 className="text-slate-400 text-xs font-medium uppercase tracking-wider mb-1">
            {title}
          </h3>
          <p className="text-3xl font-light text-white tracking-tighter">
            {count}
          </p>
        </div>
        
        {/* Decorative Bottom Bar */}
        <div className="mt-4 h-[2px] w-12 bg-gradient-to-r from-blue-500 to-transparent rounded-full opacity-50" />
      </div>
    </motion.div>
  );
}