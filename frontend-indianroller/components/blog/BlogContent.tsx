"use client";

type BlogContentData = {
  title: string;
  category?: string;
  customDate?: string;
  createdAt?: string;
  image?: string;
  description?: string;
  metaDescription?: string;
};

export default function BlogContent({ data }: { data: BlogContentData | null }) {
  if (!data) return <div className="animate-pulse h-screen bg-zinc-900 rounded-[3rem]" />;
  const displayDate = data.customDate || data.createdAt;

  const getImageUrl = (path?: string) => {
    if (!path) return "";
    const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '');
    return path.startsWith('/') ? `${baseUrl}${path}` : path;
  };

  return (
    <article className="w-full">
      {/* Header Section */}
      <h1 className="text-2xl md:text-3xl lg:text-4xl font-black mb-6 leading-[1.1] text-white tracking-tighter uppercase italic">
        {data.title}
      </h1>

      <div className="flex flex-wrap items-center gap-3 md:gap-5 mb-10 not-prose italic">
        <span className="bg-orange-600 text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em]">
          {data.category}
        </span>
        <span className="text-zinc-500 text-xs font-bold uppercase tracking-widest italic">
          {displayDate ? new Date(displayDate).toLocaleDateString() : ""}
        </span>
      </div>
      
      {/* Featured Image */}
      <div className="w-full aspect-video bg-zinc-900 border border-white/5 rounded-[2rem] md:rounded-[3.5rem] mb-12 overflow-hidden shadow-2xl">
         <img src={getImageUrl(data.image)} alt={data.title} className="w-full h-full object-fill opacity-90" />
      </div>

      {/* 🔥 Structured Pure White Content Area */}
   <div
  className="blog-content"
  dangerouslySetInnerHTML={{ __html: data.description || "" }}
/>

      {/* Summary Box */}
      {data.metaDescription && (
        <div className="mt-16 p-8 md:p-12 rounded-[2.5rem] md:rounded-[3rem] bg-zinc-900/50 border border-orange-500/20 relative overflow-hidden italic font-black">
          <h4 className="text-orange-500 text-[10px] tracking-[0.4em] uppercase mb-4">Quick Summary</h4>
          <p className="text-xl md:text-2xl text-white leading-tight">&quot;{data.metaDescription}&quot;</p>
        </div>
      )}
    </article>
  );
}
