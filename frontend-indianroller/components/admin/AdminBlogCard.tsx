"use client";
import { motion } from "framer-motion";
import { Edit2, Trash2, Eye, Calendar, User } from "lucide-react";
import Link from "next/link";

export default function AdminBlogCard({ _id, title, slug, date, author, status, image, onEdit, onDelete }: any) {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '');
  const displayImage = image?.startsWith('/') ? `${baseUrl}${image}` : image;

  return (
    <motion.div whileHover={{ y: -5 }} className="bg-white/5 border border-white/10 rounded-[2rem] overflow-hidden group transition-all duration-500 hover:shadow-2xl hover:shadow-orange-500/10">
      <div className="relative h-48 w-full bg-zinc-900 overflow-hidden">
        <img src={displayImage || "/placeholder.jpg"} alt={title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 opacity-60" />
        <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border ${status === 'Published' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-amber-500/10 text-amber-400 border-amber-500/20'}`}>{status}</div>
      </div>
      <div className="p-6 space-y-4">
        <h3 className="text-white font-bold text-lg line-clamp-2 leading-tight italic">{title}</h3>
        <div className="flex items-center gap-4 text-slate-500 text-[10px] font-bold uppercase tracking-tighter">
          <div className="flex items-center gap-1.5"><Calendar size={12} className="text-[#f26522]" /> {date}</div>
          <div className="flex items-center gap-1.5"><User size={12} className="text-[#f26522]" /> {author}</div>
        </div>
        <div className="pt-4 border-t border-white/5 flex items-center justify-between">
          <div className="flex gap-2">
            <button onClick={onEdit} className="p-2.5 rounded-xl bg-white/5 text-slate-400 hover:bg-orange-500 hover:text-white transition-all"><Edit2 size={16} /></button>
            <button onClick={onDelete} className="p-2.5 rounded-xl bg-white/5 text-slate-400 hover:bg-red-600 hover:text-white transition-all"><Trash2 size={16} /></button>
          </div>
          <Link href={`/blogs-${slug || _id}`} target="_blank" className="flex items-center gap-2 text-xs font-black text-[#f26522] hover:text-white transition-all uppercase tracking-widest">VIEW <Eye size={14} /></Link>
        </div>
      </div>
    </motion.div>
  );
}