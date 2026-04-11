import Image from "next/image";

export default function DirectorMessage() {
  return (
    <section className="relative bg-[#FFF8EE] py-12 px-6 overflow-hidden">
      {/* Background decorative blobs */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#F97316]/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#D97706]/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-2xl" />
      <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-[#FBBF24]/5 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl" />

      <div className="relative max-w-6xl mx-auto">
        {/* Section Label */}
        <div className="flex items-center gap-3 mb-14">
          <div className="h-px w-12 bg-gradient-to-r from-[#F97316] to-[#FBBF24]" />
          <span className="text-[#D97706] text-sm font-semibold tracking-[0.2em] uppercase font-mono">
            About Us
          </span>
          <div className="h-px flex-1 bg-gradient-to-r from-[#FBBF24]/40 to-transparent" />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">

          {/* LEFT: Photo Column */}
          <div className="lg:col-span-4 relative">
            {/* Decorative gold border offset behind photo */}
            <div className="absolute -top-4 -left-4 w-full h-full border-2 border-[#FBBF24]/50 rounded-sm z-0" />
            <div className="absolute -top-8 -left-8 w-full h-full border border-[#F97316]/20 rounded-sm z-0" />

            {/* Photo wrapper */}
            <div className="relative z-10 overflow-hidden rounded-sm shadow-2xl aspect-[3/4]">
              <Image
                src="/team-img/KH2_2663.JPG"
                alt="Director - Indian Roller"
                fill
                className="object-cover object-top  transition-all duration-700"
              />
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#7C2D12]/70 via-transparent to-transparent" />
            </div>

            {/* Name tag pinned at bottom */}
            <div className="absolute bottom-0 left-4 right-4 z-20 bg-gradient-to-r from-[#C2410C] to-[#D97706] px-5 py-4 shadow-xl">
              <p className="text-white font-bold text-lg leading-tight tracking-wide">
                Mr. Sunny Sharma
              </p>
              <p className="text-[#FDE68A] text-sm mt-0.5 tracking-widest uppercase font-mono">
               Managing Director <br /> Indian Roller Industries (IRI) Group
               </p>
            </div>

            {/* ISO badge */}
            <div className="mt-6 ml-4 inline-flex items-center gap-2 bg-white border border-[#FBBF24]/60 rounded-full px-4 py-2 shadow-sm">
              <div className="w-2 h-2 rounded-full bg-[#F97316]" />
              <span className="text-xs font-semibold text-[#92400E] tracking-widest uppercase font-mono">
                ISO 9001:2008 Certified
              </span>
            </div>
          </div>

          {/* RIGHT: Message Column */}
          <div className="lg:col-span-8 flex flex-col justify-start pt-2">

            {/* Heading */}
            <h2 className="text-4xl lg:text-5xl font-extrabold text-[#1C1917] leading-[1.1] mb-3 tracking-tight">
              Director&apos;s{" "}
              <span className="relative inline-block">
                Message
                <span className="absolute -bottom-1 left-0 w-full h-[3px] bg-gradient-to-r from-[#F97316] to-[#FBBF24]" />
              </span>
            </h2>

            {/* Tagline */}
            <p className="text-[#D97706] font-semibold text-base italic tracking-wide mb-4 font-mono">
              &ldquo;To Evolve is to Last Forever&rdquo;
            </p>

            {/* Big decorative quote mark */}
            <div className="text-[#FBBF24] text-7xl font-serif leading-none mb-1 select-none -ml-1">
              &ldquo;
            </div>

            {/* Message body */}
            <div className="space-y-4 text-[#44403C] leading-relaxed text-[15px]">
              <p>
                Since our inception in{" "}
                <span className="font-semibold text-[#C2410C]">1990</span>, the
                journey of{" "}
                <span className="font-semibold text-[#1C1917]">
                  Indian Roller (IRI)
                </span>{" "}
                has been guided by a singular, simple philosophy: to create
                products that are{" "}
                <span className="italic">honestly made and sincerely served</span>
                . What began as a vision by a dedicated team of energetic
                professionals has today grown into a premier ISO 9001:2008
                certified manufacturing hub, spanning{" "}
                <span className="font-semibold text-[#C2410C]">2,00,000 sq. feet</span>{" "}
                in the industrial heart of Sahibabad (Delhi NCR).
              </p>
              <p>
                At IRI, we believe that quality is not just a standard but a
                commitment. Our state-of-the-art manufacturing facility—equipped
                with a specialized{" "}
                <span className="font-medium text-[#1C1917]">
                  Dust-Proof Chamber for PU Casting
                </span>{" "}
                and our strategic technical tie-up with{" "}
                <span className="font-medium text-[#1C1917]">
                  Baule Machine (France)
                </span>
                —reflects our dedication to global excellence.
              </p>
              <p>
                Our success is built on the pillars of innovation and
                reliability. With an R&amp;D lab managed by highly experienced
                engineers and technicians, we ensure that every rubber roller
                and polyurethane product leaving our facility meets the most
                stringent quality benchmarks. We take immense pride in our vast
                list of valuable clients, a testament to our efficiency in
                technical support and our unwavering discipline regarding
                delivery timelines.
              </p>
              <p>
                As we move forward, we remain committed to evolving with the
                changing technological landscape to provide you with the
                best-in-class industrial solutions. We thank our clients and
                partners for their continued trust in Indian Roller.
              </p>
            </div>

            {/* Signature block */}
            <div className="mt-10 pt-8 border-t border-[#F97316]/20">
              <div className="flex items-end gap-6 flex-wrap">
                {/* Signature */}
                <div>
                  <p className="text-[#92400E] text-sm uppercase tracking-widest font-mono mb-1">
                    Warm Regards,
                  </p>
                  <p
                    className="text-3xl text-[#C2410C] italic"
                    style={{ fontFamily: "Georgia, serif" }}
                  >
                  Mr. Sunny Sharma  
                  </p>
                  <p className="text-[#D97706] text-xs tracking-[0.25em] uppercase mt-1 font-mono font-semibold">
                   Managing Director <br /> Indian Roller Industries (IRI) Group
                  </p>
                </div>

                {/* Divider */}
                <div className="h-14 w-px bg-gradient-to-b from-[#F97316] to-[#FBBF24] mx-2" />

                {/* Company Stats */}
                <div className="flex gap-8">
                  <div>
                    <p className="text-2xl font-extrabold text-[#C2410C]">1990</p>
                    <p className="text-xs text-[#78716C] uppercase tracking-widest font-mono mt-0.5">
                      Est.
                    </p>
                  </div>
                  <div>
                    <p className="text-2xl font-extrabold text-[#C2410C]">2 Lakh</p>
                    <p className="text-xs text-[#78716C] uppercase tracking-widest font-mono mt-0.5">
                      Sq. Ft.
                    </p>
                  </div>
                  <div>
                    <p className="text-2xl font-extrabold text-[#C2410C]">35+</p>
                    <p className="text-xs text-[#78716C] uppercase tracking-widest font-mono mt-0.5">
                      Yrs Legacy
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}