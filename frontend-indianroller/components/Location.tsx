"use client";
import React from "react";
import { motion } from "framer-motion";
import {
  ComposableMap,
  Geographies,
  Geography,
  Line,
  Marker,
  Annotation
} from "react-simple-maps";

// Official TopoJSON for the world map
const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

// REAL Coordinates: [Longitude, Latitude]
const INDIA_COORDS: [number, number] = [77.209, 28.613]; // New Delhi

const destinations = [
  { id: "africa",     label: "Africa",     coords: [20.0, 0.0] as [number, number],     desc: "Industrial rollers for paper & textile mills" },
  { id: "bangladesh", label: "Bangladesh", coords: [90.412, 23.810] as [number, number], desc: "Garment & printing industry rollers" },
  { id: "middleeast", label: "Middle East", coords: [55.270, 25.204] as [number, number], desc: "PU & rubber rollers for processing" },
  { id: "sea",        label: "SE Asia",    coords: [103.819, 1.352] as [number, number], desc: "Precision engineering solutions" },
];

const LocationSection = () => {
  return (
    <section className="pt-24 pb-24 bg-black overflow-hidden font-sans">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Header - Consistent with your design */}
        <div className="flex flex-col lg:flex-row gap-12 items-start mb-16">
          <div className="lg:w-1/3">
            <p className="text-orange-500 font-bold text-xs tracking-[4px] uppercase mb-4">Our Reach</p>
            <h2 className="text-5xl md:text-6xl font-black uppercase leading-tight tracking-tighter text-white">
              Global <br /> <span className="text-orange-500">Exports</span>
            </h2>
          </div>
          <p className="lg:w-2/3 text-gray-500 font-medium text-sm leading-relaxed uppercase tracking-widest border-l-2 border-orange-500 pl-6 self-center">
            From Sahibabad, Delhi NCR — Indian Roller's ISO 9001:2008 certified products reach 
            industrial clients across Africa, South Asia, and the Middle East.
          </p>
        </div>

        {/* MAP CONTAINER */}
        <div className="relative w-full aspect-[2/1] bg-[#050505] rounded-3xl border border-white/10 overflow-hidden">
          <ComposableMap
            projection="geoMercator"
            projectionConfig={{
              scale: 140,
              center: [40, 10] // Centers the map on the relevant export regions
            }}
            style={{ width: "100%", height: "100%" }}
          >
            {/* World Geography Layer */}
            <Geographies geography={geoUrl}>
              {({ geographies }) =>
                geographies.map((geo) => (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill="#111"
                    stroke="#222"
                    strokeWidth={0.5}
                    style={{
                      default: { outline: "none" },
                      hover: { fill: "#1a1a1a", outline: "none" },
                      pressed: { outline: "none" },
                    }}
                  />
                ))
              }
            </Geographies>

            {/* Export Lines (Great Arcs) */}
            {destinations.map((dest) => (
              <Line
                key={`line-${dest.id}`}
                from={INDIA_COORDS}
                to={dest.coords}
                stroke="#f97316"
                strokeWidth={1.5}
                strokeLinecap="round"
                strokeDasharray="4 4"
              />
            ))}

            {/* India Hub Marker */}
            <Marker coordinates={INDIA_COORDS}>
              <circle r={6} fill="#f97316" />
              <circle r={12} fill="#f97316" fillOpacity={0.2}>
                <animate attributeName="r" values="8;16;8" dur="3s" repeatCount="indefinite" />
              </circle>
              <text textAnchor="middle" y={-20} className="fill-white text-[10px] font-black uppercase tracking-tighter">
                India (Hub)
              </text>
            </Marker>

            {/* Destination Markers */}
            {destinations.map((dest) => (
              <Marker key={dest.id} coordinates={dest.coords}>
                <circle r={4} fill="#f97316" />
                <text
                  textAnchor="middle"
                  y={15}
                  style={{ fontSize: "10px", fill: "#f97316", fontWeight: "bold", textTransform: "uppercase" }}
                >
                  {dest.label}
                </text>
              </Marker>
            ))}
          </ComposableMap>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 mt-8 border border-white/10 divide-y md:divide-y-0 md:divide-x divide-white/10">
          {destinations.map((dest) => (
            <div key={dest.id} className="p-8 hover:bg-orange-500/5 transition-colors group">
              <div className="w-8 h-[2px] bg-orange-500 mb-4 group-hover:w-12 transition-all" />
              <h4 className="text-white font-bold text-xs uppercase tracking-widest mb-2">{dest.label}</h4>
              <p className="text-gray-500 text-[11px] leading-relaxed">{dest.desc}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default LocationSection;