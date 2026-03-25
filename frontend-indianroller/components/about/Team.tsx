"use client";
import React from "react";
import Image from "next/image";

const factoryData = [
  {
    id: "01",
    name: "Unit - 1 (Sahibabad)",
    location: "Greater Noida, UP",
    description: "Plot No. 62/2/1&2, Site IV, Industrial Area, Sahibabad-201010 UP.",
    image: "/team-img/shahibabad.JPG", // Yahan apni 1st factory ki team photo lagayein
  },
  {
    id: "02",
    name: "Unit - 2 (Jamshedpur)",
    location: "Shed no.1, Plot No-743, Ghamaria, Jamshedpur, Jharkhand - 832108",
    description: "Specialized in high-precision rubber and polymer coating.",
    image: "/team-img/jamshedpur-team.JPG", // 2nd factory
  },
  {
    id: "03",
    name: "Unit - 3 (Ahmedabad)",
    location: " Plot No. 226 to 229 ,Gopalcharan -2, Industrial Park,  Ahmedabad, 382433 ",
    description: "Dedicated to metal fabrication and core preparation.",
    image: "/team-img/ahmdabad.JPG", // 3rd factory
  },
  {
    id: "04",
    name: "Unit - 4 (Ballari)",
    location: "Property No-5331481412, Kurekuppa Village, Sandur, Ballari, Karnataka - 583119",
    description: "Innovation lab and final testing facility for all products.",
    image: "/team-img/kanatka2.JPG", // 4th factory
  },
   {
    id: "05",
    name: "Unit - 5 (Bangladesh)",
    location: "South Kashimpur Panchagachia, Mohipal Feni, Bangladesh",
    description: "Innovation lab and final testing facility for all products.",
    image: "/about-img/about-bg.jpg", // 4th factory
  },
];

const Factories = () => {
  return (
    <section className="py-24 bg-white text-gray-800">
      <div className="container mx-auto px-6">
        
        {/* Header */}
        <div className="max-w-4xl mb-20">
          <h4 className="text-orange-600 font-bold tracking-[3px] uppercase text-xs mb-3">
            Our Infrastructure
          </h4>
          <h2 className="text-5xl md:text-7xl font-black uppercase leading-[0.9] text-zinc-950">
            5 State-of-the-Art <br /> 
            <span className="text-zinc-400">Production Units</span>
          </h2>
        </div>

        {/* Factories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-16 gap-x-12">
          {factoryData.map((factory) => (
            <div key={factory.id} className="group cursor-default">
              
              {/* Image Container */}
              <div className="relative h-[350px] md:h-[450px] w-full overflow-hidden bg-zinc-100 mb-6">
                <Image
                  src={factory.image}
                  alt={factory.name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                {/* Number Overlay */}
                <div className="absolute top-0 right-0 bg-orange-500 text-white font-black text-2xl px-4 py-2">
                  {factory.id}
                </div>
              </div>

              {/* Info Content */}
              <div className="flex flex-col border-b border-zinc-200 pb-8">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-2xl font-black uppercase tracking-tight text-zinc-900 group-hover:text-orange-600 transition-colors">
                      {factory.name}
                    </h3>
                    <p className="text-orange-600 font-bold text-xs uppercase tracking-widest mt-1">
                      {factory.location}
                    </p>
                  </div>
                </div>
                
                <p className="text-zinc-500 text-sm leading-relaxed max-w-md">
                  {factory.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Call to Action */}
        <div className="mt-20 p-12 bg-zinc-950 text-white flex flex-col md:flex-row items-center justify-between gap-8">
          <h3 className="text-3xl font-bold uppercase italic tracking-tighter">
            Want to visit our <span className="text-orange-500 underline">facilities?</span>
          </h3>
          <button className="px-8 py-4 bg-orange-600 hover:bg-white hover:text-black transition-all font-bold uppercase text-sm tracking-widest">
            Schedule a Factory Tour
          </button>
        </div>

      </div>
    </section>
  );
};

export default Factories;