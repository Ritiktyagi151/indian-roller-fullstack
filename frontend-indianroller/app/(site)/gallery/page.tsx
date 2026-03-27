import Image from "next/image";
import { getSeoMetadataByPath } from "@/lib/seo";

const factoryGallery = [
  {
    id: "01",
    name: "Sahibabad Unit",
    location: "Ghaziabad, Uttar Pradesh",
    image: "/team-img/shahibabad.JPG",
    accent: "from-orange-500 via-orange-400 to-amber-200",
    summary:
      "The flagship manufacturing floor where precision roller development, finishing, and high-volume execution come together.",
    focus: ["Rubber rollers", "Heavy-duty turnaround", "Core finishing"],
  },
  {
    id: "02",
    name: "Jamshedpur Unit",
    location: "Jamshedpur, Jharkhand",
    image: "/team-img/jamshedpur-team.JPG",
    accent: "from-cyan-400 via-sky-400 to-slate-200",
    summary:
      "A steel-belted production environment tuned for robust industrial demand and disciplined process flow.",
    focus: ["Industrial servicing", "Plant support", "Fast dispatch readiness"],
  },
  {
    id: "03",
    name: "Ahmedabad Unit",
    location: "Ahmedabad, Gujarat",
    image: "/team-img/ahmdabad.JPG",
    accent: "from-orange-500 via-rose-400 to-zinc-200",
    summary:
      "A western manufacturing base supporting scale, consistency, and custom project execution across sectors.",
    focus: ["Custom roller builds", "Polyurethane support", "Regional fulfillment"],
  },
  {
    id: "04",
    name: "Ballari Unit",
    location: "Ballari, Karnataka",
    image: "/team-img/kanatka2.JPG",
    accent: "from-lime-300 via-orange-400 to-stone-200",
    summary:
      "Built for southern coverage with a sharp focus on industrial uptime, coatings, and responsive support.",
    focus: ["Southern operations", "Maintenance support", "Process stability"],
  },
  {
    id: "05",
    name: "Bangladesh Unit",
    location: "Feni, Bangladesh",
    image: "/about-img/about-bg.jpg",
    accent: "from-orange-500 via-yellow-300 to-white",
    summary:
      "An international production touchpoint extending Indian Roller capability beyond borders with the same quality intent.",
    focus: ["Cross-border support", "Export-ready coordination", "Regional presence"],
  },
];

const photoStrip = [
  "/team-img/shahibabad.JPG",
  "/team-img/jamshedpur-team.JPG",
  "/team-img/ahmdabad.JPG",
  "/team-img/ahmdabad2.JPG",
  "/team-img/kanataka.JPG",
  "/team-img/kanatka2.JPG",
  "/about-img/factory-img.jpg",
  "/about-img/about-bg.jpg",
];

export async function generateMetadata() {
  return getSeoMetadataByPath("/gallery", {
    title: "Factory Gallery | Indian Roller",
    description: "Explore Indian Roller's 5 manufacturing units across India and Bangladesh.",
  });
}

export default function GalleryPage() {
  return (
    <main className="bg-[#050505] text-white overflow-hidden">
      <section className="relative isolate min-h-[88vh] flex items-end">
        <Image
          src="/about-img/factory-img.jpg"
          alt="Indian Roller manufacturing gallery hero"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(249,115,22,0.28),transparent_35%),linear-gradient(180deg,rgba(0,0,0,0.25),rgba(0,0,0,0.88))]" />

        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 py-20 md:py-28">
          <div className="max-w-4xl">
            <p className="text-[11px] uppercase tracking-[0.45em] text-orange-300 mb-5 font-black">
              Factory Gallery
            </p>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black uppercase leading-[0.9] tracking-tight">
              5 Factories.
              <br />
              One Industrial Pulse.
            </h1>
            <p className="mt-6 max-w-2xl text-sm md:text-lg text-white/75 leading-relaxed">
              A visual walkthrough of Indian Roller&apos;s manufacturing network across
              India and Bangladesh, shaped for scale, engineering discipline, and fast
              response to industrial demand.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl">
            {[
              { label: "Manufacturing Units", value: "05" },
              { label: "Coverage", value: "India + Bangladesh" },
              { label: "Built For", value: "Custom Industrial Rollers" },
            ].map((item) => (
              <div
                key={item.label}
                className="border border-white/10 bg-white/5 backdrop-blur-md px-5 py-5"
              >
                <p className="text-[10px] uppercase tracking-[0.3em] text-white/55 font-bold">
                  {item.label}
                </p>
                <p className="mt-3 text-xl md:text-2xl font-black uppercase text-white">
                  {item.value}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative px-6 py-20 md:py-28">
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(249,115,22,0.08),transparent_30%,transparent_70%,rgba(255,255,255,0.02))]" />
        <div className="relative max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 mb-14">
            <div className="max-w-2xl">
              <p className="text-[10px] uppercase tracking-[0.4em] text-orange-300 font-black mb-4">
                Network View
              </p>
              <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight">
                Built Around Five Operating Bases
              </h2>
            </div>
            <p className="max-w-xl text-sm text-white/60 leading-relaxed">
              Each unit supports a different slice of the production ecosystem, while
              sharing the same material standards, response culture, and Indian Roller
              manufacturing language.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {factoryGallery.map((factory, index) => (
              <article
                key={factory.id}
                className={`group relative overflow-hidden border border-white/10 bg-[#0b0b0b] ${
                  index === 0 ? "lg:col-span-2" : ""
                }`}
              >
                <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${factory.accent}`} />
                <div className={`grid ${index === 0 ? "lg:grid-cols-[1.3fr_0.9fr]" : "md:grid-cols-[1.1fr_0.9fr]"} gap-0`}>
                  <div className="relative min-h-[320px] md:min-h-[380px]">
                    <Image
                      src={factory.image}
                      alt={`${factory.name} gallery image`}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/15 to-transparent" />
                    <div className="absolute left-6 bottom-6">
                      <p className="text-6xl md:text-8xl font-black text-white/20 leading-none">
                        {factory.id}
                      </p>
                    </div>
                  </div>

                  <div className="p-7 md:p-9 flex flex-col justify-between">
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.35em] text-orange-300 font-black">
                        {factory.location}
                      </p>
                      <h3 className="mt-4 text-2xl md:text-4xl font-black uppercase tracking-tight">
                        {factory.name}
                      </h3>
                      <p className="mt-5 text-sm md:text-base text-white/68 leading-relaxed">
                        {factory.summary}
                      </p>
                    </div>

                    <div className="mt-8 grid grid-cols-1 gap-3">
                      {factory.focus.map((item) => (
                        <div
                          key={item}
                          className="flex items-center gap-3 border border-white/8 bg-white/[0.03] px-4 py-3"
                        >
                          <span className={`h-2.5 w-2.5 rounded-full bg-gradient-to-r ${factory.accent}`} />
                          <span className="text-sm font-semibold uppercase tracking-[0.12em] text-white/82">
                            {item}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 pb-20 md:pb-28">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 mb-12">
            <div>
              <p className="text-[10px] uppercase tracking-[0.4em] text-orange-300 font-black mb-4">
                Detail Frames
              </p>
              <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight">
                Inside The Production Atmosphere
              </h2>
            </div>
            <p className="max-w-xl text-sm text-white/60 leading-relaxed">
              A tighter sequence of factory moments, built to show scale, surfaces,
              movement, and the industrial character behind your operation.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 auto-rows-[180px] md:auto-rows-[220px] gap-4">
            {photoStrip.map((image, index) => (
              <div
                key={image}
                className={`relative overflow-hidden border border-white/10 bg-white/5 ${
                  index === 0 || index === 5 ? "md:col-span-2 md:row-span-2" : ""
                }`}
              >
                <Image
                  src={image}
                  alt={`Indian Roller gallery image ${index + 1}`}
                  fill
                  className="object-cover transition-transform duration-700 hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
